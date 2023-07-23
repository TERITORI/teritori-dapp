import { Platform } from "react-native";

import { weshClient } from "./client";
import { handleMetadata } from "./processData";
import { bytesFromString, decodeJSON, stringFromBytes } from "./utils";
import {
  selectConversationList,
  selectLastIdByKey,
  setConversationList,
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

const subscribedMessages: string[] = [];

export const subscribeMessages = async (groupPk: string) => {
  if (Platform.OS !== "web") {
    if (subscribedMessages.includes(groupPk)) {
      return;
    }
    subscribedMessages.push(groupPk);
  }
  const lastId = selectLastIdByKey(groupPk)(store.getState());

  const config: Partial<GroupMessageList_Request> = {
    groupPk: bytesFromString(groupPk),
  };
  if (Platform.OS === "web" && lastId) {
    config.sinceId = bytesFromString(lastId);
  } else {
    config.untilNow = true;
  }

  try {
    const messages = await weshClient.client.GroupMessageList(config);
    const observer = {
      next: (data: GroupMessageEvent) => {
        const id = stringFromBytes(data.eventContext?.id);
        store.dispatch(
          setLastId({
            key: groupPk,
            value: id,
          })
        );

        data.message = decodeJSON(data.message);

        const message: Message = {
          id: stringFromBytes(data.eventContext?.id),
          ...data.message,
        };
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
          case "group-join": {
            console.log("group-join", message);

            store.dispatch(
              updateConversationById({
                id: stringFromBytes(config.groupPk),
                name: message?.payload?.metadata?.groupName,
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
      error: (e) => {
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
  if (Platform.OS === "web" && lastId) {
    config.sinceId = bytesFromString(lastId);
  } else {
    config.untilNow = true;
    config.reverseOrder = true;
  }

  try {
    const metadata = await weshClient.client.GroupMetadataList(config);

    const myObserver = {
      next: (data: GroupMetadataEvent) => {
        console.log("incoming metadata");
        handleMetadata(data);
      },
      error(e) {
        console.log("get metadata err", e);
      },
      complete: () => {
        if (Platform.OS === "web") {
          subscribeMetadata(groupPk);
        } else {
          setTimeout(() => subscribeMetadata(groupPk), 4000);
        }
      },
    };
    metadata.subscribe(myObserver);
  } catch (err) {
    console.log("get metadatas err", err);
  }
};
