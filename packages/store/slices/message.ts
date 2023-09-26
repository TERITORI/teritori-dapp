import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { uniqBy } from "lodash";
import moment from "moment";

import {
  ContactRequest,
  Conversation,
  MessageList,
  Message,
  CONVERSATION_TYPES,
  PeerItem,
} from "./../../utils/types/message";
import { RootState } from "../store";

export interface MessageState {
  peerList: PeerItem[];
  contactInfo: {
    name: string;
    avatar: string;
    publicRendezvousSeed: string;
    shareLink: string;
  };
  contactRequestList: ContactRequest[];
  messageList: MessageList;
  conversationList: {
    [key: string]: Conversation;
  };
  lastIds: {
    [key: string]: string;
  };
}

const initialState: MessageState = {
  contactInfo: {
    name: "Anon",
    avatar: "",
    publicRendezvousSeed: "",
    shareLink: "",
  },
  messageList: {},
  contactRequestList: [],
  conversationList: {},
  lastIds: {},
  peerList: [],
};

export const selectContactInfo = (state: RootState) =>
  state.message.contactInfo;

export const selectMessageList = (groupPk: string) => (state: RootState) =>
  state.message.messageList[groupPk] || [];

export const selectPeerList = (state: RootState) => state.message.peerList;

export const selectPeerListById = (id: string) => (state: RootState) =>
  state.message.peerList.find((item) => item.id === id);

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

export const selectConversationList =
  (conversationType: CONVERSATION_TYPES = CONVERSATION_TYPES.ACTIVE) =>
  (state: RootState) => {
    switch (conversationType) {
      case CONVERSATION_TYPES.ALL: {
        return Object.values(state.message.conversationList);
      }
      case CONVERSATION_TYPES.ARCHIVED: {
        return Object.values(state.message.conversationList).filter(
          (conv) => conv.status === "archived"
        );
      }
      case CONVERSATION_TYPES.ACTIVE:
      default:
        return Object.values(state.message.conversationList).filter(
          (conv) => conv.status === "active"
        );
    }
  };

export const selectConversationById = (id: string) => (state: RootState) =>
  state.message.conversationList[id];

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
      state.messageList[action.payload.groupPk][action.payload.data.id] =
        action.payload.data;
    },
    setPeerList: (state, action: PayloadAction<PeerItem[]>) => {
      state.peerList = action.payload;
    },
    updateMessageReaction: (
      state,
      action: PayloadAction<{ groupPk: string; data: Message }>
    ) => {
      if (action.payload.data.parentId) {
        try {
          state.messageList[action.payload.groupPk][
            action.payload.data?.parentId
          ].reactions = uniqBy(
            [
              ...(state.messageList[action.payload.groupPk][
                action.payload.data.parentId
              ].reactions || []),
              action.payload.data,
            ],
            "id"
          );
        } catch (err) {
          console.log("update reaction failed", err);
        }
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
    setConversationList: (state, action: PayloadAction<Conversation>) => {
      state.conversationList[action.payload.id] = action.payload;
    },
    updateConversationById: (
      state,
      action: PayloadAction<Partial<Conversation>>
    ) => {
      if (action.payload.id) {
        state.conversationList[action.payload.id] = {
          ...(state.conversationList[action.payload.id] || {}),
          ...action.payload,
        };
      }
    },
    setLastId: (
      state,
      action: PayloadAction<{ key: string; value: string }>
    ) => {
      state.lastIds[action.payload.key] = action.payload.value;
    },

    setContactInfo: (
      state,
      action: PayloadAction<Partial<MessageState["contactInfo"]>>
    ) => {
      state.contactInfo = { ...state.contactInfo, ...action.payload };
    },
  },
});

export const {
  setMessageList,
  setContactRequestList,
  setConversationList,
  updateMessageReaction,
  setLastId,
  setContactInfo,
  updateConversationById,
  setPeerList,
} = messageSlice.actions;

export const messageReducer = messageSlice.reducer;
