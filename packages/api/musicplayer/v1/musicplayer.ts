/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "musicplayer.v1";

export interface GetAlbumListRequest {
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

function createBaseGetAlbumListRequest(): GetAlbumListRequest {
  return {};
}

export const GetAlbumListRequest = {
  encode(_: GetAlbumListRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAlbumListRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAlbumListRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): GetAlbumListRequest {
    return {};
  },

  toJSON(_: GetAlbumListRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetAlbumListRequest>, I>>(_: I): GetAlbumListRequest {
    const message = createBaseGetAlbumListRequest();
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMusicAlbumInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.identifier = reader.string();
          break;
        case 2:
          message.metadata = reader.string();
          break;
        case 3:
          message.createdBy = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAlbumListResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.musicAlbums.push(MusicAlbumInfo.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAlbumRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.identifier = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAlbumResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.musicAlbum = MusicAlbumInfo.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
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

  fromPartial<I extends Exact<DeepPartial<GetAlbumResponse>, I>>(object: I): GetAlbumResponse {
    const message = createBaseGetAlbumResponse();
    message.musicAlbum = (object.musicAlbum !== undefined && object.musicAlbum !== null)
      ? MusicAlbumInfo.fromPartial(object.musicAlbum)
      : undefined;
    return message;
  },
};

export interface MusicplayerService {
  GetAlbumList(request: DeepPartial<GetAlbumListRequest>, metadata?: grpc.Metadata): Promise<GetAlbumListResponse>;
  GetAlbum(request: DeepPartial<GetAlbumRequest>, metadata?: grpc.Metadata): Promise<GetAlbumResponse>;
}

export class MusicplayerServiceClientImpl implements MusicplayerService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.GetAlbumList = this.GetAlbumList.bind(this);
    this.GetAlbum = this.GetAlbum.bind(this);
  }

  GetAlbumList(request: DeepPartial<GetAlbumListRequest>, metadata?: grpc.Metadata): Promise<GetAlbumListResponse> {
    return this.rpc.unary(MusicplayerServiceGetAlbumListDesc, GetAlbumListRequest.fromPartial(request), metadata);
  }

  GetAlbum(request: DeepPartial<GetAlbumRequest>, metadata?: grpc.Metadata): Promise<GetAlbumResponse> {
    return this.rpc.unary(MusicplayerServiceGetAlbumDesc, GetAlbumRequest.fromPartial(request), metadata);
  }
}

export const MusicplayerServiceDesc = { serviceName: "musicplayer.v1.MusicplayerService" };

export const MusicplayerServiceGetAlbumListDesc: UnaryMethodDefinitionish = {
  methodName: "GetAlbumList",
  service: MusicplayerServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GetAlbumListRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...GetAlbumListResponse.decode(data),
        toObject() {
          return this;
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
      return {
        ...GetAlbumResponse.decode(data),
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
