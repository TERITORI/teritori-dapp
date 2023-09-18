import { RemoteFileData } from "./feed";

export type MessageType =
  | "message"
  | "accept-contact"
  | "reject-contact"
  | "group-invite"
  | "group-join"
  | "group-leave"
  | "group-create"
  | "reaction"
  | "contact-request"
  | "read";

export type MessageFriendsTabItem = "friends" | "request" | "addFriend";

export type ConversationType = "contact" | "group";

export interface MessageFileData extends RemoteFileData {
  type: string;
}

interface MessagePayload {
  files: MessageFileData[];
  message: string;
  metadata?: {
    groupName?: string;
    group?: any;
    contact?: Contact;
    lastReadId?: string;
  };
}

export interface Message {
  id: string;
  senderId: string;
  groupId: string;
  type: MessageType;
  payload?: MessagePayload;
  timestamp: string;
  parentId?: string;
  reactions?: any[];
  isRead?: boolean;
}

interface Contact {
  id: string;
  tokenId?: string;
  name: string;
  avatar: string;
  rdvSeed: string;
  hasLeft?: boolean;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  members: Contact[];
  name: string;
  status: "active" | "archived" | "deleted" | "blocked";
}

export interface MessageList {
  [key: string]: { [key: string]: Message };
}

export interface ConversationList {
  [key: string]: Conversation[];
}

export interface ContactRequest {
  id: string;
  contactId: string;
  rdvSeed: string;
  avatar: string;
  name: string;
}

export interface ReplyTo {
  id: string;
  message: string;
}

export enum CONVERSATION_TYPES {
  ACTIVE = "Active Conversations",
  ALL = "All Conversations",
  ARCHIVED = "Archived Conversations",
}
