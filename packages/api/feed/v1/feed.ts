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
}

export interface Post {
  category: number;
  isDeleted: boolean;
  identifier: string;
  metadata: string;
  parentPostIdentifier: string;
  subPostLength: number;
  createdAt: number;
  tipAmount: number;
  authorId: string;
  reactions: Reaction[];
}

export interface PostFilter {
  user: string;
  mentions: string[];
  categories: number[];
  hashtags: string[];
}

export interface PostsRequest {
  filter: PostFilter | undefined;
  limit: number;
  offset: number;
}

export interface PostsResponse {
  posts: Post[];
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIPFSKeyRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): IPFSKeyRequest {
    return { userId: isSet(object.userId) ? String(object.userId) : "" };
  },

  toJSON(message: IPFSKeyRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    return obj;
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIPFSKeyResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.jwt = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): IPFSKeyResponse {
    return { jwt: isSet(object.jwt) ? String(object.jwt) : "" };
  },

  toJSON(message: IPFSKeyResponse): unknown {
    const obj: any = {};
    message.jwt !== undefined && (obj.jwt = message.jwt);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<IPFSKeyResponse>, I>>(object: I): IPFSKeyResponse {
    const message = createBaseIPFSKeyResponse();
    message.jwt = object.jwt ?? "";
    return message;
  },
};

function createBaseReaction(): Reaction {
  return { icon: "", count: 0 };
}

