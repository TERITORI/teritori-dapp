import { weshClient } from "./client";
import { subscribeMessages } from "./subscribers";
import { bytesFromString, decodeJSON, stringFromBytes } from "./utils";
import {
  selectContactRequestList,
  setContactRequestList,
  setConversationList,
  setLastId,
} from "../../store/slices/message";
import { store } from "../../store/store";
import {
  EventType,
  GroupMetadataEvent,
  AccountContactRequestIncomingReceived,
  AccountContactRequestOutgoingEnqueued,
  AccountContactRequestIncomingAccepted,
  AccountGroupJoined,
} from "../protocoltypes";

const processedMetadataIds: string[] = [];

export const handleMetadata = async (data: GroupMetadataEvent) => {
  const id = stringFromBytes(data.eventContext?.id);

  store.dispatch(
    setLastId({
      key: "metadata",
      value: id,
    })
  );
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
          const parsedData: any = GroupMetadataEvent.toJSON(data);
          const payload = AccountContactRequestOutgoingEnqueued.decode(
            data.metadata.payload
          );
          parsedData.payload = payload;

          parsedData.payload.ownMetadata = decodeJSON(payload.ownMetadata);

          console.log("outgoing", parsedData);
          try {
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
                  },
                ],
              })
            );
            subscribeMessages(stringFromBytes(groupInfo.group?.publicKey));
            // subscribeMetadata(groupInfo.group?.publicKey);
            console.log("group info", groupInfo);
          } catch (err) {
            console.log("group enque err", err);
          }
        } catch (err) {
          console.log("test enque err", err);
        }

        break;
      }

      case EventType.EventTypeAccountContactRequestIncomingReceived: {
        const parsedData: any = GroupMetadataEvent.toJSON(data);

        parsedData.payload = AccountContactRequestIncomingReceived.decode(
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
            contactId: stringFromBytes(parsedData.payload.contactPk),
            rdvSeed: stringFromBytes(parsedData.payload.contactRendezvousSeed),
            name: parsedData.payload.contactMetadata.name,
            avatar: parsedData.payload.contactMetadata.avatar,
          })
        );

        break;
      }
      case EventType.EventTypeAccountContactRequestIncomingDiscarded: {
        const contactRequests = selectContactRequestList(store.getState());
        const parsedData: any = GroupMetadataEvent.toJSON(data);

        parsedData.payload = AccountContactRequestIncomingAccepted.decode(
          data.metadata.payload
        );

        store.dispatch(
          setContactRequestList(
            contactRequests.filter(
              (item, i) =>
                item.id === stringFromBytes(parsedData.payload.contactPk)
            )
          )
        );

        break;
      }
      case EventType.EventTypeAccountContactRequestIncomingAccepted: {
        const contactRequests = selectContactRequestList(store.getState());
        const parsedData: any = GroupMetadataEvent.toJSON(data);

        parsedData.payload = AccountContactRequestIncomingAccepted.decode(
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
                },
              ],
              name: "",
            })
          );

          subscribeMessages(stringFromBytes(group.group?.publicKey));
        }

        break;
      }
      case EventType.EventTypeAccountGroupJoined: {
        const parsedData: any = GroupMetadataEvent.toJSON(data);
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
        subscribeMessages(stringFromBytes(parsedData.payload.group.publicKey));

        break;
      }

      default:
        return null;
    }
  } catch (err) {
    console.log("metada next err", err);
  }
};
