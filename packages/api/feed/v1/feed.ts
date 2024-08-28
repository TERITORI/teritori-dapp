/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "feed.v1";

export interface IPFSKeyRequest {
  userId: string;
}

export interface IPFSKeyResponse {
  jwt: string;
}

export interface Reaction {
  icon: string;
  count: number;
  ownState: boolean;
}

export interface Post {
  category: number;
  isDeleted: boolean;
  /**
   * use local_identifier
   *
   * @deprecated
   */
  identifier: string;
  metadata: string;
  parentPostIdentifier: string;
  subPostLength: number;
  authorId: string;
  createdAt: number;
  reactions: Reaction[];
  tipAmount: number;
  premiumLevel: number;
  id: string;
  localIdentifier: string;
  networkId: string;
}

export interface PostFilter {
  user: string;
  mentions: string[];
  categories: number[];
  hashtags: string[];
  /** inclusive */
  premiumLevelMin: number;
  /** inclusive, -1 means infinity */
  premiumLevelMax: number;
  networkId: string;
  hasLocation: boolean;
}

export interface PostsRequest {
  filter: PostFilter | undefined;
  limit: number;
  offset: number;
  queryUserId: string;
}

export interface PostsWithLocationRequest {
  north: number;
  south: number;
  west: number;
  east: number;
  hashtags: string[];
  limit: number;
}

export interface AggregatedPost {
  lat: number;
  long: number;
  totalPoints: number;
}

export interface PostsResponse {
  posts: Post[];
}

export interface PostsWithLocationResponse {
  posts: Post[];
  aggregatedPosts: AggregatedPost[];
  isAggregated: boolean;
}

function createBaseIPFSKeyRequest(): IPFSKeyRequest {
  return { userId: "" };
}

