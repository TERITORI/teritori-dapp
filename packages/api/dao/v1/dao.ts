/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "dao.v1";

export interface DaoListRequest {
  memberAddress: string;
}

export interface DaoListResponse {
  daos: DaoInfo[];
}

export interface DaoInfo {
  admin: string;
  contractAddress: string;
  name: string;
  description: string;
  imageUrl: string;
  quorum: string;
  threshold: string;
  tokenName: string;
  tokenSymbol: string;
  unstakingDuration: number;
}

function createBaseDaoListRequest(): DaoListRequest {
  return { memberAddress: "" };
}

export const DaoListRequest = {
  encode(message: DaoListRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.memberAddress !== "") {
      writer.uint32(10).string(message.memberAddress);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DaoListRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDaoListRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.memberAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DaoListRequest {
    return { memberAddress: isSet(object.memberAddress) ? String(object.memberAddress) : "" };
  },

  toJSON(message: DaoListRequest): unknown {
    const obj: any = {};
    message.memberAddress !== undefined && (obj.memberAddress = message.memberAddress);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DaoListRequest>, I>>(object: I): DaoListRequest {
    const message = createBaseDaoListRequest();
    message.memberAddress = object.memberAddress ?? "";
    return message;
  },
};

function createBaseDaoListResponse(): DaoListResponse {
  return { daos: [] };
}

export const DaoListResponse = {
  encode(message: DaoListResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.daos) {
      DaoInfo.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DaoListResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDaoListResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.daos.push(DaoInfo.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DaoListResponse {
    return { daos: Array.isArray(object?.daos) ? object.daos.map((e: any) => DaoInfo.fromJSON(e)) : [] };
  },

  toJSON(message: DaoListResponse): unknown {
    const obj: any = {};
    if (message.daos) {
      obj.daos = message.daos.map((e) => e ? DaoInfo.toJSON(e) : undefined);
    } else {
      obj.daos = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DaoListResponse>, I>>(object: I): DaoListResponse {
    const message = createBaseDaoListResponse();
    message.daos = object.daos?.map((e) => DaoInfo.fromPartial(e)) || [];
    return message;
  },
};

function createBaseDaoInfo(): DaoInfo {
  return {
    admin: "",
    contractAddress: "",
    name: "",
    description: "",
    imageUrl: "",
    quorum: "",
    threshold: "",
    tokenName: "",
    tokenSymbol: "",
    unstakingDuration: 0,
  };
}

export const DaoInfo = {
  encode(message: DaoInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.admin !== "") {
      writer.uint32(10).string(message.admin);
    }
    if (message.contractAddress !== "") {
      writer.uint32(18).string(message.contractAddress);
    }
    if (message.name !== "") {
      writer.uint32(26).string(message.name);
    }
    if (message.description !== "") {
      writer.uint32(34).string(message.description);
    }
    if (message.imageUrl !== "") {
      writer.uint32(42).string(message.imageUrl);
    }
    if (message.quorum !== "") {
      writer.uint32(50).string(message.quorum);
    }
    if (message.threshold !== "") {
      writer.uint32(58).string(message.threshold);
    }
    if (message.tokenName !== "") {
      writer.uint32(66).string(message.tokenName);
    }
    if (message.tokenSymbol !== "") {
      writer.uint32(74).string(message.tokenSymbol);
    }
    if (message.unstakingDuration !== 0) {
      writer.uint32(80).uint64(message.unstakingDuration);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DaoInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDaoInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.admin = reader.string();
          break;
        case 2:
          message.contractAddress = reader.string();
          break;
        case 3:
          message.name = reader.string();
          break;
        case 4:
          message.description = reader.string();
          break;
        case 5:
          message.imageUrl = reader.string();
          break;
        case 6:
          message.quorum = reader.string();
          break;
        case 7:
          message.threshold = reader.string();
          break;
        case 8:
          message.tokenName = reader.string();
          break;
        case 9:
          message.tokenSymbol = reader.string();
          break;
        case 10:
          message.unstakingDuration = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DaoInfo {
    return {
      admin: isSet(object.admin) ? String(object.admin) : "",
      contractAddress: isSet(object.contractAddress) ? String(object.contractAddress) : "",
      name: isSet(object.name) ? String(object.name) : "",
      description: isSet(object.description) ? String(object.description) : "",
      imageUrl: isSet(object.imageUrl) ? String(object.imageUrl) : "",
      quorum: isSet(object.quorum) ? String(object.quorum) : "",
      threshold: isSet(object.threshold) ? String(object.threshold) : "",
      tokenName: isSet(object.tokenName) ? String(object.tokenName) : "",
      tokenSymbol: isSet(object.tokenSymbol) ? String(object.tokenSymbol) : "",
      unstakingDuration: isSet(object.unstakingDuration) ? Number(object.unstakingDuration) : 0,
    };
  },

  toJSON(message: DaoInfo): unknown {
    const obj: any = {};
    message.admin !== undefined && (obj.admin = message.admin);
    message.contractAddress !== undefined && (obj.contractAddress = message.contractAddress);
    message.name !== undefined && (obj.name = message.name);
    message.description !== undefined && (obj.description = message.description);
    message.imageUrl !== undefined && (obj.imageUrl = message.imageUrl);
    message.quorum !== undefined && (obj.quorum = message.quorum);
    message.threshold !== undefined && (obj.threshold = message.threshold);
    message.tokenName !== undefined && (obj.tokenName = message.tokenName);
    message.tokenSymbol !== undefined && (obj.tokenSymbol = message.tokenSymbol);
    message.unstakingDuration !== undefined && (obj.unstakingDuration = Math.round(message.unstakingDuration));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DaoInfo>, I>>(object: I): DaoInfo {
    const message = createBaseDaoInfo();
    message.admin = object.admin ?? "";
    message.contractAddress = object.contractAddress ?? "";
    message.name = object.name ?? "";
    message.description = object.description ?? "";
    message.imageUrl = object.imageUrl ?? "";
    message.quorum = object.quorum ?? "";
    message.threshold = object.threshold ?? "";
    message.tokenName = object.tokenName ?? "";
    message.tokenSymbol = object.tokenSymbol ?? "";
    message.unstakingDuration = object.unstakingDuration ?? 0;
    return message;
  },
};

export interface DaoService {
  DaoList(request: DeepPartial<DaoListRequest>, metadata?: grpc.Metadata): Promise<DaoListResponse>;
}

export class DaoServiceClientImpl implements DaoService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.DaoList = this.DaoList.bind(this);
  }

  DaoList(request: DeepPartial<DaoListRequest>, metadata?: grpc.Metadata): Promise<DaoListResponse> {
    return this.rpc.unary(DaoServiceDaoListDesc, DaoListRequest.fromPartial(request), metadata);
  }
}

export const DaoServiceDesc = { serviceName: "dao.v1.DaoService" };

export const DaoServiceDaoListDesc: UnaryMethodDefinitionish = {
  methodName: "DaoList",
  service: DaoServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return DaoListRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...DaoListResponse.decode(data),
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
