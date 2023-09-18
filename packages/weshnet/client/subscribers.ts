import { Platform } from "react-native";

import { weshClient } from "./client";
import { weshConfig } from "./config";
import { getConversationName } from "./messageHelpers";
import { handleMetadata } from "./processData";
import { bytesFromString, decodeJSON, stringFromBytes } from "./utils";
import {
  selectConversationById,
  selectLastIdByKey,
  setLastId,
  setMessageList,
  updateConversationById,
  updateMessageReaction,
} from "../../store/slices/message";
import { store } from "../../store/store";
import { Message } from "../../utils/types/message";
import {
  GroupMessageList_Request,
  GroupMessageEvent,
  GroupMetadataEvent,
  GroupMetadataList_Request,
} from "../protocoltypes";

const subscribedGroup: string[] = [];

export const subscribeDeviceStatus = async (groupPk: string) => {
  if (subscribedGroup.includes(groupPk)) {
    return;
  } else {
    subscribedGroup.push(groupPk);
  }
  try {
    const groupDeviceStatus = await weshClient.client.GroupDeviceStatus({
      groupPk: bytesFromString(groupPk),
    });

    const observer = {
      next: (data) => {
        console.log("next device status", data);
      },
      error: (e: any) => {
        console.log("get message error...", e);
      },
      complete: async () => {
        console.log("get message complete");
      },
    };
    console.log("subscribing");
    return groupDeviceStatus.subscribe(observer);
  } catch (err) {
    console.log("get device status err", err);
  }
};

export const subscribeMessages = async (groupPk: string) => {
  subscribeDeviceStatus(groupPk);
  const lastId = selectLastIdByKey(groupPk)(store.getState());

  const config: Partial<GroupMessageList_Request> = {
    groupPk: bytesFromString(groupPk),
  };

  if (lastId) {
    config.sinceId = bytesFromString(lastId);
  } else {
    config.untilNow = true;
  }

  try {
    const messages = await weshClient.client.GroupMessageList(config);
    const observer = {
      next: (data: GroupMessageEvent) => {
        const id = stringFromBytes(data.eventContext?.id);
        const conversation = selectConversationById(
          stringFromBytes(config.groupPk)
        )(store.getState());
        store.dispatch(
          setLastId({
            key: groupPk,
            value: id,
          })
        );

        data.message = decodeJSON(data.message);

        // @ts-ignore
        const message: Message = {
          id: stringFromBytes(data.eventContext?.id),
          ...data.message,
        };
        const isSender =
          message.senderId === stringFromBytes(weshConfig.config.accountPk);

        switch (message.type) {
          case "reaction": {
            store.dispatch(
              updateMessageReaction({
                groupPk: stringFromBytes(config.groupPk),
                data: message,
              })
            );
            break;
          }

          case "group-create": {
            store.dispatch(
              updateConversationById({
                id: stringFromBytes(config.groupPk),
                name: message?.payload?.metadata?.groupName,
              })
            );

            break;
          }
          case "group-invite": {
            const formattedMessage = isSender
              ? `You invited ${getConversationName(conversation)} to a group ${
                  message?.payload?.metadata?.groupName
                }`
              : `${getConversationName(conversation)} invited you to a group ${
                  message?.payload?.metadata?.groupName
                }`;

            if (!message.payload) {
              message.payload = { files: [], message: "" };
            }
            message.payload.message = formattedMessage;

            store.dispatch(
              setMessageList({
                groupPk: stringFromBytes(config.groupPk),
                data: message,
              })
            );

            break;
          }
          case "group-join": {
            console.log("group-join", message);
            const newMember = [];

            if (
              message?.payload?.metadata?.contact?.id &&
              stringFromBytes(weshConfig.config.accountPk) !==
                message?.payload?.metadata?.contact?.id
            ) {
              newMember.push(message?.payload?.metadata?.contact);
            }

            const conversation = selectConversationById(
              stringFromBytes(config.groupPk)
            )(store.getState());
            store.dispatch(
              updateConversationById({
                id: stringFromBytes(config.groupPk),
                name: message?.payload?.metadata?.groupName,
                members: [...(conversation.members || []), ...newMember],
              })
            );
            store.dispatch(
              setMessageList({
                groupPk: stringFromBytes(config.groupPk),
                data: message,
              })
            );
            break;
          }
          default: {
            store.dispatch(
              setMessageList({
                groupPk: stringFromBytes(config.groupPk),
                data: message,
              })
            );
          }
        }
      },
      error: (e: any) => {
        console.log("get message error...", e);
      },
      complete: async () => {
        console.log("get message complete");
        const lastId = selectLastIdByKey(groupPk)(store.getState());
        if (Platform.OS === "web" && lastId) {
          subscribeMessages(groupPk);
        } else {
          setTimeout(() => subscribeMessages(groupPk), 3500);
        }
      },
    };
    return messages.subscribe(observer);
  } catch (err) {
    console.log("get messages err", err);
  }
};

export const subscribeMetadata = async (groupPk: Uint8Array) => {
  const lastId = selectLastIdByKey("metadata")(store.getState());
  const config: Partial<GroupMetadataList_Request> = {
    groupPk,
  };

  if (lastId) {
    config.sinceId = bytesFromString(lastId);
  } else {
    config.untilNow = true;
    config.reverseOrder = true;
  }

  try {
    const metadata = await weshClient.client.GroupMetadataList(config);

    const myObserver = {
      next: (data: GroupMetadataEvent) => {
        console.log("incoming metadata", data);
        handleMetadata(data);
      },
      error(e: any) {
        console.log("get metadata err", e);
      },
      complete: () => {
        console.log("metadata subscrbe complete");
        subscribeMetadata(groupPk);
      },
    };
    metadata.subscribe(myObserver);
  } catch (err) {
    console.log("get metadatas err", err);
  }
};
