/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import { share } from "rxjs/operators";
import { Observable } from "rxjs";
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "marketplace.v1";

export interface NFT {
  imageUri: string;
  name: string;
  mintAddress: string;
  price: string;
}

export interface Collection {
  imageUri: string;
  collectionName: string;
  creatorName: string;
  verified: boolean;
  mintAddress: string;
}

export interface Activity {
  transactionKind: string;
  targetName: string;
  targetImageUri: string;
  contractName: string;
  time: string;
  amount: string;
  transactionId: string;
  buyer: string;
  seller: string;
}

export interface CollectionsRequest {
  kind: CollectionsRequest_Kind;
  limit: number;
  offset: number;
}

export enum CollectionsRequest_Kind {
  KIND_UNSPECIFIED = 0,
  KIND_BY_VOLUME = 1,
  KIND_BY_MARKETCAP = 2,
  KIND_FAKE = 3,
  KIND_UPCOMING = 4,
  UNRECOGNIZED = -1,
}

export function collectionsRequest_KindFromJSON(
  object: any
): CollectionsRequest_Kind {
  switch (object) {
    case 0:
    case "KIND_UNSPECIFIED":
      return CollectionsRequest_Kind.KIND_UNSPECIFIED;
    case 1:
    case "KIND_BY_VOLUME":
      return CollectionsRequest_Kind.KIND_BY_VOLUME;
    case 2:
    case "KIND_BY_MARKETCAP":
      return CollectionsRequest_Kind.KIND_BY_MARKETCAP;
    case 3:
    case "KIND_FAKE":
      return CollectionsRequest_Kind.KIND_FAKE;
    case 4:
    case "KIND_UPCOMING":
      return CollectionsRequest_Kind.KIND_UPCOMING;
    case -1:
    case "UNRECOGNIZED":
    default:
      return CollectionsRequest_Kind.UNRECOGNIZED;
  }
}

