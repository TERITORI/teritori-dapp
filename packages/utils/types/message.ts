import { AudioFileMetadata } from "./feed";

export type MessageType =
  | "message"
  | "group-join"
  | "group-leave"
  | "accept-contact"
  | "reject-contact"
  | "group-invite";

export type ConversationType = "contact" | "group";
interface MessageFile {
  name: string;
  url: string;
  mimeType: string;
  type: "image" | "audio" | "video";
  audioMetadata?: AudioFileMetadata;
}

interface MessagePayload {
  files: MessageFile[];
  message: string;
  type: MessageType;
  timestamp: string;
  metadata?: {
    groupName?: string;
    group: any;
  };
}

export interface Message {
  id: string;
  senderId: string;
  groupId: string;
  payload: MessagePayload;
}

interface Contact {
  id: string;
  tokenId: string;
  rdvSeed: string;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  members: Contact[];
  name: string;
}

export interface MessageList {
  [key: string]: Message[];
}

export interface ConversationList {
  [key: string]: Conversation[];
}

export interface ContactRequest {
  id: string;
  contactId: string;
  tokenId: string;
  rdvSeed: string;
}
