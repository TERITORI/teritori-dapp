/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";
import { share } from "rxjs/operators";

export const protobufPackage = "marketplace.v1";

export enum Sort {
  SORTING_UNSPECIFIED = 0,
  SORTING_PRICE = 1,
  SORTING_VOLUME = 2,
  SORTING_MARKET_CAP = 3,
  UNRECOGNIZED = -1,
}

export function sortFromJSON(object: any): Sort {
  switch (object) {
    case 0:
    case "SORTING_UNSPECIFIED":
      return Sort.SORTING_UNSPECIFIED;
    case 1:
    case "SORTING_PRICE":
      return Sort.SORTING_PRICE;
    case 2:
    case "SORTING_VOLUME":
      return Sort.SORTING_VOLUME;
    case 3:
    case "SORTING_MARKET_CAP":
      return Sort.SORTING_MARKET_CAP;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Sort.UNRECOGNIZED;
  }
}

export function sortToJSON(object: Sort): string {
  switch (object) {
    case Sort.SORTING_UNSPECIFIED:
      return "SORTING_UNSPECIFIED";
    case Sort.SORTING_PRICE:
      return "SORTING_PRICE";
    case Sort.SORTING_VOLUME:
      return "SORTING_VOLUME";
    case Sort.SORTING_MARKET_CAP:
      return "SORTING_MARKET_CAP";
    case Sort.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum SortDirection {
  SORT_DIRECTION_UNSPECIFIED = 0,
  SORT_DIRECTION_ASCENDING = 1,
  SORT_DIRECTION_DESCENDING = 2,
  UNRECOGNIZED = -1,
}

export function sortDirectionFromJSON(object: any): SortDirection {
  switch (object) {
    case 0:
    case "SORT_DIRECTION_UNSPECIFIED":
      return SortDirection.SORT_DIRECTION_UNSPECIFIED;
    case 1:
    case "SORT_DIRECTION_ASCENDING":
      return SortDirection.SORT_DIRECTION_ASCENDING;
    case 2:
    case "SORT_DIRECTION_DESCENDING":
      return SortDirection.SORT_DIRECTION_DESCENDING;
    case -1:
    case "UNRECOGNIZED":
    default:
      return SortDirection.UNRECOGNIZED;
  }
}

export function sortDirectionToJSON(object: SortDirection): string {
  switch (object) {
    case SortDirection.SORT_DIRECTION_UNSPECIFIED:
      return "SORT_DIRECTION_UNSPECIFIED";
    case SortDirection.SORT_DIRECTION_ASCENDING:
      return "SORT_DIRECTION_ASCENDING";
    case SortDirection.SORT_DIRECTION_DESCENDING:
      return "SORT_DIRECTION_DESCENDING";
    case SortDirection.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum MintState {
  MINT_STATE_UNSPECIFIED = 0,
  MINT_STATE_RUNNING = 1,
  MINT_STATE_ENDED = 2,
  UNRECOGNIZED = -1,
}

export function mintStateFromJSON(object: any): MintState {
  switch (object) {
    case 0:
    case "MINT_STATE_UNSPECIFIED":
      return MintState.MINT_STATE_UNSPECIFIED;
    case 1:
    case "MINT_STATE_RUNNING":
      return MintState.MINT_STATE_RUNNING;
    case 2:
    case "MINT_STATE_ENDED":
      return MintState.MINT_STATE_ENDED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return MintState.UNRECOGNIZED;
  }
}

export function mintStateToJSON(object: MintState): string {
  switch (object) {
    case MintState.MINT_STATE_UNSPECIFIED:
      return "MINT_STATE_UNSPECIFIED";
    case MintState.MINT_STATE_RUNNING:
      return "MINT_STATE_RUNNING";
    case MintState.MINT_STATE_ENDED:
      return "MINT_STATE_ENDED";
    case MintState.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface Attribute {
  traitType: string;
  value: string;
}

export interface NFT {
  id: string;
  networkId: string;
  imageUri: string;
  name: string;
  mintAddress: string;
  price: string;
  denom: string;
  isListed: boolean;
  textInsert: string;
  collectionName: string;
  ownerId: string;
  nftContractAddress: string;
  lockedOn: string;
  attributes: Attribute[];
}

export interface Amount {
  denom: string;
  quantity: string;
}

export interface Collection {
  id: string;
  imageUri: string;
  collectionName: string;
  creatorName: string;
  verified: boolean;
  mintAddress: string;
  networkId: string;
  volume: string;
  volumeDenom: string;
  creatorId: string;
  secondaryDuringMint: boolean;
}

export interface CollectionStats {
  floorPrice: Amount[];
  totalVolume: string;
  owners: number;
  listed: number;
  totalSupply: number;
  owned: number;
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
  usdPrice: number;
}

export interface Quest {
  id: string;
  title: string;
  completed: boolean;
}

export interface PriceDatum {
  price: number;
  time: string;
}

export interface CollectionsRequest {
  limit: number;
  offset: number;
  sort: Sort;
  sortDirection: SortDirection;
  upcoming: boolean;
  networkId: string;
  mintState: MintState;
}

export interface CollectionStatsRequest {
  collectionId: string;
  ownerId: string;
  networkId: string;
}

export interface CollectionStatsResponse {
  stats: CollectionStats | undefined;
}

export interface CollectionsResponse {
  collection: Collection | undefined;
}

export interface NFTsRequest {
  limit: number;
  offset: number;
  collectionId: string;
  ownerId: string;
  sort: Sort;
  sortDirection: SortDirection;
  networkId: string;
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
  networkId: string;
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

export interface Action {
  label: string;
  url: string;
}

export interface News {
  title: string;
  subtitle: string;
  text: string;
  image: string;
  actions: Action[];
}

export interface Banner {
  image: string;
  url: string;
}

export interface BannersRequest {
  testnet: boolean;
}

export interface BannersResponse {
  banners: Banner[];
}

export interface NewsRequest {
  testnet: boolean;
}

export interface NewsResponse {
  news: News[];
}

function createBaseAttribute(): Attribute {
  return { traitType: "", value: "" };
}

export const Attribute = {
  encode(message: Attribute, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.traitType !== "") {
      writer.uint32(10).string(message.traitType);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Attribute {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAttribute();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.traitType = reader.string();
          break;
        case 2:
          message.value = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Attribute {
    return {
      traitType: isSet(object.traitType) ? String(object.traitType) : "",
      value: isSet(object.value) ? String(object.value) : "",
    };
  },

  toJSON(message: Attribute): unknown {
    const obj: any = {};
    message.traitType !== undefined && (obj.traitType = message.traitType);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Attribute>, I>>(object: I): Attribute {
    const message = createBaseAttribute();
    message.traitType = object.traitType ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseNFT(): NFT {
  return {
    id: "",
    networkId: "",
    imageUri: "",
    name: "",
    mintAddress: "",
    price: "",
    denom: "",
    isListed: false,
    textInsert: "",
    collectionName: "",
    ownerId: "",
    nftContractAddress: "",
    lockedOn: "",
    attributes: [],
  };
}

export const NFT = {
  encode(message: NFT, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.networkId !== "") {
      writer.uint32(114).string(message.networkId);
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
    if (message.nftContractAddress !== "") {
      writer.uint32(122).string(message.nftContractAddress);
    }
    if (message.lockedOn !== "") {
      writer.uint32(130).string(message.lockedOn);
    }
    for (const v of message.attributes) {
      Attribute.encode(v!, writer.uint32(138).fork()).ldelim();
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
        case 14:
          message.networkId = reader.string();
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
        case 15:
          message.nftContractAddress = reader.string();
          break;
        case 16:
          message.lockedOn = reader.string();
          break;
        case 17:
          message.attributes.push(Attribute.decode(reader, reader.uint32()));
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
      networkId: isSet(object.networkId) ? String(object.networkId) : "",
      imageUri: isSet(object.imageUri) ? String(object.imageUri) : "",
      name: isSet(object.name) ? String(object.name) : "",
      mintAddress: isSet(object.mintAddress) ? String(object.mintAddress) : "",
      price: isSet(object.price) ? String(object.price) : "",
      denom: isSet(object.denom) ? String(object.denom) : "",
      isListed: isSet(object.isListed) ? Boolean(object.isListed) : false,
      textInsert: isSet(object.textInsert) ? String(object.textInsert) : "",
      collectionName: isSet(object.collectionName) ? String(object.collectionName) : "",
      ownerId: isSet(object.ownerId) ? String(object.ownerId) : "",
      nftContractAddress: isSet(object.nftContractAddress) ? String(object.nftContractAddress) : "",
      lockedOn: isSet(object.lockedOn) ? String(object.lockedOn) : "",
      attributes: Array.isArray(object?.attributes) ? object.attributes.map((e: any) => Attribute.fromJSON(e)) : [],
    };
  },

  toJSON(message: NFT): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.networkId !== undefined && (obj.networkId = message.networkId);
    message.imageUri !== undefined && (obj.imageUri = message.imageUri);
    message.name !== undefined && (obj.name = message.name);
    message.mintAddress !== undefined && (obj.mintAddress = message.mintAddress);
    message.price !== undefined && (obj.price = message.price);
    message.denom !== undefined && (obj.denom = message.denom);
    message.isListed !== undefined && (obj.isListed = message.isListed);
    message.textInsert !== undefined && (obj.textInsert = message.textInsert);
    message.collectionName !== undefined && (obj.collectionName = message.collectionName);
    message.ownerId !== undefined && (obj.ownerId = message.ownerId);
    message.nftContractAddress !== undefined && (obj.nftContractAddress = message.nftContractAddress);
    message.lockedOn !== undefined && (obj.lockedOn = message.lockedOn);
    if (message.attributes) {
      obj.attributes = message.attributes.map((e) => e ? Attribute.toJSON(e) : undefined);
    } else {
      obj.attributes = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<NFT>, I>>(object: I): NFT {
    const message = createBaseNFT();
    message.id = object.id ?? "";
    message.networkId = object.networkId ?? "";
    message.imageUri = object.imageUri ?? "";
    message.name = object.name ?? "";
    message.mintAddress = object.mintAddress ?? "";
    message.price = object.price ?? "";
    message.denom = object.denom ?? "";
    message.isListed = object.isListed ?? false;
    message.textInsert = object.textInsert ?? "";
    message.collectionName = object.collectionName ?? "";
    message.ownerId = object.ownerId ?? "";
    message.nftContractAddress = object.nftContractAddress ?? "";
    message.lockedOn = object.lockedOn ?? "";
    message.attributes = object.attributes?.map((e) => Attribute.fromPartial(e)) || [];
    return message;
  },
};

function createBaseAmount(): Amount {
  return { denom: "", quantity: "" };
}

export const Amount = {
  encode(message: Amount, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.denom !== "") {
      writer.uint32(10).string(message.denom);
    }
    if (message.quantity !== "") {
      writer.uint32(26).string(message.quantity);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Amount {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAmount();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.denom = reader.string();
          break;
        case 3:
          message.quantity = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Amount {
    return {
      denom: isSet(object.denom) ? String(object.denom) : "",
      quantity: isSet(object.quantity) ? String(object.quantity) : "",
    };
  },

  toJSON(message: Amount): unknown {
    const obj: any = {};
    message.denom !== undefined && (obj.denom = message.denom);
    message.quantity !== undefined && (obj.quantity = message.quantity);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Amount>, I>>(object: I): Amount {
    const message = createBaseAmount();
    message.denom = object.denom ?? "";
    message.quantity = object.quantity ?? "";
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
    networkId: "",
    volume: "",
    volumeDenom: "",
    creatorId: "",
    secondaryDuringMint: false,
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
    if (message.networkId !== "") {
      writer.uint32(90).string(message.networkId);
    }
    if (message.volume !== "") {
      writer.uint32(66).string(message.volume);
    }
    if (message.volumeDenom !== "") {
      writer.uint32(74).string(message.volumeDenom);
    }
    if (message.creatorId !== "") {
      writer.uint32(82).string(message.creatorId);
    }
    if (message.secondaryDuringMint === true) {
      writer.uint32(96).bool(message.secondaryDuringMint);
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
        case 11:
          message.networkId = reader.string();
          break;
        case 8:
          message.volume = reader.string();
          break;
        case 9:
          message.volumeDenom = reader.string();
          break;
        case 10:
          message.creatorId = reader.string();
          break;
        case 12:
          message.secondaryDuringMint = reader.bool();
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
      networkId: isSet(object.networkId) ? String(object.networkId) : "",
      volume: isSet(object.volume) ? String(object.volume) : "",
      volumeDenom: isSet(object.volumeDenom) ? String(object.volumeDenom) : "",
      creatorId: isSet(object.creatorId) ? String(object.creatorId) : "",
      secondaryDuringMint: isSet(object.secondaryDuringMint) ? Boolean(object.secondaryDuringMint) : false,
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
    message.networkId !== undefined && (obj.networkId = message.networkId);
    message.volume !== undefined && (obj.volume = message.volume);
    message.volumeDenom !== undefined && (obj.volumeDenom = message.volumeDenom);
    message.creatorId !== undefined && (obj.creatorId = message.creatorId);
    message.secondaryDuringMint !== undefined && (obj.secondaryDuringMint = message.secondaryDuringMint);
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
    message.networkId = object.networkId ?? "";
    message.volume = object.volume ?? "";
    message.volumeDenom = object.volumeDenom ?? "";
    message.creatorId = object.creatorId ?? "";
    message.secondaryDuringMint = object.secondaryDuringMint ?? false;
    return message;
  },
};

function createBaseCollectionStats(): CollectionStats {
  return { floorPrice: [], totalVolume: "", owners: 0, listed: 0, totalSupply: 0, owned: 0 };
}

export const CollectionStats = {
  encode(message: CollectionStats, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.floorPrice) {
      Amount.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.totalVolume !== "") {
      writer.uint32(18).string(message.totalVolume);
    }
    if (message.owners !== 0) {
      writer.uint32(24).int32(message.owners);
    }
    if (message.listed !== 0) {
      writer.uint32(32).int32(message.listed);
    }
    if (message.totalSupply !== 0) {
      writer.uint32(40).int64(message.totalSupply);
    }
    if (message.owned !== 0) {
      writer.uint32(48).int32(message.owned);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CollectionStats {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCollectionStats();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.floorPrice.push(Amount.decode(reader, reader.uint32()));
          break;
        case 2:
          message.totalVolume = reader.string();
          break;
        case 3:
          message.owners = reader.int32();
          break;
        case 4:
          message.listed = reader.int32();
          break;
        case 5:
          message.totalSupply = longToNumber(reader.int64() as Long);
          break;
        case 6:
          message.owned = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CollectionStats {
    return {
      floorPrice: Array.isArray(object?.floorPrice) ? object.floorPrice.map((e: any) => Amount.fromJSON(e)) : [],
      totalVolume: isSet(object.totalVolume) ? String(object.totalVolume) : "",
      owners: isSet(object.owners) ? Number(object.owners) : 0,
      listed: isSet(object.listed) ? Number(object.listed) : 0,
      totalSupply: isSet(object.totalSupply) ? Number(object.totalSupply) : 0,
      owned: isSet(object.owned) ? Number(object.owned) : 0,
    };
  },

  toJSON(message: CollectionStats): unknown {
    const obj: any = {};
    if (message.floorPrice) {
      obj.floorPrice = message.floorPrice.map((e) => e ? Amount.toJSON(e) : undefined);
    } else {
      obj.floorPrice = [];
    }
    message.totalVolume !== undefined && (obj.totalVolume = message.totalVolume);
    message.owners !== undefined && (obj.owners = Math.round(message.owners));
    message.listed !== undefined && (obj.listed = Math.round(message.listed));
    message.totalSupply !== undefined && (obj.totalSupply = Math.round(message.totalSupply));
    message.owned !== undefined && (obj.owned = Math.round(message.owned));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CollectionStats>, I>>(object: I): CollectionStats {
    const message = createBaseCollectionStats();
    message.floorPrice = object.floorPrice?.map((e) => Amount.fromPartial(e)) || [];
    message.totalVolume = object.totalVolume ?? "";
    message.owners = object.owners ?? 0;
    message.listed = object.listed ?? 0;
    message.totalSupply = object.totalSupply ?? 0;
    message.owned = object.owned ?? 0;
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
    usdPrice: 0,
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
    if (message.usdPrice !== 0) {
      writer.uint32(97).double(message.usdPrice);
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
        case 12:
          message.usdPrice = reader.double();
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
      usdPrice: isSet(object.usdPrice) ? Number(object.usdPrice) : 0,
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
    message.usdPrice !== undefined && (obj.usdPrice = message.usdPrice);
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
    message.usdPrice = object.usdPrice ?? 0;
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
  return { price: 0, time: "" };
}

export const PriceDatum = {
  encode(message: PriceDatum, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.price !== 0) {
      writer.uint32(9).double(message.price);
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
          message.price = reader.double();
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
      price: isSet(object.price) ? Number(object.price) : 0,
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
    message.price = object.price ?? 0;
    message.time = object.time ?? "";
    return message;
  },
};

function createBaseCollectionsRequest(): CollectionsRequest {
  return { limit: 0, offset: 0, sort: 0, sortDirection: 0, upcoming: false, networkId: "", mintState: 0 };
}

export const CollectionsRequest = {
  encode(message: CollectionsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.limit !== 0) {
      writer.uint32(16).int32(message.limit);
    }
    if (message.offset !== 0) {
      writer.uint32(24).int32(message.offset);
    }
    if (message.sort !== 0) {
      writer.uint32(32).int32(message.sort);
    }
    if (message.sortDirection !== 0) {
      writer.uint32(40).int32(message.sortDirection);
    }
    if (message.upcoming === true) {
      writer.uint32(48).bool(message.upcoming);
    }
    if (message.networkId !== "") {
      writer.uint32(58).string(message.networkId);
    }
    if (message.mintState !== 0) {
      writer.uint32(64).int32(message.mintState);
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
        case 2:
          message.limit = reader.int32();
          break;
        case 3:
          message.offset = reader.int32();
          break;
        case 4:
          message.sort = reader.int32() as any;
          break;
        case 5:
          message.sortDirection = reader.int32() as any;
          break;
        case 6:
          message.upcoming = reader.bool();
          break;
        case 7:
          message.networkId = reader.string();
          break;
        case 8:
          message.mintState = reader.int32() as any;
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
      limit: isSet(object.limit) ? Number(object.limit) : 0,
      offset: isSet(object.offset) ? Number(object.offset) : 0,
      sort: isSet(object.sort) ? sortFromJSON(object.sort) : 0,
      sortDirection: isSet(object.sortDirection) ? sortDirectionFromJSON(object.sortDirection) : 0,
      upcoming: isSet(object.upcoming) ? Boolean(object.upcoming) : false,
      networkId: isSet(object.networkId) ? String(object.networkId) : "",
      mintState: isSet(object.mintState) ? mintStateFromJSON(object.mintState) : 0,
    };
  },

  toJSON(message: CollectionsRequest): unknown {
    const obj: any = {};
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.offset !== undefined && (obj.offset = Math.round(message.offset));
    message.sort !== undefined && (obj.sort = sortToJSON(message.sort));
    message.sortDirection !== undefined && (obj.sortDirection = sortDirectionToJSON(message.sortDirection));
    message.upcoming !== undefined && (obj.upcoming = message.upcoming);
    message.networkId !== undefined && (obj.networkId = message.networkId);
    message.mintState !== undefined && (obj.mintState = mintStateToJSON(message.mintState));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CollectionsRequest>, I>>(object: I): CollectionsRequest {
    const message = createBaseCollectionsRequest();
    message.limit = object.limit ?? 0;
    message.offset = object.offset ?? 0;
    message.sort = object.sort ?? 0;
    message.sortDirection = object.sortDirection ?? 0;
    message.upcoming = object.upcoming ?? false;
    message.networkId = object.networkId ?? "";
    message.mintState = object.mintState ?? 0;
    return message;
  },
};

function createBaseCollectionStatsRequest(): CollectionStatsRequest {
  return { collectionId: "", ownerId: "", networkId: "" };
}

export const CollectionStatsRequest = {
  encode(message: CollectionStatsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.collectionId !== "") {
      writer.uint32(10).string(message.collectionId);
    }
    if (message.ownerId !== "") {
      writer.uint32(18).string(message.ownerId);
    }
    if (message.networkId !== "") {
      writer.uint32(26).string(message.networkId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CollectionStatsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCollectionStatsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.collectionId = reader.string();
          break;
        case 2:
          message.ownerId = reader.string();
          break;
        case 3:
          message.networkId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CollectionStatsRequest {
    return {
      collectionId: isSet(object.collectionId) ? String(object.collectionId) : "",
      ownerId: isSet(object.ownerId) ? String(object.ownerId) : "",
      networkId: isSet(object.networkId) ? String(object.networkId) : "",
    };
  },

  toJSON(message: CollectionStatsRequest): unknown {
    const obj: any = {};
    message.collectionId !== undefined && (obj.collectionId = message.collectionId);
    message.ownerId !== undefined && (obj.ownerId = message.ownerId);
    message.networkId !== undefined && (obj.networkId = message.networkId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CollectionStatsRequest>, I>>(object: I): CollectionStatsRequest {
    const message = createBaseCollectionStatsRequest();
    message.collectionId = object.collectionId ?? "";
    message.ownerId = object.ownerId ?? "";
    message.networkId = object.networkId ?? "";
    return message;
  },
};

function createBaseCollectionStatsResponse(): CollectionStatsResponse {
  return { stats: undefined };
}

export const CollectionStatsResponse = {
  encode(message: CollectionStatsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.stats !== undefined) {
      CollectionStats.encode(message.stats, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CollectionStatsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCollectionStatsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.stats = CollectionStats.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CollectionStatsResponse {
    return { stats: isSet(object.stats) ? CollectionStats.fromJSON(object.stats) : undefined };
  },

  toJSON(message: CollectionStatsResponse): unknown {
    const obj: any = {};
    message.stats !== undefined && (obj.stats = message.stats ? CollectionStats.toJSON(message.stats) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CollectionStatsResponse>, I>>(object: I): CollectionStatsResponse {
    const message = createBaseCollectionStatsResponse();
    message.stats = (object.stats !== undefined && object.stats !== null)
      ? CollectionStats.fromPartial(object.stats)
      : undefined;
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
  return { limit: 0, offset: 0, collectionId: "", ownerId: "", sort: 0, sortDirection: 0, networkId: "" };
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
    if (message.sort !== 0) {
      writer.uint32(40).int32(message.sort);
    }
    if (message.sortDirection !== 0) {
      writer.uint32(48).int32(message.sortDirection);
    }
    if (message.networkId !== "") {
      writer.uint32(58).string(message.networkId);
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
        case 5:
          message.sort = reader.int32() as any;
          break;
        case 6:
          message.sortDirection = reader.int32() as any;
          break;
        case 7:
          message.networkId = reader.string();
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
      sort: isSet(object.sort) ? sortFromJSON(object.sort) : 0,
      sortDirection: isSet(object.sortDirection) ? sortDirectionFromJSON(object.sortDirection) : 0,
      networkId: isSet(object.networkId) ? String(object.networkId) : "",
    };
  },

  toJSON(message: NFTsRequest): unknown {
    const obj: any = {};
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.offset !== undefined && (obj.offset = Math.round(message.offset));
    message.collectionId !== undefined && (obj.collectionId = message.collectionId);
    message.ownerId !== undefined && (obj.ownerId = message.ownerId);
    message.sort !== undefined && (obj.sort = sortToJSON(message.sort));
    message.sortDirection !== undefined && (obj.sortDirection = sortDirectionToJSON(message.sortDirection));
    message.networkId !== undefined && (obj.networkId = message.networkId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<NFTsRequest>, I>>(object: I): NFTsRequest {
    const message = createBaseNFTsRequest();
    message.limit = object.limit ?? 0;
    message.offset = object.offset ?? 0;
    message.collectionId = object.collectionId ?? "";
    message.ownerId = object.ownerId ?? "";
    message.sort = object.sort ?? 0;
    message.sortDirection = object.sortDirection ?? 0;
    message.networkId = object.networkId ?? "";
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
  return { collectionId: "", nftId: "", limit: 0, offset: 0, networkId: "" };
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
    if (message.networkId !== "") {
      writer.uint32(42).string(message.networkId);
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
        case 5:
          message.networkId = reader.string();
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
      networkId: isSet(object.networkId) ? String(object.networkId) : "",
    };
  },

  toJSON(message: ActivityRequest): unknown {
    const obj: any = {};
    message.collectionId !== undefined && (obj.collectionId = message.collectionId);
    message.nftId !== undefined && (obj.nftId = message.nftId);
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.offset !== undefined && (obj.offset = Math.round(message.offset));
    message.networkId !== undefined && (obj.networkId = message.networkId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ActivityRequest>, I>>(object: I): ActivityRequest {
    const message = createBaseActivityRequest();
    message.collectionId = object.collectionId ?? "";
    message.nftId = object.nftId ?? "";
    message.limit = object.limit ?? 0;
    message.offset = object.offset ?? 0;
    message.networkId = object.networkId ?? "";
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

function createBaseAction(): Action {
  return { label: "", url: "" };
}

export const Action = {
  encode(message: Action, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.label !== "") {
      writer.uint32(10).string(message.label);
    }
    if (message.url !== "") {
      writer.uint32(18).string(message.url);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Action {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.label = reader.string();
          break;
        case 2:
          message.url = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Action {
    return { label: isSet(object.label) ? String(object.label) : "", url: isSet(object.url) ? String(object.url) : "" };
  },

  toJSON(message: Action): unknown {
    const obj: any = {};
    message.label !== undefined && (obj.label = message.label);
    message.url !== undefined && (obj.url = message.url);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Action>, I>>(object: I): Action {
    const message = createBaseAction();
    message.label = object.label ?? "";
    message.url = object.url ?? "";
    return message;
  },
};

function createBaseNews(): News {
  return { title: "", subtitle: "", text: "", image: "", actions: [] };
}

export const News = {
  encode(message: News, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.subtitle !== "") {
      writer.uint32(18).string(message.subtitle);
    }
    if (message.text !== "") {
      writer.uint32(26).string(message.text);
    }
    if (message.image !== "") {
      writer.uint32(34).string(message.image);
    }
    for (const v of message.actions) {
      Action.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): News {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNews();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.title = reader.string();
          break;
        case 2:
          message.subtitle = reader.string();
          break;
        case 3:
          message.text = reader.string();
          break;
        case 4:
          message.image = reader.string();
          break;
        case 5:
          message.actions.push(Action.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): News {
    return {
      title: isSet(object.title) ? String(object.title) : "",
      subtitle: isSet(object.subtitle) ? String(object.subtitle) : "",
      text: isSet(object.text) ? String(object.text) : "",
      image: isSet(object.image) ? String(object.image) : "",
      actions: Array.isArray(object?.actions) ? object.actions.map((e: any) => Action.fromJSON(e)) : [],
    };
  },

  toJSON(message: News): unknown {
    const obj: any = {};
    message.title !== undefined && (obj.title = message.title);
    message.subtitle !== undefined && (obj.subtitle = message.subtitle);
    message.text !== undefined && (obj.text = message.text);
    message.image !== undefined && (obj.image = message.image);
    if (message.actions) {
      obj.actions = message.actions.map((e) => e ? Action.toJSON(e) : undefined);
    } else {
      obj.actions = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<News>, I>>(object: I): News {
    const message = createBaseNews();
    message.title = object.title ?? "";
    message.subtitle = object.subtitle ?? "";
    message.text = object.text ?? "";
    message.image = object.image ?? "";
    message.actions = object.actions?.map((e) => Action.fromPartial(e)) || [];
    return message;
  },
};

function createBaseBanner(): Banner {
  return { image: "", url: "" };
}

export const Banner = {
  encode(message: Banner, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.image !== "") {
      writer.uint32(10).string(message.image);
    }
    if (message.url !== "") {
      writer.uint32(18).string(message.url);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Banner {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBanner();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.image = reader.string();
          break;
        case 2:
          message.url = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Banner {
    return { image: isSet(object.image) ? String(object.image) : "", url: isSet(object.url) ? String(object.url) : "" };
  },

  toJSON(message: Banner): unknown {
    const obj: any = {};
    message.image !== undefined && (obj.image = message.image);
    message.url !== undefined && (obj.url = message.url);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Banner>, I>>(object: I): Banner {
    const message = createBaseBanner();
    message.image = object.image ?? "";
    message.url = object.url ?? "";
    return message;
  },
};

function createBaseBannersRequest(): BannersRequest {
  return { testnet: false };
}

export const BannersRequest = {
  encode(message: BannersRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.testnet === true) {
      writer.uint32(8).bool(message.testnet);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BannersRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBannersRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.testnet = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BannersRequest {
    return { testnet: isSet(object.testnet) ? Boolean(object.testnet) : false };
  },

  toJSON(message: BannersRequest): unknown {
    const obj: any = {};
    message.testnet !== undefined && (obj.testnet = message.testnet);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<BannersRequest>, I>>(object: I): BannersRequest {
    const message = createBaseBannersRequest();
    message.testnet = object.testnet ?? false;
    return message;
  },
};

function createBaseBannersResponse(): BannersResponse {
  return { banners: [] };
}

export const BannersResponse = {
  encode(message: BannersResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.banners) {
      Banner.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BannersResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBannersResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.banners.push(Banner.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BannersResponse {
    return { banners: Array.isArray(object?.banners) ? object.banners.map((e: any) => Banner.fromJSON(e)) : [] };
  },

  toJSON(message: BannersResponse): unknown {
    const obj: any = {};
    if (message.banners) {
      obj.banners = message.banners.map((e) => e ? Banner.toJSON(e) : undefined);
    } else {
      obj.banners = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<BannersResponse>, I>>(object: I): BannersResponse {
    const message = createBaseBannersResponse();
    message.banners = object.banners?.map((e) => Banner.fromPartial(e)) || [];
    return message;
  },
};

function createBaseNewsRequest(): NewsRequest {
  return { testnet: false };
}

export const NewsRequest = {
  encode(message: NewsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.testnet === true) {
      writer.uint32(8).bool(message.testnet);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NewsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNewsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.testnet = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): NewsRequest {
    return { testnet: isSet(object.testnet) ? Boolean(object.testnet) : false };
  },

  toJSON(message: NewsRequest): unknown {
    const obj: any = {};
    message.testnet !== undefined && (obj.testnet = message.testnet);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<NewsRequest>, I>>(object: I): NewsRequest {
    const message = createBaseNewsRequest();
    message.testnet = object.testnet ?? false;
    return message;
  },
};

function createBaseNewsResponse(): NewsResponse {
  return { news: [] };
}

export const NewsResponse = {
  encode(message: NewsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.news) {
      News.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NewsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNewsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.news.push(News.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): NewsResponse {
    return { news: Array.isArray(object?.news) ? object.news.map((e: any) => News.fromJSON(e)) : [] };
  },

  toJSON(message: NewsResponse): unknown {
    const obj: any = {};
    if (message.news) {
      obj.news = message.news.map((e) => e ? News.toJSON(e) : undefined);
    } else {
      obj.news = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<NewsResponse>, I>>(object: I): NewsResponse {
    const message = createBaseNewsResponse();
    message.news = object.news?.map((e) => News.fromPartial(e)) || [];
    return message;
  },
};

export interface MarketplaceService {
  Collections(request: DeepPartial<CollectionsRequest>, metadata?: grpc.Metadata): Observable<CollectionsResponse>;
  CollectionStats(
    request: DeepPartial<CollectionStatsRequest>,
    metadata?: grpc.Metadata,
  ): Promise<CollectionStatsResponse>;
  NFTs(request: DeepPartial<NFTsRequest>, metadata?: grpc.Metadata): Observable<NFTsResponse>;
  Quests(request: DeepPartial<QuestsRequest>, metadata?: grpc.Metadata): Observable<QuestsResponse>;
  Activity(request: DeepPartial<ActivityRequest>, metadata?: grpc.Metadata): Observable<ActivityResponse>;
  NFTPriceHistory(
    request: DeepPartial<NFTPriceHistoryRequest>,
    metadata?: grpc.Metadata,
  ): Promise<NFTPriceHistoryResponse>;
  Banners(request: DeepPartial<BannersRequest>, metadata?: grpc.Metadata): Promise<BannersResponse>;
  News(request: DeepPartial<NewsRequest>, metadata?: grpc.Metadata): Promise<NewsResponse>;
}

export class MarketplaceServiceClientImpl implements MarketplaceService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Collections = this.Collections.bind(this);
    this.CollectionStats = this.CollectionStats.bind(this);
    this.NFTs = this.NFTs.bind(this);
    this.Quests = this.Quests.bind(this);
    this.Activity = this.Activity.bind(this);
    this.NFTPriceHistory = this.NFTPriceHistory.bind(this);
    this.Banners = this.Banners.bind(this);
    this.News = this.News.bind(this);
  }

  Collections(request: DeepPartial<CollectionsRequest>, metadata?: grpc.Metadata): Observable<CollectionsResponse> {
    return this.rpc.invoke(MarketplaceServiceCollectionsDesc, CollectionsRequest.fromPartial(request), metadata);
  }

  CollectionStats(
    request: DeepPartial<CollectionStatsRequest>,
    metadata?: grpc.Metadata,
  ): Promise<CollectionStatsResponse> {
    return this.rpc.unary(MarketplaceServiceCollectionStatsDesc, CollectionStatsRequest.fromPartial(request), metadata);
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

  Banners(request: DeepPartial<BannersRequest>, metadata?: grpc.Metadata): Promise<BannersResponse> {
    return this.rpc.unary(MarketplaceServiceBannersDesc, BannersRequest.fromPartial(request), metadata);
  }

  News(request: DeepPartial<NewsRequest>, metadata?: grpc.Metadata): Promise<NewsResponse> {
    return this.rpc.unary(MarketplaceServiceNewsDesc, NewsRequest.fromPartial(request), metadata);
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

export const MarketplaceServiceCollectionStatsDesc: UnaryMethodDefinitionish = {
  methodName: "CollectionStats",
  service: MarketplaceServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return CollectionStatsRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...CollectionStatsResponse.decode(data),
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

export const MarketplaceServiceBannersDesc: UnaryMethodDefinitionish = {
  methodName: "Banners",
  service: MarketplaceServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return BannersRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...BannersResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const MarketplaceServiceNewsDesc: UnaryMethodDefinitionish = {
  methodName: "News",
  service: MarketplaceServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return NewsRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...NewsResponse.decode(data),
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
