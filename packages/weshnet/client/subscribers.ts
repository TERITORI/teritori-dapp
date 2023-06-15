import {
  GroupMessageList_Request,
  ProtocolServiceGroupMessageListDesc,
  EventType,
  GroupMessageEvent,
  GroupMetadataEvent,
  GroupMetadataList,
  GroupMetadata,
  AccountContactRequestReceived,
  AccountContactRequestEnabled,
  DeviceChainKey,
  GroupAddDeviceChainKey,
  AccountContactRequestSent,
  AccountContactRequestEnqueued,
  GroupMessageList,
  MessageEnvelope,
  AppMessageSend,
  AppMessageSend_Request,
  EncryptedMessage,
  MessageHeaders,
  GroupEnvelope,
  AppMessageSend_Reply,
  AccountContactRequestAccepted,
} from "./../protocoltypes";
import { weshClient } from "./client";
import { handleMetadata } from "./processData";
import { activateGroup } from "./services";
import {
  bytesFromString,
  decode,
  decodeJSON,
  decodeUTF8,
  stringFromBytes,
} from "./utils";
import {
  setContactRequestList,
  setConversationList,
  setMessageList,
  setMetadataList,
} from "../../store/slices/message";
import { setNotification } from "../../store/slices/notification";
import { store } from "../../store/store";

const contactRequests = [];
const contactRequestsSent = [];
const conversations = [];

export const subscribeMessages = async (config: GroupMessageList_Request) => {
  console.log("subscribed", config);
  let lastId;
  let firstId;
  try {
    const messages = await weshClient.GroupMessageList(config);
    const myObserver = {};
    return messages.subscribe({
      next: (data: GroupMessageEvent) => {
        console.log("new message");
        data.message = decodeJSON(data.message);

        store.dispatch(
          setMessageList({ groupPk: stringFromBytes(config.groupPk), data })
        );
      },
      error: (e) => {
        console.log("get message obser...", e);
      },
      complete: async () => {
        console.log("get message complete", stringFromBytes(lastId, config));
      },
    });
  } catch (err) {
    console.log("get messages err", err);
  }
};

export const subscribeMetadata = async (groupPk: Uint8Array) => {
  try {
    const metadata = await weshClient.GroupMetadataList({
      groupPk,
      untilNow: true,
      reverseOrder: true,
    });
    const myObserver = {
      next: async (data: GroupMetadataEvent) => {
        handleMetadata(data);
      },
      error(e) {
        console.log("get metadata obser...", e);
      },
      complete: () => {
        try {
        } catch (err) {
          console.log("update store err", err);
        }

        console.log("get metadata complete");
      },
    };
    metadata.subscribe(myObserver);
  } catch (err) {
    console.log("get metadatas err", err);
  }
};
