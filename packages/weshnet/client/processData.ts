import { weshClient } from "./client";
import { weshConfig } from "./config";
import { activateGroup } from "./services";
import {
  bytesFromString,
  decode,
  decodeJSON,
  decodeUTF8,
  stringFromBytes,
} from "./utils";
import {
  selectContactRequestList,
  setContactRequestList,
  setConversationList,
} from "../../store/slices/message";
import { setNotification } from "../../store/slices/notification";
import { store } from "../../store/store";
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
  AccountGroupJoined,
} from "../protocoltypes";

const contactRequests = [];
const contactRequestsSent = [];
const conversations = [];

export const handleMetadata = async (data: GroupMetadataEvent) => {
  try {
    if (
      data.metadata?.eventType !==
      EventType.EventTypeAccountContactRequestEnabled
    ) {
      console.log(data.metadata?.eventType);
    }
    switch (data.metadata?.eventType) {
      case EventType.EventTypeGroupDeviceChainKeyAdded: {
        // try {
        //   await weshClient.GroupInfo({});
        // } catch (err) {
        //   console.log("group test err", err.message);
        // }
        // try {
        //   const parsedData = GroupMetadataEvent.toJSON(data);
        //   parsedData.payload = GroupAddDeviceChainKey.decode(
        //     data.metadata.payload
        //   );

        //   const contactRequestIndex = contactRequests.findIndex(
        //     (request) =>
        //       stringFromBytes(request.payload.contactPk) ===
        //       stringFromBytes(parsedData.payload.destMemberPk)
        //   );
        //   const contactRequestSentIndex = contactRequestsSent.findIndex(
        //     (request) =>
        //       stringFromBytes(request.payload.devicePk) ===
        //       stringFromBytes(parsedData.payload.devicePk)
        //   );

        //   console.log(contactRequests?.[0], parsedData, data);

        //   if (contactRequestIndex !== -1) {
        //     conversations.push(contactRequests[contactRequestIndex]);
        //     contactRequests.splice(contactRequestIndex, 1);
        //   } else {
        //     store.dispatch(
        //       setNotification({
        //         title: "New Friend request",
        //         desc: ``,
        //       })
        //     );
        //   }
        //   if (contactRequestSentIndex !== -1) {
        //     const conversation =
        //       contactRequestsSent[contactRequestSentIndex];
        //     conversations.push(conversation);
        //     contactRequestsSent.splice(contactRequestSentIndex, 1);

        //     await activateGroup(conversation.payload.contact.pk);
        //   } else {
        //     store.dispatch(
        //       setNotification({
        //         title: "Friend request accepted",
        //         desc: ``,
        //       })
        //     );
        //   }
        // } catch (err) {
        //   console.log("test err", err);
        // }

        break;
      }
      case EventType.EventTypeAccountContactRequestOutgoingEnqueued: {
        try {
          const parsedData = GroupMetadataEvent.toJSON(data);
          const payload = AccountContactRequestEnqueued.decode(
            data.metadata.payload
          );
          parsedData.payload = payload;

          parsedData.payload.ownMetadata = decodeJSON(payload.ownMetadata);
          try {
            const groupInfo = await weshClient.GroupInfo({
              contactPk: payload.contact?.pk,
            });

            await weshClient.ActivateGroup({
              groupPk: groupInfo.group?.publicKey,
            });

            store.dispatch(setConversationList(parsedData));
            console.log("group info", groupInfo);
          } catch (err) {
            console.log("group enque err", err?.message);

            // store.dispatch(setContactRequestsSent(parsedData));
          }
        } catch (err) {
          console.log("test enque err", err);
        }

        break;
      }
      case EventType.EventTypeAccountContactRequestIncomingReceived: {
        const parsedData = GroupMetadataEvent.toJSON(data);

        parsedData.payload = AccountContactRequestReceived.decode(
          data.metadata.payload
        );

        parsedData.payload.contactMetadata = decodeJSON(
          parsedData.payload.contactMetadata
        );

        store.dispatch(setContactRequestList(parsedData));

        break;
      }
      case EventType.EventTypeAccountContactRequestIncomingAccepted: {
        const contactRequests = selectContactRequestList(store.getState());
        const parsedData = GroupMetadataEvent.toJSON(data);

        parsedData.payload = AccountContactRequestAccepted.decode(
          data.metadata.payload
        );

        console.log("accepted", parsedData, contactRequests);

        const contactRequestIndex = contactRequests.findIndex(
          (request) =>
            stringFromBytes(request.payload.contactPk) ===
            stringFromBytes(parsedData.payload.contactPk)
        );

        if (contactRequestIndex !== -1) {
          store.dispatch(
            setConversationList(contactRequests[contactRequestIndex])
          );
          conversations.push(contactRequests[contactRequestIndex]);
          store.dispatch(
            setContactRequestList(
              contactRequests.filter((_, i) => i === contactRequestIndex)
            )
          );
        }

        break;
      }
      case EventType.EventTypeAccountGroupJoined: {
        const parsedData = GroupMetadataEvent.toJSON(data);
        console.log("group joined", data, parsedData);

        parsedData.payload = AccountGroupJoined.decode(data.metadata.payload);
        store.dispatch(setConversationList(parsedData));

        break;
      }

      default:
        return null;
    }
  } catch (err) {
    console.log("metada next err", err);
  }

  // try {
  //   store.dispatch(setContactRequestList(contactRequests));
  //   store.dispatch(setConversationList(conversations));
  // } catch (err) {
  //   console.log("update store err", err);
  // }

  // console.log("get metadata complete");
};
