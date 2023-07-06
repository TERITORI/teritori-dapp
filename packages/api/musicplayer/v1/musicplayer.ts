/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "musicplayer.v1";

export interface GetAllAlbumListRequest {
  limit: number;
  offset: number;
}

export interface GetUserAlbumListRequest {
  createdBy: string;
  limit: number;
  offset: number;
}

export interface MusicAlbumInfo {
  identifier: string;
  metadata: string;
  createdBy: string;
}

export interface GetAlbumListResponse {
  musicAlbums: MusicAlbumInfo[];
}

export interface GetAlbumRequest {
  identifier: string;
}

export interface GetAlbumResponse {
  musicAlbum: MusicAlbumInfo | undefined;
}

function createBaseGetAllAlbumListRequest(): GetAllAlbumListRequest {
  return { limit: 0, offset: 0 };
}

export const GetAllAlbumListRequest = {
  encode(message: GetAllAlbumListRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.limit !== 0) {
      writer.uint32(16).uint32(message.limit);
    }
    if (message.offset !== 0) {
      writer.uint32(24).uint32(message.offset);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAllAlbumListRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAllAlbumListRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
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
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetAllAlbumListRequest {
    return {
      limit: isSet(object.limit) ? Number(object.limit) : 0,
      offset: isSet(object.offset) ? Number(object.offset) : 0,
    };
  },

  toJSON(message: GetAllAlbumListRequest): unknown {
    const obj: any = {};
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.offset !== undefined && (obj.offset = Math.round(message.offset));
    return obj;
  },

  create<I extends Exact<DeepPartial<GetAllAlbumListRequest>, I>>(base?: I): GetAllAlbumListRequest {
    return GetAllAlbumListRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetAllAlbumListRequest>, I>>(object: I): GetAllAlbumListRequest {
    const message = createBaseGetAllAlbumListRequest();
    message.limit = object.limit ?? 0;
    message.offset = object.offset ?? 0;
    return message;
  },
};

function createBaseGetUserAlbumListRequest(): GetUserAlbumListRequest {
  return { createdBy: "", limit: 0, offset: 0 };
}

export const GetUserAlbumListRequest = {
  encode(message: GetUserAlbumListRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.createdBy !== "") {
      writer.uint32(10).string(message.createdBy);
    }
    if (message.limit !== 0) {
      writer.uint32(16).uint32(message.limit);
    }
    if (message.offset !== 0) {
      writer.uint32(24).uint32(message.offset);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUserAlbumListRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserAlbumListRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.createdBy = reader.string();
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
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetUserAlbumListRequest {
    return {
      createdBy: isSet(object.createdBy) ? String(object.createdBy) : "",
      limit: isSet(object.limit) ? Number(object.limit) : 0,
      offset: isSet(object.offset) ? Number(object.offset) : 0,
    };
  },

  toJSON(message: GetUserAlbumListRequest): unknown {
    const obj: any = {};
    message.createdBy !== undefined && (obj.createdBy = message.createdBy);
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.offset !== undefined && (obj.offset = Math.round(message.offset));
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUserAlbumListRequest>, I>>(base?: I): GetUserAlbumListRequest {
    return GetUserAlbumListRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetUserAlbumListRequest>, I>>(object: I): GetUserAlbumListRequest {
    const message = createBaseGetUserAlbumListRequest();
    message.createdBy = object.createdBy ?? "";
    message.limit = object.limit ?? 0;
    message.offset = object.offset ?? 0;
    return message;
  },
};

function createBaseMusicAlbumInfo(): MusicAlbumInfo {
  return { identifier: "", metadata: "", createdBy: "" };
}

export const MusicAlbumInfo = {
  encode(message: MusicAlbumInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identifier !== "") {
      writer.uint32(10).string(message.identifier);
    }
    if (message.metadata !== "") {
      writer.uint32(18).string(message.metadata);
    }
    if (message.createdBy !== "") {
      writer.uint32(26).string(message.createdBy);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MusicAlbumInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMusicAlbumInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.identifier = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.metadata = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.createdBy = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MusicAlbumInfo {
    return {
      identifier: isSet(object.identifier) ? String(object.identifier) : "",
      metadata: isSet(object.metadata) ? String(object.metadata) : "",
      createdBy: isSet(object.createdBy) ? String(object.createdBy) : "",
    };
  },

  toJSON(message: MusicAlbumInfo): unknown {
    const obj: any = {};
    message.identifier !== undefined && (obj.identifier = message.identifier);
    message.metadata !== undefined && (obj.metadata = message.metadata);
    message.createdBy !== undefined && (obj.createdBy = message.createdBy);
    return obj;
  },

  create<I extends Exact<DeepPartial<MusicAlbumInfo>, I>>(base?: I): MusicAlbumInfo {
    return MusicAlbumInfo.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<MusicAlbumInfo>, I>>(object: I): MusicAlbumInfo {
    const message = createBaseMusicAlbumInfo();
    message.identifier = object.identifier ?? "";
    message.metadata = object.metadata ?? "";
    message.createdBy = object.createdBy ?? "";
    return message;
  },
};

function createBaseGetAlbumListResponse(): GetAlbumListResponse {
  return { musicAlbums: [] };
}

export const GetAlbumListResponse = {
  encode(message: GetAlbumListResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.musicAlbums) {
      MusicAlbumInfo.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAlbumListResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAlbumListResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.musicAlbums.push(MusicAlbumInfo.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetAlbumListResponse {
    return {
      musicAlbums: Array.isArray(object?.musicAlbums)
        ? object.musicAlbums.map((e: any) => MusicAlbumInfo.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GetAlbumListResponse): unknown {
    const obj: any = {};
    if (message.musicAlbums) {
      obj.musicAlbums = message.musicAlbums.map((e) => e ? MusicAlbumInfo.toJSON(e) : undefined);
    } else {
      obj.musicAlbums = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetAlbumListResponse>, I>>(base?: I): GetAlbumListResponse {
    return GetAlbumListResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetAlbumListResponse>, I>>(object: I): GetAlbumListResponse {
    const message = createBaseGetAlbumListResponse();
    message.musicAlbums = object.musicAlbums?.map((e) => MusicAlbumInfo.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetAlbumRequest(): GetAlbumRequest {
  return { identifier: "" };
}

export const GetAlbumRequest = {
  encode(message: GetAlbumRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identifier !== "") {
      writer.uint32(10).string(message.identifier);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAlbumRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAlbumRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.identifier = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetAlbumRequest {
    return { identifier: isSet(object.identifier) ? String(object.identifier) : "" };
  },

  toJSON(message: GetAlbumRequest): unknown {
    const obj: any = {};
    message.identifier !== undefined && (obj.identifier = message.identifier);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetAlbumRequest>, I>>(base?: I): GetAlbumRequest {
    return GetAlbumRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetAlbumRequest>, I>>(object: I): GetAlbumRequest {
    const message = createBaseGetAlbumRequest();
    message.identifier = object.identifier ?? "";
    return message;
  },
};

function createBaseGetAlbumResponse(): GetAlbumResponse {
  return { musicAlbum: undefined };
}

export const GetAlbumResponse = {
  encode(message: GetAlbumResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.musicAlbum !== undefined) {
      MusicAlbumInfo.encode(message.musicAlbum, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAlbumResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAlbumResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.musicAlbum = MusicAlbumInfo.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetAlbumResponse {
    return { musicAlbum: isSet(object.musicAlbum) ? MusicAlbumInfo.fromJSON(object.musicAlbum) : undefined };
  },

  toJSON(message: GetAlbumResponse): unknown {
    const obj: any = {};
    message.musicAlbum !== undefined &&
      (obj.musicAlbum = message.musicAlbum ? MusicAlbumInfo.toJSON(message.musicAlbum) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetAlbumResponse>, I>>(base?: I): GetAlbumResponse {
    return GetAlbumResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetAlbumResponse>, I>>(object: I): GetAlbumResponse {
    const message = createBaseGetAlbumResponse();
    message.musicAlbum = (object.musicAlbum !== undefined && object.musicAlbum !== null)
      ? MusicAlbumInfo.fromPartial(object.musicAlbum)
      : undefined;
    return message;
  },
};

export interface MusicplayerService {
  GetAllAlbumList(
    request: DeepPartial<GetAllAlbumListRequest>,
    metadata?: grpc.Metadata,
  ): Promise<GetAlbumListResponse>;
  GetUserAlbumList(
    request: DeepPartial<GetUserAlbumListRequest>,
    metadata?: grpc.Metadata,
  ): Promise<GetAlbumListResponse>;
  GetAlbum(request: DeepPartial<GetAlbumRequest>, metadata?: grpc.Metadata): Promise<GetAlbumResponse>;
}

export class MusicplayerServiceClientImpl implements MusicplayerService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.GetAllAlbumList = this.GetAllAlbumList.bind(this);
    this.GetUserAlbumList = this.GetUserAlbumList.bind(this);
    this.GetAlbum = this.GetAlbum.bind(this);
  }

  GetAllAlbumList(
    request: DeepPartial<GetAllAlbumListRequest>,
    metadata?: grpc.Metadata,
  ): Promise<GetAlbumListResponse> {
    return this.rpc.unary(MusicplayerServiceGetAllAlbumListDesc, GetAllAlbumListRequest.fromPartial(request), metadata);
  }

  GetUserAlbumList(
    request: DeepPartial<GetUserAlbumListRequest>,
    metadata?: grpc.Metadata,
  ): Promise<GetAlbumListResponse> {
    return this.rpc.unary(
      MusicplayerServiceGetUserAlbumListDesc,
      GetUserAlbumListRequest.fromPartial(request),
      metadata,
    );
  }

  GetAlbum(request: DeepPartial<GetAlbumRequest>, metadata?: grpc.Metadata): Promise<GetAlbumResponse> {
    return this.rpc.unary(MusicplayerServiceGetAlbumDesc, GetAlbumRequest.fromPartial(request), metadata);
  }
}

export const MusicplayerServiceDesc = { serviceName: "musicplayer.v1.MusicplayerService" };

export const MusicplayerServiceGetAllAlbumListDesc: UnaryMethodDefinitionish = {
  methodName: "GetAllAlbumList",
  service: MusicplayerServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GetAllAlbumListRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = GetAlbumListResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const MusicplayerServiceGetUserAlbumListDesc: UnaryMethodDefinitionish = {
  methodName: "GetUserAlbumList",
  service: MusicplayerServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GetUserAlbumListRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = GetAlbumListResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const MusicplayerServiceGetAlbumDesc: UnaryMethodDefinitionish = {
  methodName: "GetAlbum",
  service: MusicplayerServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GetAlbumRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = GetAlbumResponse.decode(data);
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

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var tsProtoGlobalThis: any = (() => {
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

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export class GrpcWebError extends tsProtoGlobalThis.Error {
  constructor(message: string, public code: grpc.Code, public metadata: grpc.Metadata) {
    super(message);
  }
}
