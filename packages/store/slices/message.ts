import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";

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

export const selectLastIdByKey = (key: string) => (state: RootState) =>
  state.message.lastIds[key];

export const selectMessageListByGroupPk =
  (groupPk: string) => (state: RootState) =>
    Object.values(state.message.messageList[groupPk] || {})
      .filter((item) => item.id)
      .sort(
        (a, b) => moment(b.timestamp).valueOf() - moment(a.timestamp).valueOf()
      );

export const selectLastMessageByGroupPk =
  (groupPk: string) => (state: RootState) =>
    selectMessageListByGroupPk(groupPk)(state)[0];

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
      if (!state.messageList[action.payload.groupPk]) {
        state.messageList[action.payload.groupPk] = {};
      }
      state.messageList[action.payload.groupPk][action.payload.data.id] = {
        ...state.messageList[action.payload.groupPk][action.payload.data.id],
        ...action.payload.data,
      };
    },
    updateMessageReaction: (
      state,
      action: PayloadAction<{ groupPk: string; data: Message }>
    ) => {
      try {
        if (!state.messageList[action.payload.groupPk]) {
          state.messageList[action.payload.groupPk] = {};
        }
        if (
          !state.messageList[action.payload.groupPk][
            action.payload.data?.parentId
          ]
        ) {
          state.messageList[action.payload.groupPk][
            action.payload.data?.parentId
          ] = {};
        }
        state.messageList[action.payload.groupPk][
          action.payload.data?.parentId
        ].reactions = [
          ...(state.messageList[action.payload.groupPk][
            action.payload.data.parentId
          ].reactions || []),
          action.payload.data,
        ];
      } catch (err) {
        console.log("updateMessageReaction err", err);
      }
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
    setLastId: (
      state,
      action: PayloadAction<{ key: string; value: string }>
    ) => {
      state.lastIds[action.payload.key] = action.payload.value;
    },
  },
});

export const {
  setMessageList,
  setContactRequestList,
  setConversationList,
  updateMessageReaction,
  setLastId,
} = messageSlice.actions;

export const messageReducer = messageSlice.reducer;
