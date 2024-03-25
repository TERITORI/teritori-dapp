/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "launchpad.v1";

export interface UpdateTokensMetadatasRequest {
  sender: string;
  networkId: string;
  projectId: number;
  metadatas: Metadata[];
}

export interface UpdateTokensMetadatasResponse {
  merkleRoot: string;
}

export interface CalculateCollectionMerkleRootRequest {
  sender: string;
  metadatas: Metadata[];
}

export interface CalculateCollectionMerkleRootResponse {
  merkleRoot: string;
}

export interface TokenMetadataRequest {
  sender: string;
  networkId: string;
  projectId: number;
  tokenId: number;
}

export interface TokenMetadataResponse {
  merkleRoot: string;
  metadata: Metadata | undefined;
  merkleProof: string[];
}

export interface UpdateCollectionWhitelistsRequest {
  sender: string;
  networkId: string;
  projectId: number;
  whitelistMintInfos: WhitelistMintInfo[];
}

export interface UpdateCollectionWhitelistsResponse {
  merkleRoots: string[];
}

export interface WhitelistedAddressMerkleInfoRequest {
  sender: string;
  networkId: string;
  projectId: number;
  whitelistId: number;
  address: string;
}

export interface WhitelistedAddressMerkleInfoResponse {
  merkleRoot: string;
  merkleProof: string[];
}

export interface Metadata {
  image?: string | undefined;
  imageData?: string | undefined;
  externalUrl?: string | undefined;
  description?: string | undefined;
  name?: string | undefined;
  attributes: Trait[];
  backgroundColor?: string | undefined;
  animationUrl?: string | undefined;
  youtubeUrl?: string | undefined;
  royaltyPercentage?: number | undefined;
  royaltyPaymentAddress?: string | undefined;
}

export interface Trait {
  displayType?: string | undefined;
  traitType: string;
  value: string;
}

export interface WhitelistMintInfo {
  addresses: string[];
  unitPrice: number;
  denom: string;
  limitPerAddress: number;
  addressesCount: number;
  startTime: number;
  endTime: number;
}

function createBaseUpdateTokensMetadatasRequest(): UpdateTokensMetadatasRequest {
  return { sender: "", networkId: "", projectId: 0, metadatas: [] };
}

