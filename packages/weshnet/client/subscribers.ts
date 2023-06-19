import {
  GroupMessageList_Request,
  GroupMessageEvent,
  GroupMetadataEvent,
} from "./../protocoltypes";
import { weshClient } from "./client";
import { handleMetadata } from "./processData";
import { decodeJSON, stringFromBytes } from "./utils";
import { setMessageList } from "../../store/slices/message";
import { store } from "../../store/store";
import { Message } from "../../utils/types/message";

let lastId: Uint8Array;

export const subscribeMessages = async (config: GroupMessageList_Request) => {
  console.log("subscribe message");
  try {
    const messages = await weshClient().GroupMessageList(config);
    const observer = {
      next: (data: GroupMessageEvent) => {
        console.log("message until now received");
        lastId = data.eventContext?.id;
        data.message = decodeJSON(data.message);

        const message: Message = {
          senderId: stringFromBytes(data.headers?.devicePk),
          id: stringFromBytes(data.eventContext?.id),
          groupId: data.eventContext?.groupPk
            ? stringFromBytes(data.eventContext?.groupPk)
            : "",
          payload: data.message,
        };

        store.dispatch(
          setMessageList({
            groupPk: stringFromBytes(config.groupPk),
            data: message,
          })
        );
      },
      error: (e) => {
        console.log("get message obser...", e);
      },
      complete: async () => {
        console.log("get message complete");
        subscribeMessages2({ groupPk: config.groupPk, sinceId: lastId });
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
  console.log("subscribe message 2 started");
  try {
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
