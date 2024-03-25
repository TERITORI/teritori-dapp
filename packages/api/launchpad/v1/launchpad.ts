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

export interface Collection {
  /** Collection info ---------------------------- */
  name: string;
  desc: string;
  symbol: string;
  coverImgUri: string;
  targetNetwork: string;
  externalLink: string;
  /** Collection details ---------------------------- */
  websiteLink: string;
  twitterProfile: string;
  twitterFollowersCount: number;
  contactDiscordName: string;
  contactEmail: string;
  isProjectDerivative: boolean;
  projectType: string;
  projectDesc: string;
  isAppliedPreviously: boolean;
  /** Team info -------------------------------------- */
  teamDesc: string;
  teamLink: string;
  partners: string;
  investmentDesc: string;
  investmentLink: string;
  whitepaperLink: string;
  roadmapLink: string;
  /** Additional info ---------------------------- */
  artworkDesc: string;
  isReadyForMint: boolean;
  expectedSupply: number;
  expectedPublicMintPrice: number;
  expectedMintDate: number;
  escrowMintProceedsPeriod: number;
  isDox: boolean;
  daoWhitelistCount: number;
  /** Minting details ---------------------------- */
  tokensCount: number;
  unitPrice: number;
  limitPerAddress: number;
  startTime: number;
  /** Royalty -------------------------- */
  royaltyAddress: string;
  royaltyPercentage: number;
  /** Extend info -------------------------- */
  baseTokenUri: string;
  merkleRoot: string;
  deployedAddress: string;
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

function createBaseCollection(): Collection {
  return {
    name: "",
    desc: "",
    symbol: "",
    coverImgUri: "",
    targetNetwork: "",
    externalLink: "",
    websiteLink: "",
    twitterProfile: "",
    twitterFollowersCount: 0,
    contactDiscordName: "",
    contactEmail: "",
    isProjectDerivative: false,
    projectType: "",
    projectDesc: "",
    isAppliedPreviously: false,
    teamDesc: "",
    teamLink: "",
    partners: "",
    investmentDesc: "",
    investmentLink: "",
    whitepaperLink: "",
    roadmapLink: "",
    artworkDesc: "",
    isReadyForMint: false,
    expectedSupply: 0,
    expectedPublicMintPrice: 0,
    expectedMintDate: 0,
    escrowMintProceedsPeriod: 0,
    isDox: false,
    daoWhitelistCount: 0,
    tokensCount: 0,
    unitPrice: 0,
    limitPerAddress: 0,
    startTime: 0,
    royaltyAddress: "",
    royaltyPercentage: 0,
    baseTokenUri: "",
    merkleRoot: "",
    deployedAddress: "",
  };
}

export const Collection = {
  encode(message: Collection, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.desc !== "") {
      writer.uint32(18).string(message.desc);
    }
    if (message.symbol !== "") {
      writer.uint32(26).string(message.symbol);
    }
    if (message.coverImgUri !== "") {
      writer.uint32(34).string(message.coverImgUri);
    }
    if (message.targetNetwork !== "") {
      writer.uint32(42).string(message.targetNetwork);
    }
    if (message.externalLink !== "") {
      writer.uint32(50).string(message.externalLink);
    }
    if (message.websiteLink !== "") {
      writer.uint32(58).string(message.websiteLink);
    }
    if (message.twitterProfile !== "") {
      writer.uint32(66).string(message.twitterProfile);
    }
    if (message.twitterFollowersCount !== 0) {
      writer.uint32(72).uint64(message.twitterFollowersCount);
    }
    if (message.contactDiscordName !== "") {
      writer.uint32(82).string(message.contactDiscordName);
    }
    if (message.contactEmail !== "") {
      writer.uint32(90).string(message.contactEmail);
    }
    if (message.isProjectDerivative === true) {
      writer.uint32(96).bool(message.isProjectDerivative);
    }
    if (message.projectType !== "") {
      writer.uint32(106).string(message.projectType);
    }
    if (message.projectDesc !== "") {
      writer.uint32(114).string(message.projectDesc);
    }
    if (message.isAppliedPreviously === true) {
      writer.uint32(120).bool(message.isAppliedPreviously);
    }
    if (message.teamDesc !== "") {
      writer.uint32(130).string(message.teamDesc);
    }
    if (message.teamLink !== "") {
      writer.uint32(138).string(message.teamLink);
    }
    if (message.partners !== "") {
      writer.uint32(146).string(message.partners);
    }
    if (message.investmentDesc !== "") {
      writer.uint32(154).string(message.investmentDesc);
    }
    if (message.investmentLink !== "") {
      writer.uint32(162).string(message.investmentLink);
    }
    if (message.whitepaperLink !== "") {
      writer.uint32(170).string(message.whitepaperLink);
    }
    if (message.roadmapLink !== "") {
      writer.uint32(178).string(message.roadmapLink);
    }
    if (message.artworkDesc !== "") {
      writer.uint32(186).string(message.artworkDesc);
    }
    if (message.isReadyForMint === true) {
      writer.uint32(192).bool(message.isReadyForMint);
    }
    if (message.expectedSupply !== 0) {
      writer.uint32(200).uint32(message.expectedSupply);
    }
    if (message.expectedPublicMintPrice !== 0) {
      writer.uint32(208).uint64(message.expectedPublicMintPrice);
    }
    if (message.expectedMintDate !== 0) {
      writer.uint32(216).uint64(message.expectedMintDate);
    }
    if (message.escrowMintProceedsPeriod !== 0) {
      writer.uint32(224).uint64(message.escrowMintProceedsPeriod);
    }
    if (message.isDox === true) {
      writer.uint32(232).bool(message.isDox);
    }
    if (message.daoWhitelistCount !== 0) {
      writer.uint32(240).uint32(message.daoWhitelistCount);
    }
    if (message.tokensCount !== 0) {
      writer.uint32(248).uint32(message.tokensCount);
    }
    if (message.unitPrice !== 0) {
      writer.uint32(256).uint64(message.unitPrice);
    }
    if (message.limitPerAddress !== 0) {
      writer.uint32(264).uint32(message.limitPerAddress);
    }
    if (message.startTime !== 0) {
      writer.uint32(272).uint64(message.startTime);
    }
    if (message.royaltyAddress !== "") {
      writer.uint32(282).string(message.royaltyAddress);
    }
    if (message.royaltyPercentage !== 0) {
      writer.uint32(288).uint32(message.royaltyPercentage);
    }
    if (message.baseTokenUri !== "") {
      writer.uint32(298).string(message.baseTokenUri);
    }
    if (message.merkleRoot !== "") {
      writer.uint32(306).string(message.merkleRoot);
    }
    if (message.deployedAddress !== "") {
      writer.uint32(314).string(message.deployedAddress);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Collection {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCollection();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.desc = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.symbol = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.coverImgUri = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.targetNetwork = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.externalLink = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.websiteLink = reader.string();
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.twitterProfile = reader.string();
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }

          message.twitterFollowersCount = longToNumber(reader.uint64() as Long);
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.contactDiscordName = reader.string();
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.contactEmail = reader.string();
          continue;
        case 12:
          if (tag !== 96) {
            break;
          }

          message.isProjectDerivative = reader.bool();
          continue;
        case 13:
          if (tag !== 106) {
            break;
          }

          message.projectType = reader.string();
          continue;
        case 14:
          if (tag !== 114) {
            break;
          }

          message.projectDesc = reader.string();
          continue;
        case 15:
          if (tag !== 120) {
            break;
          }

          message.isAppliedPreviously = reader.bool();
          continue;
        case 16:
          if (tag !== 130) {
            break;
          }

          message.teamDesc = reader.string();
          continue;
        case 17:
          if (tag !== 138) {
            break;
          }

          message.teamLink = reader.string();
          continue;
        case 18:
          if (tag !== 146) {
            break;
          }

          message.partners = reader.string();
          continue;
        case 19:
          if (tag !== 154) {
            break;
          }

          message.investmentDesc = reader.string();
          continue;
        case 20:
          if (tag !== 162) {
            break;
          }

          message.investmentLink = reader.string();
          continue;
        case 21:
          if (tag !== 170) {
            break;
          }

          message.whitepaperLink = reader.string();
          continue;
        case 22:
          if (tag !== 178) {
            break;
          }

          message.roadmapLink = reader.string();
          continue;
        case 23:
          if (tag !== 186) {
            break;
          }

          message.artworkDesc = reader.string();
          continue;
        case 24:
          if (tag !== 192) {
            break;
          }

          message.isReadyForMint = reader.bool();
          continue;
        case 25:
          if (tag !== 200) {
            break;
          }

          message.expectedSupply = reader.uint32();
          continue;
        case 26:
          if (tag !== 208) {
            break;
          }

          message.expectedPublicMintPrice = longToNumber(reader.uint64() as Long);
          continue;
        case 27:
          if (tag !== 216) {
            break;
          }

          message.expectedMintDate = longToNumber(reader.uint64() as Long);
          continue;
        case 28:
          if (tag !== 224) {
            break;
          }

          message.escrowMintProceedsPeriod = longToNumber(reader.uint64() as Long);
          continue;
        case 29:
          if (tag !== 232) {
            break;
          }

          message.isDox = reader.bool();
          continue;
        case 30:
          if (tag !== 240) {
            break;
          }

          message.daoWhitelistCount = reader.uint32();
          continue;
        case 31:
          if (tag !== 248) {
            break;
          }

          message.tokensCount = reader.uint32();
          continue;
        case 32:
          if (tag !== 256) {
            break;
          }

          message.unitPrice = longToNumber(reader.uint64() as Long);
          continue;
        case 33:
          if (tag !== 264) {
            break;
          }

          message.limitPerAddress = reader.uint32();
          continue;
        case 34:
          if (tag !== 272) {
            break;
          }

          message.startTime = longToNumber(reader.uint64() as Long);
          continue;
        case 35:
          if (tag !== 282) {
            break;
          }

          message.royaltyAddress = reader.string();
          continue;
        case 36:
          if (tag !== 288) {
            break;
          }

          message.royaltyPercentage = reader.uint32();
          continue;
        case 37:
          if (tag !== 298) {
            break;
          }

          message.baseTokenUri = reader.string();
          continue;
        case 38:
          if (tag !== 306) {
            break;
          }

          message.merkleRoot = reader.string();
          continue;
        case 39:
          if (tag !== 314) {
            break;
          }

          message.deployedAddress = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Collection {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      desc: isSet(object.desc) ? globalThis.String(object.desc) : "",
      symbol: isSet(object.symbol) ? globalThis.String(object.symbol) : "",
      coverImgUri: isSet(object.coverImgUri) ? globalThis.String(object.coverImgUri) : "",
      targetNetwork: isSet(object.targetNetwork) ? globalThis.String(object.targetNetwork) : "",
      externalLink: isSet(object.externalLink) ? globalThis.String(object.externalLink) : "",
      websiteLink: isSet(object.websiteLink) ? globalThis.String(object.websiteLink) : "",
      twitterProfile: isSet(object.twitterProfile) ? globalThis.String(object.twitterProfile) : "",
      twitterFollowersCount: isSet(object.twitterFollowersCount) ? globalThis.Number(object.twitterFollowersCount) : 0,
      contactDiscordName: isSet(object.contactDiscordName) ? globalThis.String(object.contactDiscordName) : "",
      contactEmail: isSet(object.contactEmail) ? globalThis.String(object.contactEmail) : "",
      isProjectDerivative: isSet(object.isProjectDerivative) ? globalThis.Boolean(object.isProjectDerivative) : false,
      projectType: isSet(object.projectType) ? globalThis.String(object.projectType) : "",
      projectDesc: isSet(object.projectDesc) ? globalThis.String(object.projectDesc) : "",
      isAppliedPreviously: isSet(object.isAppliedPreviously) ? globalThis.Boolean(object.isAppliedPreviously) : false,
      teamDesc: isSet(object.teamDesc) ? globalThis.String(object.teamDesc) : "",
      teamLink: isSet(object.teamLink) ? globalThis.String(object.teamLink) : "",
      partners: isSet(object.partners) ? globalThis.String(object.partners) : "",
      investmentDesc: isSet(object.investmentDesc) ? globalThis.String(object.investmentDesc) : "",
      investmentLink: isSet(object.investmentLink) ? globalThis.String(object.investmentLink) : "",
      whitepaperLink: isSet(object.whitepaperLink) ? globalThis.String(object.whitepaperLink) : "",
      roadmapLink: isSet(object.roadmapLink) ? globalThis.String(object.roadmapLink) : "",
      artworkDesc: isSet(object.artworkDesc) ? globalThis.String(object.artworkDesc) : "",
      isReadyForMint: isSet(object.isReadyForMint) ? globalThis.Boolean(object.isReadyForMint) : false,
      expectedSupply: isSet(object.expectedSupply) ? globalThis.Number(object.expectedSupply) : 0,
      expectedPublicMintPrice: isSet(object.expectedPublicMintPrice)
        ? globalThis.Number(object.expectedPublicMintPrice)
        : 0,
      expectedMintDate: isSet(object.expectedMintDate) ? globalThis.Number(object.expectedMintDate) : 0,
      escrowMintProceedsPeriod: isSet(object.escrowMintProceedsPeriod)
        ? globalThis.Number(object.escrowMintProceedsPeriod)
        : 0,
      isDox: isSet(object.isDox) ? globalThis.Boolean(object.isDox) : false,
      daoWhitelistCount: isSet(object.daoWhitelistCount) ? globalThis.Number(object.daoWhitelistCount) : 0,
      tokensCount: isSet(object.tokensCount) ? globalThis.Number(object.tokensCount) : 0,
      unitPrice: isSet(object.unitPrice) ? globalThis.Number(object.unitPrice) : 0,
      limitPerAddress: isSet(object.limitPerAddress) ? globalThis.Number(object.limitPerAddress) : 0,
      startTime: isSet(object.startTime) ? globalThis.Number(object.startTime) : 0,
      royaltyAddress: isSet(object.royaltyAddress) ? globalThis.String(object.royaltyAddress) : "",
      royaltyPercentage: isSet(object.royaltyPercentage) ? globalThis.Number(object.royaltyPercentage) : 0,
      baseTokenUri: isSet(object.baseTokenUri) ? globalThis.String(object.baseTokenUri) : "",
      merkleRoot: isSet(object.merkleRoot) ? globalThis.String(object.merkleRoot) : "",
      deployedAddress: isSet(object.deployedAddress) ? globalThis.String(object.deployedAddress) : "",
    };
  },

  toJSON(message: Collection): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.desc !== "") {
      obj.desc = message.desc;
    }
    if (message.symbol !== "") {
      obj.symbol = message.symbol;
    }
    if (message.coverImgUri !== "") {
      obj.coverImgUri = message.coverImgUri;
    }
    if (message.targetNetwork !== "") {
      obj.targetNetwork = message.targetNetwork;
    }
    if (message.externalLink !== "") {
      obj.externalLink = message.externalLink;
    }
    if (message.websiteLink !== "") {
      obj.websiteLink = message.websiteLink;
    }
    if (message.twitterProfile !== "") {
      obj.twitterProfile = message.twitterProfile;
    }
    if (message.twitterFollowersCount !== 0) {
      obj.twitterFollowersCount = Math.round(message.twitterFollowersCount);
    }
    if (message.contactDiscordName !== "") {
      obj.contactDiscordName = message.contactDiscordName;
    }
    if (message.contactEmail !== "") {
      obj.contactEmail = message.contactEmail;
    }
    if (message.isProjectDerivative === true) {
      obj.isProjectDerivative = message.isProjectDerivative;
    }
    if (message.projectType !== "") {
      obj.projectType = message.projectType;
    }
    if (message.projectDesc !== "") {
      obj.projectDesc = message.projectDesc;
    }
    if (message.isAppliedPreviously === true) {
      obj.isAppliedPreviously = message.isAppliedPreviously;
    }
    if (message.teamDesc !== "") {
      obj.teamDesc = message.teamDesc;
    }
    if (message.teamLink !== "") {
      obj.teamLink = message.teamLink;
    }
    if (message.partners !== "") {
      obj.partners = message.partners;
    }
    if (message.investmentDesc !== "") {
      obj.investmentDesc = message.investmentDesc;
    }
    if (message.investmentLink !== "") {
      obj.investmentLink = message.investmentLink;
    }
    if (message.whitepaperLink !== "") {
      obj.whitepaperLink = message.whitepaperLink;
    }
    if (message.roadmapLink !== "") {
      obj.roadmapLink = message.roadmapLink;
    }
    if (message.artworkDesc !== "") {
      obj.artworkDesc = message.artworkDesc;
    }
    if (message.isReadyForMint === true) {
      obj.isReadyForMint = message.isReadyForMint;
    }
    if (message.expectedSupply !== 0) {
      obj.expectedSupply = Math.round(message.expectedSupply);
    }
    if (message.expectedPublicMintPrice !== 0) {
      obj.expectedPublicMintPrice = Math.round(message.expectedPublicMintPrice);
    }
    if (message.expectedMintDate !== 0) {
      obj.expectedMintDate = Math.round(message.expectedMintDate);
    }
    if (message.escrowMintProceedsPeriod !== 0) {
      obj.escrowMintProceedsPeriod = Math.round(message.escrowMintProceedsPeriod);
    }
    if (message.isDox === true) {
      obj.isDox = message.isDox;
    }
    if (message.daoWhitelistCount !== 0) {
      obj.daoWhitelistCount = Math.round(message.daoWhitelistCount);
    }
    if (message.tokensCount !== 0) {
      obj.tokensCount = Math.round(message.tokensCount);
    }
    if (message.unitPrice !== 0) {
      obj.unitPrice = Math.round(message.unitPrice);
    }
    if (message.limitPerAddress !== 0) {
      obj.limitPerAddress = Math.round(message.limitPerAddress);
    }
    if (message.startTime !== 0) {
      obj.startTime = Math.round(message.startTime);
    }
    if (message.royaltyAddress !== "") {
      obj.royaltyAddress = message.royaltyAddress;
    }
    if (message.royaltyPercentage !== 0) {
      obj.royaltyPercentage = Math.round(message.royaltyPercentage);
    }
    if (message.baseTokenUri !== "") {
      obj.baseTokenUri = message.baseTokenUri;
    }
    if (message.merkleRoot !== "") {
      obj.merkleRoot = message.merkleRoot;
    }
    if (message.deployedAddress !== "") {
      obj.deployedAddress = message.deployedAddress;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Collection>, I>>(base?: I): Collection {
    return Collection.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Collection>, I>>(object: I): Collection {
    const message = createBaseCollection();
    message.name = object.name ?? "";
    message.desc = object.desc ?? "";
    message.symbol = object.symbol ?? "";
    message.coverImgUri = object.coverImgUri ?? "";
    message.targetNetwork = object.targetNetwork ?? "";
    message.externalLink = object.externalLink ?? "";
    message.websiteLink = object.websiteLink ?? "";
    message.twitterProfile = object.twitterProfile ?? "";
    message.twitterFollowersCount = object.twitterFollowersCount ?? 0;
    message.contactDiscordName = object.contactDiscordName ?? "";
    message.contactEmail = object.contactEmail ?? "";
    message.isProjectDerivative = object.isProjectDerivative ?? false;
    message.projectType = object.projectType ?? "";
    message.projectDesc = object.projectDesc ?? "";
    message.isAppliedPreviously = object.isAppliedPreviously ?? false;
    message.teamDesc = object.teamDesc ?? "";
    message.teamLink = object.teamLink ?? "";
    message.partners = object.partners ?? "";
    message.investmentDesc = object.investmentDesc ?? "";
    message.investmentLink = object.investmentLink ?? "";
    message.whitepaperLink = object.whitepaperLink ?? "";
    message.roadmapLink = object.roadmapLink ?? "";
    message.artworkDesc = object.artworkDesc ?? "";
    message.isReadyForMint = object.isReadyForMint ?? false;
    message.expectedSupply = object.expectedSupply ?? 0;
    message.expectedPublicMintPrice = object.expectedPublicMintPrice ?? 0;
    message.expectedMintDate = object.expectedMintDate ?? 0;
    message.escrowMintProceedsPeriod = object.escrowMintProceedsPeriod ?? 0;
    message.isDox = object.isDox ?? false;
    message.daoWhitelistCount = object.daoWhitelistCount ?? 0;
    message.tokensCount = object.tokensCount ?? 0;
    message.unitPrice = object.unitPrice ?? 0;
    message.limitPerAddress = object.limitPerAddress ?? 0;
    message.startTime = object.startTime ?? 0;
    message.royaltyAddress = object.royaltyAddress ?? "";
    message.royaltyPercentage = object.royaltyPercentage ?? 0;
    message.baseTokenUri = object.baseTokenUri ?? "";
    message.merkleRoot = object.merkleRoot ?? "";
    message.deployedAddress = object.deployedAddress ?? "";
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