export const UpdateTokensMetadatasRequest = {
  encode(message: UpdateTokensMetadatasRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.networkId !== "") {
      writer.uint32(18).string(message.networkId);
    }
    if (message.projectId !== 0) {
      writer.uint32(24).uint32(message.projectId);
    }
    for (const v of message.metadatas) {
      Metadata.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateTokensMetadatasRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateTokensMetadatasRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.sender = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.networkId = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.projectId = reader.uint32();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.metadatas.push(Metadata.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UpdateTokensMetadatasRequest {
    return {
      sender: isSet(object.sender) ? globalThis.String(object.sender) : "",
      networkId: isSet(object.networkId) ? globalThis.String(object.networkId) : "",
      projectId: isSet(object.projectId) ? globalThis.Number(object.projectId) : 0,
      metadatas: globalThis.Array.isArray(object?.metadatas)
        ? object.metadatas.map((e: any) => Metadata.fromJSON(e))
        : [],
    };
  },

  toJSON(message: UpdateTokensMetadatasRequest): unknown {
    const obj: any = {};
    if (message.sender !== "") {
      obj.sender = message.sender;
    }
    if (message.networkId !== "") {
      obj.networkId = message.networkId;
    }
    if (message.projectId !== 0) {
      obj.projectId = Math.round(message.projectId);
    }
    if (message.metadatas?.length) {
      obj.metadatas = message.metadatas.map((e) => Metadata.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateTokensMetadatasRequest>, I>>(base?: I): UpdateTokensMetadatasRequest {
    return UpdateTokensMetadatasRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UpdateTokensMetadatasRequest>, I>>(object: I): UpdateTokensMetadatasRequest {
    const message = createBaseUpdateTokensMetadatasRequest();
    message.sender = object.sender ?? "";
    message.networkId = object.networkId ?? "";
    message.projectId = object.projectId ?? 0;
    message.metadatas = object.metadatas?.map((e) => Metadata.fromPartial(e)) || [];
    return message;
  },
};

function createBaseUpdateTokensMetadatasResponse(): UpdateTokensMetadatasResponse {
  return { merkleRoot: "" };
}

export const UpdateTokensMetadatasResponse = {
  encode(message: UpdateTokensMetadatasResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.merkleRoot !== "") {
      writer.uint32(10).string(message.merkleRoot);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateTokensMetadatasResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateTokensMetadatasResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.merkleRoot = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UpdateTokensMetadatasResponse {
    return { merkleRoot: isSet(object.merkleRoot) ? globalThis.String(object.merkleRoot) : "" };
  },

  toJSON(message: UpdateTokensMetadatasResponse): unknown {
    const obj: any = {};
    if (message.merkleRoot !== "") {
      obj.merkleRoot = message.merkleRoot;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateTokensMetadatasResponse>, I>>(base?: I): UpdateTokensMetadatasResponse {
    return UpdateTokensMetadatasResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UpdateTokensMetadatasResponse>, I>>(
    object: I,
  ): UpdateTokensMetadatasResponse {
    const message = createBaseUpdateTokensMetadatasResponse();
    message.merkleRoot = object.merkleRoot ?? "";
    return message;
  },
};

function createBaseCalculateCollectionMerkleRootRequest(): CalculateCollectionMerkleRootRequest {
  return { sender: "", metadatas: [] };
}

export const CalculateCollectionMerkleRootRequest = {
  encode(message: CalculateCollectionMerkleRootRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    for (const v of message.metadatas) {
      Metadata.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CalculateCollectionMerkleRootRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCalculateCollectionMerkleRootRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.sender = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.metadatas.push(Metadata.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CalculateCollectionMerkleRootRequest {
    return {
      sender: isSet(object.sender) ? globalThis.String(object.sender) : "",
      metadatas: globalThis.Array.isArray(object?.metadatas)
        ? object.metadatas.map((e: any) => Metadata.fromJSON(e))
        : [],
    };
  },

  toJSON(message: CalculateCollectionMerkleRootRequest): unknown {
    const obj: any = {};
    if (message.sender !== "") {
      obj.sender = message.sender;
    }
    if (message.metadatas?.length) {
      obj.metadatas = message.metadatas.map((e) => Metadata.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CalculateCollectionMerkleRootRequest>, I>>(
    base?: I,
  ): CalculateCollectionMerkleRootRequest {
    return CalculateCollectionMerkleRootRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CalculateCollectionMerkleRootRequest>, I>>(
    object: I,
  ): CalculateCollectionMerkleRootRequest {
    const message = createBaseCalculateCollectionMerkleRootRequest();
    message.sender = object.sender ?? "";
    message.metadatas = object.metadatas?.map((e) => Metadata.fromPartial(e)) || [];
    return message;
  },
};

function createBaseCalculateCollectionMerkleRootResponse(): CalculateCollectionMerkleRootResponse {
  return { merkleRoot: "" };
}

export const CalculateCollectionMerkleRootResponse = {
  encode(message: CalculateCollectionMerkleRootResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.merkleRoot !== "") {
      writer.uint32(10).string(message.merkleRoot);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CalculateCollectionMerkleRootResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCalculateCollectionMerkleRootResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.merkleRoot = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CalculateCollectionMerkleRootResponse {
    return { merkleRoot: isSet(object.merkleRoot) ? globalThis.String(object.merkleRoot) : "" };
  },

  toJSON(message: CalculateCollectionMerkleRootResponse): unknown {
    const obj: any = {};
    if (message.merkleRoot !== "") {
      obj.merkleRoot = message.merkleRoot;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CalculateCollectionMerkleRootResponse>, I>>(
    base?: I,
  ): CalculateCollectionMerkleRootResponse {
    return CalculateCollectionMerkleRootResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CalculateCollectionMerkleRootResponse>, I>>(
    object: I,
  ): CalculateCollectionMerkleRootResponse {
    const message = createBaseCalculateCollectionMerkleRootResponse();
    message.merkleRoot = object.merkleRoot ?? "";
    return message;
  },
};

function createBaseTokenMetadataRequest(): TokenMetadataRequest {
  return { sender: "", networkId: "", projectId: 0, tokenId: 0 };
}

export const TokenMetadataRequest = {
  encode(message: TokenMetadataRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.networkId !== "") {
      writer.uint32(18).string(message.networkId);
    }
    if (message.projectId !== 0) {
      writer.uint32(24).uint32(message.projectId);
    }
    if (message.tokenId !== 0) {
      writer.uint32(32).uint32(message.tokenId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TokenMetadataRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTokenMetadataRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.sender = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.networkId = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.projectId = reader.uint32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.tokenId = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TokenMetadataRequest {
    return {
      sender: isSet(object.sender) ? globalThis.String(object.sender) : "",
      networkId: isSet(object.networkId) ? globalThis.String(object.networkId) : "",
      projectId: isSet(object.projectId) ? globalThis.Number(object.projectId) : 0,
      tokenId: isSet(object.tokenId) ? globalThis.Number(object.tokenId) : 0,
    };
  },

  toJSON(message: TokenMetadataRequest): unknown {
    const obj: any = {};
    if (message.sender !== "") {
      obj.sender = message.sender;
    }
    if (message.networkId !== "") {
      obj.networkId = message.networkId;
    }
    if (message.projectId !== 0) {
      obj.projectId = Math.round(message.projectId);
    }
    if (message.tokenId !== 0) {
      obj.tokenId = Math.round(message.tokenId);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TokenMetadataRequest>, I>>(base?: I): TokenMetadataRequest {
    return TokenMetadataRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TokenMetadataRequest>, I>>(object: I): TokenMetadataRequest {
    const message = createBaseTokenMetadataRequest();
    message.sender = object.sender ?? "";
    message.networkId = object.networkId ?? "";
    message.projectId = object.projectId ?? 0;
    message.tokenId = object.tokenId ?? 0;
    return message;
  },
};

function createBaseTokenMetadataResponse(): TokenMetadataResponse {
  return { merkleRoot: "", metadata: undefined, merkleProof: [] };
}

export const TokenMetadataResponse = {
  encode(message: TokenMetadataResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.merkleRoot !== "") {
      writer.uint32(10).string(message.merkleRoot);
    }
    if (message.metadata !== undefined) {
      Metadata.encode(message.metadata, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.merkleProof) {
      writer.uint32(26).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TokenMetadataResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTokenMetadataResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.merkleRoot = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.metadata = Metadata.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.merkleProof.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TokenMetadataResponse {
    return {
      merkleRoot: isSet(object.merkleRoot) ? globalThis.String(object.merkleRoot) : "",
      metadata: isSet(object.metadata) ? Metadata.fromJSON(object.metadata) : undefined,
      merkleProof: globalThis.Array.isArray(object?.merkleProof)
        ? object.merkleProof.map((e: any) => globalThis.String(e))
        : [],
    };
  },

  toJSON(message: TokenMetadataResponse): unknown {
    const obj: any = {};
    if (message.merkleRoot !== "") {
      obj.merkleRoot = message.merkleRoot;
    }
    if (message.metadata !== undefined) {
      obj.metadata = Metadata.toJSON(message.metadata);
    }
    if (message.merkleProof?.length) {
      obj.merkleProof = message.merkleProof;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TokenMetadataResponse>, I>>(base?: I): TokenMetadataResponse {
    return TokenMetadataResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TokenMetadataResponse>, I>>(object: I): TokenMetadataResponse {
    const message = createBaseTokenMetadataResponse();
    message.merkleRoot = object.merkleRoot ?? "";
    message.metadata = (object.metadata !== undefined && object.metadata !== null)
      ? Metadata.fromPartial(object.metadata)
      : undefined;
    message.merkleProof = object.merkleProof?.map((e) => e) || [];
    return message;
  },
};

function createBaseUpdateCollectionWhitelistsRequest(): UpdateCollectionWhitelistsRequest {
  return { sender: "", networkId: "", projectId: 0, whitelistMintInfos: [] };
}

export const UpdateCollectionWhitelistsRequest = {
  encode(message: UpdateCollectionWhitelistsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.networkId !== "") {
      writer.uint32(18).string(message.networkId);
    }
    if (message.projectId !== 0) {
      writer.uint32(24).uint32(message.projectId);
    }
    for (const v of message.whitelistMintInfos) {
      WhitelistMintInfo.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateCollectionWhitelistsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateCollectionWhitelistsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.sender = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.networkId = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.projectId = reader.uint32();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.whitelistMintInfos.push(WhitelistMintInfo.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UpdateCollectionWhitelistsRequest {
    return {
      sender: isSet(object.sender) ? globalThis.String(object.sender) : "",
      networkId: isSet(object.networkId) ? globalThis.String(object.networkId) : "",
      projectId: isSet(object.projectId) ? globalThis.Number(object.projectId) : 0,
      whitelistMintInfos: globalThis.Array.isArray(object?.whitelistMintInfos)
        ? object.whitelistMintInfos.map((e: any) => WhitelistMintInfo.fromJSON(e))
        : [],
    };
  },

  toJSON(message: UpdateCollectionWhitelistsRequest): unknown {
    const obj: any = {};
    if (message.sender !== "") {
      obj.sender = message.sender;
    }
    if (message.networkId !== "") {
      obj.networkId = message.networkId;
    }
    if (message.projectId !== 0) {
      obj.projectId = Math.round(message.projectId);
    }
    if (message.whitelistMintInfos?.length) {
      obj.whitelistMintInfos = message.whitelistMintInfos.map((e) => WhitelistMintInfo.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateCollectionWhitelistsRequest>, I>>(
    base?: I,
  ): UpdateCollectionWhitelistsRequest {
    return UpdateCollectionWhitelistsRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UpdateCollectionWhitelistsRequest>, I>>(
    object: I,
  ): UpdateCollectionWhitelistsRequest {
    const message = createBaseUpdateCollectionWhitelistsRequest();
    message.sender = object.sender ?? "";
    message.networkId = object.networkId ?? "";
    message.projectId = object.projectId ?? 0;
    message.whitelistMintInfos = object.whitelistMintInfos?.map((e) => WhitelistMintInfo.fromPartial(e)) || [];
    return message;
  },
};

function createBaseUpdateCollectionWhitelistsResponse(): UpdateCollectionWhitelistsResponse {
  return { merkleRoots: [] };
}

export const UpdateCollectionWhitelistsResponse = {
  encode(message: UpdateCollectionWhitelistsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.merkleRoots) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateCollectionWhitelistsResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateCollectionWhitelistsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.merkleRoots.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UpdateCollectionWhitelistsResponse {
    return {
      merkleRoots: globalThis.Array.isArray(object?.merkleRoots)
        ? object.merkleRoots.map((e: any) => globalThis.String(e))
        : [],
    };
  },

  toJSON(message: UpdateCollectionWhitelistsResponse): unknown {
    const obj: any = {};
    if (message.merkleRoots?.length) {
      obj.merkleRoots = message.merkleRoots;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateCollectionWhitelistsResponse>, I>>(
    base?: I,
  ): UpdateCollectionWhitelistsResponse {
    return UpdateCollectionWhitelistsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UpdateCollectionWhitelistsResponse>, I>>(
    object: I,
  ): UpdateCollectionWhitelistsResponse {
    const message = createBaseUpdateCollectionWhitelistsResponse();
    message.merkleRoots = object.merkleRoots?.map((e) => e) || [];
    return message;
  },
};

function createBaseWhitelistedAddressMerkleInfoRequest(): WhitelistedAddressMerkleInfoRequest {
  return { sender: "", networkId: "", projectId: 0, whitelistId: 0, address: "" };
}

export const WhitelistedAddressMerkleInfoRequest = {
  encode(message: WhitelistedAddressMerkleInfoRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.networkId !== "") {
      writer.uint32(18).string(message.networkId);
    }
    if (message.projectId !== 0) {
      writer.uint32(24).uint32(message.projectId);
    }
    if (message.whitelistId !== 0) {
      writer.uint32(32).uint32(message.whitelistId);
    }
    if (message.address !== "") {
      writer.uint32(42).string(message.address);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): WhitelistedAddressMerkleInfoRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWhitelistedAddressMerkleInfoRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.sender = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.networkId = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.projectId = reader.uint32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.whitelistId = reader.uint32();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.address = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): WhitelistedAddressMerkleInfoRequest {
    return {
      sender: isSet(object.sender) ? globalThis.String(object.sender) : "",
      networkId: isSet(object.networkId) ? globalThis.String(object.networkId) : "",
      projectId: isSet(object.projectId) ? globalThis.Number(object.projectId) : 0,
      whitelistId: isSet(object.whitelistId) ? globalThis.Number(object.whitelistId) : 0,
      address: isSet(object.address) ? globalThis.String(object.address) : "",
    };
  },

  toJSON(message: WhitelistedAddressMerkleInfoRequest): unknown {
    const obj: any = {};
    if (message.sender !== "") {
      obj.sender = message.sender;
    }
    if (message.networkId !== "") {
      obj.networkId = message.networkId;
    }
    if (message.projectId !== 0) {
      obj.projectId = Math.round(message.projectId);
    }
    if (message.whitelistId !== 0) {
      obj.whitelistId = Math.round(message.whitelistId);
    }
    if (message.address !== "") {
      obj.address = message.address;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<WhitelistedAddressMerkleInfoRequest>, I>>(
    base?: I,
  ): WhitelistedAddressMerkleInfoRequest {
    return WhitelistedAddressMerkleInfoRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<WhitelistedAddressMerkleInfoRequest>, I>>(
    object: I,
  ): WhitelistedAddressMerkleInfoRequest {
    const message = createBaseWhitelistedAddressMerkleInfoRequest();
    message.sender = object.sender ?? "";
    message.networkId = object.networkId ?? "";
    message.projectId = object.projectId ?? 0;
    message.whitelistId = object.whitelistId ?? 0;
    message.address = object.address ?? "";
    return message;
  },
};

function createBaseWhitelistedAddressMerkleInfoResponse(): WhitelistedAddressMerkleInfoResponse {
  return { merkleRoot: "", merkleProof: [] };
}

export const WhitelistedAddressMerkleInfoResponse = {
  encode(message: WhitelistedAddressMerkleInfoResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.merkleRoot !== "") {
      writer.uint32(10).string(message.merkleRoot);
    }
    for (const v of message.merkleProof) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): WhitelistedAddressMerkleInfoResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWhitelistedAddressMerkleInfoResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.merkleRoot = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.merkleProof.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): WhitelistedAddressMerkleInfoResponse {
    return {
      merkleRoot: isSet(object.merkleRoot) ? globalThis.String(object.merkleRoot) : "",
      merkleProof: globalThis.Array.isArray(object?.merkleProof)
        ? object.merkleProof.map((e: any) => globalThis.String(e))
        : [],
    };
  },

  toJSON(message: WhitelistedAddressMerkleInfoResponse): unknown {
    const obj: any = {};
    if (message.merkleRoot !== "") {
      obj.merkleRoot = message.merkleRoot;
    }
    if (message.merkleProof?.length) {
      obj.merkleProof = message.merkleProof;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<WhitelistedAddressMerkleInfoResponse>, I>>(
    base?: I,
  ): WhitelistedAddressMerkleInfoResponse {
    return WhitelistedAddressMerkleInfoResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<WhitelistedAddressMerkleInfoResponse>, I>>(
    object: I,
  ): WhitelistedAddressMerkleInfoResponse {
    const message = createBaseWhitelistedAddressMerkleInfoResponse();
    message.merkleRoot = object.merkleRoot ?? "";
    message.merkleProof = object.merkleProof?.map((e) => e) || [];
    return message;
  },
};

function createBaseMetadata(): Metadata {
  return {
    image: undefined,
    imageData: undefined,
    externalUrl: undefined,
    description: undefined,
    name: undefined,
    attributes: [],
    backgroundColor: undefined,
    animationUrl: undefined,
    youtubeUrl: undefined,
    royaltyPercentage: undefined,
    royaltyPaymentAddress: undefined,
  };
}

export const Metadata = {
  encode(message: Metadata, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.image !== undefined) {
      writer.uint32(10).string(message.image);
    }
    if (message.imageData !== undefined) {
      writer.uint32(18).string(message.imageData);
    }
    if (message.externalUrl !== undefined) {
      writer.uint32(26).string(message.externalUrl);
    }
    if (message.description !== undefined) {
      writer.uint32(34).string(message.description);
    }
    if (message.name !== undefined) {
      writer.uint32(42).string(message.name);
    }
    for (const v of message.attributes) {
      Trait.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    if (message.backgroundColor !== undefined) {
      writer.uint32(58).string(message.backgroundColor);
    }
    if (message.animationUrl !== undefined) {
      writer.uint32(66).string(message.animationUrl);
    }
    if (message.youtubeUrl !== undefined) {
      writer.uint32(74).string(message.youtubeUrl);
    }
    if (message.royaltyPercentage !== undefined) {
      writer.uint32(80).uint64(message.royaltyPercentage);
    }
    if (message.royaltyPaymentAddress !== undefined) {
      writer.uint32(90).string(message.royaltyPaymentAddress);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Metadata {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMetadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.image = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.imageData = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.externalUrl = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.description = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.name = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.attributes.push(Trait.decode(reader, reader.uint32()));
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.backgroundColor = reader.string();
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.animationUrl = reader.string();
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.youtubeUrl = reader.string();
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }

          message.royaltyPercentage = longToNumber(reader.uint64() as Long);
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.royaltyPaymentAddress = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Metadata {
    return {
      image: isSet(object.image) ? globalThis.String(object.image) : undefined,
      imageData: isSet(object.imageData) ? globalThis.String(object.imageData) : undefined,
      externalUrl: isSet(object.externalUrl) ? globalThis.String(object.externalUrl) : undefined,
      description: isSet(object.description) ? globalThis.String(object.description) : undefined,
      name: isSet(object.name) ? globalThis.String(object.name) : undefined,
      attributes: globalThis.Array.isArray(object?.attributes)
        ? object.attributes.map((e: any) => Trait.fromJSON(e))
        : [],
      backgroundColor: isSet(object.backgroundColor) ? globalThis.String(object.backgroundColor) : undefined,
      animationUrl: isSet(object.animationUrl) ? globalThis.String(object.animationUrl) : undefined,
      youtubeUrl: isSet(object.youtubeUrl) ? globalThis.String(object.youtubeUrl) : undefined,
      royaltyPercentage: isSet(object.royaltyPercentage) ? globalThis.Number(object.royaltyPercentage) : undefined,
      royaltyPaymentAddress: isSet(object.royaltyPaymentAddress)
        ? globalThis.String(object.royaltyPaymentAddress)
        : undefined,
    };
  },

  toJSON(message: Metadata): unknown {
    const obj: any = {};
    if (message.image !== undefined) {
      obj.image = message.image;
    }
    if (message.imageData !== undefined) {
      obj.imageData = message.imageData;
    }
    if (message.externalUrl !== undefined) {
      obj.externalUrl = message.externalUrl;
    }
    if (message.description !== undefined) {
      obj.description = message.description;
    }
    if (message.name !== undefined) {
      obj.name = message.name;
    }
    if (message.attributes?.length) {
      obj.attributes = message.attributes.map((e) => Trait.toJSON(e));
    }
    if (message.backgroundColor !== undefined) {
      obj.backgroundColor = message.backgroundColor;
    }
    if (message.animationUrl !== undefined) {
      obj.animationUrl = message.animationUrl;
    }
    if (message.youtubeUrl !== undefined) {
      obj.youtubeUrl = message.youtubeUrl;
    }
    if (message.royaltyPercentage !== undefined) {
      obj.royaltyPercentage = Math.round(message.royaltyPercentage);
    }
    if (message.royaltyPaymentAddress !== undefined) {
      obj.royaltyPaymentAddress = message.royaltyPaymentAddress;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Metadata>, I>>(base?: I): Metadata {
    return Metadata.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Metadata>, I>>(object: I): Metadata {
    const message = createBaseMetadata();
    message.image = object.image ?? undefined;
    message.imageData = object.imageData ?? undefined;
    message.externalUrl = object.externalUrl ?? undefined;
    message.description = object.description ?? undefined;
    message.name = object.name ?? undefined;
    message.attributes = object.attributes?.map((e) => Trait.fromPartial(e)) || [];
    message.backgroundColor = object.backgroundColor ?? undefined;
    message.animationUrl = object.animationUrl ?? undefined;
    message.youtubeUrl = object.youtubeUrl ?? undefined;
    message.royaltyPercentage = object.royaltyPercentage ?? undefined;
    message.royaltyPaymentAddress = object.royaltyPaymentAddress ?? undefined;
    return message;
  },
};

function createBaseTrait(): Trait {
  return { displayType: undefined, traitType: "", value: "" };
}

export const Trait = {
  encode(message: Trait, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.displayType !== undefined) {
      writer.uint32(10).string(message.displayType);
    }
    if (message.traitType !== "") {
      writer.uint32(18).string(message.traitType);
    }
    if (message.value !== "") {
      writer.uint32(26).string(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Trait {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTrait();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.displayType = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.traitType = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.value = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Trait {
    return {
      displayType: isSet(object.displayType) ? globalThis.String(object.displayType) : undefined,
      traitType: isSet(object.traitType) ? globalThis.String(object.traitType) : "",
      value: isSet(object.value) ? globalThis.String(object.value) : "",
    };
  },

  toJSON(message: Trait): unknown {
    const obj: any = {};
    if (message.displayType !== undefined) {
      obj.displayType = message.displayType;
    }
    if (message.traitType !== "") {
      obj.traitType = message.traitType;
    }
    if (message.value !== "") {
      obj.value = message.value;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Trait>, I>>(base?: I): Trait {
    return Trait.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Trait>, I>>(object: I): Trait {
    const message = createBaseTrait();
    message.displayType = object.displayType ?? undefined;
    message.traitType = object.traitType ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseWhitelistMintInfo(): WhitelistMintInfo {
  return { addresses: [], unitPrice: 0, denom: "", limitPerAddress: 0, addressesCount: 0, startTime: 0, endTime: 0 };
}

export const WhitelistMintInfo = {
  encode(message: WhitelistMintInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.addresses) {
      writer.uint32(10).string(v!);
    }
    if (message.unitPrice !== 0) {
      writer.uint32(16).uint64(message.unitPrice);
    }
    if (message.denom !== "") {
      writer.uint32(26).string(message.denom);
    }
    if (message.limitPerAddress !== 0) {
      writer.uint32(32).uint32(message.limitPerAddress);
    }
    if (message.addressesCount !== 0) {
      writer.uint32(40).uint32(message.addressesCount);
    }
    if (message.startTime !== 0) {
      writer.uint32(48).uint64(message.startTime);
    }
    if (message.endTime !== 0) {
      writer.uint32(56).uint64(message.endTime);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): WhitelistMintInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWhitelistMintInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.addresses.push(reader.string());
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.unitPrice = longToNumber(reader.uint64() as Long);
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.denom = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.limitPerAddress = reader.uint32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.addressesCount = reader.uint32();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.startTime = longToNumber(reader.uint64() as Long);
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.endTime = longToNumber(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): WhitelistMintInfo {
    return {
      addresses: globalThis.Array.isArray(object?.addresses)
        ? object.addresses.map((e: any) => globalThis.String(e))
        : [],
      unitPrice: isSet(object.unitPrice) ? globalThis.Number(object.unitPrice) : 0,
      denom: isSet(object.denom) ? globalThis.String(object.denom) : "",
      limitPerAddress: isSet(object.limitPerAddress) ? globalThis.Number(object.limitPerAddress) : 0,
      addressesCount: isSet(object.addressesCount) ? globalThis.Number(object.addressesCount) : 0,
      startTime: isSet(object.startTime) ? globalThis.Number(object.startTime) : 0,
      endTime: isSet(object.endTime) ? globalThis.Number(object.endTime) : 0,
    };
  },

  toJSON(message: WhitelistMintInfo): unknown {
    const obj: any = {};
    if (message.addresses?.length) {
      obj.addresses = message.addresses;
    }
    if (message.unitPrice !== 0) {
      obj.unitPrice = Math.round(message.unitPrice);
    }
    if (message.denom !== "") {
      obj.denom = message.denom;
    }
    if (message.limitPerAddress !== 0) {
      obj.limitPerAddress = Math.round(message.limitPerAddress);
    }
    if (message.addressesCount !== 0) {
      obj.addressesCount = Math.round(message.addressesCount);
    }
    if (message.startTime !== 0) {
      obj.startTime = Math.round(message.startTime);
    }
    if (message.endTime !== 0) {
      obj.endTime = Math.round(message.endTime);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<WhitelistMintInfo>, I>>(base?: I): WhitelistMintInfo {
    return WhitelistMintInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<WhitelistMintInfo>, I>>(object: I): WhitelistMintInfo {
    const message = createBaseWhitelistMintInfo();
    message.addresses = object.addresses?.map((e) => e) || [];
    message.unitPrice = object.unitPrice ?? 0;
    message.denom = object.denom ?? "";
    message.limitPerAddress = object.limitPerAddress ?? 0;
    message.addressesCount = object.addressesCount ?? 0;
    message.startTime = object.startTime ?? 0;
    message.endTime = object.endTime ?? 0;
    return message;
  },
};

export interface LaunchpadService {
  UpdateTokensMetadatas(
    request: DeepPartial<UpdateTokensMetadatasRequest>,
    metadata?: grpc.Metadata,
  ): Promise<UpdateTokensMetadatasResponse>;
  CalculateCollectionMerkleRoot(
    request: DeepPartial<CalculateCollectionMerkleRootRequest>,
    metadata?: grpc.Metadata,
  ): Promise<CalculateCollectionMerkleRootResponse>;
  UpdateCollectionWhitelists(
    request: DeepPartial<UpdateCollectionWhitelistsRequest>,
    metadata?: grpc.Metadata,
  ): Promise<UpdateCollectionWhitelistsResponse>;
  TokenMetadata(request: DeepPartial<TokenMetadataRequest>, metadata?: grpc.Metadata): Promise<TokenMetadataResponse>;
  WhitelistedAddressMerkleInfo(
    request: DeepPartial<WhitelistedAddressMerkleInfoRequest>,
    metadata?: grpc.Metadata,
  ): Promise<WhitelistedAddressMerkleInfoResponse>;
}

export class LaunchpadServiceClientImpl implements LaunchpadService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.UpdateTokensMetadatas = this.UpdateTokensMetadatas.bind(this);
    this.CalculateCollectionMerkleRoot = this.CalculateCollectionMerkleRoot.bind(this);
    this.UpdateCollectionWhitelists = this.UpdateCollectionWhitelists.bind(this);
    this.TokenMetadata = this.TokenMetadata.bind(this);
    this.WhitelistedAddressMerkleInfo = this.WhitelistedAddressMerkleInfo.bind(this);
  }

  UpdateTokensMetadatas(
    request: DeepPartial<UpdateTokensMetadatasRequest>,
    metadata?: grpc.Metadata,
  ): Promise<UpdateTokensMetadatasResponse> {
    return this.rpc.unary(
      LaunchpadServiceUpdateTokensMetadatasDesc,
      UpdateTokensMetadatasRequest.fromPartial(request),
      metadata,
    );
  }

  CalculateCollectionMerkleRoot(
    request: DeepPartial<CalculateCollectionMerkleRootRequest>,
    metadata?: grpc.Metadata,
  ): Promise<CalculateCollectionMerkleRootResponse> {
    return this.rpc.unary(
      LaunchpadServiceCalculateCollectionMerkleRootDesc,
      CalculateCollectionMerkleRootRequest.fromPartial(request),
      metadata,
    );
  }

  UpdateCollectionWhitelists(
    request: DeepPartial<UpdateCollectionWhitelistsRequest>,
    metadata?: grpc.Metadata,
  ): Promise<UpdateCollectionWhitelistsResponse> {
    return this.rpc.unary(
      LaunchpadServiceUpdateCollectionWhitelistsDesc,
      UpdateCollectionWhitelistsRequest.fromPartial(request),
      metadata,
    );
  }

  TokenMetadata(request: DeepPartial<TokenMetadataRequest>, metadata?: grpc.Metadata): Promise<TokenMetadataResponse> {
    return this.rpc.unary(LaunchpadServiceTokenMetadataDesc, TokenMetadataRequest.fromPartial(request), metadata);
  }

  WhitelistedAddressMerkleInfo(
    request: DeepPartial<WhitelistedAddressMerkleInfoRequest>,
    metadata?: grpc.Metadata,
  ): Promise<WhitelistedAddressMerkleInfoResponse> {
    return this.rpc.unary(
      LaunchpadServiceWhitelistedAddressMerkleInfoDesc,
      WhitelistedAddressMerkleInfoRequest.fromPartial(request),
      metadata,
    );
  }
}

export const LaunchpadServiceDesc = { serviceName: "launchpad.v1.LaunchpadService" };

export const LaunchpadServiceUpdateTokensMetadatasDesc: UnaryMethodDefinitionish = {
  methodName: "UpdateTokensMetadatas",
  service: LaunchpadServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return UpdateTokensMetadatasRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = UpdateTokensMetadatasResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const LaunchpadServiceCalculateCollectionMerkleRootDesc: UnaryMethodDefinitionish = {
  methodName: "CalculateCollectionMerkleRoot",
  service: LaunchpadServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return CalculateCollectionMerkleRootRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = CalculateCollectionMerkleRootResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const LaunchpadServiceUpdateCollectionWhitelistsDesc: UnaryMethodDefinitionish = {
  methodName: "UpdateCollectionWhitelists",
  service: LaunchpadServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return UpdateCollectionWhitelistsRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = UpdateCollectionWhitelistsResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const LaunchpadServiceTokenMetadataDesc: UnaryMethodDefinitionish = {
  methodName: "TokenMetadata",
  service: LaunchpadServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return TokenMetadataRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = TokenMetadataResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const LaunchpadServiceWhitelistedAddressMerkleInfoDesc: UnaryMethodDefinitionish = {
  methodName: "WhitelistedAddressMerkleInfo",
  service: LaunchpadServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return WhitelistedAddressMerkleInfoRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = WhitelistedAddressMerkleInfoResponse.decode(data);
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
