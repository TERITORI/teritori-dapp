import { GroupMessageEvent } from "../../api/weshnet/protocoltypes";
import {
  selectConversationById,
  setMessageList,
  updateConversationById,
  updateMessageReaction,
} from "../../store/slices/message";
import { store } from "../../store/store";
import { ContactRequest, Conversation } from "../../utils/types/message";
import { weshConfig } from "../config";
import { getConversationName } from "../messageHelpers";
import { decodeJSON, stringFromBytes } from "../utils";

export const processMessage = async (
  data: GroupMessageEvent,
  groupPk: string,
) => {
  try {
    const conversation = selectConversationById(groupPk)(store.getState());
    const decodedMessage = decodeJSON(data.message);

    const message = {
      id: stringFromBytes(data.eventContext?.id),
      ...decodedMessage,
    };
    const isSender =
      message.senderId === stringFromBytes(weshConfig.config?.accountPk);

    switch (message.type) {
      case "reaction": {
        store.dispatch(
          updateMessageReaction({
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
        const formattedMessage = isSender
          ? `You invited ${getConversationName(
              conversation,
            )} to a group ${message?.payload?.metadata?.groupName}`
          : `${getConversationName(
              conversation,
            )} invited you to a group ${message?.payload?.metadata?.groupName}`;

        if (!message.payload) {
          message.payload = { files: [], message: "" };
        }
        message.payload.message = formattedMessage;

        store.dispatch(
          setMessageList({
            groupPk,
            data: message,
          }),
        );

        break;
      }
      case "group-join": {
        const newMember: ContactRequest[] = [];

        if (
          message?.payload?.metadata?.contact?.id &&
          stringFromBytes(weshConfig.config?.accountPk) !==
            message?.payload?.metadata?.contact?.id
        ) {
          newMember.push(message?.payload?.metadata?.contact);
        }

        const conversation = selectConversationById(groupPk)(store.getState());
        store.dispatch(
          updateConversationById({
            id: groupPk,
            name: message?.payload?.metadata?.groupName,
            members: [...(conversation.members || []), ...newMember],
          }),
        );
        store.dispatch(
          setMessageList({
            groupPk,
            data: message,
          }),
        );
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
          setMessageList({
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
