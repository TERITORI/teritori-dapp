/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";
import { share } from "rxjs/operators";

export const protobufPackage = "p2e.v1";

export interface FighterScoreRequest {
  collectionId: string;
  userId: string;
}

export interface FighterScoreResponse {
  userScore: UserScore | undefined;
}

export interface FightersCountRequest {
  collectionId: string;
}

export interface FightersCountResponse {
  count: number;
}

export interface LeaderboardRequest {
  collectionId: string;
  limit: number;
  offset: number;
}

export interface UserScore {
  rank: number;
  snapshotRank: number;
  userId: string;
  inProgressScore: number;
  snapshotScore: number;
}

export interface LeaderboardResponse {
  userScore: UserScore | undefined;
}

function createBaseFighterScoreRequest(): FighterScoreRequest {
  return { collectionId: "", userId: "" };
}

export const FighterScoreRequest = {
  encode(message: FighterScoreRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.collectionId !== "") {
      writer.uint32(10).string(message.collectionId);
    }
    if (message.userId !== "") {
      writer.uint32(18).string(message.userId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FighterScoreRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFighterScoreRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.collectionId = reader.string();
          break;
        case 2:
          message.userId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FighterScoreRequest {
    return {
      collectionId: isSet(object.collectionId) ? String(object.collectionId) : "",
      userId: isSet(object.userId) ? String(object.userId) : "",
    };
  },

  toJSON(message: FighterScoreRequest): unknown {
    const obj: any = {};
    message.collectionId !== undefined && (obj.collectionId = message.collectionId);
    message.userId !== undefined && (obj.userId = message.userId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<FighterScoreRequest>, I>>(object: I): FighterScoreRequest {
    const message = createBaseFighterScoreRequest();
    message.collectionId = object.collectionId ?? "";
    message.userId = object.userId ?? "";
    return message;
  },
};

function createBaseFighterScoreResponse(): FighterScoreResponse {
  return { userScore: undefined };
}

export const FighterScoreResponse = {
  encode(message: FighterScoreResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userScore !== undefined) {
      UserScore.encode(message.userScore, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FighterScoreResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFighterScoreResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userScore = UserScore.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FighterScoreResponse {
    return { userScore: isSet(object.userScore) ? UserScore.fromJSON(object.userScore) : undefined };
  },

  toJSON(message: FighterScoreResponse): unknown {
    const obj: any = {};
    message.userScore !== undefined &&
      (obj.userScore = message.userScore ? UserScore.toJSON(message.userScore) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<FighterScoreResponse>, I>>(object: I): FighterScoreResponse {
    const message = createBaseFighterScoreResponse();
    message.userScore = (object.userScore !== undefined && object.userScore !== null)
      ? UserScore.fromPartial(object.userScore)
      : undefined;
    return message;
  },
};

function createBaseFightersCountRequest(): FightersCountRequest {
  return { collectionId: "" };
}

export const FightersCountRequest = {
  encode(message: FightersCountRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.collectionId !== "") {
      writer.uint32(10).string(message.collectionId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FightersCountRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFightersCountRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.collectionId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FightersCountRequest {
    return { collectionId: isSet(object.collectionId) ? String(object.collectionId) : "" };
  },

  toJSON(message: FightersCountRequest): unknown {
    const obj: any = {};
    message.collectionId !== undefined && (obj.collectionId = message.collectionId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<FightersCountRequest>, I>>(object: I): FightersCountRequest {
    const message = createBaseFightersCountRequest();
    message.collectionId = object.collectionId ?? "";
    return message;
  },
};

function createBaseFightersCountResponse(): FightersCountResponse {
  return { count: 0 };
}

export const FightersCountResponse = {
  encode(message: FightersCountResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.count !== 0) {
      writer.uint32(8).uint32(message.count);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FightersCountResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFightersCountResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.count = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FightersCountResponse {
    return { count: isSet(object.count) ? Number(object.count) : 0 };
  },

  toJSON(message: FightersCountResponse): unknown {
    const obj: any = {};
    message.count !== undefined && (obj.count = Math.round(message.count));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<FightersCountResponse>, I>>(object: I): FightersCountResponse {
    const message = createBaseFightersCountResponse();
    message.count = object.count ?? 0;
    return message;
  },
};

function createBaseLeaderboardRequest(): LeaderboardRequest {
  return { collectionId: "", limit: 0, offset: 0 };
}

export const LeaderboardRequest = {
  encode(message: LeaderboardRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.collectionId !== "") {
      writer.uint32(10).string(message.collectionId);
    }
    if (message.limit !== 0) {
      writer.uint32(16).int32(message.limit);
    }
    if (message.offset !== 0) {
      writer.uint32(24).int32(message.offset);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LeaderboardRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLeaderboardRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.collectionId = reader.string();
          break;
        case 2:
          message.limit = reader.int32();
          break;
        case 3:
          message.offset = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LeaderboardRequest {
    return {
      collectionId: isSet(object.collectionId) ? String(object.collectionId) : "",
      limit: isSet(object.limit) ? Number(object.limit) : 0,
      offset: isSet(object.offset) ? Number(object.offset) : 0,
    };
  },

  toJSON(message: LeaderboardRequest): unknown {
    const obj: any = {};
    message.collectionId !== undefined && (obj.collectionId = message.collectionId);
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.offset !== undefined && (obj.offset = Math.round(message.offset));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<LeaderboardRequest>, I>>(object: I): LeaderboardRequest {
    const message = createBaseLeaderboardRequest();
    message.collectionId = object.collectionId ?? "";
    message.limit = object.limit ?? 0;
    message.offset = object.offset ?? 0;
    return message;
  },
};

function createBaseUserScore(): UserScore {
  return { rank: 0, snapshotRank: 0, userId: "", inProgressScore: 0, snapshotScore: 0 };
}

export const UserScore = {
  encode(message: UserScore, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.rank !== 0) {
      writer.uint32(8).int32(message.rank);
    }
    if (message.snapshotRank !== 0) {
      writer.uint32(16).int32(message.snapshotRank);
    }
    if (message.userId !== "") {
      writer.uint32(26).string(message.userId);
    }
    if (message.inProgressScore !== 0) {
      writer.uint32(32).int64(message.inProgressScore);
    }
    if (message.snapshotScore !== 0) {
      writer.uint32(40).int64(message.snapshotScore);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UserScore {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUserScore();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.rank = reader.int32();
          break;
        case 2:
          message.snapshotRank = reader.int32();
          break;
        case 3:
          message.userId = reader.string();
          break;
        case 4:
          message.inProgressScore = longToNumber(reader.int64() as Long);
          break;
        case 5:
          message.snapshotScore = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UserScore {
    return {
      rank: isSet(object.rank) ? Number(object.rank) : 0,
      snapshotRank: isSet(object.snapshotRank) ? Number(object.snapshotRank) : 0,
      userId: isSet(object.userId) ? String(object.userId) : "",
      inProgressScore: isSet(object.inProgressScore) ? Number(object.inProgressScore) : 0,
      snapshotScore: isSet(object.snapshotScore) ? Number(object.snapshotScore) : 0,
    };
  },

  toJSON(message: UserScore): unknown {
    const obj: any = {};
    message.rank !== undefined && (obj.rank = Math.round(message.rank));
    message.snapshotRank !== undefined && (obj.snapshotRank = Math.round(message.snapshotRank));
    message.userId !== undefined && (obj.userId = message.userId);
    message.inProgressScore !== undefined && (obj.inProgressScore = Math.round(message.inProgressScore));
    message.snapshotScore !== undefined && (obj.snapshotScore = Math.round(message.snapshotScore));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UserScore>, I>>(object: I): UserScore {
    const message = createBaseUserScore();
    message.rank = object.rank ?? 0;
    message.snapshotRank = object.snapshotRank ?? 0;
    message.userId = object.userId ?? "";
    message.inProgressScore = object.inProgressScore ?? 0;
    message.snapshotScore = object.snapshotScore ?? 0;
    return message;
  },
};

function createBaseLeaderboardResponse(): LeaderboardResponse {
  return { userScore: undefined };
}

export const LeaderboardResponse = {
  encode(message: LeaderboardResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userScore !== undefined) {
      UserScore.encode(message.userScore, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LeaderboardResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLeaderboardResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userScore = UserScore.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LeaderboardResponse {
    return { userScore: isSet(object.userScore) ? UserScore.fromJSON(object.userScore) : undefined };
  },

  toJSON(message: LeaderboardResponse): unknown {
    const obj: any = {};
    message.userScore !== undefined &&
      (obj.userScore = message.userScore ? UserScore.toJSON(message.userScore) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<LeaderboardResponse>, I>>(object: I): LeaderboardResponse {
    const message = createBaseLeaderboardResponse();
    message.userScore = (object.userScore !== undefined && object.userScore !== null)
      ? UserScore.fromPartial(object.userScore)
      : undefined;
    return message;
  },
};

export interface P2eService {
  Leaderboard(request: DeepPartial<LeaderboardRequest>, metadata?: grpc.Metadata): Observable<LeaderboardResponse>;
  FightersCount(request: DeepPartial<FightersCountRequest>, metadata?: grpc.Metadata): Promise<FightersCountResponse>;
  FighterScore(request: DeepPartial<FighterScoreRequest>, metadata?: grpc.Metadata): Promise<FighterScoreResponse>;
}

export class P2eServiceClientImpl implements P2eService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Leaderboard = this.Leaderboard.bind(this);
    this.FightersCount = this.FightersCount.bind(this);
    this.FighterScore = this.FighterScore.bind(this);
  }

  Leaderboard(request: DeepPartial<LeaderboardRequest>, metadata?: grpc.Metadata): Observable<LeaderboardResponse> {
    return this.rpc.invoke(P2eServiceLeaderboardDesc, LeaderboardRequest.fromPartial(request), metadata);
  }

  FightersCount(request: DeepPartial<FightersCountRequest>, metadata?: grpc.Metadata): Promise<FightersCountResponse> {
    return this.rpc.unary(P2eServiceFightersCountDesc, FightersCountRequest.fromPartial(request), metadata);
  }

  FighterScore(request: DeepPartial<FighterScoreRequest>, metadata?: grpc.Metadata): Promise<FighterScoreResponse> {
    return this.rpc.unary(P2eServiceFighterScoreDesc, FighterScoreRequest.fromPartial(request), metadata);
  }
}

export const P2eServiceDesc = { serviceName: "p2e.v1.P2eService" };

export const P2eServiceLeaderboardDesc: UnaryMethodDefinitionish = {
  methodName: "Leaderboard",
  service: P2eServiceDesc,
  requestStream: false,
  responseStream: true,
  requestType: {
    serializeBinary() {
      return LeaderboardRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...LeaderboardResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const P2eServiceFightersCountDesc: UnaryMethodDefinitionish = {
  methodName: "FightersCount",
  service: P2eServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return FightersCountRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...FightersCountResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const P2eServiceFighterScoreDesc: UnaryMethodDefinitionish = {
  methodName: "FighterScore",
  service: P2eServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return FighterScoreRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...FighterScoreResponse.decode(data),
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
  invoke<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    request: any,
    metadata: grpc.Metadata | undefined,
  ): Observable<any>;
}

export class GrpcWebImpl {
  private host: string;
  private options: {
    transport?: grpc.TransportFactory;
    streamingTransport?: grpc.TransportFactory;
    debug?: boolean;
    metadata?: grpc.Metadata;
    upStreamRetryCodes?: number[];
  };

  constructor(
    host: string,
    options: {
      transport?: grpc.TransportFactory;
      streamingTransport?: grpc.TransportFactory;
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

  invoke<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    _request: any,
    metadata: grpc.Metadata | undefined,
  ): Observable<any> {
    const upStreamCodes = this.options.upStreamRetryCodes || [];
    const DEFAULT_TIMEOUT_TIME: number = 3_000;
    const request = { ..._request, ...methodDesc.requestType };
    const maybeCombinedMetadata = metadata && this.options.metadata
      ? new BrowserHeaders({ ...this.options?.metadata.headersMap, ...metadata?.headersMap })
      : metadata || this.options.metadata;
    return new Observable((observer) => {
      const upStream = (() => {
        const client = grpc.invoke(methodDesc, {
          host: this.host,
          request,
          transport: this.options.streamingTransport || this.options.transport,
          metadata: maybeCombinedMetadata,
          debug: this.options.debug,
          onMessage: (next) => observer.next(next),
          onEnd: (code: grpc.Code, message: string, trailers: grpc.Metadata) => {
            if (code === 0) {
              observer.complete();
            } else if (upStreamCodes.includes(code)) {
              setTimeout(upStream, DEFAULT_TIMEOUT_TIME);
            } else {
              const err = new Error(message) as any;
              err.code = code;
              err.metadata = trailers;
              observer.error(err);
            }
          },
        });
        observer.add(() => client.close());
      });
      upStream();
    }).pipe(share());
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
