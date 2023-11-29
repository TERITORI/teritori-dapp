import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import { uniqBy } from "lodash";
import moment from "moment";

import {
  ContactRequest,
  Conversation,
  Message,
  CONVERSATION_TYPES,
  PeerItem,
} from "./../../utils/types/message";
import { weshConfig } from "../../weshnet/config";
import { stringFromBytes } from "../../weshnet/utils";
import { RootState } from "../store";

const contactRequestEntityAdapter = createEntityAdapter<ContactRequest>();
const contactRequestSelectors = contactRequestEntityAdapter.getSelectors();

const peerEntityAdapter = createEntityAdapter<PeerItem>();
const peerSelectors = peerEntityAdapter.getSelectors();

const conversationEntityAdapter = createEntityAdapter<Conversation>();
const conversationSelectors = conversationEntityAdapter.getSelectors();

interface KVItem<T> {
  id: string;
  value: T;
}
const kvEntityAdapter = createEntityAdapter<KVItem<string>>();
const kvSelectors = kvEntityAdapter.getSelectors();

const messageEntityAdapter = createEntityAdapter<Message>({
  sortComparer: (a, b) =>
    moment(b.timestamp).valueOf() - moment(a.timestamp).valueOf(),
});
const messageSelectors = messageEntityAdapter.getSelectors();

const groupEntityAdapter = createEntityAdapter<KVItem<EntityState<Message>>>();
const groupSelectors = groupEntityAdapter.getSelectors();

export interface MessageState {
  isWeshConnected: boolean;
  peers: EntityState<PeerItem>;
  contactInfo: {
    name: string;
    avatar: string;
    publicRendezvousSeed: string;
    shareLink: string;
  };
  contactRequests: EntityState<ContactRequest>;
  messages: EntityState<KVItem<EntityState<Message>>>;
  conversations: EntityState<Conversation>;
  lastIds: EntityState<KVItem<string>>;
}

const initialState: MessageState = {
  isWeshConnected: false,
  contactInfo: {
    name: "Anon",
    avatar: "",
    publicRendezvousSeed: "",
    shareLink: "",
  },
  messages: groupEntityAdapter.getInitialState(),
  contactRequests: contactRequestEntityAdapter.getInitialState(),
  conversations: conversationEntityAdapter.getInitialState(),
  lastIds: kvEntityAdapter.getInitialState(),
  peers: peerEntityAdapter.getInitialState(),
};

export const selectIsWeshConnected = (state: RootState) =>
  state.message.isWeshConnected;

export const selectContactInfo = (state: RootState) =>
  state.message.contactInfo;

const selectGroup = (state: RootState, groupPk: string) =>
  groupSelectors.selectById(state.message.messages, groupPk)?.value;

export const selectMessageList = (state: RootState, groupPk: string) => {
  const group = selectGroup(state, groupPk);
  if (!group) return [];
  return messageSelectors.selectAll(group);
};

/*
export const selectPeerList = (state: RootState) =>
  peerSelectors.selectAll(state.message.peers);
*/

export const selectPeerById = (state: RootState, id: string) =>
  peerSelectors.selectById(state.message.peers, id);

export const selectLastIdByKey = (state: RootState, key: string) =>
  kvSelectors.selectById(state.message.lastIds, key)?.value;

export const selectLastMessageByGroupPk = (
  state: RootState,
  groupPk: string,
) => {
  const messages = selectMessageList(state, groupPk);
  if (!messages.length) return undefined;
  return messages[0];
};

// TODO: optimize
export const selectLastContactMessageByGroupPk = (
  state: RootState,
  groupPk: string,
) => {
  const messages = selectMessageList(state, groupPk);
  const filtered = messages.filter(
    (item) => item.senderId !== stringFromBytes(weshConfig?.config?.accountPk),
  );
  if (!filtered.length) return undefined;
  return filtered[0];
};

export const selectContactRequestList = (state: RootState) =>
  contactRequestSelectors.selectAll(state.message.contactRequests);

