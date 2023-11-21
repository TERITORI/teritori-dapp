import {
  EventType,
  GroupMetadataEvent,
  AccountContactRequestIncomingReceived,
  AccountContactRequestOutgoingEnqueued,
  AccountContactRequestIncomingAccepted,
  AccountGroupJoined,
} from "../../api/weshnet/protocoltypes";
import {
  selectContactRequestList,
  setContactRequest,
  setContactRequestList,
  setConversationList,
} from "../../store/slices/message";
import { store } from "../../store/store";
import { weshClient } from "../client";
import { subscribeMessages } from "../message/subscriber";
import { bytesFromString, decodeJSON, stringFromBytes } from "../utils";

const processedMetadataIds: string[] = [];

export const processMetadata = async (data: GroupMetadataEvent) => {
  const id = stringFromBytes(data.eventContext?.id);

  if (processedMetadataIds.includes(id)) {
    return;
  }
  processedMetadataIds.push(id);
  try {
    switch (data.metadata?.eventType) {
      case EventType.EventTypeAccountContactRequestOutgoingEnqueued: {
        try {
          const parsedData: any = GroupMetadataEvent.toJSON(data);
          const payload = AccountContactRequestOutgoingEnqueued.decode(
            data.metadata.payload,
          );
          parsedData.payload = payload;

          parsedData.payload.ownMetadata = decodeJSON(payload.ownMetadata);

          const groupInfo = await weshClient.client.GroupInfo({
            contactPk: payload.contact?.pk,
          });

          await weshClient.client.ActivateGroup({
            groupPk: groupInfo.group?.publicKey,
          });

          store.dispatch(
            setConversationList({
              id: stringFromBytes(groupInfo.group?.publicKey),
              type: "contact",
              name: "",
              members: [
                {
                  id: stringFromBytes(parsedData.payload.contact.pk),
                  rdvSeed: parsedData.payload.contact.publicRendezvousSeed,
                  name: parsedData.payload.ownMetadata.contact.name,
                  avatar: parsedData.payload.ownMetadata.contact.avatar,
                  peerId: parsedData.payload.ownMetadata.contact.peerId,
                },
              ],
              status: "active",
            }),
          );
          subscribeMessages(stringFromBytes(groupInfo.group?.publicKey));
        } catch (err) {
          console.error("Outgoing enqueue err", err);
        }

        break;
      }

      case EventType.EventTypeAccountContactRequestIncomingReceived: {
        const parsedData: any = GroupMetadataEvent.toJSON(data);

        parsedData.payload = AccountContactRequestIncomingReceived.decode(
          data.metadata.payload,
        );

        parsedData.payload.contactMetadata = decodeJSON(
          parsedData.payload.contactMetadata,
        );

        store.dispatch(
          setContactRequest({
            id: stringFromBytes(parsedData.payload.contactPk),
            contactId: stringFromBytes(parsedData.payload.contactPk),
            rdvSeed: stringFromBytes(parsedData.payload.contactRendezvousSeed),
            name: parsedData.payload.contactMetadata.name,
            avatar: parsedData.payload.contactMetadata.avatar,
            peerId: parsedData.payload.contactMetadata.peerId,
          }),
        );

        break;
      }
      case EventType.EventTypeAccountContactRequestIncomingDiscarded: {
        const contactRequests = selectContactRequestList(store.getState());
        const parsedData: any = GroupMetadataEvent.toJSON(data);

        parsedData.payload = AccountContactRequestIncomingAccepted.decode(
          data.metadata.payload,
        );

        store.dispatch(
          setContactRequestList(
            contactRequests.filter(
              (item) =>
                item.contactId !==
                stringFromBytes(parsedData.payload.contactPk),
            ),
          ),
        );

        break;
      }
      case EventType.EventTypeAccountContactRequestIncomingAccepted: {
        const contactRequests = selectContactRequestList(store.getState());
        const parsedData: any = GroupMetadataEvent.toJSON(data);

        parsedData.payload = AccountContactRequestIncomingAccepted.decode(
          data.metadata.payload,
        );

        const contactRequestIndex = contactRequests.findIndex(
          (request) =>
            request.contactId === stringFromBytes(parsedData.payload.contactPk),
        );

        if (contactRequestIndex !== -1) {
          const contactRequest = contactRequests[contactRequestIndex];
          store.dispatch(
            setContactRequestList(
              contactRequests.filter(
                (item) =>
                  item.contactId !==
                  stringFromBytes(parsedData.payload.contactPk),
              ),
            ),
          );
          const group = await weshClient.client.GroupInfo({
            contactPk: bytesFromString(contactRequest.contactId),
          });
          await weshClient.client.ActivateGroup({
            groupPk: group.group?.publicKey,
          });

          store.dispatch(
            setConversationList({
              id: stringFromBytes(group.group?.publicKey),
              type: "contact",
              members: [
                {
                  id: contactRequest.contactId,
                  rdvSeed: contactRequest.rdvSeed,
                  name: contactRequest.name,
                  avatar: contactRequest.avatar,
                  peerId: contactRequest.peerId,
                },
              ],
              name: "",
              status: "active",
            }),
          );

          subscribeMessages(stringFromBytes(group.group?.publicKey));
        }

        break;
      }
      case EventType.EventTypeAccountGroupJoined: {
        const parsedData: any = GroupMetadataEvent.toJSON(data);

        parsedData.payload = AccountGroupJoined.decode(data.metadata.payload);
        store.dispatch(
          setConversationList({
            id: stringFromBytes(parsedData.payload.group.publicKey),
            type: "group",
            members: [],
            name: "Group",
            status: "active",
          }),
        );
        subscribeMessages(stringFromBytes(parsedData.payload.group.publicKey));

        break;
      }

      default:
        return null;
    }
  } catch (err) {
    console.error("metadata next err", err);
  }
};
