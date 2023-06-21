/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "prices.v1";

export interface PricesRequest {
  id: string;
  time: string;
  vsIds: string[];
}

export interface Price {
  id: string;
  value: number;
}

export interface PricesResponse {
  prices: Price[];
}

function createBasePricesRequest(): PricesRequest {
  return { id: "", time: "", vsIds: [] };
}

export const PricesRequest = {
  encode(message: PricesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.time !== "") {
      writer.uint32(18).string(message.time);
    }
    for (const v of message.vsIds) {
      writer.uint32(26).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PricesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePricesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.time = reader.string();
          break;
        case 3:
          message.vsIds.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PricesRequest {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      time: isSet(object.time) ? String(object.time) : "",
      vsIds: Array.isArray(object?.vsIds) ? object.vsIds.map((e: any) => String(e)) : [],
    };
  },

  toJSON(message: PricesRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.time !== undefined && (obj.time = message.time);
    if (message.vsIds) {
      obj.vsIds = message.vsIds.map((e) => e);
    } else {
      obj.vsIds = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PricesRequest>, I>>(object: I): PricesRequest {
    const message = createBasePricesRequest();
    message.id = object.id ?? "";
    message.time = object.time ?? "";
    message.vsIds = object.vsIds?.map((e) => e) || [];
    return message;
  },
};

function createBasePrice(): Price {
  return { id: "", value: 0 };
}

export const Price = {
  encode(message: Price, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.value !== 0) {
      writer.uint32(17).double(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Price {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePrice();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.value = reader.double();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Price {
    return { id: isSet(object.id) ? String(object.id) : "", value: isSet(object.value) ? Number(object.value) : 0 };
  },

  toJSON(message: Price): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Price>, I>>(object: I): Price {
    const message = createBasePrice();
    message.id = object.id ?? "";
    message.value = object.value ?? 0;
    return message;
  },
};

function createBasePricesResponse(): PricesResponse {
  return { prices: [] };
}

export const PricesResponse = {
  encode(message: PricesResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.prices) {
      Price.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PricesResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePricesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.prices.push(Price.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PricesResponse {
    return { prices: Array.isArray(object?.prices) ? object.prices.map((e: any) => Price.fromJSON(e)) : [] };
  },

  toJSON(message: PricesResponse): unknown {
    const obj: any = {};
    if (message.prices) {
      obj.prices = message.prices.map((e) => e ? Price.toJSON(e) : undefined);
    } else {
      obj.prices = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PricesResponse>, I>>(object: I): PricesResponse {
    const message = createBasePricesResponse();
    message.prices = object.prices?.map((e) => Price.fromPartial(e)) || [];
    return message;
  },
};

export interface PricesService {
  Prices(request: DeepPartial<PricesRequest>, metadata?: grpc.Metadata): Promise<PricesResponse>;
}

export class PricesServiceClientImpl implements PricesService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Prices = this.Prices.bind(this);
  }

  Prices(request: DeepPartial<PricesRequest>, metadata?: grpc.Metadata): Promise<PricesResponse> {
    return this.rpc.unary(PricesServicePricesDesc, PricesRequest.fromPartial(request), metadata);
  }
}

export const PricesServiceDesc = { serviceName: "prices.v1.PricesService" };

export const PricesServicePricesDesc: UnaryMethodDefinitionish = {
  methodName: "Prices",
  service: PricesServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return PricesRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...PricesResponse.decode(data),
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
