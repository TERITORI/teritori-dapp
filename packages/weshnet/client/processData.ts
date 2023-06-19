import { weshClient } from "./client";
import { decodeJSON, stringFromBytes } from "./utils";
import {
  selectContactRequestList,
  setContactRequestList,
  setConversationList,
} from "../../store/slices/message";
import { setNotification } from "../../store/slices/notification";
import { store } from "../../store/store";
import { ContactRequest } from "../../utils/types/message";
import {
  EventType,
  GroupMetadataEvent,
  AccountContactRequestReceived,
  AccountContactRequestEnqueued,
  AccountContactRequestAccepted,
  AccountGroupJoined,
  AccountContactRequestSent,
} from "../protocoltypes";

const processedMetadataIds: string[] = [];

export const handleMetadata = async (data: GroupMetadataEvent) => {
  const id = stringFromBytes(data.eventContext?.id);
  if (processedMetadataIds.includes(id)) {
    return;
  }
  processedMetadataIds.push(id);
  try {
    if (
      data.metadata?.eventType !==
      EventType.EventTypeAccountContactRequestEnabled
    ) {
      console.log("event-type", data.metadata?.eventType);
    }
    switch (data.metadata?.eventType) {
      case EventType.EventTypeAccountContactRequestOutgoingEnqueued: {
        try {
          const parsedData = GroupMetadataEvent.toJSON(data);
          const payload = AccountContactRequestEnqueued.decode(
            data.metadata.payload
          );
          parsedData.payload = payload;

          parsedData.payload.ownMetadata = decodeJSON(payload.ownMetadata);

          console.log("outgoing", parsedData);
          try {
            const groupInfo = await weshClient().GroupInfo({
              contactPk: payload.contact?.pk,
            });

            await weshClient().ActivateGroup({
              groupPk: groupInfo.group?.publicKey,
            });

            store.dispatch(
              setConversationList({
                id: parsedData.eventContext.id,
                type: "contact",
                name: "",
                members: [
                  {
                    id: parsedData.payload.contact.pk,
                    rdvSeed: parsedData.payload.contact.publicRendezvousSeed,
                    tokenId: parsedData.payload.ownMetadata.contactTokenId,
                  },
                ],
              })
            );
            console.log("group info", groupInfo);
          } catch (err) {
            console.log("group enque err", err?.message);
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

        console.log("incoming", parsedData);

        // const contactRequest: ContactRequest = {
        //   id: data.metadata,
        //   tokenId: parsedData.payload.
        // };

        store.dispatch(
          setContactRequestList({
            id: parsedData.eventContext.id,
            tokenId: parsedData.payload.contactMetadata.tokenId,
            contactId: stringFromBytes(parsedData.payload.contactPk),
            rdvSeed: stringFromBytes(parsedData.payload.contactRendezvousSeed),
          })
        );

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
            request.contactId === stringFromBytes(parsedData.payload.contactPk)
        );

        console.log("contactRequest", contactRequestIndex);
        if (contactRequestIndex !== -1) {
          const contactRequest = contactRequests[contactRequestIndex];
          store.dispatch(
            setContactRequestList(
              contactRequests.filter(
                (item, i) =>
                  item.id === stringFromBytes(parsedData.payload.contactPk)
              )
            )
          );

          store.dispatch(
            setConversationList({
              id: parsedData.eventContext.id,
              type: "contact",
              members: [
                {
                  id: contactRequest.contactId,
                  tokenId: contactRequest.tokenId,
                  rdvSeed: contactRequest.rdvSeed,
                },
              ],
              name: "",
            })
          );
        }

        break;
      }
      case EventType.EventTypeAccountGroupJoined: {
        const parsedData = GroupMetadataEvent.toJSON(data);
        console.log("group joined", data, parsedData);

        parsedData.payload = AccountGroupJoined.decode(data.metadata.payload);
        store.dispatch(
          setConversationList({
            id: stringFromBytes(parsedData.payload.group.publicKey),
            type: "group",
            members: [],
            name: "Group",
          })
        );

        break;
      }

      default:
        return null;
    }
  } catch (err) {
    console.log("metada next err", err);
  }
};
