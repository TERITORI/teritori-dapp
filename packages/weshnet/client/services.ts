import { weshClient } from "./client";
import { weshConfig } from "./config";
import {
  subscribeContactRequests,
  subscribeMessages,
  subscribeMetadata,
} from "./subscribers";
import {
  bytesFromString,
  decode,
  encode,
  stringFromBytes,
  unicodeDecodeB64,
} from "./utils";
import {
  GroupInfo_Reply,
  ServiceGetConfiguration_Reply,
  ServiceGetConfiguration_Request,
  createWeshClient,
} from "../../weshnet";

export const createConfig = async () => {
  if (weshConfig.config) {
    return;
  }

  try {
    const config = await weshClient.ServiceGetConfiguration({});
    weshConfig.config = config;

    await weshClient.ContactRequestEnable({});
    console.log("get config", ServiceGetConfiguration_Reply.toJSON(config));

    subscribeMetadata(weshConfig.config.accountGroupPk);
    subscribeMessages(weshConfig.config.accountGroupPk);
  } catch (err) {
    console.log("create config err", err);
  }
};

export const createSharableLink = async (name: string) => {
  try {
    const contactRef = await weshClient.ContactRequestReference({});
    await weshClient.ContactRequestEnable({});
    if (contactRef.publicRendezvousSeed.length === 0) {
      // we need to reset the reference the first time
      const resetRef = await weshClient.ContactRequestResetReference({});
      contactRef.publicRendezvousSeed = resetRef.publicRendezvousSeed;
    }

    weshConfig.shareLink = `https://app.teritori.com/contact?accountPk=${encodeURIComponent(
      stringFromBytes(weshConfig.config.accountPk)
    )}&rdvSeed=${encodeURIComponent(
      stringFromBytes(contactRef.publicRendezvousSeed)
    )}&name=${encodeURIComponent(name || "Anon")}`;
  } catch (err) {
    console.log("make contact", err);
  }
};

export const addContact = async (
  shareLink: string,
  name: string,
  avatar: string
) => {
  const url = new URL(shareLink);

  if (!url.searchParams.has("accountPk") || !url.searchParams.has("rdvSeed")) {
    console.log("bool err contact send");
    throw new Error("Share link is invalid");
  }

  const contactPk = bytesFromString(
    decodeURIComponent(url.searchParams.get("accountPk") || "")
  );
  try {
    await weshClient.ContactRequestSend({
      contact: {
        pk: contactPk,
        publicRendezvousSeed: bytesFromString(
          decodeURIComponent(url.searchParams.get("rdvSeed") || "")
        ),
        metadata: contactPk,
      },
      ownMetadata: encode(
        JSON.stringify({
          name: url.searchParams.get("name") || "",
          avatar: "",
          contactPk: stringFromBytes(weshConfig.config.accountPk),
        })
      ),
    });
  } catch (err) {
    if (!err?.message?.includes("ErrContactRequestContactAlreadyAdded")) {
      throw err;
    }
  }

  // await activateGroup(contactPk);
};

export const acceptFriendRequest = async (contactPk: Uint8Array) => {
  await weshClient.ContactRequestAccept({
    contactPk,
  });

  await activateGroup(contactPk);
};

export const activateGroup = async (contactPk: Uint8Array) => {
  try {
    const contactGroup = await weshClient.GroupInfo({
      contactPk,
    });

    await weshClient.ActivateGroup({
      groupPk: contactGroup.group?.publicKey,
    });
  } catch (err) {
    console.log("get group info", err);
  }
};

const sendMessage = async (groupPk: Uint8Array, message: string) => {
  try {
    await weshClient.AppMessageSend({
      groupPk,
      payload: bytesFromString(message),
    });
    console.log("send message success");
  } catch (err) {
    console.log("send message err", err);
  }
};
