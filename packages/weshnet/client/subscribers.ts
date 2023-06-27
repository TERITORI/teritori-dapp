import { weshClient } from "./client";
import { handleMetadata } from "./processData";
import { bytesFromString, decodeJSON, stringFromBytes } from "./utils";
import {
  selectConversationList,
  selectLastIdByKey,
  setConversationList,
  setLastId,
  setMessageList,
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

let lastId: Uint8Array;

const subscribedMessages: string[] = [];

const processedMessageIds: string[] = [];

export const subscribeMessages = async (
  groupPk: string,
  ignoreCheck: boolean = false
) => {
  if (!ignoreCheck) {
    if (subscribedMessages.includes(groupPk)) {
      return;
    } else {
      subscribedMessages.push(groupPk);
    }
  }

  const lastId = selectLastIdByKey(groupPk)(store.getState());

  const config: Partial<GroupMessageList_Request> = {
    groupPk: bytesFromString(groupPk),
  };
  if (lastId) {
    config.sinceId = bytesFromString(lastId);
  } else if (ignoreCheck) {
    config.sinceNow = true;
  } else {
    config.untilNow = true;
  }

  try {
    const messages = await weshClient().GroupMessageList(config);
    const observer = {
      next: (data: GroupMessageEvent) => {
        console.log("message");
        const id = stringFromBytes(data.eventContext?.id);
        store.dispatch(
          setLastId({
            key: groupPk,
            value: id,
          })
        );
        // if (processedMessageIds.includes(id)) {
        //   return;
        // }
        // processedMessageIds.push(id);
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
          case "group-join": {
            console.log("group-join", message);
            // const conversations = selectConversationList(store.getState());

            // store.dispatch(
            //   setConversationList(
            //     conversations.map((item) => {
            //       if (item.id === stringFromBytes(data.eventContext?.groupPk)) {
            //         return {
            //           ...item,
            //           name: message.payload.metadata?.groupName || "Anon Group",
            //         };
            //       }
            //       return item;
            //     })
            //   )
            // );

            break;
          }
          case "group-create": {
            const conversations = selectConversationList(store.getState());

            store.dispatch(
              setConversationList(
                conversations.map((item) => {
                  if (item.id === stringFromBytes(data.eventContext?.groupPk)) {
                    return {
                      ...item,
                      name: message.payload.metadata?.groupName || "Anon Group",
                    };
                  }
                  return item;
                })
              )
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

        if (!lastId && !ignoreCheck) {
          await subscribeMessages(groupPk, true);
        }
        // await subscribeMessages2({ groupPk: config.groupPk, sinceId: lastId });
        // setTimeout(() => {
        //   subscribeMessages(config);
        // }, 5000);
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
  }

  try {
    const metadata = await weshClient().GroupMetadataList(config);

    const myObserver = {
      next: (data: GroupMetadataEvent) => {
        handleMetadata(data);
      },
      error(e) {
        console.log("get metadata err", e);
      },
      complete: () => {
        subscribeMetadata(groupPk);
      },
    };
    metadata.subscribe(myObserver);
  } catch (err) {
    console.log("get metadatas err", err);
  }
};
