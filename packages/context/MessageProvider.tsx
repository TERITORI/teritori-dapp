import React, { createContext, useContext, useState } from "react";

import { CONVERSATION_TYPES, Conversation } from "../utils/types/message";

interface DefaultValue {
  activeConversationType: CONVERSATION_TYPES;
  setActiveConversationType: (type: CONVERSATION_TYPES) => void;
  activeConversation?: Conversation;
  setActiveConversation: (conv: Conversation) => void;
}
const defaultValue: DefaultValue = {
  activeConversationType: CONVERSATION_TYPES.ACTIVE,
  setActiveConversationType: (type: CONVERSATION_TYPES) => {},
  activeConversation: undefined,
  setActiveConversation: (conv: Conversation) => {},
};

const MessageContext = createContext(defaultValue);

export const MessageContextProvider: React.FC = ({ children }) => {
  // The entered name
  const [activeConversationType, setActiveConversationType] = useState(
    CONVERSATION_TYPES.ACTIVE
  );
  const [activeConversation, setActiveConversation] = useState<Conversation>();

  return (
    <MessageContext.Provider
      value={{
        activeConversationType,
        setActiveConversationType,
        activeConversation,
        setActiveConversation,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
