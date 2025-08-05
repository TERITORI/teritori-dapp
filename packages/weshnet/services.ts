import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";
import moment from "moment";
import { Platform } from "react-native";

import { getWeshnetAddress, weshClient } from "./client";
import { weshConfig } from "./config";
import { fixWeshPortURLParams } from "./devWeshPortFix";
import {
  subscribeMessages,
  unsubscribeMessageSubscriptions,
} from "./message/subscriber";
import {
  subscribeMetadata,
  unsubscribeMetadataSubscriptions,
} from "./metadata/subscriber";
import { bytesFromString, encodeJSON, stringFromBytes } from "./utils";
import {
  Group,
  GroupInfo_Request,
  GroupType,
  ServiceExportData_Reply,
} from "../api/weshnet/protocoltypes";
import {
  MessageState,
  setIsWeshConnected,
  setContactInfo,
  setPeerList,
  selectContactInfo,
  resetMessageSlice,
  setIsOnboardingCompleted,
  selectFilteredConversationList,
  setIsChatActivated,
} from "../store/slices/message";
import { store } from "../store/store";
import { isElectron } from "../utils/isElectron";
import { CONVERSATION_TYPES, Message } from "../utils/types/message";

import FileSystem from "@/modules/FileSystem";
import { blobToDataURI, readFileAsBase64 } from "@/utils/file";

const isRunningInExpoGo = Constants.appOwnership === "expo";
const DEV_WESHPORT_STORAGE_KEY = "__DEV__WeshPort";

let getPeerListIntervalId: ReturnType<typeof setInterval>;

export const getAndUpdatePeerList = async () => {
  const peerList = await weshClient.client.PeerList({});

  store.dispatch(
    setPeerList(
      peerList.peers.map((item) => ({
        id: item.id,
        isActive: item.isActive,
      })),
    ),
  );
};

const bootWeshModule = async () => {
  const WeshnetModule = require("../../weshd");
  const port = await WeshnetModule.getPort();
  await AsyncStorage.setItem(DEV_WESHPORT_STORAGE_KEY, String(port));
  WeshnetModule.boot();
  setTimeout(() => {
    weshClient.createClient(port);
  }, 15 * 1000);
};

export const stopWeshModule = async () => {
  store.dispatch(setIsChatActivated(false));
  store.dispatch(setIsWeshConnected(false));

  if (Platform.OS !== "web" && !isRunningInExpoGo) {
    const WeshnetModule = require("../../weshd");
    await WeshnetModule.shutdown();
  }
  unsubscribeMessageSubscriptions();
  stopMessagingConnection();
};

export const checkAndBootWeshModule = async () => {
  store.dispatch(setIsChatActivated(true));
  try {
    if (Platform.OS === "web" && !isElectron()) {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const port = urlParams.get("weshPort");

      if (port) {
        fixWeshPortURLParams();
        await weshClient.createClient(Number(port) || 4242);
      }
    } else if (isElectron()) {
      weshClient.watchPort();
    } else if (isRunningInExpoGo) {
      // Connects to local wesh; go run ./weshd/go/web
      await weshClient.createClient(4242);
    } else {
      const refPort = await AsyncStorage.getItem(DEV_WESHPORT_STORAGE_KEY);
      if (refPort) {
        try {
          const port = Number(refPort);
          await weshClient.createClient(port);
          await weshClient.client.ServiceGetConfiguration({});
        } catch {
          await bootWeshModule();
        }
      } else {
        await bootWeshModule();
      }
    }
  } catch (err) {
    console.error("bootWeshModule", err);
  }
};

export const afterWeshnetConnectionAction = async () => {
  try {
    store.dispatch(setIsWeshConnected(true));
    await weshClient.client.ContactRequestEnable({});
    const contactRef = await weshClient.client.ContactRequestReference({});

    if (contactRef.publicRendezvousSeed.length === 0) {
      const resetRef = await weshClient.client.ContactRequestResetReference({});
      contactRef.publicRendezvousSeed = resetRef.publicRendezvousSeed;
    }

    const publicRendezvousSeed = stringFromBytes(
      contactRef.publicRendezvousSeed,
    );
    const contactInfo = selectContactInfo(store.getState());
    const shareLink = createSharableLink({
      ...contactInfo,
      publicRendezvousSeed,
    });

    store.dispatch(
      setContactInfo({
        shareLink,
        publicRendezvousSeed,
      }),
    );

    subscribeMetadata(weshConfig.config?.accountGroupPk);

    getAndUpdatePeerList();
    if (getPeerListIntervalId) {
      clearInterval(getPeerListIntervalId);
    }
    getPeerListIntervalId = setInterval(() => {
      getAndUpdatePeerList();
    }, 30 * 1000);
  } catch (err) {
    console.error("create config err", err);
  }
  bootSubscribeMessages();
};

