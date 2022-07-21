/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import { share } from "rxjs/operators";
import { Observable } from "rxjs";
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "marketplace.v1";

export interface Collection {
  imageUri: string;
  collectionName: string;
  creatorName: string;
  verified: boolean;
}

export interface UpcomingLaunchesRequest {}

export interface UpcomingLaunchesResponse {
  collection: Collection | undefined;
}

export interface CollectionsRequest {}

export interface CollectionsResponse {
  collection: Collection | undefined;
}

function createBaseCollection(): Collection {
  return { imageUri: "", collectionName: "", creatorName: "", verified: false };
}

export const Collection = {
  encode(
    message: Collection,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.imageUri !== "") {
      writer.uint32(10).string(message.imageUri);
    }
    if (message.collectionName !== "") {
      writer.uint32(18).string(message.collectionName);
    }
    if (message.creatorName !== "") {
      writer.uint32(26).string(message.creatorName);
    }
    if (message.verified === true) {
      writer.uint32(32).bool(message.verified);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Collection {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCollection();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.imageUri = reader.string();
          break;
        case 2:
          message.collectionName = reader.string();
          break;
        case 3:
          message.creatorName = reader.string();
          break;
        case 4:
          message.verified = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Collection {
    return {
      imageUri: isSet(object.imageUri) ? String(object.imageUri) : "",
      collectionName: isSet(object.collectionName)
        ? String(object.collectionName)
        : "",
      creatorName: isSet(object.creatorName) ? String(object.creatorName) : "",
      verified: isSet(object.verified) ? Boolean(object.verified) : false,
    };
  },

  toJSON(message: Collection): unknown {
    const obj: any = {};
    message.imageUri !== undefined && (obj.imageUri = message.imageUri);
    message.collectionName !== undefined &&
      (obj.collectionName = message.collectionName);
    message.creatorName !== undefined &&
      (obj.creatorName = message.creatorName);
    message.verified !== undefined && (obj.verified = message.verified);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Collection>, I>>(
    object: I
  ): Collection {
    const message = createBaseCollection();
    message.imageUri = object.imageUri ?? "";
    message.collectionName = object.collectionName ?? "";
    message.creatorName = object.creatorName ?? "";
    message.verified = object.verified ?? false;
    return message;
  },
};

function createBaseUpcomingLaunchesRequest(): UpcomingLaunchesRequest {
  return {};
}

export const UpcomingLaunchesRequest = {
  encode(
    _: UpcomingLaunchesRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): UpcomingLaunchesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpcomingLaunchesRequest();
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

  fromJSON(_: any): UpcomingLaunchesRequest {
    return {};
  },

  toJSON(_: UpcomingLaunchesRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UpcomingLaunchesRequest>, I>>(
    _: I
  ): UpcomingLaunchesRequest {
    const message = createBaseUpcomingLaunchesRequest();
    return message;
  },
};

function createBaseUpcomingLaunchesResponse(): UpcomingLaunchesResponse {
  return { collection: undefined };
}

export const UpcomingLaunchesResponse = {
  encode(
    message: UpcomingLaunchesResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.collection !== undefined) {
      Collection.encode(message.collection, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): UpcomingLaunchesResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpcomingLaunchesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.collection = Collection.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpcomingLaunchesResponse {
    return {
      collection: isSet(object.collection)
        ? Collection.fromJSON(object.collection)
        : undefined,
    };
  },

  toJSON(message: UpcomingLaunchesResponse): unknown {
    const obj: any = {};
    message.collection !== undefined &&
      (obj.collection = message.collection
        ? Collection.toJSON(message.collection)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UpcomingLaunchesResponse>, I>>(
    object: I
  ): UpcomingLaunchesResponse {
    const message = createBaseUpcomingLaunchesResponse();
    message.collection =
      object.collection !== undefined && object.collection !== null
        ? Collection.fromPartial(object.collection)
        : undefined;
    return message;
  },
};

function createBaseCollectionsRequest(): CollectionsRequest {
  return {};
}

export const CollectionsRequest = {
  encode(
    _: CollectionsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CollectionsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCollectionsRequest();
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

  fromJSON(_: any): CollectionsRequest {
    return {};
  },

  toJSON(_: CollectionsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CollectionsRequest>, I>>(
    _: I
  ): CollectionsRequest {
    const message = createBaseCollectionsRequest();
    return message;
  },
};

function createBaseCollectionsResponse(): CollectionsResponse {
  return { collection: undefined };
}

export const CollectionsResponse = {
  encode(
    message: CollectionsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.collection !== undefined) {
      Collection.encode(message.collection, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CollectionsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCollectionsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.collection = Collection.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CollectionsResponse {
    return {
      collection: isSet(object.collection)
        ? Collection.fromJSON(object.collection)
        : undefined,
    };
  },

  toJSON(message: CollectionsResponse): unknown {
    const obj: any = {};
    message.collection !== undefined &&
      (obj.collection = message.collection
        ? Collection.toJSON(message.collection)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CollectionsResponse>, I>>(
    object: I
  ): CollectionsResponse {
    const message = createBaseCollectionsResponse();
    message.collection =
      object.collection !== undefined && object.collection !== null
        ? Collection.fromPartial(object.collection)
        : undefined;
    return message;
  },
};

export interface MarketplaceService {
  UpcomingLaunches(
    request: DeepPartial<UpcomingLaunchesRequest>,
    metadata?: grpc.Metadata
  ): Observable<UpcomingLaunchesResponse>;
  Collections(
    request: DeepPartial<CollectionsRequest>,
    metadata?: grpc.Metadata
  ): Observable<CollectionsResponse>;
}

export class MarketplaceServiceClientImpl implements MarketplaceService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.UpcomingLaunches = this.UpcomingLaunches.bind(this);
    this.Collections = this.Collections.bind(this);
  }

  UpcomingLaunches(
    request: DeepPartial<UpcomingLaunchesRequest>,
    metadata?: grpc.Metadata
  ): Observable<UpcomingLaunchesResponse> {
    return this.rpc.invoke(
      MarketplaceServiceUpcomingLaunchesDesc,
      UpcomingLaunchesRequest.fromPartial(request),
      metadata
    );
  }

  Collections(
    request: DeepPartial<CollectionsRequest>,
    metadata?: grpc.Metadata
  ): Observable<CollectionsResponse> {
    return this.rpc.invoke(
      MarketplaceServiceCollectionsDesc,
      CollectionsRequest.fromPartial(request),
      metadata
    );
  }
}

export const MarketplaceServiceDesc = {
  serviceName: "marketplace.v1.MarketplaceService",
};

export const MarketplaceServiceUpcomingLaunchesDesc: MethodDefinitionish = {
  methodName: "UpcomingLaunches",
  service: MarketplaceServiceDesc,
  requestStream: false,
  responseStream: true,
  requestType: {
    serializeBinary() {
      return UpcomingLaunchesRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...UpcomingLaunchesResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const MarketplaceServiceCollectionsDesc: MethodDefinitionish = {
  methodName: "Collections",
  service: MarketplaceServiceDesc,
  requestStream: false,
  responseStream: true,
  requestType: {
    serializeBinary() {
      return CollectionsRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...CollectionsResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

interface UnaryMethodDefinitionishR
  extends grpc.UnaryMethodDefinition<any, any> {
  requestStream: any;
  responseStream: any;
}

type UnaryMethodDefinitionish = UnaryMethodDefinitionishR;

interface MethodDefinitionishR extends grpc.MethodDefinition<any, any> {
  requestStream: any;
  responseStream: any;
}

type MethodDefinitionish = MethodDefinitionishR;

interface Rpc {
  unary<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    request: any,
    metadata: grpc.Metadata | undefined
  ): Promise<any>;
  invoke<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    request: any,
    metadata: grpc.Metadata | undefined
  ): Observable<any>;
  stream<T extends MethodDefinitionish>(
    methodDesc: T,
    request: Observable<any>,
    metadata: grpc.Metadata | undefined,
    rpcOptions: grpc.RpcOptions | undefined
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
    }
  ) {
    this.host = host;
    this.options = options;
  }

  unary<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    _request: any,
    metadata: grpc.Metadata | undefined
  ): Promise<any> {
    const request = { ..._request, ...methodDesc.requestType };
    const maybeCombinedMetadata =
      metadata && this.options.metadata
        ? new BrowserHeaders({
            ...this.options?.metadata.headersMap,
            ...metadata?.headersMap,
          })
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
            const err = new Error(response.statusMessage) as any;
            err.code = response.status;
            err.metadata = response.trailers;
            reject(err);
          }
        },
      });
    });
  }

  invoke<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    _request: any,
    metadata: grpc.Metadata | undefined
  ): Observable<any> {
    const upStreamCodes = this.options.upStreamRetryCodes || [];
    const DEFAULT_TIMEOUT_TIME: number = 3000;
    const request = { ..._request, ...methodDesc.requestType };
    const maybeCombinedMetadata =
      metadata && this.options.metadata
        ? new BrowserHeaders({
            ...this.options?.metadata.headersMap,
            ...metadata?.headersMap,
          })
        : metadata || this.options.metadata;
    return new Observable((observer) => {
      const upStream = () => {
        const client = grpc.invoke(methodDesc, {
          host: this.host,
          request,
          transport: this.options.streamingTransport || this.options.transport,
          metadata: maybeCombinedMetadata,
          debug: this.options.debug,
          onMessage: (next) => observer.next(next),
          onEnd: (
            code: grpc.Code,
            message: string,
            trailers: grpc.Metadata
          ) => {
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
      };
      upStream();
    }).pipe(share());
  }

  stream<T extends MethodDefinitionish>(
    methodDesc: T,
    _request: Observable<any>,
    metadata: grpc.Metadata | undefined,
    rpcOptions: grpc.RpcOptions | undefined
  ): Observable<any> {
    const defaultOptions = {
      host: this.host,
      debug: rpcOptions?.debug || this.options.debug,
      transport:
        rpcOptions?.transport ||
        this.options.streamingTransport ||
        this.options.transport,
    };

    let started = false;
    const client = grpc.client(methodDesc, defaultOptions);

    const subscription = _request.subscribe((_req: any) => {
      const request = { ..._req, ...methodDesc.requestType };
      if (!started) {
        client.start(metadata);
        started = true;
      }
      client.send(request);
    });

    subscription.add(() => {
      client.finishSend();
    });

    return new Observable((observer) => {
      client.onEnd(
        (code: grpc.Code, message: string, trailers: grpc.Metadata) => {
          subscription.unsubscribe();
          if (code === 0) {
            observer.complete();
          } else {
            observer.error(new Error(`Error ${code} ${message}`));
          }
        }
      );
      client.onMessage((res: any) => {
        observer.next(res);
      });
      observer.add(() => client.close());
    }).pipe(share());
  }
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<
        Exclude<keyof I, KeysOfUnion<P>>,
        never
      >;

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
