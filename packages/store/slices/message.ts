import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  ContactRequest,
  Conversation,
  MessageList,
  Message,
} from "./../../utils/types/message";
import { RootState } from "../store";

interface Search {
  contactRequestList: ContactRequest[];
  messageList: MessageList;
  conversationList: Conversation[];
  lastIds: {
    [key: string]: string;
  };
}

const initialState: Search = {
  messageList: {},
  contactRequestList: [],
  conversationList: [],
  lastIds: {},
};

export const selectMessageList = (groupPk: string) => (state: RootState) =>
  state.message.messageList[groupPk] || [];

export const selectMessageListByGroupPk =
  (groupPk: string) => (state: RootState) =>
    state.message.messageList[groupPk] || [];

export const selectContactRequestList = (state: RootState) =>
  state.message.contactRequestList;
export const selectConversationList = (state: RootState) =>
  state.message.conversationList;

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessageList: (
      state,
      action: PayloadAction<{ groupPk: string; data: Message }>
    ) => {
      state.messageList[action.payload.groupPk] = [
        ...(state.messageList[action.payload.groupPk] || []),
        action.payload.data,
      ];
    },
    setContactRequestList: (
      state,
      action: PayloadAction<ContactRequest | ContactRequest[]>
    ) => {
      if (Array.isArray(action.payload)) {
        state.contactRequestList = action.payload;
      } else {
        state.contactRequestList = [
          action.payload,
          ...state.contactRequestList,
        ];
      }
    },
    setConversationList: (
      state,
      action: PayloadAction<Conversation | Conversation[]>
    ) => {
      if (Array.isArray(action.payload)) {
        state.conversationList = action.payload;
      } else {
        state.conversationList = [action.payload, ...state.conversationList];
      }
    },
  },
});

export const { setMessageList, setContactRequestList, setConversationList } =
  messageSlice.actions;

export const messageReducer = messageSlice.reducer;
