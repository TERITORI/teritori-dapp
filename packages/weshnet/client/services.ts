import { Platform } from "react-native";

import { weshClient } from "./client";
import { weshConfig } from "./config";
import { subscribeMessages, subscribeMetadata } from "./subscribers";
import { bytesFromString, encodeJSON, stringFromBytes } from "./utils";
import {
  MessageState,
  selectConversationList,
  setContactInfo,
  setPeerList,
} from "../../store/slices/message";
import { store } from "../../store/store";
import { isElectron } from "../../utils/isElectron";
import { CONVERSATION_TYPES, Message } from "../../utils/types/message";
import { GroupInfo_Request } from "../protocoltypes";

let getPeerListIntervalId: ReturnType<typeof setInterval>;

export const getAndUpdatePeerList = async () => {
  const peerList = await weshClient.client.PeerList({});

  store.dispatch(
    setPeerList(
      peerList.peers.map((item) => ({
        id: item.id,
        isActive: item.isActive,
      }))
    )
  );
};

export const bootWeshModule = async () => {
  try {
    if (Platform.OS === "web" && !isElectron()) {
      return;
    }

    if (isElectron()) {
      weshClient.watchPort();
    } else {
      const WeshnetModule = require("../../../modules/weshd");
      const port = await WeshnetModule.getPort();
      WeshnetModule.boot();
      setTimeout(() => {
        weshClient.createClient(port);
      }, 15 * 1000);
    }
  } catch (err) {
    console.log("bootWesh", err);
  }
};

export const bootWeshnet = async () => {
  try {
    console.log(weshConfig.config);
    await weshClient.client.ContactRequestEnable({});
    const contactRef = await weshClient.client.ContactRequestReference({});

    if (contactRef.publicRendezvousSeed.length === 0) {
      const resetRef = await weshClient.client.ContactRequestResetReference({});
      contactRef.publicRendezvousSeed = resetRef.publicRendezvousSeed;
    }

    store.dispatch(
      setContactInfo({
        publicRendezvousSeed: stringFromBytes(contactRef.publicRendezvousSeed),
      })
    );

    subscribeMetadata(weshConfig.config.accountGroupPk);

    getAndUpdatePeerList();
    if (getPeerListIntervalId) {
      clearInterval(getPeerListIntervalId);
    }
    getPeerListIntervalId = setInterval(() => {
      getAndUpdatePeerList();
    }, 30 * 1000);
  } catch (err) {
    console.log("create config err", err);
  }
  bootSubscribeMessages();
};

const bootSubscribeMessages = () => {
  const conversations = selectConversationList(CONVERSATION_TYPES.ACTIVE)(
    store.getState()
  );

  conversations.forEach((item) => {
    subscribeMessages(item.id);
  });
};

export const createSharableLink = (
  contactInfo: MessageState["contactInfo"]
) => {
  if (!weshConfig?.config?.accountPk || !contactInfo.publicRendezvousSeed) {
    return "";
  }
  return `https://app.teritori.com/contact?accountPk=${encodeURIComponent(
    stringFromBytes(weshConfig.config.accountPk)
  )}&rdvSeed=${encodeURIComponent(
    contactInfo.publicRendezvousSeed
  )}&name=${encodeURIComponent(contactInfo.name)}&avatar=${encodeURIComponent(
    contactInfo.avatar
  )}&peerId=${encodeURIComponent(weshConfig.config.peerId)}`;
};

export const addContact = async (
  shareLink: string,
  contactInfo: MessageState["contactInfo"]
) => {
  const url = new URL(shareLink);

  if (
    !url?.searchParams.has("accountPk") ||
    !url?.searchParams.has("rdvSeed")
  ) {
    console.log("bool err contact send");
    throw new Error("Share link is invalid");
  }

  const contactPk = bytesFromString(
    decodeURIComponent(url?.searchParams.get("accountPk") || "")
  );
  try {
    await weshClient.client.ContactRequestSend({
      contact: {
        pk: contactPk,
        publicRendezvousSeed: bytesFromString(
          decodeURIComponent(url?.searchParams.get("rdvSeed") || "")
        ),
      },
      ownMetadata: encodeJSON({
        name: contactInfo.name,
        avatar: contactInfo.avatar,
        peerId: weshConfig.config.peerId,
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
    console.log("get group info", err);
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
        senderId: stringFromBytes(weshConfig.config.accountPk),
      }),
    });
  } catch (err) {
    console.log("send message err", err);
  }
};