export const Reaction = {
  encode(message: Reaction, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.icon !== "") {
      writer.uint32(10).string(message.icon);
    }
    if (message.count !== 0) {
      writer.uint32(16).uint32(message.count);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Reaction {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReaction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.icon = reader.string();
          break;
        case 2:
          message.count = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Reaction {
    return {
      icon: isSet(object.icon) ? String(object.icon) : "",
      count: isSet(object.count) ? Number(object.count) : 0,
    };
  },

  toJSON(message: Reaction): unknown {
    const obj: any = {};
    message.icon !== undefined && (obj.icon = message.icon);
    message.count !== undefined && (obj.count = Math.round(message.count));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Reaction>, I>>(object: I): Reaction {
    const message = createBaseReaction();
    message.icon = object.icon ?? "";
    message.count = object.count ?? 0;
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
    createdAt: 0,
    tipAmount: 0,
    authorId: "",
    reactions: [],
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
    if (message.createdAt !== 0) {
      writer.uint32(64).int64(message.createdAt);
    }
    if (message.tipAmount !== 0) {
      writer.uint32(80).int64(message.tipAmount);
    }
    if (message.authorId !== "") {
      writer.uint32(90).string(message.authorId);
    }
    for (const v of message.reactions) {
      Reaction.encode(v!, writer.uint32(74).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Post {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePost();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.category = reader.uint32();
          break;
        case 2:
          message.isDeleted = reader.bool();
          break;
        case 3:
          message.identifier = reader.string();
          break;
        case 4:
          message.metadata = reader.string();
          break;
        case 5:
          message.parentPostIdentifier = reader.string();
          break;
        case 6:
          message.subPostLength = reader.uint32();
          break;
        case 8:
          message.createdAt = longToNumber(reader.int64() as Long);
          break;
        case 10:
          message.tipAmount = longToNumber(reader.int64() as Long);
          break;
        case 11:
          message.authorId = reader.string();
          break;
        case 9:
          message.reactions.push(Reaction.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Post {
    return {
      category: isSet(object.category) ? Number(object.category) : 0,
      isDeleted: isSet(object.isDeleted) ? Boolean(object.isDeleted) : false,
      identifier: isSet(object.identifier) ? String(object.identifier) : "",
      metadata: isSet(object.metadata) ? String(object.metadata) : "",
      parentPostIdentifier: isSet(object.parentPostIdentifier) ? String(object.parentPostIdentifier) : "",
      subPostLength: isSet(object.subPostLength) ? Number(object.subPostLength) : 0,
      createdAt: isSet(object.createdAt) ? Number(object.createdAt) : 0,
      tipAmount: isSet(object.tipAmount) ? Number(object.tipAmount) : 0,
      authorId: isSet(object.authorId) ? String(object.authorId) : "",
      reactions: Array.isArray(object?.reactions) ? object.reactions.map((e: any) => Reaction.fromJSON(e)) : [],
    };
  },

  toJSON(message: Post): unknown {
    const obj: any = {};
    message.category !== undefined && (obj.category = Math.round(message.category));
    message.isDeleted !== undefined && (obj.isDeleted = message.isDeleted);
    message.identifier !== undefined && (obj.identifier = message.identifier);
    message.metadata !== undefined && (obj.metadata = message.metadata);
    message.parentPostIdentifier !== undefined && (obj.parentPostIdentifier = message.parentPostIdentifier);
    message.subPostLength !== undefined && (obj.subPostLength = Math.round(message.subPostLength));
    message.createdAt !== undefined && (obj.createdAt = Math.round(message.createdAt));
    message.tipAmount !== undefined && (obj.tipAmount = Math.round(message.tipAmount));
    message.authorId !== undefined && (obj.authorId = message.authorId);
    if (message.reactions) {
      obj.reactions = message.reactions.map((e) => e ? Reaction.toJSON(e) : undefined);
    } else {
      obj.reactions = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Post>, I>>(object: I): Post {
    const message = createBasePost();
    message.category = object.category ?? 0;
    message.isDeleted = object.isDeleted ?? false;
    message.identifier = object.identifier ?? "";
    message.metadata = object.metadata ?? "";
    message.parentPostIdentifier = object.parentPostIdentifier ?? "";
    message.subPostLength = object.subPostLength ?? 0;
    message.createdAt = object.createdAt ?? 0;
    message.tipAmount = object.tipAmount ?? 0;
    message.authorId = object.authorId ?? "";
    message.reactions = object.reactions?.map((e) => Reaction.fromPartial(e)) || [];
    return message;
  },
};

function createBasePostFilter(): PostFilter {
  return { user: "", mentions: [], categories: [], hashtags: [] };
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
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PostFilter {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePostFilter();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.user = reader.string();
          break;
        case 2:
          message.mentions.push(reader.string());
          break;
        case 3:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.categories.push(reader.uint32());
            }
          } else {
            message.categories.push(reader.uint32());
          }
          break;
        case 4:
          message.hashtags.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PostFilter {
    return {
      user: isSet(object.user) ? String(object.user) : "",
      mentions: Array.isArray(object?.mentions) ? object.mentions.map((e: any) => String(e)) : [],
      categories: Array.isArray(object?.categories) ? object.categories.map((e: any) => Number(e)) : [],
      hashtags: Array.isArray(object?.hashtags) ? object.hashtags.map((e: any) => String(e)) : [],
    };
  },

  toJSON(message: PostFilter): unknown {
    const obj: any = {};
    message.user !== undefined && (obj.user = message.user);
    if (message.mentions) {
      obj.mentions = message.mentions.map((e) => e);
    } else {
      obj.mentions = [];
    }
    if (message.categories) {
      obj.categories = message.categories.map((e) => Math.round(e));
    } else {
      obj.categories = [];
    }
    if (message.hashtags) {
      obj.hashtags = message.hashtags.map((e) => e);
    } else {
      obj.hashtags = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PostFilter>, I>>(object: I): PostFilter {
    const message = createBasePostFilter();
    message.user = object.user ?? "";
    message.mentions = object.mentions?.map((e) => e) || [];
    message.categories = object.categories?.map((e) => e) || [];
    message.hashtags = object.hashtags?.map((e) => e) || [];
    return message;
  },
};

function createBasePostsRequest(): PostsRequest {
  return { filter: undefined, limit: 0, offset: 0 };
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
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PostsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePostsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.filter = PostFilter.decode(reader, reader.uint32());
          break;
        case 2:
          message.limit = reader.uint32();
          break;
        case 3:
          message.offset = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PostsRequest {
    return {
      filter: isSet(object.filter) ? PostFilter.fromJSON(object.filter) : undefined,
      limit: isSet(object.limit) ? Number(object.limit) : 0,
      offset: isSet(object.offset) ? Number(object.offset) : 0,
    };
  },

  toJSON(message: PostsRequest): unknown {
    const obj: any = {};
    message.filter !== undefined && (obj.filter = message.filter ? PostFilter.toJSON(message.filter) : undefined);
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.offset !== undefined && (obj.offset = Math.round(message.offset));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PostsRequest>, I>>(object: I): PostsRequest {
    const message = createBasePostsRequest();
    message.filter = (object.filter !== undefined && object.filter !== null)
      ? PostFilter.fromPartial(object.filter)
      : undefined;
    message.limit = object.limit ?? 0;
    message.offset = object.offset ?? 0;
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePostsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.posts.push(Post.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PostsResponse {
    return { posts: Array.isArray(object?.posts) ? object.posts.map((e: any) => Post.fromJSON(e)) : [] };
  },

  toJSON(message: PostsResponse): unknown {
    const obj: any = {};
    if (message.posts) {
      obj.posts = message.posts.map((e) => e ? Post.toJSON(e) : undefined);
    } else {
      obj.posts = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PostsResponse>, I>>(object: I): PostsResponse {
    const message = createBasePostsResponse();
    message.posts = object.posts?.map((e) => Post.fromPartial(e)) || [];
    return message;
  },
};

export interface FeedService {
  Posts(request: DeepPartial<PostsRequest>, metadata?: grpc.Metadata): Promise<PostsResponse>;
  IPFSKey(request: DeepPartial<IPFSKeyRequest>, metadata?: grpc.Metadata): Promise<IPFSKeyResponse>;
}

export class FeedServiceClientImpl implements FeedService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Posts = this.Posts.bind(this);
    this.IPFSKey = this.IPFSKey.bind(this);
  }

  Posts(request: DeepPartial<PostsRequest>, metadata?: grpc.Metadata): Promise<PostsResponse> {
    return this.rpc.unary(FeedServicePostsDesc, PostsRequest.fromPartial(request), metadata);
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
      return {
        ...PostsResponse.decode(data),
        toObject() {
          return this;
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
      return {
        ...IPFSKeyResponse.decode(data),
        toObject() {
          return this;
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
      : metadata || this.options.metadata;
    return new Promise((resolve, reject) => {
      grpc.unary(methodDesc, {
        request,
        host: this.host,
        metadata: maybeCombinedMetadata,
        transport: this.options.transport,
        debug: this.options.debug,
        onEnd: function (response) {
          if (response.status === grpc.Code.OK) {
            resolve(response.message);
          } else {
            const err = new GrpcWebError(response.statusMessage, response.status, response.trailers);
            reject(err);
          }
        },
      });
    });
  }
}

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
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

export class GrpcWebError extends Error {
  constructor(message: string, public code: grpc.Code, public metadata: grpc.Metadata) {
    super(message);
  }
}
