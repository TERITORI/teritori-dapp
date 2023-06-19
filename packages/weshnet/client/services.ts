import { weshClient } from "./client";
import { weshConfig } from "./config";
import { subscribeMetadata } from "./subscribers";
import { bytesFromString, encodeJSON, stringFromBytes } from "./utils";
import { Message } from "../../utils/types/message";
import { GroupInfo_Request } from "../protocoltypes";

let isConfigLoading = false;

export const createConfig = async () => {
  if (weshConfig.config || isConfigLoading) {
    return;
  }
  isConfigLoading = true;

  try {
    const config = await weshClient().ServiceGetConfiguration({});
    weshConfig.config = config;

    await weshClient().ContactRequestEnable({});

    subscribeMetadata(weshConfig.config.accountGroupPk);
  } catch (err) {
    console.log("create config err", err);
  }

  isConfigLoading = false;
};

export const createSharableLink = async (tokenId: string = "Anon") => {
  try {
    const contactRef = await weshClient().ContactRequestReference({});
    await weshClient().ContactRequestEnable({});
    if (contactRef.publicRendezvousSeed.length === 0) {
      const resetRef = await weshClient().ContactRequestResetReference({});
      contactRef.publicRendezvousSeed = resetRef.publicRendezvousSeed;
    }

    weshConfig.metadata = {
      rdvSeed: contactRef.publicRendezvousSeed,
      tokenId,
    };

    weshConfig.shareLink = `https://app.teritori.com/contact?accountPk=${encodeURIComponent(
      stringFromBytes(weshConfig.config.accountPk)
    )}&rdvSeed=${encodeURIComponent(
      stringFromBytes(contactRef.publicRendezvousSeed)
    )}&tokenId=${encodeURIComponent(tokenId)}`;
  } catch (err) {
    console.log("create sharable link", err);
  }
};

export const addContact = async (shareLink: string, tokenId: string) => {
  const url = new URL(shareLink);

  if (!url.searchParams.has("accountPk") || !url.searchParams.has("rdvSeed")) {
    console.log("bool err contact send");
    throw new Error("Share link is invalid");
  }

  const contactPk = bytesFromString(
    decodeURIComponent(url.searchParams.get("accountPk") || "")
  );
  try {
    await weshClient().ContactRequestSend({
      contact: {
        pk: contactPk,
        publicRendezvousSeed: bytesFromString(
          decodeURIComponent(url.searchParams.get("rdvSeed") || "")
        ),
      },
      ownMetadata: encodeJSON({
        tokenId: tokenId || "",
        contactTokenId: url.searchParams.get("name") || "",
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (err) {
    if (!err?.message?.includes("ErrContactRequestContactAlreadyAdded")) {
      throw err;
    }
  }

  // await activateGroup(contactPk);
};

export const acceptFriendRequest = async (contactPk: Uint8Array) => {
  console.log(contactPk);
  await weshClient().ContactRequestAccept({
    contactPk,
  });

  return await activateGroup({ contactPk });
};

export const activateGroup = async (params: Partial<GroupInfo_Request>) => {
  try {
    const contactGroup = await weshClient().GroupInfo(params);

    console.log("contact group", contactGroup);

    await weshClient().ActivateGroup({
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
    await weshClient().AppMessageSend({
      groupPk,
      payload: encodeJSON({
        ...message,
        timestamp: new Date().toISOString(),
        senderId: stringFromBytes(weshConfig.config.accountPk),
      }),
    });
    console.log("send message success");
  } catch (err) {
    console.log("send message err", err);
  }
};