export const selectConversationList = (
  state: RootState,
  conversationType: CONVERSATION_TYPES = CONVERSATION_TYPES.ACTIVE,
) => {
  const conversations = conversationSelectors.selectAll(
    state.message.conversations,
  );
  switch (conversationType) {
    case CONVERSATION_TYPES.ALL: {
      return conversations;
    }
    case CONVERSATION_TYPES.ARCHIVED: {
      return conversations.filter((conv) => conv.status === "archived");
    }
    case CONVERSATION_TYPES.ACTIVE:
    default:
      return conversations.filter((conv) => conv.status === "active");
  }
};

export const selectConversationById = (state: RootState, id: string) =>
  conversationSelectors.selectById(state.message.conversations, id);

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setIsWeshConnected: (state, action: PayloadAction<boolean>) => {
      state.isWeshConnected = action.payload;
    },
    setMessage: (
      state,
      action: PayloadAction<{ groupPk: string; data: Message }>,
    ) => {
      let group = groupSelectors.selectById(
        state.messages,
        action.payload.groupPk,
      );
      if (!group) {
        group = {
          id: action.payload.groupPk,
          value: messageEntityAdapter.getInitialState(),
        };
        group.value = messageEntityAdapter.setOne(
          group.value,
          action.payload.data,
        );
        groupEntityAdapter.setOne(state.messages, group);
      } else {
        groupEntityAdapter.updateOne(state.messages, {
          id: action.payload.groupPk,
          changes: {
            value: messageEntityAdapter.setOne(
              group.value,
              action.payload.data,
            ),
          },
        });
      }
    },
    setPeerList: (state, action: PayloadAction<PeerItem[]>) => {
      peerEntityAdapter.setAll(state.peers, action.payload);
    },
    updateMessageReactions: (
      state,
      action: PayloadAction<{ groupPk: string; data: Message }>,
    ) => {
      if (action.payload.data.parentId) {
        const group = groupSelectors.selectById(
          state.messages,
          action.payload.groupPk,
        );
        if (!group) return;
        const message = messageSelectors.selectById(
          group.value,
          action.payload.data.parentId,
        );
        if (!message) return;
        messageEntityAdapter.updateOne(group.value, {
          id: action.payload.data?.parentId,
          changes: {
            reactions: uniqBy(
              [...(message.reactions || []), action.payload.data], // TODO: normalize
              "id",
            ),
          },
        });
      }
    },
    setContactRequestList: (state, action: PayloadAction<ContactRequest[]>) => {
      contactRequestEntityAdapter.setAll(state.contactRequests, action.payload);
    },
    setContactRequest: (state, action: PayloadAction<ContactRequest>) => {
      contactRequestEntityAdapter.setOne(state.contactRequests, action.payload);
    },
    setConversationList: (state, action: PayloadAction<Conversation>) => {
      conversationEntityAdapter.setOne(state.conversations, action.payload);
    },
    updateConversationById: (
      state,
      action: PayloadAction<Partial<Conversation>>,
    ) => {
      if (action.payload.id) {
        conversationEntityAdapter.updateOne(state.conversations, {
          id: action.payload.id,
          changes: action.payload,
        });
      }
    },
    setLastId: (state, action: PayloadAction<KVItem<string>>) => {
      kvEntityAdapter.setOne(state.lastIds, action.payload);
    },

    setContactInfo: (
      state,
      action: PayloadAction<Partial<MessageState["contactInfo"]>>,
    ) => {
      state.contactInfo = { ...state.contactInfo, ...action.payload };
    },
  },
});

export const {
  setMessage,
  setContactRequestList,
  setContactRequest,
  setConversationList,
  updateMessageReactions,
  setLastId,
  setContactInfo,
  updateConversationById,
  setPeerList,
  setIsWeshConnected,
} = messageSlice.actions;

export const messageReducer = messageSlice.reducer;
