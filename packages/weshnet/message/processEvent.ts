import { GroupMessageEvent } from "../../api/weshnet/protocoltypes";
import {
  selectConversationById,
  setMessage,
  updateConversationById,
  updateMessageReactions,
} from "../../store/slices/message";
import { store } from "../../store/store";
import {
  ContactRequest,
  Conversation,
  StoreMessage,
  ZodMessage,
} from "../../utils/types/message";
import { weshConfig } from "../config";
import { getConversationName } from "../messageHelpers";
import { decodeJSON, stringFromBytes } from "../utils";

export const processMessage = async (
  data: GroupMessageEvent,
  groupPk: string,
) => {
  try {
    const conversation = selectConversationById(store.getState(), groupPk);

    const decodedMessage = ZodMessage.omit({ id: true }).parse({
      ...(decodeJSON(data.message) as object),
      groupId: groupPk,
    });

    const message: StoreMessage = {
      id: stringFromBytes(data.eventContext?.id),
      ...decodedMessage,
    };
    const isSender =
      message.senderId === stringFromBytes(weshConfig.config?.accountPk);

    switch (message.type) {
      case "reaction": {
        store.dispatch(
          updateMessageReactions({
            groupPk,
            data: message,
          }),
        );
        break;
      }

      case "group-create": {
        store.dispatch(
          updateConversationById({
            id: groupPk,
            name: message?.payload?.metadata?.groupName,
          }),
        );

        break;
      }
      case "group-invite": {
        if (conversation) {
          const formattedMessage = isSender
            ? `You invited ${getConversationName(
                conversation,
              )} to a group ${message?.payload?.metadata?.groupName}`
            : `${getConversationName(
                conversation,
              )} invited you to a group ${message?.payload?.metadata
                ?.groupName}`;

          if (!message.payload) {
            message.payload = { files: [], message: "", metadata: {} };
          }
          message.payload.message = formattedMessage;

          store.dispatch(
            setMessage({
              groupPk,
              data: message,
            }),
          );
        }

        break;
      }
      case "group-join": {
        if (conversation) {
          const newMember: ContactRequest[] = [];

          if (
            message?.payload?.metadata?.contact?.id &&
            stringFromBytes(weshConfig.config?.accountPk) !==
              message?.payload?.metadata?.contact?.id
          ) {
            newMember.push(message?.payload?.metadata?.contact);
          }

          store.dispatch(
            updateConversationById({
              id: groupPk,
              name: message?.payload?.metadata?.groupName,
              members: [...(conversation.members || []), ...newMember],
            }),
          );
          store.dispatch(
            setMessage({
              groupPk,
              data: message,
            }),
          );
        }

        break;
      }
      case "read": {
        const data: Partial<Conversation> = {};
        const lastReadId = message?.payload?.metadata?.lastReadId;
        const lastReadBy = message?.payload?.metadata?.lastReadBy;
        if (lastReadBy === stringFromBytes(weshConfig.config?.accountPk)) {
          data.lastReadIdByMe = lastReadId;
        } else {
          data.lastReadIdByContact = lastReadId;
        }

        store.dispatch(
          updateConversationById({
            id: groupPk,
            ...data,
          }),
        );
        break;
      }
      default: {
        store.dispatch(
          setMessage({
            groupPk,
            data: message,
          }),
        );
      }
    }
  } catch (err) {
    console.error("process message err", err);
  }
};
