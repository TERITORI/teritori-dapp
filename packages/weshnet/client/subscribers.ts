import { weshClient } from "./client";
import { bytesFromString, decode, decodeUTF8, stringFromBytes } from "./utils";
import {
  setContactRequestList,
  setConversationList,
  setMessageList,
  setMetadataList,
} from "../../store/slices/message";
import { store } from "../../store/store";
import {
  EventType,
  GroupMessageEvent,
  GroupMetadataEvent,
  GroupMetadataList,
  GroupMetadata,
} from "../protocoltypes";
export const subscribeMessages = async (groupPk: Uint8Array) => {
  try {
    const messages = await weshClient.GroupMessageList({
      groupPk,
      untilNow: true,
    });
    const myObserver = {
      next(data: GroupMessageEvent) {
        console.log("get message data", data);
        store.dispatch(setMessageList(data));
      },
      error(e) {
        console.log("get message obser...", e);
      },
      complete() {
        console.log("get message complete");
      },
    };
    messages.subscribe(myObserver);
  } catch (err) {
    console.log("get messages err", err);
  }
};

export const subscribeMetadata = async (groupPk: Uint8Array) => {
  console.log("subscribe");
  try {
    const metadata = await weshClient.GroupMetadataList({
      groupPk,
      untilNow: true,
    });
    const myObserver = {
      next(data: GroupMetadataEvent) {
        if (
          data.metadata?.eventType !==
          EventType.EventTypeAccountContactRequestEnabled
        ) {
          console.log("get", GroupMetadataEvent.toJSON(data));
        }
        switch (data.metadata?.eventType) {
          case EventType.EventTypeAccountContactRequestIncomingReceived: {
            setContactRequestList(data);
            break;
          }

          default:
            return null;
        }
      },
      error(e) {
        console.log("get metadata obser...", e);
      },
      complete() {
        console.log("get metadata complete");
      },
    };
    metadata.subscribe(myObserver);
  } catch (err) {
    console.log("get metadatas err", err);
  }
};
