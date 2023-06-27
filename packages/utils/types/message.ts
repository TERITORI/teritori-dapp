import { AudioFileMetadata, RemoteFileData } from "./feed";

export type MessageType =
  | "message"
  | "accept-contact"
  | "reject-contact"
  | "group-invite"
  | "group-join"
  | "group-leave"
  | "group-create"
  | "reaction";

export type ConversationType = "contact" | "group";
interface MessageFile {
  name: string;
  url: string;
  mimeType: string;
  type: "image" | "audio" | "video";
  audioMetadata?: AudioFileMetadata;
}

interface MessagePayload {
  files: RemoteFileData[];
  message: string;
  metadata?: {
    groupName?: string;
    group?: any;
    contact?: Contact;
  };
}

export interface Message {
  id: string;
  senderId: string;
  groupId: string;
  type: MessageType;
  payload: MessagePayload;
  timestamp: string;
  parentId?: string;
}

interface Contact {
  id: string;
  tokenId: string;
  rdvSeed: string;
  hasLeft?: boolean;
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

export interface ReplyTo {
  id: string;
  message: string;
}