export const IPFSKeyRequest = {
  encode(message: IPFSKeyRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IPFSKeyRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIPFSKeyRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.userId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): IPFSKeyRequest {
    return { userId: isSet(object.userId) ? globalThis.String(object.userId) : "" };
  },

  toJSON(message: IPFSKeyRequest): unknown {
    const obj: any = {};
    if (message.userId !== "") {
      obj.userId = message.userId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<IPFSKeyRequest>, I>>(base?: I): IPFSKeyRequest {
    return IPFSKeyRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<IPFSKeyRequest>, I>>(object: I): IPFSKeyRequest {
    const message = createBaseIPFSKeyRequest();
    message.userId = object.userId ?? "";
    return message;
  },
};

function createBaseIPFSKeyResponse(): IPFSKeyResponse {
  return { jwt: "" };
}

export const IPFSKeyResponse = {
  encode(message: IPFSKeyResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.jwt !== "") {
      writer.uint32(10).string(message.jwt);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IPFSKeyResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIPFSKeyResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.jwt = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): IPFSKeyResponse {
    return { jwt: isSet(object.jwt) ? globalThis.String(object.jwt) : "" };
  },

  toJSON(message: IPFSKeyResponse): unknown {
    const obj: any = {};
    if (message.jwt !== "") {
      obj.jwt = message.jwt;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<IPFSKeyResponse>, I>>(base?: I): IPFSKeyResponse {
    return IPFSKeyResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<IPFSKeyResponse>, I>>(object: I): IPFSKeyResponse {
    const message = createBaseIPFSKeyResponse();
    message.jwt = object.jwt ?? "";
    return message;
  },
};

function createBaseReaction(): Reaction {
  return { icon: "", count: 0, ownState: false };
}

export const Reaction = {
  encode(message: Reaction, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.icon !== "") {
      writer.uint32(10).string(message.icon);
    }
    if (message.count !== 0) {
      writer.uint32(16).uint32(message.count);
    }
    if (message.ownState === true) {
      writer.uint32(24).bool(message.ownState);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Reaction {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReaction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.icon = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.count = reader.uint32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.ownState = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Reaction {
    return {
      icon: isSet(object.icon) ? globalThis.String(object.icon) : "",
      count: isSet(object.count) ? globalThis.Number(object.count) : 0,
      ownState: isSet(object.ownState) ? globalThis.Boolean(object.ownState) : false,
    };
  },

  toJSON(message: Reaction): unknown {
    const obj: any = {};
    if (message.icon !== "") {
      obj.icon = message.icon;
    }
    if (message.count !== 0) {
      obj.count = Math.round(message.count);
    }
    if (message.ownState === true) {
      obj.ownState = message.ownState;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Reaction>, I>>(base?: I): Reaction {
    return Reaction.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Reaction>, I>>(object: I): Reaction {
    const message = createBaseReaction();
    message.icon = object.icon ?? "";
    message.count = object.count ?? 0;
    message.ownState = object.ownState ?? false;
    return message;
  },
};

function createBasePost(): Post {
  return {
    category: 0,
    isDeleted: false,
    identifier: "",
    metadata: "",
    parentPostIdentifier: "",
    subPostLength: 0,
    authorId: "",
    createdAt: 0,
    reactions: [],
    tipAmount: 0,
    premiumLevel: 0,
    id: "",
    localIdentifier: "",
    networkId: "",
  };
}

export const Post = {
  encode(message: Post, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.category !== 0) {
      writer.uint32(8).uint32(message.category);
    }
    if (message.isDeleted === true) {
      writer.uint32(16).bool(message.isDeleted);
    }
    if (message.identifier !== "") {
      writer.uint32(26).string(message.identifier);
    }
    if (message.metadata !== "") {
      writer.uint32(34).string(message.metadata);
    }
    if (message.parentPostIdentifier !== "") {
      writer.uint32(42).string(message.parentPostIdentifier);
    }
    if (message.subPostLength !== 0) {
      writer.uint32(48).uint32(message.subPostLength);
    }
    if (message.authorId !== "") {
      writer.uint32(58).string(message.authorId);
    }
    if (message.createdAt !== 0) {
      writer.uint32(64).int64(message.createdAt);
    }
    for (const v of message.reactions) {
      Reaction.encode(v!, writer.uint32(74).fork()).ldelim();
    }
    if (message.tipAmount !== 0) {
      writer.uint32(80).int64(message.tipAmount);
    }
    if (message.premiumLevel !== 0) {
      writer.uint32(88).uint32(message.premiumLevel);
    }
    if (message.id !== "") {
      writer.uint32(98).string(message.id);
    }
    if (message.localIdentifier !== "") {
      writer.uint32(106).string(message.localIdentifier);
    }
    if (message.networkId !== "") {
      writer.uint32(114).string(message.networkId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Post {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePost();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.category = reader.uint32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.isDeleted = reader.bool();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.identifier = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.metadata = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.parentPostIdentifier = reader.string();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.subPostLength = reader.uint32();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.authorId = reader.string();
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.createdAt = longToNumber(reader.int64() as Long);
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.reactions.push(Reaction.decode(reader, reader.uint32()));
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }

          message.tipAmount = longToNumber(reader.int64() as Long);
          continue;
        case 11:
          if (tag !== 88) {
            break;
          }

          message.premiumLevel = reader.uint32();
          continue;
        case 12:
          if (tag !== 98) {
            break;
          }

          message.id = reader.string();
          continue;
        case 13:
          if (tag !== 106) {
            break;
          }

          message.localIdentifier = reader.string();
          continue;
        case 14:
          if (tag !== 114) {
            break;
          }

          message.networkId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Post {
    return {
      category: isSet(object.category) ? globalThis.Number(object.category) : 0,
      isDeleted: isSet(object.isDeleted) ? globalThis.Boolean(object.isDeleted) : false,
      identifier: isSet(object.identifier) ? globalThis.String(object.identifier) : "",
      metadata: isSet(object.metadata) ? globalThis.String(object.metadata) : "",
      parentPostIdentifier: isSet(object.parentPostIdentifier) ? globalThis.String(object.parentPostIdentifier) : "",
      subPostLength: isSet(object.subPostLength) ? globalThis.Number(object.subPostLength) : 0,
      authorId: isSet(object.authorId) ? globalThis.String(object.authorId) : "",
      createdAt: isSet(object.createdAt) ? globalThis.Number(object.createdAt) : 0,
      reactions: globalThis.Array.isArray(object?.reactions)
        ? object.reactions.map((e: any) => Reaction.fromJSON(e))
        : [],
      tipAmount: isSet(object.tipAmount) ? globalThis.Number(object.tipAmount) : 0,
      premiumLevel: isSet(object.premiumLevel) ? globalThis.Number(object.premiumLevel) : 0,
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      localIdentifier: isSet(object.localIdentifier) ? globalThis.String(object.localIdentifier) : "",
      networkId: isSet(object.networkId) ? globalThis.String(object.networkId) : "",
    };
  },

  toJSON(message: Post): unknown {
    const obj: any = {};
    if (message.category !== 0) {
      obj.category = Math.round(message.category);
    }
    if (message.isDeleted === true) {
      obj.isDeleted = message.isDeleted;
    }
    if (message.identifier !== "") {
      obj.identifier = message.identifier;
    }
    if (message.metadata !== "") {
      obj.metadata = message.metadata;
    }
    if (message.parentPostIdentifier !== "") {
      obj.parentPostIdentifier = message.parentPostIdentifier;
    }
    if (message.subPostLength !== 0) {
      obj.subPostLength = Math.round(message.subPostLength);
    }
    if (message.authorId !== "") {
      obj.authorId = message.authorId;
    }
    if (message.createdAt !== 0) {
      obj.createdAt = Math.round(message.createdAt);
    }
    if (message.reactions?.length) {
      obj.reactions = message.reactions.map((e) => Reaction.toJSON(e));
    }
    if (message.tipAmount !== 0) {
      obj.tipAmount = Math.round(message.tipAmount);
    }
    if (message.premiumLevel !== 0) {
      obj.premiumLevel = Math.round(message.premiumLevel);
    }
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.localIdentifier !== "") {
      obj.localIdentifier = message.localIdentifier;
    }
    if (message.networkId !== "") {
      obj.networkId = message.networkId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Post>, I>>(base?: I): Post {
    return Post.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Post>, I>>(object: I): Post {
    const message = createBasePost();
    message.category = object.category ?? 0;
    message.isDeleted = object.isDeleted ?? false;
    message.identifier = object.identifier ?? "";
    message.metadata = object.metadata ?? "";
    message.parentPostIdentifier = object.parentPostIdentifier ?? "";
    message.subPostLength = object.subPostLength ?? 0;
    message.authorId = object.authorId ?? "";
    message.createdAt = object.createdAt ?? 0;
    message.reactions = object.reactions?.map((e) => Reaction.fromPartial(e)) || [];
    message.tipAmount = object.tipAmount ?? 0;
    message.premiumLevel = object.premiumLevel ?? 0;
    message.id = object.id ?? "";
    message.localIdentifier = object.localIdentifier ?? "";
    message.networkId = object.networkId ?? "";
    return message;
  },
};

function createBasePostFilter(): PostFilter {
  return {
    user: "",
    mentions: [],
    categories: [],
    hashtags: [],
    premiumLevelMin: 0,
    premiumLevelMax: 0,
    networkId: "",
    hasLocation: false,
  };
}

export const PostFilter = {
  encode(message: PostFilter, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.user !== "") {
      writer.uint32(10).string(message.user);
    }
    for (const v of message.mentions) {
      writer.uint32(18).string(v!);
    }
    writer.uint32(26).fork();
    for (const v of message.categories) {
      writer.uint32(v);
    }
    writer.ldelim();
    for (const v of message.hashtags) {
      writer.uint32(34).string(v!);
    }
    if (message.premiumLevelMin !== 0) {
      writer.uint32(40).int32(message.premiumLevelMin);
    }
    if (message.premiumLevelMax !== 0) {
      writer.uint32(48).int32(message.premiumLevelMax);
    }
    if (message.networkId !== "") {
      writer.uint32(58).string(message.networkId);
    }
    if (message.hasLocation === true) {
      writer.uint32(56).bool(message.hasLocation);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PostFilter {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePostFilter();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.user = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.mentions.push(reader.string());
          continue;
        case 3:
          if (tag === 24) {
            message.categories.push(reader.uint32());

            continue;
          }

          if (tag === 26) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.categories.push(reader.uint32());
            }

            continue;
          }

          break;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.hashtags.push(reader.string());
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.premiumLevelMin = reader.int32();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.premiumLevelMax = reader.int32();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.networkId = reader.string();
          continue;
        case 8:
          if (tag !== 56) {
            break;
          }

          message.hasLocation = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PostFilter {
    return {
      user: isSet(object.user) ? globalThis.String(object.user) : "",
      mentions: globalThis.Array.isArray(object?.mentions) ? object.mentions.map((e: any) => globalThis.String(e)) : [],
      categories: globalThis.Array.isArray(object?.categories)
        ? object.categories.map((e: any) => globalThis.Number(e))
        : [],
      hashtags: globalThis.Array.isArray(object?.hashtags) ? object.hashtags.map((e: any) => globalThis.String(e)) : [],
      premiumLevelMin: isSet(object.premiumLevelMin) ? globalThis.Number(object.premiumLevelMin) : 0,
      premiumLevelMax: isSet(object.premiumLevelMax) ? globalThis.Number(object.premiumLevelMax) : 0,
      networkId: isSet(object.networkId) ? globalThis.String(object.networkId) : "",
      hasLocation: isSet(object.hasLocation) ? globalThis.Boolean(object.hasLocation) : false,
    };
  },

  toJSON(message: PostFilter): unknown {
    const obj: any = {};
    if (message.user !== "") {
      obj.user = message.user;
    }
    if (message.mentions?.length) {
      obj.mentions = message.mentions;
    }
    if (message.categories?.length) {
      obj.categories = message.categories.map((e) => Math.round(e));
    }
    if (message.hashtags?.length) {
      obj.hashtags = message.hashtags;
    }
    if (message.premiumLevelMin !== 0) {
      obj.premiumLevelMin = Math.round(message.premiumLevelMin);
    }
    if (message.premiumLevelMax !== 0) {
      obj.premiumLevelMax = Math.round(message.premiumLevelMax);
    }
    if (message.networkId !== "") {
      obj.networkId = message.networkId;
    }
    if (message.hasLocation === true) {
      obj.hasLocation = message.hasLocation;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PostFilter>, I>>(base?: I): PostFilter {
    return PostFilter.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PostFilter>, I>>(object: I): PostFilter {
    const message = createBasePostFilter();
    message.user = object.user ?? "";
    message.mentions = object.mentions?.map((e) => e) || [];
    message.categories = object.categories?.map((e) => e) || [];
    message.hashtags = object.hashtags?.map((e) => e) || [];
    message.premiumLevelMin = object.premiumLevelMin ?? 0;
    message.premiumLevelMax = object.premiumLevelMax ?? 0;
    message.networkId = object.networkId ?? "";
    message.hasLocation = object.hasLocation ?? false;
    return message;
  },
};

function createBasePostsRequest(): PostsRequest {
  return { filter: undefined, limit: 0, offset: 0, queryUserId: "" };
}

export const PostsRequest = {
  encode(message: PostsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.filter !== undefined) {
      PostFilter.encode(message.filter, writer.uint32(10).fork()).ldelim();
    }
    if (message.limit !== 0) {
      writer.uint32(16).uint32(message.limit);
    }
    if (message.offset !== 0) {
      writer.uint32(24).uint32(message.offset);
    }
    if (message.queryUserId !== "") {
      writer.uint32(34).string(message.queryUserId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PostsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePostsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.filter = PostFilter.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.limit = reader.uint32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.offset = reader.uint32();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.queryUserId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PostsRequest {
    return {
      filter: isSet(object.filter) ? PostFilter.fromJSON(object.filter) : undefined,
      limit: isSet(object.limit) ? globalThis.Number(object.limit) : 0,
      offset: isSet(object.offset) ? globalThis.Number(object.offset) : 0,
      queryUserId: isSet(object.queryUserId) ? globalThis.String(object.queryUserId) : "",
    };
  },

  toJSON(message: PostsRequest): unknown {
    const obj: any = {};
    if (message.filter !== undefined) {
      obj.filter = PostFilter.toJSON(message.filter);
    }
    if (message.limit !== 0) {
      obj.limit = Math.round(message.limit);
    }
    if (message.offset !== 0) {
      obj.offset = Math.round(message.offset);
    }
    if (message.queryUserId !== "") {
      obj.queryUserId = message.queryUserId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PostsRequest>, I>>(base?: I): PostsRequest {
    return PostsRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PostsRequest>, I>>(object: I): PostsRequest {
    const message = createBasePostsRequest();
    message.filter = (object.filter !== undefined && object.filter !== null)
      ? PostFilter.fromPartial(object.filter)
      : undefined;
    message.limit = object.limit ?? 0;
    message.offset = object.offset ?? 0;
    message.queryUserId = object.queryUserId ?? "";
    return message;
  },
};

function createBasePostsWithLocationRequest(): PostsWithLocationRequest {
  return { north: 0, south: 0, west: 0, east: 0, hashtags: [], limit: 0 };
}

export const PostsWithLocationRequest = {
  encode(message: PostsWithLocationRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.north !== 0) {
      writer.uint32(13).float(message.north);
    }
    if (message.south !== 0) {
      writer.uint32(21).float(message.south);
    }
    if (message.west !== 0) {
      writer.uint32(29).float(message.west);
    }
    if (message.east !== 0) {
      writer.uint32(37).float(message.east);
    }
    for (const v of message.hashtags) {
      writer.uint32(42).string(v!);
    }
    if (message.limit !== 0) {
      writer.uint32(48).uint32(message.limit);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PostsWithLocationRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePostsWithLocationRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 13) {
            break;
          }

          message.north = reader.float();
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }

          message.south = reader.float();
          continue;
        case 3:
          if (tag !== 29) {
            break;
          }

          message.west = reader.float();
          continue;
        case 4:
          if (tag !== 37) {
            break;
          }

          message.east = reader.float();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.hashtags.push(reader.string());
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.limit = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PostsWithLocationRequest {
    return {
      north: isSet(object.north) ? globalThis.Number(object.north) : 0,
      south: isSet(object.south) ? globalThis.Number(object.south) : 0,
      west: isSet(object.west) ? globalThis.Number(object.west) : 0,
      east: isSet(object.east) ? globalThis.Number(object.east) : 0,
      hashtags: globalThis.Array.isArray(object?.hashtags) ? object.hashtags.map((e: any) => globalThis.String(e)) : [],
      limit: isSet(object.limit) ? globalThis.Number(object.limit) : 0,
    };
  },

  toJSON(message: PostsWithLocationRequest): unknown {
    const obj: any = {};
    if (message.north !== 0) {
      obj.north = message.north;
    }
    if (message.south !== 0) {
      obj.south = message.south;
    }
    if (message.west !== 0) {
      obj.west = message.west;
    }
    if (message.east !== 0) {
      obj.east = message.east;
    }
    if (message.hashtags?.length) {
      obj.hashtags = message.hashtags;
    }
    if (message.limit !== 0) {
      obj.limit = Math.round(message.limit);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PostsWithLocationRequest>, I>>(base?: I): PostsWithLocationRequest {
    return PostsWithLocationRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PostsWithLocationRequest>, I>>(object: I): PostsWithLocationRequest {
    const message = createBasePostsWithLocationRequest();
    message.north = object.north ?? 0;
    message.south = object.south ?? 0;
    message.west = object.west ?? 0;
    message.east = object.east ?? 0;
    message.hashtags = object.hashtags?.map((e) => e) || [];
    message.limit = object.limit ?? 0;
    return message;
  },
};

function createBaseAggregatedPost(): AggregatedPost {
  return { lat: 0, long: 0, totalPoints: 0 };
}

export const AggregatedPost = {
  encode(message: AggregatedPost, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.lat !== 0) {
      writer.uint32(13).float(message.lat);
    }
    if (message.long !== 0) {
      writer.uint32(21).float(message.long);
    }
    if (message.totalPoints !== 0) {
      writer.uint32(24).int64(message.totalPoints);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AggregatedPost {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAggregatedPost();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 13) {
            break;
          }

          message.lat = reader.float();
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }

          message.long = reader.float();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.totalPoints = longToNumber(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AggregatedPost {
    return {
      lat: isSet(object.lat) ? globalThis.Number(object.lat) : 0,
      long: isSet(object.long) ? globalThis.Number(object.long) : 0,
      totalPoints: isSet(object.totalPoints) ? globalThis.Number(object.totalPoints) : 0,
    };
  },

  toJSON(message: AggregatedPost): unknown {
    const obj: any = {};
    if (message.lat !== 0) {
      obj.lat = message.lat;
    }
    if (message.long !== 0) {
      obj.long = message.long;
    }
    if (message.totalPoints !== 0) {
      obj.totalPoints = Math.round(message.totalPoints);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AggregatedPost>, I>>(base?: I): AggregatedPost {
    return AggregatedPost.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AggregatedPost>, I>>(object: I): AggregatedPost {
    const message = createBaseAggregatedPost();
    message.lat = object.lat ?? 0;
    message.long = object.long ?? 0;
    message.totalPoints = object.totalPoints ?? 0;
    return message;
  },
};

function createBasePostsResponse(): PostsResponse {
  return { posts: [] };
}

export const PostsResponse = {
  encode(message: PostsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.posts) {
      Post.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PostsResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePostsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.posts.push(Post.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PostsResponse {
    return { posts: globalThis.Array.isArray(object?.posts) ? object.posts.map((e: any) => Post.fromJSON(e)) : [] };
  },

  toJSON(message: PostsResponse): unknown {
    const obj: any = {};
    if (message.posts?.length) {
      obj.posts = message.posts.map((e) => Post.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PostsResponse>, I>>(base?: I): PostsResponse {
    return PostsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PostsResponse>, I>>(object: I): PostsResponse {
    const message = createBasePostsResponse();
    message.posts = object.posts?.map((e) => Post.fromPartial(e)) || [];
    return message;
  },
};

function createBasePostsWithLocationResponse(): PostsWithLocationResponse {
  return { posts: [], aggregatedPosts: [], isAggregated: false };
}

export const PostsWithLocationResponse = {
  encode(message: PostsWithLocationResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.posts) {
      Post.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.aggregatedPosts) {
      AggregatedPost.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.isAggregated === true) {
      writer.uint32(24).bool(message.isAggregated);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PostsWithLocationResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePostsWithLocationResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.posts.push(Post.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.aggregatedPosts.push(AggregatedPost.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.isAggregated = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PostsWithLocationResponse {
    return {
      posts: globalThis.Array.isArray(object?.posts) ? object.posts.map((e: any) => Post.fromJSON(e)) : [],
      aggregatedPosts: globalThis.Array.isArray(object?.aggregatedPosts)
        ? object.aggregatedPosts.map((e: any) => AggregatedPost.fromJSON(e))
        : [],
      isAggregated: isSet(object.isAggregated) ? globalThis.Boolean(object.isAggregated) : false,
    };
  },

  toJSON(message: PostsWithLocationResponse): unknown {
    const obj: any = {};
    if (message.posts?.length) {
      obj.posts = message.posts.map((e) => Post.toJSON(e));
    }
    if (message.aggregatedPosts?.length) {
      obj.aggregatedPosts = message.aggregatedPosts.map((e) => AggregatedPost.toJSON(e));
    }
    if (message.isAggregated === true) {
      obj.isAggregated = message.isAggregated;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PostsWithLocationResponse>, I>>(base?: I): PostsWithLocationResponse {
    return PostsWithLocationResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PostsWithLocationResponse>, I>>(object: I): PostsWithLocationResponse {
    const message = createBasePostsWithLocationResponse();
    message.posts = object.posts?.map((e) => Post.fromPartial(e)) || [];
    message.aggregatedPosts = object.aggregatedPosts?.map((e) => AggregatedPost.fromPartial(e)) || [];
    message.isAggregated = object.isAggregated ?? false;
    return message;
  },
};

export interface FeedService {
  Posts(request: DeepPartial<PostsRequest>, metadata?: grpc.Metadata): Promise<PostsResponse>;
  PostsWithLocation(
    request: DeepPartial<PostsWithLocationRequest>,
    metadata?: grpc.Metadata,
  ): Promise<PostsWithLocationResponse>;
  IPFSKey(request: DeepPartial<IPFSKeyRequest>, metadata?: grpc.Metadata): Promise<IPFSKeyResponse>;
}

export class FeedServiceClientImpl implements FeedService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Posts = this.Posts.bind(this);
    this.PostsWithLocation = this.PostsWithLocation.bind(this);
    this.IPFSKey = this.IPFSKey.bind(this);
  }

  Posts(request: DeepPartial<PostsRequest>, metadata?: grpc.Metadata): Promise<PostsResponse> {
    return this.rpc.unary(FeedServicePostsDesc, PostsRequest.fromPartial(request), metadata);
  }

  PostsWithLocation(
    request: DeepPartial<PostsWithLocationRequest>,
    metadata?: grpc.Metadata,
  ): Promise<PostsWithLocationResponse> {
    return this.rpc.unary(FeedServicePostsWithLocationDesc, PostsWithLocationRequest.fromPartial(request), metadata);
  }

  IPFSKey(request: DeepPartial<IPFSKeyRequest>, metadata?: grpc.Metadata): Promise<IPFSKeyResponse> {
    return this.rpc.unary(FeedServiceIPFSKeyDesc, IPFSKeyRequest.fromPartial(request), metadata);
  }
}

export const FeedServiceDesc = { serviceName: "feed.v1.FeedService" };

export const FeedServicePostsDesc: UnaryMethodDefinitionish = {
  methodName: "Posts",
  service: FeedServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return PostsRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = PostsResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const FeedServicePostsWithLocationDesc: UnaryMethodDefinitionish = {
  methodName: "PostsWithLocation",
  service: FeedServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return PostsWithLocationRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = PostsWithLocationResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const FeedServiceIPFSKeyDesc: UnaryMethodDefinitionish = {
  methodName: "IPFSKey",
  service: FeedServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return IPFSKeyRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = IPFSKeyResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

interface UnaryMethodDefinitionishR extends grpc.UnaryMethodDefinition<any, any> {
  requestStream: any;
  responseStream: any;
}

type UnaryMethodDefinitionish = UnaryMethodDefinitionishR;

interface Rpc {
  unary<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    request: any,
    metadata: grpc.Metadata | undefined,
  ): Promise<any>;
}

export class GrpcWebImpl {
  private host: string;
  private options: {
    transport?: grpc.TransportFactory;

    debug?: boolean;
    metadata?: grpc.Metadata;
    upStreamRetryCodes?: number[];
  };

  constructor(
    host: string,
    options: {
      transport?: grpc.TransportFactory;

      debug?: boolean;
      metadata?: grpc.Metadata;
      upStreamRetryCodes?: number[];
    },
  ) {
    this.host = host;
    this.options = options;
  }

  unary<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    _request: any,
    metadata: grpc.Metadata | undefined,
  ): Promise<any> {
    const request = { ..._request, ...methodDesc.requestType };
    const maybeCombinedMetadata = metadata && this.options.metadata
      ? new BrowserHeaders({ ...this.options?.metadata.headersMap, ...metadata?.headersMap })
      : metadata ?? this.options.metadata;
    return new Promise((resolve, reject) => {
      grpc.unary(methodDesc, {
        request,
        host: this.host,
        metadata: maybeCombinedMetadata ?? {},
        ...(this.options.transport !== undefined ? { transport: this.options.transport } : {}),
        debug: this.options.debug ?? false,
        onEnd: function (response) {
          if (response.status === grpc.Code.OK) {
            resolve(response.message!.toObject());
          } else {
            const err = new GrpcWebError(response.statusMessage, response.status, response.trailers);
            reject(err);
          }
        },
      });
    });
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToNumber(long: Long): number {
  if (long.gt(globalThis.Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export class GrpcWebError extends globalThis.Error {
  constructor(message: string, public code: grpc.Code, public metadata: grpc.Metadata) {
    super(message);
  }
}
