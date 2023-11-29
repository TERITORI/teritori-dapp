/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "follow.v1";

/** Follow / Unfollow Action */
export interface FollowUserRequest {
  userId: string;
  followUserId: string;
}

export interface FollowUserResponse {
}

/** Followers */
export interface FollowersRequest {
  userId: string;
}

export interface FollowersResponse {
  followers: Follower[];
}

export interface Follower {
  userId: string;
}

/** Followers stats */
export interface UserFollowStatsRequest {
  userId: string;
}

export interface UserFollowStatsResponse {
  followers: number;
  following: number;
}

/** Does user follows user? */
export interface UserFollowsUserRequest {
  userId: string;
  followUserId: string;
}

export interface UserFollowsUserResponse {
  status: boolean;
}

function createBaseFollowUserRequest(): FollowUserRequest {
  return { userId: "", followUserId: "" };
}

export const FollowUserRequest = {
  encode(message: FollowUserRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.followUserId !== "") {
      writer.uint32(18).string(message.followUserId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FollowUserRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFollowUserRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.userId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.followUserId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FollowUserRequest {
    return {
      userId: isSet(object.userId) ? globalThis.String(object.userId) : "",
      followUserId: isSet(object.followUserId) ? globalThis.String(object.followUserId) : "",
    };
  },

  toJSON(message: FollowUserRequest): unknown {
    const obj: any = {};
    if (message.userId !== "") {
      obj.userId = message.userId;
    }
    if (message.followUserId !== "") {
      obj.followUserId = message.followUserId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FollowUserRequest>, I>>(base?: I): FollowUserRequest {
    return FollowUserRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FollowUserRequest>, I>>(object: I): FollowUserRequest {
    const message = createBaseFollowUserRequest();
    message.userId = object.userId ?? "";
    message.followUserId = object.followUserId ?? "";
    return message;
  },
};

function createBaseFollowUserResponse(): FollowUserResponse {
  return {};
}

export const FollowUserResponse = {
  encode(_: FollowUserResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FollowUserResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFollowUserResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): FollowUserResponse {
    return {};
  },

  toJSON(_: FollowUserResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<FollowUserResponse>, I>>(base?: I): FollowUserResponse {
    return FollowUserResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FollowUserResponse>, I>>(_: I): FollowUserResponse {
    const message = createBaseFollowUserResponse();
    return message;
  },
};

function createBaseFollowersRequest(): FollowersRequest {
  return { userId: "" };
}

export const FollowersRequest = {
  encode(message: FollowersRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FollowersRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFollowersRequest();
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

  fromJSON(object: any): FollowersRequest {
    return { userId: isSet(object.userId) ? globalThis.String(object.userId) : "" };
  },

  toJSON(message: FollowersRequest): unknown {
    const obj: any = {};
    if (message.userId !== "") {
      obj.userId = message.userId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FollowersRequest>, I>>(base?: I): FollowersRequest {
    return FollowersRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FollowersRequest>, I>>(object: I): FollowersRequest {
    const message = createBaseFollowersRequest();
    message.userId = object.userId ?? "";
    return message;
  },
};

function createBaseFollowersResponse(): FollowersResponse {
  return { followers: [] };
}

export const FollowersResponse = {
  encode(message: FollowersResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.followers) {
      Follower.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FollowersResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFollowersResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.followers.push(Follower.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FollowersResponse {
    return {
      followers: globalThis.Array.isArray(object?.followers)
        ? object.followers.map((e: any) => Follower.fromJSON(e))
        : [],
    };
  },

  toJSON(message: FollowersResponse): unknown {
    const obj: any = {};
    if (message.followers?.length) {
      obj.followers = message.followers.map((e) => Follower.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FollowersResponse>, I>>(base?: I): FollowersResponse {
    return FollowersResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FollowersResponse>, I>>(object: I): FollowersResponse {
    const message = createBaseFollowersResponse();
    message.followers = object.followers?.map((e) => Follower.fromPartial(e)) || [];
    return message;
  },
};

function createBaseFollower(): Follower {
  return { userId: "" };
}

export const Follower = {
  encode(message: Follower, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Follower {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFollower();
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

  fromJSON(object: any): Follower {
    return { userId: isSet(object.userId) ? globalThis.String(object.userId) : "" };
  },

  toJSON(message: Follower): unknown {
    const obj: any = {};
    if (message.userId !== "") {
      obj.userId = message.userId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Follower>, I>>(base?: I): Follower {
    return Follower.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Follower>, I>>(object: I): Follower {
    const message = createBaseFollower();
    message.userId = object.userId ?? "";
    return message;
  },
};

function createBaseUserFollowStatsRequest(): UserFollowStatsRequest {
  return { userId: "" };
}

export const UserFollowStatsRequest = {
  encode(message: UserFollowStatsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UserFollowStatsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUserFollowStatsRequest();
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

  fromJSON(object: any): UserFollowStatsRequest {
    return { userId: isSet(object.userId) ? globalThis.String(object.userId) : "" };
  },

  toJSON(message: UserFollowStatsRequest): unknown {
    const obj: any = {};
    if (message.userId !== "") {
      obj.userId = message.userId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UserFollowStatsRequest>, I>>(base?: I): UserFollowStatsRequest {
    return UserFollowStatsRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UserFollowStatsRequest>, I>>(object: I): UserFollowStatsRequest {
    const message = createBaseUserFollowStatsRequest();
    message.userId = object.userId ?? "";
    return message;
  },
};

function createBaseUserFollowStatsResponse(): UserFollowStatsResponse {
  return { followers: 0, following: 0 };
}

export const UserFollowStatsResponse = {
  encode(message: UserFollowStatsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.followers !== 0) {
      writer.uint32(8).int64(message.followers);
    }
    if (message.following !== 0) {
      writer.uint32(16).int64(message.following);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UserFollowStatsResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUserFollowStatsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.followers = longToNumber(reader.int64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.following = longToNumber(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UserFollowStatsResponse {
    return {
      followers: isSet(object.followers) ? globalThis.Number(object.followers) : 0,
      following: isSet(object.following) ? globalThis.Number(object.following) : 0,
    };
  },

  toJSON(message: UserFollowStatsResponse): unknown {
    const obj: any = {};
    if (message.followers !== 0) {
      obj.followers = Math.round(message.followers);
    }
    if (message.following !== 0) {
      obj.following = Math.round(message.following);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UserFollowStatsResponse>, I>>(base?: I): UserFollowStatsResponse {
    return UserFollowStatsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UserFollowStatsResponse>, I>>(object: I): UserFollowStatsResponse {
    const message = createBaseUserFollowStatsResponse();
    message.followers = object.followers ?? 0;
    message.following = object.following ?? 0;
    return message;
  },
};

function createBaseUserFollowsUserRequest(): UserFollowsUserRequest {
  return { userId: "", followUserId: "" };
}

export const UserFollowsUserRequest = {
  encode(message: UserFollowsUserRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.followUserId !== "") {
      writer.uint32(18).string(message.followUserId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UserFollowsUserRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUserFollowsUserRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.userId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.followUserId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UserFollowsUserRequest {
    return {
      userId: isSet(object.userId) ? globalThis.String(object.userId) : "",
      followUserId: isSet(object.followUserId) ? globalThis.String(object.followUserId) : "",
    };
  },

  toJSON(message: UserFollowsUserRequest): unknown {
    const obj: any = {};
    if (message.userId !== "") {
      obj.userId = message.userId;
    }
    if (message.followUserId !== "") {
      obj.followUserId = message.followUserId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UserFollowsUserRequest>, I>>(base?: I): UserFollowsUserRequest {
    return UserFollowsUserRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UserFollowsUserRequest>, I>>(object: I): UserFollowsUserRequest {
    const message = createBaseUserFollowsUserRequest();
    message.userId = object.userId ?? "";
    message.followUserId = object.followUserId ?? "";
    return message;
  },
};

function createBaseUserFollowsUserResponse(): UserFollowsUserResponse {
  return { status: false };
}

export const UserFollowsUserResponse = {
  encode(message: UserFollowsUserResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.status === true) {
      writer.uint32(8).bool(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UserFollowsUserResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUserFollowsUserResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.status = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UserFollowsUserResponse {
    return { status: isSet(object.status) ? globalThis.Boolean(object.status) : false };
  },

  toJSON(message: UserFollowsUserResponse): unknown {
    const obj: any = {};
    if (message.status === true) {
      obj.status = message.status;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UserFollowsUserResponse>, I>>(base?: I): UserFollowsUserResponse {
    return UserFollowsUserResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UserFollowsUserResponse>, I>>(object: I): UserFollowsUserResponse {
    const message = createBaseUserFollowsUserResponse();
    message.status = object.status ?? false;
    return message;
  },
};

export interface FollowService {
  FollowUser(request: DeepPartial<FollowUserRequest>, metadata?: grpc.Metadata): Promise<FollowUserResponse>;
  Followers(request: DeepPartial<FollowersRequest>, metadata?: grpc.Metadata): Promise<FollowersResponse>;
  UserFollowStats(
    request: DeepPartial<UserFollowStatsRequest>,
    metadata?: grpc.Metadata,
  ): Promise<UserFollowStatsResponse>;
  UserFollowsUser(
    request: DeepPartial<UserFollowsUserRequest>,
    metadata?: grpc.Metadata,
  ): Promise<UserFollowsUserResponse>;
}

export class FollowServiceClientImpl implements FollowService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.FollowUser = this.FollowUser.bind(this);
    this.Followers = this.Followers.bind(this);
    this.UserFollowStats = this.UserFollowStats.bind(this);
    this.UserFollowsUser = this.UserFollowsUser.bind(this);
  }

  FollowUser(request: DeepPartial<FollowUserRequest>, metadata?: grpc.Metadata): Promise<FollowUserResponse> {
    return this.rpc.unary(FollowServiceFollowUserDesc, FollowUserRequest.fromPartial(request), metadata);
  }

  Followers(request: DeepPartial<FollowersRequest>, metadata?: grpc.Metadata): Promise<FollowersResponse> {
    return this.rpc.unary(FollowServiceFollowersDesc, FollowersRequest.fromPartial(request), metadata);
  }

  UserFollowStats(
    request: DeepPartial<UserFollowStatsRequest>,
    metadata?: grpc.Metadata,
  ): Promise<UserFollowStatsResponse> {
    return this.rpc.unary(FollowServiceUserFollowStatsDesc, UserFollowStatsRequest.fromPartial(request), metadata);
  }

  UserFollowsUser(
    request: DeepPartial<UserFollowsUserRequest>,
    metadata?: grpc.Metadata,
  ): Promise<UserFollowsUserResponse> {
    return this.rpc.unary(FollowServiceUserFollowsUserDesc, UserFollowsUserRequest.fromPartial(request), metadata);
  }
}

export const FollowServiceDesc = { serviceName: "follow.v1.FollowService" };

export const FollowServiceFollowUserDesc: UnaryMethodDefinitionish = {
  methodName: "FollowUser",
  service: FollowServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return FollowUserRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = FollowUserResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const FollowServiceFollowersDesc: UnaryMethodDefinitionish = {
  methodName: "Followers",
  service: FollowServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return FollowersRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = FollowersResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const FollowServiceUserFollowStatsDesc: UnaryMethodDefinitionish = {
  methodName: "UserFollowStats",
  service: FollowServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return UserFollowStatsRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = UserFollowStatsResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const FollowServiceUserFollowsUserDesc: UnaryMethodDefinitionish = {
  methodName: "UserFollowsUser",
  service: FollowServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return UserFollowsUserRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = UserFollowsUserResponse.decode(data);
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
