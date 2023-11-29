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
  identifier: string;
  metadata: string;
  parentPostIdentifier: string;
  subPostLength: number;
  authorId: string;
  createdAt: number;
  tipAmount: number;
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
  queryUserId: string;
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
    tipAmount: 0,
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
    if (message.authorId !== "") {
      writer.uint32(58).string(message.authorId);
    }
    if (message.createdAt !== 0) {
      writer.uint32(64).int64(message.createdAt);
    }
    if (message.tipAmount !== 0) {
      writer.uint32(80).int64(message.tipAmount);
    }
    for (const v of message.reactions) {
      Reaction.encode(v!, writer.uint32(74).fork()).ldelim();
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
        case 10:
          if (tag !== 80) {
            break;
          }

          message.tipAmount = longToNumber(reader.int64() as Long);
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.reactions.push(Reaction.decode(reader, reader.uint32()));
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
      tipAmount: isSet(object.tipAmount) ? globalThis.Number(object.tipAmount) : 0,
      reactions: globalThis.Array.isArray(object?.reactions)
        ? object.reactions.map((e: any) => Reaction.fromJSON(e))
        : [],
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
    if (message.tipAmount !== 0) {
      obj.tipAmount = Math.round(message.tipAmount);
    }
    if (message.reactions?.length) {
      obj.reactions = message.reactions.map((e) => Reaction.toJSON(e));
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
    message.tipAmount = object.tipAmount ?? 0;
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
