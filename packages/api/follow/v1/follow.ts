/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "follow.v1";

/** Follow / Unfollow Action */
export interface FollowUserRequest {
  userId: string;
  followUserId: string;
}

export interface FollowUserResponse {
  ok: boolean;
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFollowUserRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.followUserId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FollowUserRequest {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
      followUserId: isSet(object.followUserId) ? String(object.followUserId) : "",
    };
  },

  toJSON(message: FollowUserRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    message.followUserId !== undefined && (obj.followUserId = message.followUserId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<FollowUserRequest>, I>>(object: I): FollowUserRequest {
    const message = createBaseFollowUserRequest();
    message.userId = object.userId ?? "";
    message.followUserId = object.followUserId ?? "";
    return message;
  },
};

function createBaseFollowUserResponse(): FollowUserResponse {
  return { ok: false };
}

export const FollowUserResponse = {
  encode(message: FollowUserResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ok === true) {
      writer.uint32(8).bool(message.ok);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FollowUserResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFollowUserResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ok = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FollowUserResponse {
    return { ok: isSet(object.ok) ? Boolean(object.ok) : false };
  },

  toJSON(message: FollowUserResponse): unknown {
    const obj: any = {};
    message.ok !== undefined && (obj.ok = message.ok);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<FollowUserResponse>, I>>(object: I): FollowUserResponse {
    const message = createBaseFollowUserResponse();
    message.ok = object.ok ?? false;
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFollowersRequest();
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

  fromJSON(object: any): FollowersRequest {
    return { userId: isSet(object.userId) ? String(object.userId) : "" };
  },

  toJSON(message: FollowersRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    return obj;
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFollowersResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.followers.push(Follower.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FollowersResponse {
    return {
      followers: Array.isArray(object?.followers) ? object.followers.map((e: any) => Follower.fromJSON(e)) : [],
    };
  },

  toJSON(message: FollowersResponse): unknown {
    const obj: any = {};
    if (message.followers) {
      obj.followers = message.followers.map((e) => e ? Follower.toJSON(e) : undefined);
    } else {
      obj.followers = [];
    }
    return obj;
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFollower();
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

  fromJSON(object: any): Follower {
    return { userId: isSet(object.userId) ? String(object.userId) : "" };
  },

  toJSON(message: Follower): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Follower>, I>>(object: I): Follower {
    const message = createBaseFollower();
    message.userId = object.userId ?? "";
    return message;
  },
};

export interface FollowService {
  FollowUser(request: DeepPartial<FollowUserRequest>, metadata?: grpc.Metadata): Promise<FollowUserResponse>;
  Followers(request: DeepPartial<FollowersRequest>, metadata?: grpc.Metadata): Promise<FollowersResponse>;
}

export class FollowServiceClientImpl implements FollowService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.FollowUser = this.FollowUser.bind(this);
    this.Followers = this.Followers.bind(this);
  }

  FollowUser(request: DeepPartial<FollowUserRequest>, metadata?: grpc.Metadata): Promise<FollowUserResponse> {
    return this.rpc.unary(FollowServiceFollowUserDesc, FollowUserRequest.fromPartial(request), metadata);
  }

  Followers(request: DeepPartial<FollowersRequest>, metadata?: grpc.Metadata): Promise<FollowersResponse> {
    return this.rpc.unary(FollowServiceFollowersDesc, FollowersRequest.fromPartial(request), metadata);
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
      return {
        ...FollowUserResponse.decode(data),
        toObject() {
          return this;
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
      return {
        ...FollowersResponse.decode(data),
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

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export class GrpcWebError extends Error {
  constructor(message: string, public code: grpc.Code, public metadata: grpc.Metadata) {
    super(message);
  }
}
