import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { GroupMessageEvent, GroupMetadataEvent } from "../../weshnet";
import { RootState } from "../store";

interface Search {
  contactRequestList: GroupMetadataEvent[];
  metadataList: GroupMetadataEvent[];
  messageList: any;
  conversationList: GroupMetadataEvent[];
}

const initialState: Search = {
  metadataList: [],
  messageList: {},
  contactRequestList: [],
  conversationList: [],
};

export const selectMetadataList = (state: RootState) =>
  state.message.metadataList;

export const selectMessageList = (state: RootState) =>
  state.message.messageList;

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
    setMetadataList: (state, action: PayloadAction<GroupMetadataEvent>) => {
      state.metadataList = [action.payload, ...state.metadataList];
    },
    setMessageList: (state, action: PayloadAction<GroupMessageEvent>) => {
      state.messageList[action.payload.groupPk] = [
        ...(state.messageList[action.payload.groupPk] || []),
        action.payload.data,
      ];
    },
    setContactRequestList: (
      state,
      action: PayloadAction<GroupMetadataEvent | GroupMetadataEvent[]>
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
      action: PayloadAction<GroupMetadataEvent | GroupMetadataEvent[]>
    ) => {
      if (Array.isArray(action.payload)) {
        state.conversationList = action.payload;
      } else {
        state.conversationList = [action.payload, ...state.conversationList];
      }
    },
  },
});

export const {
  setMessageList,
  setMetadataList,
  setContactRequestList,
  setConversationList,
} = messageSlice.actions;

export const messageReducer = messageSlice.reducer;