const bootSubscribeMessages = () => {
  const conversations = selectFilteredConversationList(
    store.getState(),
    CONVERSATION_TYPES.ACTIVE,
    "",
  );

  conversations.forEach((item) => {
    subscribeMessages(item.id);
  });
};

export const createSharableLink = (
  contactInfo: MessageState["contactInfo"],
) => {
  if (!weshConfig?.config?.accountPk || !contactInfo.publicRendezvousSeed) {
    return "";
  }
  return `https://app.teritori.com/contact?accountPk=${encodeURIComponent(
    stringFromBytes(weshConfig.config?.accountPk),
  )}&rdvSeed=${encodeURIComponent(
    contactInfo.publicRendezvousSeed,
  )}&name=${encodeURIComponent(contactInfo.name)}&avatar=${encodeURIComponent(
    contactInfo.avatar,
  )}&peerId=${encodeURIComponent(weshConfig.config?.peerId)}`;
};

export const createSharableLinkOfFriends = ({
  accountPk,
  publicRendezvousSeed,
  name,
  avatar,
  peerId,
}: {
  accountPk: string;
  publicRendezvousSeed: string;
  name: string;
  avatar: string;
  peerId: string;
}) => {
  if (!accountPk || !publicRendezvousSeed) {
    return "";
  }
  return `https://app.teritori.com/contact?accountPk=${encodeURIComponent(
    accountPk,
  )}&rdvSeed=${encodeURIComponent(
    publicRendezvousSeed,
  )}&name=${encodeURIComponent(name)}&avatar=${encodeURIComponent(
    avatar,
  )}&peerId=${encodeURIComponent(peerId)}`;
};

export const createMultiMemberShareableLink = (
  group: Group,
  groupName: string,
) => {
  // construct URL
  return `https://app.teritori.com/group?publicKey=${encodeURIComponent(
    stringFromBytes(group.publicKey),
  )}&secret=${encodeURIComponent(
    stringFromBytes(group.secret),
  )}&secretSig=${encodeURIComponent(
    stringFromBytes(group.secretSig),
  )}&signPub=${encodeURIComponent(
    stringFromBytes(group.signPub),
  )}&linkKey=${encodeURIComponent(
    stringFromBytes(group.linkKey),
  )}&linkKeySig=${encodeURIComponent(
    stringFromBytes(group.linkKeySig),
  )}&groupName=${groupName}`;
};

export const multiMemberGroupJoin = async (
  multiMemberSharedLink: string,
  contactInfo: MessageState["contactInfo"],
) => {
  // create URL from string
  const url = new URL(multiMemberSharedLink);

  // get all params from URL
  const publicKey = bytesFromString(
    decodeURIComponent(url?.searchParams.get("publicKey") || ""),
  );
  const secret = bytesFromString(
    decodeURIComponent(url?.searchParams.get("secret") || ""),
  );
  const secretSig = bytesFromString(
    decodeURIComponent(url?.searchParams.get("secretSig") || ""),
  );
  const signPub = bytesFromString(
    decodeURIComponent(url?.searchParams.get("signPub") || ""),
  );
  const linkKey = bytesFromString(
    decodeURIComponent(url?.searchParams.get("linkKey") || ""),
  );
  const linkKeySig = bytesFromString(
    decodeURIComponent(url?.searchParams.get("linkKeySig") || ""),
  );
  const groupName = url?.searchParams.get("groupName") || "";

  // construct group object
  const group: Group = {
    publicKey,
    secret,
    secretSig,
    groupType: GroupType.GroupTypeMultiMember,
    signPub,
    linkKey,
    linkKeySig,
  };

  // join multiMember conversation
  await weshClient.client.MultiMemberGroupJoin({ group });

  // active conversation
  await weshClient.client.ActivateGroup({ groupPk: publicKey });

  // send group join message
  await sendMessage({
    groupPk: publicKey,
    message: {
      type: "group-join",
      payload: {
        message: "",
        files: [],
        metadata: {
          contact: {
            id: stringFromBytes(weshConfig.config?.accountPk),
            rdvSeed: stringFromBytes(weshConfig.metadata.rdvSeed),
            tokenId: weshConfig.metadata.tokenId,
            name: contactInfo.name,
            avatar: contactInfo.avatar,
            peerId: weshConfig.config?.peerId,
          },
          groupName,
        },
      },
    },
  });
};

