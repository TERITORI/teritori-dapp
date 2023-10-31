/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "dao.v1";

export interface DAOsRequest {
  networkId: string;
  memberAddress: string;
}

export interface DAOsResponse {
  daos: DAO[];
}

export interface DAO {
  id: string;
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

function createBaseDAOsRequest(): DAOsRequest {
  return { networkId: "", memberAddress: "" };
}

export const DAOsRequest = {
  encode(message: DAOsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.networkId !== "") {
      writer.uint32(10).string(message.networkId);
    }
    if (message.memberAddress !== "") {
      writer.uint32(18).string(message.memberAddress);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DAOsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDAOsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.networkId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.memberAddress = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DAOsRequest {
    return {
      networkId: isSet(object.networkId) ? globalThis.String(object.networkId) : "",
      memberAddress: isSet(object.memberAddress) ? globalThis.String(object.memberAddress) : "",
    };
  },

  toJSON(message: DAOsRequest): unknown {
    const obj: any = {};
    if (message.networkId !== "") {
      obj.networkId = message.networkId;
    }
    if (message.memberAddress !== "") {
      obj.memberAddress = message.memberAddress;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DAOsRequest>, I>>(base?: I): DAOsRequest {
    return DAOsRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DAOsRequest>, I>>(object: I): DAOsRequest {
    const message = createBaseDAOsRequest();
    message.networkId = object.networkId ?? "";
    message.memberAddress = object.memberAddress ?? "";
    return message;
  },
};

function createBaseDAOsResponse(): DAOsResponse {
  return { daos: [] };
}

export const DAOsResponse = {
  encode(message: DAOsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.daos) {
      DAO.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DAOsResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDAOsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.daos.push(DAO.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DAOsResponse {
    return { daos: globalThis.Array.isArray(object?.daos) ? object.daos.map((e: any) => DAO.fromJSON(e)) : [] };
  },

  toJSON(message: DAOsResponse): unknown {
    const obj: any = {};
    if (message.daos?.length) {
      obj.daos = message.daos.map((e) => DAO.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DAOsResponse>, I>>(base?: I): DAOsResponse {
    return DAOsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DAOsResponse>, I>>(object: I): DAOsResponse {
    const message = createBaseDAOsResponse();
    message.daos = object.daos?.map((e) => DAO.fromPartial(e)) || [];
    return message;
  },
};

function createBaseDAO(): DAO {
  return {
    id: "",
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

export const DAO = {
  encode(message: DAO, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.admin !== "") {
      writer.uint32(18).string(message.admin);
    }
    if (message.contractAddress !== "") {
      writer.uint32(26).string(message.contractAddress);
    }
    if (message.name !== "") {
      writer.uint32(34).string(message.name);
    }
    if (message.description !== "") {
      writer.uint32(42).string(message.description);
    }
    if (message.imageUrl !== "") {
      writer.uint32(50).string(message.imageUrl);
    }
    if (message.quorum !== "") {
      writer.uint32(58).string(message.quorum);
    }
    if (message.threshold !== "") {
      writer.uint32(66).string(message.threshold);
    }
    if (message.tokenName !== "") {
      writer.uint32(74).string(message.tokenName);
    }
    if (message.tokenSymbol !== "") {
      writer.uint32(82).string(message.tokenSymbol);
    }
    if (message.unstakingDuration !== 0) {
      writer.uint32(88).uint64(message.unstakingDuration);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DAO {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDAO();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.admin = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.contractAddress = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.name = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.description = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.imageUrl = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.quorum = reader.string();
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.threshold = reader.string();
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.tokenName = reader.string();
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.tokenSymbol = reader.string();
          continue;
        case 11:
          if (tag !== 88) {
            break;
          }

          message.unstakingDuration = longToNumber(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DAO {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      admin: isSet(object.admin) ? globalThis.String(object.admin) : "",
      contractAddress: isSet(object.contractAddress) ? globalThis.String(object.contractAddress) : "",
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      description: isSet(object.description) ? globalThis.String(object.description) : "",
      imageUrl: isSet(object.imageUrl) ? globalThis.String(object.imageUrl) : "",
      quorum: isSet(object.quorum) ? globalThis.String(object.quorum) : "",
      threshold: isSet(object.threshold) ? globalThis.String(object.threshold) : "",
      tokenName: isSet(object.tokenName) ? globalThis.String(object.tokenName) : "",
      tokenSymbol: isSet(object.tokenSymbol) ? globalThis.String(object.tokenSymbol) : "",
      unstakingDuration: isSet(object.unstakingDuration) ? globalThis.Number(object.unstakingDuration) : 0,
    };
  },

  toJSON(message: DAO): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.admin !== "") {
      obj.admin = message.admin;
    }
    if (message.contractAddress !== "") {
      obj.contractAddress = message.contractAddress;
    }
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.description !== "") {
      obj.description = message.description;
    }
    if (message.imageUrl !== "") {
      obj.imageUrl = message.imageUrl;
    }
    if (message.quorum !== "") {
      obj.quorum = message.quorum;
    }
    if (message.threshold !== "") {
      obj.threshold = message.threshold;
    }
    if (message.tokenName !== "") {
      obj.tokenName = message.tokenName;
    }
    if (message.tokenSymbol !== "") {
      obj.tokenSymbol = message.tokenSymbol;
    }
    if (message.unstakingDuration !== 0) {
      obj.unstakingDuration = Math.round(message.unstakingDuration);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DAO>, I>>(base?: I): DAO {
    return DAO.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DAO>, I>>(object: I): DAO {
    const message = createBaseDAO();
    message.id = object.id ?? "";
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

export interface DAOService {
  DAOs(request: DeepPartial<DAOsRequest>, metadata?: grpc.Metadata): Promise<DAOsResponse>;
}

export class DAOServiceClientImpl implements DAOService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.DAOs = this.DAOs.bind(this);
  }

  DAOs(request: DeepPartial<DAOsRequest>, metadata?: grpc.Metadata): Promise<DAOsResponse> {
    return this.rpc.unary(DAOServiceDAOsDesc, DAOsRequest.fromPartial(request), metadata);
  }
}

export const DAOServiceDesc = { serviceName: "dao.v1.DAOService" };

export const DAOServiceDAOsDesc: UnaryMethodDefinitionish = {
  methodName: "DAOs",
  service: DAOServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return DAOsRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = DAOsResponse.decode(data);
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
