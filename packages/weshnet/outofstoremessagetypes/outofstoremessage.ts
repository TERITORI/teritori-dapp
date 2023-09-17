/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import { OutOfStoreReceive_Reply, OutOfStoreReceive_Request } from "../protocoltypes";

export const protobufPackage = "weshnet.outofstoremessage.v1";

/**
 * OutOfStoreMessageService is the service used to open out-of-store messages (e.g. push notifications)
 * It is used to open messages with a lightweight protocol service for mobile backgroup processes.
 */
export interface OutOfStoreMessageService {
  /** OutOfStoreReceive parses a payload received outside a synchronized store */
  OutOfStoreReceive(
    request: DeepPartial<OutOfStoreReceive_Request>,
    metadata?: grpc.Metadata,
  ): Promise<OutOfStoreReceive_Reply>;
}

export class OutOfStoreMessageServiceClientImpl implements OutOfStoreMessageService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.OutOfStoreReceive = this.OutOfStoreReceive.bind(this);
  }

  OutOfStoreReceive(
    request: DeepPartial<OutOfStoreReceive_Request>,
    metadata?: grpc.Metadata,
  ): Promise<OutOfStoreReceive_Reply> {
    return this.rpc.unary(
      OutOfStoreMessageServiceOutOfStoreReceiveDesc,
      OutOfStoreReceive_Request.fromPartial(request),
      metadata,
    );
  }
}

export const OutOfStoreMessageServiceDesc = { serviceName: "weshnet.outofstoremessage.v1.OutOfStoreMessageService" };

export const OutOfStoreMessageServiceOutOfStoreReceiveDesc: UnaryMethodDefinitionish = {
  methodName: "OutOfStoreReceive",
  service: OutOfStoreMessageServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return OutOfStoreReceive_Request.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = OutOfStoreReceive_Reply.decode(data);
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

declare const self: any | undefined;
declare const window: any | undefined;
declare const global: any | undefined;
const tsProtoGlobalThis: any = (() => {
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

export class GrpcWebError extends tsProtoGlobalThis.Error {
  constructor(message: string, public code: grpc.Code, public metadata: grpc.Metadata) {
    super(message);
  }
}
