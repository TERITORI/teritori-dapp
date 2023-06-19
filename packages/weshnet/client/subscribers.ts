import {
  GroupMessageList_Request,
  GroupMessageEvent,
  GroupMetadataEvent,
} from "./../protocoltypes";
import { weshClient } from "./client";
import { handleMetadata } from "./processData";
import { decodeJSON, stringFromBytes } from "./utils";
import {
  selectConversationList,
  setConversationList,
  setMessageList,
} from "../../store/slices/message";
import { store } from "../../store/store";
import { Message } from "../../utils/types/message";

let lastId: Uint8Array;

const processedMessageIds: string[] = [];

export const subscribeMessages = async (config: GroupMessageList_Request) => {
  console.log("subscribe message", config);
  try {
    const messages = await weshClient().GroupMessageList(config);
    const observer = {
      next: (data: GroupMessageEvent) => {
        const id = stringFromBytes(data.eventContext?.id);
        if (processedMessageIds.includes(id)) {
          return;
        }
        processedMessageIds.push(id);
        data.message = decodeJSON(data.message);
        console.log("message until now received", data);
        const message: Message = {
          id: stringFromBytes(data.eventContext?.id),
          ...data.message,
        };
        switch (message.type) {
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
        // await subscribeMessages2({ groupPk: config.groupPk, sinceId: lastId });
        setTimeout(() => {
          subscribeMessages(config);
        }, 5000);
      },
    };
    return messages.subscribe(observer);
  } catch (err) {
    console.log("get messages err", err);
  }
};

export const subscribeMetadata = async (groupPk: Uint8Array) => {
  try {
    const metadata = await weshClient().GroupMetadataList({
      groupPk,
      untilNow: true,
      reverseOrder: true,
    });

    const myObserver = {
      next: (data: GroupMetadataEvent) => {
        handleMetadata(data);
      },
      error(e) {
        console.log("get metadata err", e);
      },
      complete: () => {
        console.log("get metadata complete");
        setTimeout(() => {
          subscribeMetadata(groupPk);
        }, 5000);
      },
    };
    metadata.subscribe(myObserver);
  } catch (err) {
    console.log("get metadatas err", err);
  }
};

export const subscribeMessages2 = async (
  config: Partial<GroupMessageList_Request>
) => {
  console.log("subscribe message 2 started", config.sinceId);
  try {
    await weshClient().ActivateGroup({
      groupPk: config.groupPk,
    });
    const messages = await weshClient().GroupMessageList(config);
    const observer = {
      next: (data: GroupMessageEvent) => {
        console.log("message 2 incoming");
      },
      error: (e) => {
        console.log("get message obser...", e);
      },
      complete: async () => {
        console.log("get message complete");
      },
    };
    return messages.subscribe(observer);
  } catch (err) {
    console.log("get messages err", err);
  }
};
