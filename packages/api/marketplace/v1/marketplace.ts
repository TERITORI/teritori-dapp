/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";
import { share } from "rxjs/operators";

export const protobufPackage = "marketplace.v1";

export enum Network {
  NETWORK_UNSPECIFIED = 0,
  NETWORK_FAKE = 1,
  NETWORK_TERITORI = 2,
  NETWORK_SOLANA = 3,
  UNRECOGNIZED = -1,
}

export function networkFromJSON(object: any): Network {
  switch (object) {
    case 0:
    case "NETWORK_UNSPECIFIED":
      return Network.NETWORK_UNSPECIFIED;
    case 1:
    case "NETWORK_FAKE":
      return Network.NETWORK_FAKE;
    case 2:
    case "NETWORK_TERITORI":
      return Network.NETWORK_TERITORI;
    case 3:
    case "NETWORK_SOLANA":
      return Network.NETWORK_SOLANA;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Network.UNRECOGNIZED;
  }
}

export function networkToJSON(object: Network): string {
  switch (object) {
    case Network.NETWORK_UNSPECIFIED:
      return "NETWORK_UNSPECIFIED";
    case Network.NETWORK_FAKE:
      return "NETWORK_FAKE";
    case Network.NETWORK_TERITORI:
      return "NETWORK_TERITORI";
    case Network.NETWORK_SOLANA:
      return "NETWORK_SOLANA";
    case Network.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface NFT {
  id: string;
  network: Network;
  imageUri: string;
  name: string;
  mintAddress: string;
  price: string;
  denom: string;
  isListed: boolean;
  textInsert: string;
  collectionName: string;
  ownerId: string;
}

export interface Collection {
  id: string;
  imageUri: string;
  collectionName: string;
  creatorName: string;
  verified: boolean;
  mintAddress: string;
  network: Network;
  volume: string;
  volumeDenom: string;
}

export interface Activity {
  id: string;
  transactionKind: string;
  targetName: string;
  targetImageUri: string;
  contractName: string;
  time: string;
  amount: string;
  denom: string;
  transactionId: string;
  buyerId: string;
  sellerId: string;
}

export interface Quest {
  id: string;
  title: string;
  completed: boolean;
}

export interface PriceDatum {
  price: string;
  time: string;
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
  KIND_TERITORI_FEATURES = 5,
  UNRECOGNIZED = -1,
}

export function collectionsRequest_KindFromJSON(object: any): CollectionsRequest_Kind {
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
    case 5:
    case "KIND_TERITORI_FEATURES":
      return CollectionsRequest_Kind.KIND_TERITORI_FEATURES;
    case -1:
    case "UNRECOGNIZED":
    default:
      return CollectionsRequest_Kind.UNRECOGNIZED;
  }
}

export function collectionsRequest_KindToJSON(object: CollectionsRequest_Kind): string {
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
    case CollectionsRequest_Kind.KIND_TERITORI_FEATURES:
      return "KIND_TERITORI_FEATURES";
    case CollectionsRequest_Kind.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface CollectionsResponse {
  collection: Collection | undefined;
}

export interface NFTsRequest {
  limit: number;
  offset: number;
  collectionId: string;
  ownerId: string;
}

export interface NFTsResponse {
  nft: NFT | undefined;
}

export interface QuestsRequest {
  limit: number;
  offset: number;
  userId: string;
}

export interface QuestsResponse {
  quest: Quest | undefined;
}

export interface ActivityRequest {
  collectionId: string;
  nftId: string;
  limit: number;
  offset: number;
}

export interface ActivityResponse {
  activity: Activity | undefined;
  total: number;
}

export interface NFTPriceHistoryRequest {
  id: string;
}

export interface NFTPriceHistoryResponse {
  data: PriceDatum[];
}

function createBaseNFT(): NFT {
  return {
    id: "",
    network: 0,
    imageUri: "",
    name: "",
    mintAddress: "",
    price: "",
    denom: "",
    isListed: false,
    textInsert: "",
    collectionName: "",
    ownerId: "",
  };
}

export const NFT = {
  encode(message: NFT, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.network !== 0) {
      writer.uint32(16).int32(message.network);
    }
    if (message.imageUri !== "") {
      writer.uint32(26).string(message.imageUri);
    }
    if (message.name !== "") {
      writer.uint32(34).string(message.name);
    }
    if (message.mintAddress !== "") {
      writer.uint32(42).string(message.mintAddress);
    }
    if (message.price !== "") {
      writer.uint32(50).string(message.price);
    }
    if (message.denom !== "") {
      writer.uint32(58).string(message.denom);
    }
    if (message.isListed === true) {
      writer.uint32(64).bool(message.isListed);
    }
    if (message.textInsert !== "") {
      writer.uint32(74).string(message.textInsert);
    }
    if (message.collectionName !== "") {
      writer.uint32(82).string(message.collectionName);
    }
    if (message.ownerId !== "") {
      writer.uint32(106).string(message.ownerId);
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
          message.id = reader.string();
          break;
        case 2:
          message.network = reader.int32() as any;
          break;
        case 3:
          message.imageUri = reader.string();
          break;
        case 4:
          message.name = reader.string();
          break;
        case 5:
          message.mintAddress = reader.string();
          break;
        case 6:
          message.price = reader.string();
          break;
        case 7:
          message.denom = reader.string();
          break;
        case 8:
          message.isListed = reader.bool();
          break;
        case 9:
          message.textInsert = reader.string();
          break;
        case 10:
          message.collectionName = reader.string();
          break;
        case 13:
          message.ownerId = reader.string();
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
      id: isSet(object.id) ? String(object.id) : "",
      network: isSet(object.network) ? networkFromJSON(object.network) : 0,
      imageUri: isSet(object.imageUri) ? String(object.imageUri) : "",
      name: isSet(object.name) ? String(object.name) : "",
      mintAddress: isSet(object.mintAddress) ? String(object.mintAddress) : "",
      price: isSet(object.price) ? String(object.price) : "",
      denom: isSet(object.denom) ? String(object.denom) : "",
      isListed: isSet(object.isListed) ? Boolean(object.isListed) : false,
      textInsert: isSet(object.textInsert) ? String(object.textInsert) : "",
      collectionName: isSet(object.collectionName) ? String(object.collectionName) : "",
      ownerId: isSet(object.ownerId) ? String(object.ownerId) : "",
    };
  },

  toJSON(message: NFT): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.network !== undefined && (obj.network = networkToJSON(message.network));
    message.imageUri !== undefined && (obj.imageUri = message.imageUri);
    message.name !== undefined && (obj.name = message.name);
    message.mintAddress !== undefined && (obj.mintAddress = message.mintAddress);
    message.price !== undefined && (obj.price = message.price);
    message.denom !== undefined && (obj.denom = message.denom);
    message.isListed !== undefined && (obj.isListed = message.isListed);
    message.textInsert !== undefined && (obj.textInsert = message.textInsert);
    message.collectionName !== undefined && (obj.collectionName = message.collectionName);
    message.ownerId !== undefined && (obj.ownerId = message.ownerId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<NFT>, I>>(object: I): NFT {
    const message = createBaseNFT();
    message.id = object.id ?? "";
    message.network = object.network ?? 0;
    message.imageUri = object.imageUri ?? "";
    message.name = object.name ?? "";
    message.mintAddress = object.mintAddress ?? "";
    message.price = object.price ?? "";
    message.denom = object.denom ?? "";
    message.isListed = object.isListed ?? false;
    message.textInsert = object.textInsert ?? "";
    message.collectionName = object.collectionName ?? "";
    message.ownerId = object.ownerId ?? "";
    return message;
  },
};

function createBaseCollection(): Collection {
  return {
    id: "",
    imageUri: "",
    collectionName: "",
    creatorName: "",
    verified: false,
    mintAddress: "",
    network: 0,
    volume: "",
    volumeDenom: "",
  };
}

export const Collection = {
  encode(message: Collection, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
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
    if (message.network !== 0) {
      writer.uint32(56).int32(message.network);
    }
    if (message.volume !== "") {
      writer.uint32(66).string(message.volume);
    }
    if (message.volumeDenom !== "") {
      writer.uint32(74).string(message.volumeDenom);
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
          message.id = reader.string();
          break;
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
        case 7:
          message.network = reader.int32() as any;
          break;
        case 8:
          message.volume = reader.string();
          break;
        case 9:
          message.volumeDenom = reader.string();
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
      id: isSet(object.id) ? String(object.id) : "",
      imageUri: isSet(object.imageUri) ? String(object.imageUri) : "",
      collectionName: isSet(object.collectionName) ? String(object.collectionName) : "",
      creatorName: isSet(object.creatorName) ? String(object.creatorName) : "",
      verified: isSet(object.verified) ? Boolean(object.verified) : false,
      mintAddress: isSet(object.mintAddress) ? String(object.mintAddress) : "",
      network: isSet(object.network) ? networkFromJSON(object.network) : 0,
      volume: isSet(object.volume) ? String(object.volume) : "",
      volumeDenom: isSet(object.volumeDenom) ? String(object.volumeDenom) : "",
    };
  },

  toJSON(message: Collection): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.imageUri !== undefined && (obj.imageUri = message.imageUri);
    message.collectionName !== undefined && (obj.collectionName = message.collectionName);
    message.creatorName !== undefined && (obj.creatorName = message.creatorName);
    message.verified !== undefined && (obj.verified = message.verified);
    message.mintAddress !== undefined && (obj.mintAddress = message.mintAddress);
    message.network !== undefined && (obj.network = networkToJSON(message.network));
    message.volume !== undefined && (obj.volume = message.volume);
    message.volumeDenom !== undefined && (obj.volumeDenom = message.volumeDenom);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Collection>, I>>(object: I): Collection {
    const message = createBaseCollection();
    message.id = object.id ?? "";
    message.imageUri = object.imageUri ?? "";
    message.collectionName = object.collectionName ?? "";
    message.creatorName = object.creatorName ?? "";
    message.verified = object.verified ?? false;
    message.mintAddress = object.mintAddress ?? "";
    message.network = object.network ?? 0;
    message.volume = object.volume ?? "";
    message.volumeDenom = object.volumeDenom ?? "";
    return message;
  },
};

function createBaseActivity(): Activity {
  return {
    id: "",
    transactionKind: "",
    targetName: "",
    targetImageUri: "",
    contractName: "",
    time: "",
    amount: "",
    denom: "",
    transactionId: "",
    buyerId: "",
    sellerId: "",
  };
}

export const Activity = {
  encode(message: Activity, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.transactionKind !== "") {
      writer.uint32(18).string(message.transactionKind);
    }
    if (message.targetName !== "") {
      writer.uint32(26).string(message.targetName);
    }
    if (message.targetImageUri !== "") {
      writer.uint32(34).string(message.targetImageUri);
    }
    if (message.contractName !== "") {
      writer.uint32(42).string(message.contractName);
    }
    if (message.time !== "") {
      writer.uint32(50).string(message.time);
    }
    if (message.amount !== "") {
      writer.uint32(58).string(message.amount);
    }
    if (message.denom !== "") {
      writer.uint32(66).string(message.denom);
    }
    if (message.transactionId !== "") {
      writer.uint32(74).string(message.transactionId);
    }
    if (message.buyerId !== "") {
      writer.uint32(82).string(message.buyerId);
    }
    if (message.sellerId !== "") {
      writer.uint32(90).string(message.sellerId);
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
          message.id = reader.string();
          break;
        case 2:
          message.transactionKind = reader.string();
          break;
        case 3:
          message.targetName = reader.string();
          break;
        case 4:
          message.targetImageUri = reader.string();
          break;
        case 5:
          message.contractName = reader.string();
          break;
        case 6:
          message.time = reader.string();
          break;
        case 7:
          message.amount = reader.string();
          break;
        case 8:
          message.denom = reader.string();
          break;
        case 9:
          message.transactionId = reader.string();
          break;
        case 10:
          message.buyerId = reader.string();
          break;
        case 11:
          message.sellerId = reader.string();
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
      id: isSet(object.id) ? String(object.id) : "",
      transactionKind: isSet(object.transactionKind) ? String(object.transactionKind) : "",
      targetName: isSet(object.targetName) ? String(object.targetName) : "",
      targetImageUri: isSet(object.targetImageUri) ? String(object.targetImageUri) : "",
      contractName: isSet(object.contractName) ? String(object.contractName) : "",
      time: isSet(object.time) ? String(object.time) : "",
      amount: isSet(object.amount) ? String(object.amount) : "",
      denom: isSet(object.denom) ? String(object.denom) : "",
      transactionId: isSet(object.transactionId) ? String(object.transactionId) : "",
      buyerId: isSet(object.buyerId) ? String(object.buyerId) : "",
      sellerId: isSet(object.sellerId) ? String(object.sellerId) : "",
    };
  },

  toJSON(message: Activity): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.transactionKind !== undefined && (obj.transactionKind = message.transactionKind);
    message.targetName !== undefined && (obj.targetName = message.targetName);
    message.targetImageUri !== undefined && (obj.targetImageUri = message.targetImageUri);
    message.contractName !== undefined && (obj.contractName = message.contractName);
    message.time !== undefined && (obj.time = message.time);
    message.amount !== undefined && (obj.amount = message.amount);
    message.denom !== undefined && (obj.denom = message.denom);
    message.transactionId !== undefined && (obj.transactionId = message.transactionId);
    message.buyerId !== undefined && (obj.buyerId = message.buyerId);
    message.sellerId !== undefined && (obj.sellerId = message.sellerId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Activity>, I>>(object: I): Activity {
    const message = createBaseActivity();
    message.id = object.id ?? "";
    message.transactionKind = object.transactionKind ?? "";
    message.targetName = object.targetName ?? "";
    message.targetImageUri = object.targetImageUri ?? "";
    message.contractName = object.contractName ?? "";
    message.time = object.time ?? "";
    message.amount = object.amount ?? "";
    message.denom = object.denom ?? "";
    message.transactionId = object.transactionId ?? "";
    message.buyerId = object.buyerId ?? "";
    message.sellerId = object.sellerId ?? "";
    return message;
  },
};

function createBaseQuest(): Quest {
  return { id: "", title: "", completed: false };
}

export const Quest = {
  encode(message: Quest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.title !== "") {
      writer.uint32(18).string(message.title);
    }
    if (message.completed === true) {
      writer.uint32(24).bool(message.completed);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Quest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQuest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.title = reader.string();
          break;
        case 3:
          message.completed = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Quest {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      title: isSet(object.title) ? String(object.title) : "",
      completed: isSet(object.completed) ? Boolean(object.completed) : false,
    };
  },

  toJSON(message: Quest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.title !== undefined && (obj.title = message.title);
    message.completed !== undefined && (obj.completed = message.completed);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Quest>, I>>(object: I): Quest {
    const message = createBaseQuest();
    message.id = object.id ?? "";
    message.title = object.title ?? "";
    message.completed = object.completed ?? false;
    return message;
  },
};

function createBasePriceDatum(): PriceDatum {
  return { price: "", time: "" };
}

export const PriceDatum = {
  encode(message: PriceDatum, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.price !== "") {
      writer.uint32(10).string(message.price);
    }
    if (message.time !== "") {
      writer.uint32(18).string(message.time);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PriceDatum {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePriceDatum();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.price = reader.string();
          break;
        case 2:
          message.time = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PriceDatum {
    return {
      price: isSet(object.price) ? String(object.price) : "",
      time: isSet(object.time) ? String(object.time) : "",
    };
  },

  toJSON(message: PriceDatum): unknown {
    const obj: any = {};
    message.price !== undefined && (obj.price = message.price);
    message.time !== undefined && (obj.time = message.time);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PriceDatum>, I>>(object: I): PriceDatum {
    const message = createBasePriceDatum();
    message.price = object.price ?? "";
    message.time = object.time ?? "";
    return message;
  },
};

function createBaseCollectionsRequest(): CollectionsRequest {
  return { kind: 0, limit: 0, offset: 0 };
}

export const CollectionsRequest = {
  encode(message: CollectionsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
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
      kind: isSet(object.kind) ? collectionsRequest_KindFromJSON(object.kind) : 0,
      limit: isSet(object.limit) ? Number(object.limit) : 0,
      offset: isSet(object.offset) ? Number(object.offset) : 0,
    };
  },

  toJSON(message: CollectionsRequest): unknown {
    const obj: any = {};
    message.kind !== undefined && (obj.kind = collectionsRequest_KindToJSON(message.kind));
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.offset !== undefined && (obj.offset = Math.round(message.offset));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CollectionsRequest>, I>>(object: I): CollectionsRequest {
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
  encode(message: CollectionsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
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
    return { collection: isSet(object.collection) ? Collection.fromJSON(object.collection) : undefined };
  },

  toJSON(message: CollectionsResponse): unknown {
    const obj: any = {};
    message.collection !== undefined &&
      (obj.collection = message.collection ? Collection.toJSON(message.collection) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CollectionsResponse>, I>>(object: I): CollectionsResponse {
    const message = createBaseCollectionsResponse();
    message.collection = (object.collection !== undefined && object.collection !== null)
      ? Collection.fromPartial(object.collection)
      : undefined;
    return message;
  },
};

function createBaseNFTsRequest(): NFTsRequest {
  return { limit: 0, offset: 0, collectionId: "", ownerId: "" };
}

export const NFTsRequest = {
  encode(message: NFTsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.limit !== 0) {
      writer.uint32(8).int32(message.limit);
    }
    if (message.offset !== 0) {
      writer.uint32(16).int32(message.offset);
    }
    if (message.collectionId !== "") {
      writer.uint32(26).string(message.collectionId);
    }
    if (message.ownerId !== "") {
      writer.uint32(34).string(message.ownerId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NFTsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNFTsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.limit = reader.int32();
          break;
        case 2:
          message.offset = reader.int32();
          break;
        case 3:
          message.collectionId = reader.string();
          break;
        case 4:
          message.ownerId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): NFTsRequest {
    return {
      limit: isSet(object.limit) ? Number(object.limit) : 0,
      offset: isSet(object.offset) ? Number(object.offset) : 0,
      collectionId: isSet(object.collectionId) ? String(object.collectionId) : "",
      ownerId: isSet(object.ownerId) ? String(object.ownerId) : "",
    };
  },

  toJSON(message: NFTsRequest): unknown {
    const obj: any = {};
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.offset !== undefined && (obj.offset = Math.round(message.offset));
    message.collectionId !== undefined && (obj.collectionId = message.collectionId);
    message.ownerId !== undefined && (obj.ownerId = message.ownerId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<NFTsRequest>, I>>(object: I): NFTsRequest {
    const message = createBaseNFTsRequest();
    message.limit = object.limit ?? 0;
    message.offset = object.offset ?? 0;
    message.collectionId = object.collectionId ?? "";
    message.ownerId = object.ownerId ?? "";
    return message;
  },
};

function createBaseNFTsResponse(): NFTsResponse {
  return { nft: undefined };
}

export const NFTsResponse = {
  encode(message: NFTsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.nft !== undefined) {
      NFT.encode(message.nft, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NFTsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNFTsResponse();
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

  fromJSON(object: any): NFTsResponse {
    return { nft: isSet(object.nft) ? NFT.fromJSON(object.nft) : undefined };
  },

  toJSON(message: NFTsResponse): unknown {
    const obj: any = {};
    message.nft !== undefined && (obj.nft = message.nft ? NFT.toJSON(message.nft) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<NFTsResponse>, I>>(object: I): NFTsResponse {
    const message = createBaseNFTsResponse();
    message.nft = (object.nft !== undefined && object.nft !== null) ? NFT.fromPartial(object.nft) : undefined;
    return message;
  },
};

function createBaseQuestsRequest(): QuestsRequest {
  return { limit: 0, offset: 0, userId: "" };
}

export const QuestsRequest = {
  encode(message: QuestsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.limit !== 0) {
      writer.uint32(8).int32(message.limit);
    }
    if (message.offset !== 0) {
      writer.uint32(16).int32(message.offset);
    }
    if (message.userId !== "") {
      writer.uint32(26).string(message.userId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QuestsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQuestsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.limit = reader.int32();
          break;
        case 2:
          message.offset = reader.int32();
          break;
        case 3:
          message.userId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QuestsRequest {
    return {
      limit: isSet(object.limit) ? Number(object.limit) : 0,
      offset: isSet(object.offset) ? Number(object.offset) : 0,
      userId: isSet(object.userId) ? String(object.userId) : "",
    };
  },

  toJSON(message: QuestsRequest): unknown {
    const obj: any = {};
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.offset !== undefined && (obj.offset = Math.round(message.offset));
    message.userId !== undefined && (obj.userId = message.userId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QuestsRequest>, I>>(object: I): QuestsRequest {
    const message = createBaseQuestsRequest();
    message.limit = object.limit ?? 0;
    message.offset = object.offset ?? 0;
    message.userId = object.userId ?? "";
    return message;
  },
};

function createBaseQuestsResponse(): QuestsResponse {
  return { quest: undefined };
}

export const QuestsResponse = {
  encode(message: QuestsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.quest !== undefined) {
      Quest.encode(message.quest, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QuestsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQuestsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.quest = Quest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QuestsResponse {
    return { quest: isSet(object.quest) ? Quest.fromJSON(object.quest) : undefined };
  },

  toJSON(message: QuestsResponse): unknown {
    const obj: any = {};
    message.quest !== undefined && (obj.quest = message.quest ? Quest.toJSON(message.quest) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QuestsResponse>, I>>(object: I): QuestsResponse {
    const message = createBaseQuestsResponse();
    message.quest = (object.quest !== undefined && object.quest !== null) ? Quest.fromPartial(object.quest) : undefined;
    return message;
  },
};

function createBaseActivityRequest(): ActivityRequest {
  return { collectionId: "", nftId: "", limit: 0, offset: 0 };
}

export const ActivityRequest = {
  encode(message: ActivityRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.collectionId !== "") {
      writer.uint32(10).string(message.collectionId);
    }
    if (message.nftId !== "") {
      writer.uint32(18).string(message.nftId);
    }
    if (message.limit !== 0) {
      writer.uint32(24).int32(message.limit);
    }
    if (message.offset !== 0) {
      writer.uint32(32).int32(message.offset);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ActivityRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseActivityRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.collectionId = reader.string();
          break;
        case 2:
          message.nftId = reader.string();
          break;
        case 3:
          message.limit = reader.int32();
          break;
        case 4:
          message.offset = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ActivityRequest {
    return {
      collectionId: isSet(object.collectionId) ? String(object.collectionId) : "",
      nftId: isSet(object.nftId) ? String(object.nftId) : "",
      limit: isSet(object.limit) ? Number(object.limit) : 0,
      offset: isSet(object.offset) ? Number(object.offset) : 0,
    };
  },

  toJSON(message: ActivityRequest): unknown {
    const obj: any = {};
    message.collectionId !== undefined && (obj.collectionId = message.collectionId);
    message.nftId !== undefined && (obj.nftId = message.nftId);
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.offset !== undefined && (obj.offset = Math.round(message.offset));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ActivityRequest>, I>>(object: I): ActivityRequest {
    const message = createBaseActivityRequest();
    message.collectionId = object.collectionId ?? "";
    message.nftId = object.nftId ?? "";
    message.limit = object.limit ?? 0;
    message.offset = object.offset ?? 0;
    return message;
  },
};

function createBaseActivityResponse(): ActivityResponse {
  return { activity: undefined, total: 0 };
}

export const ActivityResponse = {
  encode(message: ActivityResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.activity !== undefined) {
      Activity.encode(message.activity, writer.uint32(10).fork()).ldelim();
    }
    if (message.total !== 0) {
      writer.uint32(16).int64(message.total);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ActivityResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseActivityResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.activity = Activity.decode(reader, reader.uint32());
          break;
        case 2:
          message.total = longToNumber(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ActivityResponse {
    return {
      activity: isSet(object.activity) ? Activity.fromJSON(object.activity) : undefined,
      total: isSet(object.total) ? Number(object.total) : 0,
    };
  },

  toJSON(message: ActivityResponse): unknown {
    const obj: any = {};
    message.activity !== undefined && (obj.activity = message.activity ? Activity.toJSON(message.activity) : undefined);
    message.total !== undefined && (obj.total = Math.round(message.total));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ActivityResponse>, I>>(object: I): ActivityResponse {
    const message = createBaseActivityResponse();
    message.activity = (object.activity !== undefined && object.activity !== null)
      ? Activity.fromPartial(object.activity)
      : undefined;
    message.total = object.total ?? 0;
    return message;
  },
};

function createBaseNFTPriceHistoryRequest(): NFTPriceHistoryRequest {
  return { id: "" };
}

export const NFTPriceHistoryRequest = {
  encode(message: NFTPriceHistoryRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NFTPriceHistoryRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNFTPriceHistoryRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): NFTPriceHistoryRequest {
    return { id: isSet(object.id) ? String(object.id) : "" };
  },

  toJSON(message: NFTPriceHistoryRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<NFTPriceHistoryRequest>, I>>(object: I): NFTPriceHistoryRequest {
    const message = createBaseNFTPriceHistoryRequest();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseNFTPriceHistoryResponse(): NFTPriceHistoryResponse {
  return { data: [] };
}

export const NFTPriceHistoryResponse = {
  encode(message: NFTPriceHistoryResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.data) {
      PriceDatum.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NFTPriceHistoryResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNFTPriceHistoryResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.data.push(PriceDatum.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): NFTPriceHistoryResponse {
    return { data: Array.isArray(object?.data) ? object.data.map((e: any) => PriceDatum.fromJSON(e)) : [] };
  },

  toJSON(message: NFTPriceHistoryResponse): unknown {
    const obj: any = {};
    if (message.data) {
      obj.data = message.data.map((e) => e ? PriceDatum.toJSON(e) : undefined);
    } else {
      obj.data = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<NFTPriceHistoryResponse>, I>>(object: I): NFTPriceHistoryResponse {
    const message = createBaseNFTPriceHistoryResponse();
    message.data = object.data?.map((e) => PriceDatum.fromPartial(e)) || [];
    return message;
  },
};

export interface MarketplaceService {
  Collections(request: DeepPartial<CollectionsRequest>, metadata?: grpc.Metadata): Observable<CollectionsResponse>;
  NFTs(request: DeepPartial<NFTsRequest>, metadata?: grpc.Metadata): Observable<NFTsResponse>;
  Quests(request: DeepPartial<QuestsRequest>, metadata?: grpc.Metadata): Observable<QuestsResponse>;
  Activity(request: DeepPartial<ActivityRequest>, metadata?: grpc.Metadata): Observable<ActivityResponse>;
  NFTPriceHistory(
    request: DeepPartial<NFTPriceHistoryRequest>,
    metadata?: grpc.Metadata,
  ): Promise<NFTPriceHistoryResponse>;
}

export class MarketplaceServiceClientImpl implements MarketplaceService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Collections = this.Collections.bind(this);
    this.NFTs = this.NFTs.bind(this);
    this.Quests = this.Quests.bind(this);
    this.Activity = this.Activity.bind(this);
    this.NFTPriceHistory = this.NFTPriceHistory.bind(this);
  }

  Collections(request: DeepPartial<CollectionsRequest>, metadata?: grpc.Metadata): Observable<CollectionsResponse> {
    return this.rpc.invoke(MarketplaceServiceCollectionsDesc, CollectionsRequest.fromPartial(request), metadata);
  }

  NFTs(request: DeepPartial<NFTsRequest>, metadata?: grpc.Metadata): Observable<NFTsResponse> {
    return this.rpc.invoke(MarketplaceServiceNFTsDesc, NFTsRequest.fromPartial(request), metadata);
  }

  Quests(request: DeepPartial<QuestsRequest>, metadata?: grpc.Metadata): Observable<QuestsResponse> {
    return this.rpc.invoke(MarketplaceServiceQuestsDesc, QuestsRequest.fromPartial(request), metadata);
  }

  Activity(request: DeepPartial<ActivityRequest>, metadata?: grpc.Metadata): Observable<ActivityResponse> {
    return this.rpc.invoke(MarketplaceServiceActivityDesc, ActivityRequest.fromPartial(request), metadata);
  }

  NFTPriceHistory(
    request: DeepPartial<NFTPriceHistoryRequest>,
    metadata?: grpc.Metadata,
  ): Promise<NFTPriceHistoryResponse> {
    return this.rpc.unary(MarketplaceServiceNFTPriceHistoryDesc, NFTPriceHistoryRequest.fromPartial(request), metadata);
  }
}

export const MarketplaceServiceDesc = { serviceName: "marketplace.v1.MarketplaceService" };

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

export const MarketplaceServiceNFTsDesc: UnaryMethodDefinitionish = {
  methodName: "NFTs",
  service: MarketplaceServiceDesc,
  requestStream: false,
  responseStream: true,
  requestType: {
    serializeBinary() {
      return NFTsRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...NFTsResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const MarketplaceServiceQuestsDesc: UnaryMethodDefinitionish = {
  methodName: "Quests",
  service: MarketplaceServiceDesc,
  requestStream: false,
  responseStream: true,
  requestType: {
    serializeBinary() {
      return QuestsRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...QuestsResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const MarketplaceServiceActivityDesc: UnaryMethodDefinitionish = {
  methodName: "Activity",
  service: MarketplaceServiceDesc,
  requestStream: false,
  responseStream: true,
  requestType: {
    serializeBinary() {
      return ActivityRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...ActivityResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const MarketplaceServiceNFTPriceHistoryDesc: UnaryMethodDefinitionish = {
  methodName: "NFTPriceHistory",
  service: MarketplaceServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return NFTPriceHistoryRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...NFTPriceHistoryResponse.decode(data),
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
  invoke<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    request: any,
    metadata: grpc.Metadata | undefined,
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

  invoke<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    _request: any,
    metadata: grpc.Metadata | undefined,
  ): Observable<any> {
    const upStreamCodes = this.options.upStreamRetryCodes || [];
    const DEFAULT_TIMEOUT_TIME: number = 3_000;
    const request = { ..._request, ...methodDesc.requestType };
    const maybeCombinedMetadata = metadata && this.options.metadata
      ? new BrowserHeaders({ ...this.options?.metadata.headersMap, ...metadata?.headersMap })
      : metadata || this.options.metadata;
    return new Observable((observer) => {
      const upStream = (() => {
        const client = grpc.invoke(methodDesc, {
          host: this.host,
          request,
          transport: this.options.streamingTransport || this.options.transport,
          metadata: maybeCombinedMetadata,
          debug: this.options.debug,
          onMessage: (next) => observer.next(next),
          onEnd: (code: grpc.Code, message: string, trailers: grpc.Metadata) => {
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
      });
      upStream();
    }).pipe(share());
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
