import { Conversation, Message } from "../../utils/types/message";

export const getLineTextByMessageType = ({ message }: { message: Message }) => {
  switch (message.type) {
    case "contact-request":
      return `Anon has sent a contact`;
  }
};

export const getNewConversationText = (conversation: Conversation) => {
  if (conversation.type === "contact") {
    return `Your contact request with ${
      conversation?.members?.[0]?.name || "Anon"
    } is still pending and has not yet been accepted.`;
  } else {
    return "Congratulations on creating this group! Currently, there are no members who have joined yet.";
  }
};

export const getConversationName = (conversation: Conversation) => {
  if (conversation.type === "contact") {
    return conversation?.members?.[0]?.name || "Anon";
  } else {
    return conversation?.name || "Group";
  }
};

export const getConversationAvatar = (
  conversation: Conversation,
  index = 0
) => {
  return conversation?.members?.[index]?.avatar || "";
};