export const addContact = async (
  shareLink: string,
  contactInfo: MessageState["contactInfo"],
) => {
  const url = new URL(shareLink);
  if (
    !url?.searchParams.has("accountPk") ||
    !url?.searchParams.has("rdvSeed")
  ) {
    throw new Error("Share link is invalid");
  }

  const contactPk = bytesFromString(
    decodeURIComponent(url?.searchParams.get("accountPk") || ""),
  );
  try {
    await weshClient.client.ContactRequestSend({
      contact: {
        pk: contactPk,
        publicRendezvousSeed: bytesFromString(
          decodeURIComponent(url?.searchParams.get("rdvSeed") || ""),
        ),
      },
      ownMetadata: encodeJSON({
        name: contactInfo.name,
        avatar: contactInfo.avatar,
        peerId: weshConfig.config?.peerId,
        timestamp: new Date().toISOString(),
        contact: {
          name: decodeURIComponent(url?.searchParams.get("name") || ""),
          avatar: decodeURIComponent(url?.searchParams.get("avatar") || ""),
          peerId: decodeURIComponent(url?.searchParams.get("peerId") || ""),
        },
      }),
    });
  } catch (err: any) {
    if (!err?.message?.includes("ErrContactRequestContactAlreadyAdded")) {
      throw err;
    }
  }
};

export const acceptFriendRequest = async (contactPk: Uint8Array) => {
  await weshClient.client.ContactRequestAccept({
    contactPk,
  });
  return await activateGroup({ contactPk });
};

export const activateGroup = async (params: Partial<GroupInfo_Request>) => {
  try {
    const contactGroup = await weshClient.client.GroupInfo(params);
    await weshClient.client.ActivateGroup({
      groupPk: contactGroup.group?.publicKey,
    });

    return contactGroup;
  } catch (err) {
    console.error("activateGroup", err);
  }
};

export const sendMessage = async ({
  groupPk,
  message,
}: {
  groupPk?: Uint8Array;
  message: Omit<Message, "timestamp" | "senderId" | "id" | "groupId">;
}) => {
  if (!groupPk) {
    return;
  }

  try {
    await weshClient.client.AppMessageSend({
      groupPk,
      payload: encodeJSON({
        ...message,
        timestamp: new Date().toISOString(),
        senderId: stringFromBytes(weshConfig.config?.accountPk),
      }),
    });
  } catch (err) {
    console.error("send message err", err);
  }
};

export const exportAccount = async () => {
  const data = await weshClient.client.ServiceExportData({});

  let acc = new Uint8Array(0);

  const promise = new Promise(async (resolve, reject) => {
    const observer = {
      next: (data: ServiceExportData_Reply) => {
        const combinedArray = new Uint8Array(
          acc.length + data.exportedData.length,
        );
        combinedArray.set(acc);
        combinedArray.set(data.exportedData, acc.length);
        acc = combinedArray;
      },
      error: reject,
      complete: async () => {
        try {
          const blob = new Blob([acc], { type: "application/x-tar" });
          const fileName = `teritori-message-account-backup-${moment().format("YYYY-MM-DD hh:mm:ss")}.tar`;

          if (Platform.OS === "web") {
            const downloadLink = document.createElement("a");
            downloadLink.href = window.URL.createObjectURL(blob);
            downloadLink.download = fileName;

            document.body.appendChild(downloadLink);
            downloadLink.click();

            document.body.removeChild(downloadLink);
          } else {
            const uri = await blobToDataURI(blob);
            const localFileURI = FileSystem.documentDirectory + fileName;
            await FileSystem.writeAsStringAsync(
              localFileURI,
              uri.split(",")[1],
              {
                encoding: FileSystem.EncodingType.Base64,
              },
            );

            await Sharing.shareAsync(localFileURI, {
              UTI: "application/x-tar",
              mimeType: "application/x-tar",
            });
          }
          resolve("");
        } catch (err) {
          reject(err);
        }
      },
    };
    data.subscribe(observer);
  });

  await promise;
};

export const setMessageOnboardingComplete = () => {
  store.dispatch(setIsOnboardingCompleted(true));
};

export const handleRestoreAccount = async () => {
  const result = await DocumentPicker.getDocumentAsync({
    type: "application/x-tar",
  });

  if (!result.canceled && result.assets[0]) {
    let base64String: string;

    if (Platform.OS === "web") {
      base64String = await readFileAsBase64(result.assets[0].file);
    } else {
      base64String = await FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: FileSystem?.EncodingType?.Base64,
      });
    }

    const response = await axios.post(
      `${getWeshnetAddress(weshClient.port)}/restore-account`,
      base64String,
    );
    if (response.status < 200 || response.status > 300) {
      throw response.data;
    }
    await AsyncStorage.removeItem(DEV_WESHPORT_STORAGE_KEY);
    store.dispatch(resetMessageSlice());
    stopMessagingConnection();
    setMessageOnboardingComplete();
    if (Platform.OS === "web") {
      setTimeout(() => {
        checkAndBootWeshModule();
      }, 15 * 1000);
    } else {
      await checkAndBootWeshModule();
    }
  }
  throw new Error("Couldn't load the file");
};

function stopMessagingConnection() {
  unsubscribeMessageSubscriptions();
  unsubscribeMetadataSubscriptions();
  store.dispatch(setIsWeshConnected(false));
}

if (Platform.OS === "web") {
  setTimeout(checkAndBootWeshModule, 1000);
}
