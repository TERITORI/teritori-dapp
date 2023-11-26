import { z } from "zod";

/*
type MessageType =
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
*/

export type MessageFriendsTabItem = "friends" | "request" | "addFriend";

type ConversationType = "contact" | "group";

/*
interface MessageFileData extends RemoteFileData {
  type: string;
}
*/

const ZodMessagePayload = z.object({
  files: z.array(z.any()),
  message: z.string(),
  metadata: z
    .object({
      groupName: z.string().optional(),
      group: z.any().optional(),
      contact: z.any().optional(),
      lastReadId: z.string().optional(),
      lastReadBy: z.string().optional(),
    })
    .optional(),
});

export const ZodMessage = z.object({
  id: z.string(),
  senderId: z.string(),
  groupId: z.string(),
  type: z.string(),
  payload: ZodMessagePayload.optional(),
  timestamp: z.string(),
  parentId: z.string().optional(),
  reactions: z.any().optional(),
  isRead: z.boolean().optional(),
});

export type Message = z.infer<typeof ZodMessage>;

export type StoreMessage = Message & { id: string };

export interface Contact {
  id: string;
  tokenId?: string;
  name: string;
  avatar: string;
  rdvSeed: string;
  peerId: string;
  hasLeft?: boolean;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  members: Contact[];
  name: string;
  status: "active" | "archived" | "deleted" | "blocked";
  lastReadIdByMe?: string;
  lastReadIdByContact?: string;
}

export interface ContactRequest {
  id: string;
  contactId: string;
  rdvSeed: string;
  avatar: string;
  name: string;
  peerId: string;
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

export interface PeerItem {
  id: string;
  isActive: boolean;
}