export function collectionsRequest_KindToJSON(
  object: CollectionsRequest_Kind
): string {
  switch (object) {
    case CollectionsRequest_Kind.KIND_UNSPECIFIED:
      return "KIND_UNSPECIFIED";
    case CollectionsRequest_Kind.KIND_BY_VOLUME:
      return "KIND_BY_VOLUME";
    case CollectionsRequest_Kind.KIND_BY_MARKETCAP:
      return "KIND_BY_MARKETCAP";
    case CollectionsRequest_Kind.KIND_FAKE:
      return "KIND_FAKE";
    case CollectionsRequest_Kind.KIND_UPCOMING:
      return "KIND_UPCOMING";
    case CollectionsRequest_Kind.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface CollectionsResponse {
  collection: Collection | undefined;
}

export interface CollectionNFTsRequest {
  mintAddress: string;
  limit: number;
  offset: number;
}

export interface CollectionNFTsResponse {
  nft: NFT | undefined;
}

export interface CollectionActivityRequest {
  mintAddress: string;
  limit: number;
  offset: number;
}

export interface CollectionActivityResponse {
  activity: Activity | undefined;
}

function createBaseNFT(): NFT {
  return { imageUri: "", name: "", mintAddress: "", price: "" };
}

export const NFT = {
  encode(message: NFT, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.imageUri !== "") {
      writer.uint32(10).string(message.imageUri);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.mintAddress !== "") {
      writer.uint32(26).string(message.mintAddress);
    }
    if (message.price !== "") {
      writer.uint32(34).string(message.price);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NFT {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNFT();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.imageUri = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.mintAddress = reader.string();
          break;
        case 4:
          message.price = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): NFT {
    return {
      imageUri: isSet(object.imageUri) ? String(object.imageUri) : "",
      name: isSet(object.name) ? String(object.name) : "",
      mintAddress: isSet(object.mintAddress) ? String(object.mintAddress) : "",
      price: isSet(object.price) ? String(object.price) : "",
    };
  },

  toJSON(message: NFT): unknown {
    const obj: any = {};
    message.imageUri !== undefined && (obj.imageUri = message.imageUri);
    message.name !== undefined && (obj.name = message.name);
    message.mintAddress !== undefined &&
      (obj.mintAddress = message.mintAddress);
    message.price !== undefined && (obj.price = message.price);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<NFT>, I>>(object: I): NFT {
    const message = createBaseNFT();
    message.imageUri = object.imageUri ?? "";
    message.name = object.name ?? "";
    message.mintAddress = object.mintAddress ?? "";
    message.price = object.price ?? "";
    return message;
  },
};

function createBaseCollection(): Collection {
  return {
    imageUri: "",
    collectionName: "",
    creatorName: "",
    verified: false,
    mintAddress: "",
  };
}

export const Collection = {
  encode(
    message: Collection,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.imageUri !== "") {
      writer.uint32(18).string(message.imageUri);
    }
    if (message.collectionName !== "") {
      writer.uint32(26).string(message.collectionName);
    }
    if (message.creatorName !== "") {
      writer.uint32(34).string(message.creatorName);
    }
    if (message.verified === true) {
      writer.uint32(40).bool(message.verified);
    }
    if (message.mintAddress !== "") {
      writer.uint32(50).string(message.mintAddress);
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
        case 2:
          message.imageUri = reader.string();
          break;
        case 3:
          message.collectionName = reader.string();
          break;
        case 4:
          message.creatorName = reader.string();
          break;
        case 5:
          message.verified = reader.bool();
          break;
        case 6:
          message.mintAddress = reader.string();
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
      mintAddress: isSet(object.mintAddress) ? String(object.mintAddress) : "",
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
    message.mintAddress !== undefined &&
      (obj.mintAddress = message.mintAddress);
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
    message.mintAddress = object.mintAddress ?? "";
    return message;
  },
};

function createBaseActivity(): Activity {
  return {
    transactionKind: "",
    targetName: "",
    targetImageUri: "",
    contractName: "",
    time: "",
    amount: "",
    transactionId: "",
    buyer: "",
    seller: "",
  };
}

export const Activity = {
  encode(
    message: Activity,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.transactionKind !== "") {
      writer.uint32(10).string(message.transactionKind);
    }
    if (message.targetName !== "") {
      writer.uint32(18).string(message.targetName);
    }
    if (message.targetImageUri !== "") {
      writer.uint32(26).string(message.targetImageUri);
    }
    if (message.contractName !== "") {
      writer.uint32(34).string(message.contractName);
    }
    if (message.time !== "") {
      writer.uint32(42).string(message.time);
    }
    if (message.amount !== "") {
      writer.uint32(50).string(message.amount);
    }
    if (message.transactionId !== "") {
      writer.uint32(58).string(message.transactionId);
    }
    if (message.buyer !== "") {
      writer.uint32(66).string(message.buyer);
    }
    if (message.seller !== "") {
      writer.uint32(74).string(message.seller);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Activity {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseActivity();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.transactionKind = reader.string();
          break;
        case 2:
          message.targetName = reader.string();
          break;
        case 3:
          message.targetImageUri = reader.string();
          break;
        case 4:
          message.contractName = reader.string();
          break;
        case 5:
          message.time = reader.string();
          break;
        case 6:
          message.amount = reader.string();
          break;
        case 7:
          message.transactionId = reader.string();
          break;
        case 8:
          message.buyer = reader.string();
          break;
        case 9:
          message.seller = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Activity {
    return {
      transactionKind: isSet(object.transactionKind)
        ? String(object.transactionKind)
        : "",
      targetName: isSet(object.targetName) ? String(object.targetName) : "",
      targetImageUri: isSet(object.targetImageUri)
        ? String(object.targetImageUri)
        : "",
      contractName: isSet(object.contractName)
        ? String(object.contractName)
        : "",
      time: isSet(object.time) ? String(object.time) : "",
      amount: isSet(object.amount) ? String(object.amount) : "",
      transactionId: isSet(object.transactionId)
        ? String(object.transactionId)
        : "",
      buyer: isSet(object.buyer) ? String(object.buyer) : "",
      seller: isSet(object.seller) ? String(object.seller) : "",
    };
  },

  toJSON(message: Activity): unknown {
    const obj: any = {};
    message.transactionKind !== undefined &&
      (obj.transactionKind = message.transactionKind);
    message.targetName !== undefined && (obj.targetName = message.targetName);
    message.targetImageUri !== undefined &&
      (obj.targetImageUri = message.targetImageUri);
    message.contractName !== undefined &&
      (obj.contractName = message.contractName);
    message.time !== undefined && (obj.time = message.time);
    message.amount !== undefined && (obj.amount = message.amount);
    message.transactionId !== undefined &&
      (obj.transactionId = message.transactionId);
    message.buyer !== undefined && (obj.buyer = message.buyer);
    message.seller !== undefined && (obj.seller = message.seller);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Activity>, I>>(object: I): Activity {
    const message = createBaseActivity();
    message.transactionKind = object.transactionKind ?? "";
    message.targetName = object.targetName ?? "";
    message.targetImageUri = object.targetImageUri ?? "";
    message.contractName = object.contractName ?? "";
    message.time = object.time ?? "";
    message.amount = object.amount ?? "";
    message.transactionId = object.transactionId ?? "";
    message.buyer = object.buyer ?? "";
    message.seller = object.seller ?? "";
    return message;
  },
};

function createBaseCollectionsRequest(): CollectionsRequest {
  return { kind: 0, limit: 0, offset: 0 };
}

export const CollectionsRequest = {
  encode(
    message: CollectionsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.kind !== 0) {
      writer.uint32(8).int32(message.kind);
    }
    if (message.limit !== 0) {
      writer.uint32(16).int32(message.limit);
    }
    if (message.offset !== 0) {
      writer.uint32(24).int32(message.offset);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CollectionsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCollectionsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.kind = reader.int32() as any;
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

  fromJSON(object: any): CollectionsRequest {
    return {
      kind: isSet(object.kind)
        ? collectionsRequest_KindFromJSON(object.kind)
        : 0,
      limit: isSet(object.limit) ? Number(object.limit) : 0,
      offset: isSet(object.offset) ? Number(object.offset) : 0,
    };
  },

  toJSON(message: CollectionsRequest): unknown {
    const obj: any = {};
    message.kind !== undefined &&
      (obj.kind = collectionsRequest_KindToJSON(message.kind));
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.offset !== undefined && (obj.offset = Math.round(message.offset));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CollectionsRequest>, I>>(
    object: I
  ): CollectionsRequest {
    const message = createBaseCollectionsRequest();
    message.kind = object.kind ?? 0;
    message.limit = object.limit ?? 0;
    message.offset = object.offset ?? 0;
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

function createBaseCollectionNFTsRequest(): CollectionNFTsRequest {
  return { mintAddress: "", limit: 0, offset: 0 };
}

export const CollectionNFTsRequest = {
  encode(
    message: CollectionNFTsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.mintAddress !== "") {
      writer.uint32(10).string(message.mintAddress);
    }
    if (message.limit !== 0) {
      writer.uint32(16).int32(message.limit);
    }
    if (message.offset !== 0) {
      writer.uint32(24).int32(message.offset);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): CollectionNFTsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCollectionNFTsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.mintAddress = reader.string();
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

  fromJSON(object: any): CollectionNFTsRequest {
    return {
      mintAddress: isSet(object.mintAddress) ? String(object.mintAddress) : "",
      limit: isSet(object.limit) ? Number(object.limit) : 0,
      offset: isSet(object.offset) ? Number(object.offset) : 0,
    };
  },

  toJSON(message: CollectionNFTsRequest): unknown {
    const obj: any = {};
    message.mintAddress !== undefined &&
      (obj.mintAddress = message.mintAddress);
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.offset !== undefined && (obj.offset = Math.round(message.offset));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CollectionNFTsRequest>, I>>(
    object: I
  ): CollectionNFTsRequest {
    const message = createBaseCollectionNFTsRequest();
    message.mintAddress = object.mintAddress ?? "";
    message.limit = object.limit ?? 0;
    message.offset = object.offset ?? 0;
    return message;
  },
};

function createBaseCollectionNFTsResponse(): CollectionNFTsResponse {
  return { nft: undefined };
}

export const CollectionNFTsResponse = {
  encode(
    message: CollectionNFTsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.nft !== undefined) {
      NFT.encode(message.nft, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): CollectionNFTsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCollectionNFTsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.nft = NFT.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CollectionNFTsResponse {
    return {
      nft: isSet(object.nft) ? NFT.fromJSON(object.nft) : undefined,
    };
  },

  toJSON(message: CollectionNFTsResponse): unknown {
    const obj: any = {};
    message.nft !== undefined &&
      (obj.nft = message.nft ? NFT.toJSON(message.nft) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CollectionNFTsResponse>, I>>(
    object: I
  ): CollectionNFTsResponse {
    const message = createBaseCollectionNFTsResponse();
    message.nft =
      object.nft !== undefined && object.nft !== null
        ? NFT.fromPartial(object.nft)
        : undefined;
    return message;
  },
};

function createBaseCollectionActivityRequest(): CollectionActivityRequest {
  return { mintAddress: "", limit: 0, offset: 0 };
}

export const CollectionActivityRequest = {
  encode(
    message: CollectionActivityRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.mintAddress !== "") {
      writer.uint32(10).string(message.mintAddress);
    }
    if (message.limit !== 0) {
      writer.uint32(16).int32(message.limit);
    }
    if (message.offset !== 0) {
      writer.uint32(24).int32(message.offset);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): CollectionActivityRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCollectionActivityRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.mintAddress = reader.string();
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

  fromJSON(object: any): CollectionActivityRequest {
    return {
      mintAddress: isSet(object.mintAddress) ? String(object.mintAddress) : "",
      limit: isSet(object.limit) ? Number(object.limit) : 0,
      offset: isSet(object.offset) ? Number(object.offset) : 0,
    };
  },

  toJSON(message: CollectionActivityRequest): unknown {
    const obj: any = {};
    message.mintAddress !== undefined &&
      (obj.mintAddress = message.mintAddress);
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.offset !== undefined && (obj.offset = Math.round(message.offset));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CollectionActivityRequest>, I>>(
    object: I
  ): CollectionActivityRequest {
    const message = createBaseCollectionActivityRequest();
    message.mintAddress = object.mintAddress ?? "";
    message.limit = object.limit ?? 0;
    message.offset = object.offset ?? 0;
    return message;
  },
};

function createBaseCollectionActivityResponse(): CollectionActivityResponse {
  return { activity: undefined };
}

export const CollectionActivityResponse = {
  encode(
    message: CollectionActivityResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.activity !== undefined) {
      Activity.encode(message.activity, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): CollectionActivityResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCollectionActivityResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.activity = Activity.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CollectionActivityResponse {
    return {
      activity: isSet(object.activity)
        ? Activity.fromJSON(object.activity)
        : undefined,
    };
  },

  toJSON(message: CollectionActivityResponse): unknown {
    const obj: any = {};
    message.activity !== undefined &&
      (obj.activity = message.activity
        ? Activity.toJSON(message.activity)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CollectionActivityResponse>, I>>(
    object: I
  ): CollectionActivityResponse {
    const message = createBaseCollectionActivityResponse();
    message.activity =
      object.activity !== undefined && object.activity !== null
        ? Activity.fromPartial(object.activity)
        : undefined;
    return message;
  },
};

export interface MarketplaceService {
  Collections(
    request: DeepPartial<CollectionsRequest>,
    metadata?: grpc.Metadata
  ): Observable<CollectionsResponse>;
  CollectionNFTs(
    request: DeepPartial<CollectionNFTsRequest>,
    metadata?: grpc.Metadata
  ): Observable<CollectionNFTsResponse>;
  CollectionActivity(
    request: DeepPartial<CollectionActivityRequest>,
    metadata?: grpc.Metadata
  ): Observable<CollectionActivityResponse>;
}

export class MarketplaceServiceClientImpl implements MarketplaceService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Collections = this.Collections.bind(this);
    this.CollectionNFTs = this.CollectionNFTs.bind(this);
    this.CollectionActivity = this.CollectionActivity.bind(this);
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

  CollectionNFTs(
    request: DeepPartial<CollectionNFTsRequest>,
    metadata?: grpc.Metadata
  ): Observable<CollectionNFTsResponse> {
    return this.rpc.invoke(
      MarketplaceServiceCollectionNFTsDesc,
      CollectionNFTsRequest.fromPartial(request),
      metadata
    );
  }

  CollectionActivity(
    request: DeepPartial<CollectionActivityRequest>,
    metadata?: grpc.Metadata
  ): Observable<CollectionActivityResponse> {
    return this.rpc.invoke(
      MarketplaceServiceCollectionActivityDesc,
      CollectionActivityRequest.fromPartial(request),
      metadata
    );
  }
}

export const MarketplaceServiceDesc = {
  serviceName: "marketplace.v1.MarketplaceService",
};

export const MarketplaceServiceCollectionsDesc: UnaryMethodDefinitionish = {
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

export const MarketplaceServiceCollectionNFTsDesc: UnaryMethodDefinitionish = {
  methodName: "CollectionNFTs",
  service: MarketplaceServiceDesc,
  requestStream: false,
  responseStream: true,
  requestType: {
    serializeBinary() {
      return CollectionNFTsRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...CollectionNFTsResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const MarketplaceServiceCollectionActivityDesc: UnaryMethodDefinitionish =
  {
    methodName: "CollectionActivity",
    service: MarketplaceServiceDesc,
    requestStream: false,
    responseStream: true,
    requestType: {
      serializeBinary() {
        return CollectionActivityRequest.encode(this).finish();
      },
    } as any,
    responseType: {
      deserializeBinary(data: Uint8Array) {
        return {
          ...CollectionActivityResponse.decode(data),
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
            const err = new GrpcWebError(
              response.statusMessage,
              response.status,
              response.trailers
            );
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
    const DEFAULT_TIMEOUT_TIME: number = 3_000;
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
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & {
      [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
    };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export class GrpcWebError extends Error {
  constructor(
    message: string,
    public code: grpc.Code,
    public metadata: grpc.Metadata
  ) {
    super(message);
  }
}
