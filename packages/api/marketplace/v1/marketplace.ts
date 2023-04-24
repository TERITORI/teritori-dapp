/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";
import { share } from "rxjs/operators";
import { ReactNativeTransport } from "@improbable-eng/grpc-web-react-native-transport";
grpc.setDefaultTransport(ReactNativeTransport({}));

export const protobufPackage = "marketplace.v1";

export enum Sort {
  SORT_UNSPECIFIED = 0,
  SORT_PRICE = 1,
  SORT_VOLUME = 2,
  SORT_MARKET_CAP = 3,
  SORT_CREATED_AT = 4,
  SORT_VOLUME_USD = 5,
  UNRECOGNIZED = -1,
}

export function sortFromJSON(object: any): Sort {
  switch (object) {
    case 0:
    case "SORT_UNSPECIFIED":
      return Sort.SORT_UNSPECIFIED;
    case 1:
    case "SORT_PRICE":
      return Sort.SORT_PRICE;
    case 2:
    case "SORT_VOLUME":
      return Sort.SORT_VOLUME;
    case 3:
    case "SORT_MARKET_CAP":
      return Sort.SORT_MARKET_CAP;
    case 4:
    case "SORT_CREATED_AT":
      return Sort.SORT_CREATED_AT;
    case 5:
    case "SORT_VOLUME_USD":
      return Sort.SORT_VOLUME_USD;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Sort.UNRECOGNIZED;
  }
}

export function sortToJSON(object: Sort): string {
  switch (object) {
    case Sort.SORT_UNSPECIFIED:
      return "SORT_UNSPECIFIED";
    case Sort.SORT_PRICE:
      return "SORT_PRICE";
    case Sort.SORT_VOLUME:
      return "SORT_VOLUME";
    case Sort.SORT_MARKET_CAP:
      return "SORT_MARKET_CAP";
    case Sort.SORT_CREATED_AT:
      return "SORT_CREATED_AT";
    case Sort.SORT_VOLUME_USD:
      return "SORT_VOLUME_USD";
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

export interface PriceRange {
  min: string;
  max: string;
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
  websiteUrl: string;
  twitterUrl: string;
  floorPrice: number;
  maxSupply: number;
  mintPrice: string;
  totalVolume: number;
  numTrades: number;
  numOwners: number;
  denom: string;
  volumeCompare: number;
}

export interface CollectionStats {
  floorPrice: Amount[];
  totalVolume: string;
  owners: number;
  listed: number;
  totalSupply: number;
  owned: number;
  avgPricePeriod: number;
}

export interface AttributeRarityFloor {
  traitType: string;
  value: string;
  counta: number;
  floor: number;
  collectionId: string;
  rareRatio: number;
  collectionSize: number;
}

export interface NFTCollectionAttributesResponse {
  attributes: AttributeRarityFloor | undefined;
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
  price: string;
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
}

export interface NFTCollectionAttributesRequest {
  collectionId: string;
  whereAttributes: Attribute[];
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
  attributes: Attribute[];
  isListed: boolean;
  priceRange: PriceRange | undefined;
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

export interface DAppGroup {
  id: string;
  groupName: string;
  icon: string;
  options: string[];
}

export interface DApp {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  groupKey: string;
  linkingId: string;
  selectedByDefault: boolean;
  alwaysOn: boolean;
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

export interface DAppsRequest {
}

export interface DAppsResponse {
  group: DApp[];
}

export interface DAppsGroupsRequest {
}

export interface DAppsGroupsResponse {
  group: DAppGroup[];
}

export interface SearchNamesRequest {
  networkId: string;
  input: string;
  limit: number;
}

export interface SearchNamesResponse {
  names: string[];
}

export interface SearchCollectionsRequest {
  input: string;
  limit: number;
}

export interface SearchCollectionsResponse {
  collections: Collection[];
}

function createBaseAttribute(): Attribute {
  return { traitType: "", value: "" };
}

export const Attribute = {
  encode(
    message: Attribute,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
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

  fromPartial<I extends Exact<DeepPartial<Attribute>, I>>(
    object: I
  ): Attribute {
    const message = createBaseAttribute();
    message.traitType = object.traitType ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBasePriceRange(): PriceRange {
  return { min: "", max: "" };
}

export const PriceRange = {
  encode(message: PriceRange, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.min !== "") {
      writer.uint32(10).string(message.min);
    }
    if (message.max !== "") {
      writer.uint32(18).string(message.max);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PriceRange {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePriceRange();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.min = reader.string();
          break;
        case 2:
          message.max = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PriceRange {
    return { min: isSet(object.min) ? String(object.min) : "", max: isSet(object.max) ? String(object.max) : "" };
  },

  toJSON(message: PriceRange): unknown {
    const obj: any = {};
    message.min !== undefined && (obj.min = message.min);
    message.max !== undefined && (obj.max = message.max);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PriceRange>, I>>(object: I): PriceRange {
    const message = createBasePriceRange();
    message.min = object.min ?? "";
    message.max = object.max ?? "";
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
      collectionName: isSet(object.collectionName)
        ? String(object.collectionName)
        : "",
      ownerId: isSet(object.ownerId) ? String(object.ownerId) : "",
      nftContractAddress: isSet(object.nftContractAddress)
        ? String(object.nftContractAddress)
        : "",
      lockedOn: isSet(object.lockedOn) ? String(object.lockedOn) : "",
      attributes: Array.isArray(object?.attributes)
        ? object.attributes.map((e: any) => Attribute.fromJSON(e))
        : [],
    };
  },

  toJSON(message: NFT): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.networkId !== undefined && (obj.networkId = message.networkId);
    message.imageUri !== undefined && (obj.imageUri = message.imageUri);
    message.name !== undefined && (obj.name = message.name);
    message.mintAddress !== undefined &&
      (obj.mintAddress = message.mintAddress);
    message.price !== undefined && (obj.price = message.price);
    message.denom !== undefined && (obj.denom = message.denom);
    message.isListed !== undefined && (obj.isListed = message.isListed);
    message.textInsert !== undefined && (obj.textInsert = message.textInsert);
    message.collectionName !== undefined &&
      (obj.collectionName = message.collectionName);
    message.ownerId !== undefined && (obj.ownerId = message.ownerId);
    message.nftContractAddress !== undefined &&
      (obj.nftContractAddress = message.nftContractAddress);
    message.lockedOn !== undefined && (obj.lockedOn = message.lockedOn);
    if (message.attributes) {
      obj.attributes = message.attributes.map((e) =>
        e ? Attribute.toJSON(e) : undefined
      );
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
    message.attributes =
      object.attributes?.map((e) => Attribute.fromPartial(e)) || [];
    return message;
  },
};

function createBaseAmount(): Amount {
  return { denom: "", quantity: "" };
}

export const Amount = {
  encode(
    message: Amount,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
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
    websiteUrl: "",
    twitterUrl: "",
    floorPrice: 0,
    maxSupply: 0,
    mintPrice: "",
    totalVolume: 0,
    numTrades: 0,
    numOwners: 0,
    denom: "",
    volumeCompare: 0,
  };
}

export const Collection = {
  encode(
    message: Collection,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
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
    if (message.websiteUrl !== "") {
      writer.uint32(106).string(message.websiteUrl);
    }
    if (message.twitterUrl !== "") {
      writer.uint32(114).string(message.twitterUrl);
    }
    if (message.floorPrice !== 0) {
      writer.uint32(120).uint64(message.floorPrice);
    }
    if (message.maxSupply !== 0) {
      writer.uint32(128).int64(message.maxSupply);
    }
    if (message.mintPrice !== "") {
      writer.uint32(138).string(message.mintPrice);
    }
    if (message.totalVolume !== 0) {
      writer.uint32(149).float(message.totalVolume);
    }
    if (message.numTrades !== 0) {
      writer.uint32(152).int64(message.numTrades);
    }
    if (message.numOwners !== 0) {
      writer.uint32(160).int32(message.numOwners);
    }
    if (message.denom !== "") {
      writer.uint32(170).string(message.denom);
    }
    if (message.volumeCompare !== 0) {
      writer.uint32(181).float(message.volumeCompare);
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
        case 13:
          message.websiteUrl = reader.string();
          break;
        case 14:
          message.twitterUrl = reader.string();
          break;
        case 15:
          message.floorPrice = longToNumber(reader.uint64() as Long);
          break;
        case 16:
          message.maxSupply = longToNumber(reader.int64() as Long);
          break;
        case 17:
          message.mintPrice = reader.string();
          break;
        case 18:
          message.totalVolume = reader.float();
          break;
        case 19:
          message.numTrades = longToNumber(reader.int64() as Long);
          break;
        case 20:
          message.numOwners = reader.int32();
          break;
        case 21:
          message.denom = reader.string();
          break;
        case 22:
          message.volumeCompare = reader.float();
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
      collectionName: isSet(object.collectionName)
        ? String(object.collectionName)
        : "",
      creatorName: isSet(object.creatorName) ? String(object.creatorName) : "",
      verified: isSet(object.verified) ? Boolean(object.verified) : false,
      mintAddress: isSet(object.mintAddress) ? String(object.mintAddress) : "",
      networkId: isSet(object.networkId) ? String(object.networkId) : "",
      volume: isSet(object.volume) ? String(object.volume) : "",
      volumeDenom: isSet(object.volumeDenom) ? String(object.volumeDenom) : "",
      creatorId: isSet(object.creatorId) ? String(object.creatorId) : "",
      secondaryDuringMint: isSet(object.secondaryDuringMint)
        ? Boolean(object.secondaryDuringMint)
        : false,
      websiteUrl: isSet(object.websiteUrl) ? String(object.websiteUrl) : "",
      twitterUrl: isSet(object.twitterUrl) ? String(object.twitterUrl) : "",
      floorPrice: isSet(object.floorPrice) ? Number(object.floorPrice) : 0,
      maxSupply: isSet(object.maxSupply) ? Number(object.maxSupply) : 0,
      mintPrice: isSet(object.mintPrice) ? String(object.mintPrice) : "",
      totalVolume: isSet(object.totalVolume) ? Number(object.totalVolume) : 0,
      numTrades: isSet(object.numTrades) ? Number(object.numTrades) : 0,
      numOwners: isSet(object.numOwners) ? Number(object.numOwners) : 0,
      denom: isSet(object.denom) ? String(object.denom) : "",
      volumeCompare: isSet(object.volumeCompare) ? Number(object.volumeCompare) : 0,
    };
  },

  toJSON(message: Collection): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.imageUri !== undefined && (obj.imageUri = message.imageUri);
    message.collectionName !== undefined &&
      (obj.collectionName = message.collectionName);
    message.creatorName !== undefined &&
      (obj.creatorName = message.creatorName);
    message.verified !== undefined && (obj.verified = message.verified);
    message.mintAddress !== undefined &&
      (obj.mintAddress = message.mintAddress);
    message.networkId !== undefined && (obj.networkId = message.networkId);
    message.volume !== undefined && (obj.volume = message.volume);
    message.volumeDenom !== undefined &&
      (obj.volumeDenom = message.volumeDenom);
    message.creatorId !== undefined && (obj.creatorId = message.creatorId);
    message.secondaryDuringMint !== undefined &&
      (obj.secondaryDuringMint = message.secondaryDuringMint);
    message.websiteUrl !== undefined && (obj.websiteUrl = message.websiteUrl);
    message.twitterUrl !== undefined && (obj.twitterUrl = message.twitterUrl);
    message.floorPrice !== undefined && (obj.floorPrice = Math.round(message.floorPrice));
    message.maxSupply !== undefined && (obj.maxSupply = Math.round(message.maxSupply));
    message.mintPrice !== undefined && (obj.mintPrice = message.mintPrice);
    message.totalVolume !== undefined && (obj.totalVolume = message.totalVolume);
    message.numTrades !== undefined && (obj.numTrades = Math.round(message.numTrades));
    message.numOwners !== undefined && (obj.numOwners = Math.round(message.numOwners));
    message.denom !== undefined && (obj.denom = message.denom);
    message.volumeCompare !== undefined && (obj.volumeCompare = message.volumeCompare);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Collection>, I>>(
    object: I
  ): Collection {
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
    message.websiteUrl = object.websiteUrl ?? "";
    message.twitterUrl = object.twitterUrl ?? "";
    message.floorPrice = object.floorPrice ?? 0;
    message.maxSupply = object.maxSupply ?? 0;
    message.mintPrice = object.mintPrice ?? "";
    message.totalVolume = object.totalVolume ?? 0;
    message.numTrades = object.numTrades ?? 0;
    message.numOwners = object.numOwners ?? 0;
    message.denom = object.denom ?? "";
    message.volumeCompare = object.volumeCompare ?? 0;
    return message;
  },
};

function createBaseCollectionStats(): CollectionStats {
  return { floorPrice: [], totalVolume: "", owners: 0, listed: 0, totalSupply: 0, owned: 0, avgPricePeriod: 0 };
}

export const CollectionStats = {
  encode(
    message: CollectionStats,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
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
    if (message.avgPricePeriod !== 0) {
      writer.uint32(61).float(message.avgPricePeriod);
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
        case 7:
          message.avgPricePeriod = reader.float();
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
      floorPrice: Array.isArray(object?.floorPrice)
        ? object.floorPrice.map((e: any) => Amount.fromJSON(e))
        : [],
      totalVolume: isSet(object.totalVolume) ? String(object.totalVolume) : "",
      owners: isSet(object.owners) ? Number(object.owners) : 0,
      listed: isSet(object.listed) ? Number(object.listed) : 0,
      totalSupply: isSet(object.totalSupply) ? Number(object.totalSupply) : 0,
      owned: isSet(object.owned) ? Number(object.owned) : 0,
      avgPricePeriod: isSet(object.avgPricePeriod) ? Number(object.avgPricePeriod) : 0,
    };
  },

  toJSON(message: CollectionStats): unknown {
    const obj: any = {};
    if (message.floorPrice) {
      obj.floorPrice = message.floorPrice.map((e) =>
        e ? Amount.toJSON(e) : undefined
      );
    } else {
      obj.floorPrice = [];
    }
    message.totalVolume !== undefined &&
      (obj.totalVolume = message.totalVolume);
    message.owners !== undefined && (obj.owners = Math.round(message.owners));
    message.listed !== undefined && (obj.listed = Math.round(message.listed));
    message.totalSupply !== undefined &&
      (obj.totalSupply = Math.round(message.totalSupply));
    message.owned !== undefined && (obj.owned = Math.round(message.owned));
    message.avgPricePeriod !== undefined && (obj.avgPricePeriod = message.avgPricePeriod);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CollectionStats>, I>>(
    object: I
  ): CollectionStats {
    const message = createBaseCollectionStats();
    message.floorPrice =
      object.floorPrice?.map((e) => Amount.fromPartial(e)) || [];
    message.totalVolume = object.totalVolume ?? "";
    message.owners = object.owners ?? 0;
    message.listed = object.listed ?? 0;
    message.totalSupply = object.totalSupply ?? 0;
    message.owned = object.owned ?? 0;
    message.avgPricePeriod = object.avgPricePeriod ?? 0;
    return message;
  },
};

function createBaseAttributeRarityFloor(): AttributeRarityFloor {
  return { traitType: "", value: "", counta: 0, floor: 0, collectionId: "", rareRatio: 0, collectionSize: 0 };
}

export const AttributeRarityFloor = {
  encode(message: AttributeRarityFloor, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.traitType !== "") {
      writer.uint32(10).string(message.traitType);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    if (message.counta !== 0) {
      writer.uint32(24).int32(message.counta);
    }
    if (message.floor !== 0) {
      writer.uint32(37).float(message.floor);
    }
    if (message.collectionId !== "") {
      writer.uint32(42).string(message.collectionId);
    }
    if (message.rareRatio !== 0) {
      writer.uint32(53).float(message.rareRatio);
    }
    if (message.collectionSize !== 0) {
      writer.uint32(56).int32(message.collectionSize);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AttributeRarityFloor {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAttributeRarityFloor();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.traitType = reader.string();
          break;
        case 2:
          message.value = reader.string();
          break;
        case 3:
          message.counta = reader.int32();
          break;
        case 4:
          message.floor = reader.float();
          break;
        case 5:
          message.collectionId = reader.string();
          break;
        case 6:
          message.rareRatio = reader.float();
          break;
        case 7:
          message.collectionSize = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AttributeRarityFloor {
    return {
      traitType: isSet(object.traitType) ? String(object.traitType) : "",
      value: isSet(object.value) ? String(object.value) : "",
      counta: isSet(object.counta) ? Number(object.counta) : 0,
      floor: isSet(object.floor) ? Number(object.floor) : 0,
      collectionId: isSet(object.collectionId) ? String(object.collectionId) : "",
      rareRatio: isSet(object.rareRatio) ? Number(object.rareRatio) : 0,
      collectionSize: isSet(object.collectionSize) ? Number(object.collectionSize) : 0,
    };
  },

  toJSON(message: AttributeRarityFloor): unknown {
    const obj: any = {};
    message.traitType !== undefined && (obj.traitType = message.traitType);
    message.value !== undefined && (obj.value = message.value);
    message.counta !== undefined && (obj.counta = Math.round(message.counta));
    message.floor !== undefined && (obj.floor = message.floor);
    message.collectionId !== undefined && (obj.collectionId = message.collectionId);
    message.rareRatio !== undefined && (obj.rareRatio = message.rareRatio);
    message.collectionSize !== undefined && (obj.collectionSize = Math.round(message.collectionSize));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<AttributeRarityFloor>, I>>(object: I): AttributeRarityFloor {
    const message = createBaseAttributeRarityFloor();
    message.traitType = object.traitType ?? "";
    message.value = object.value ?? "";
    message.counta = object.counta ?? 0;
    message.floor = object.floor ?? 0;
    message.collectionId = object.collectionId ?? "";
    message.rareRatio = object.rareRatio ?? 0;
    message.collectionSize = object.collectionSize ?? 0;
    return message;
  },
};

function createBaseNFTCollectionAttributesResponse(): NFTCollectionAttributesResponse {
  return { attributes: undefined };
}

export const NFTCollectionAttributesResponse = {
  encode(message: NFTCollectionAttributesResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.attributes !== undefined) {
      AttributeRarityFloor.encode(message.attributes, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NFTCollectionAttributesResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNFTCollectionAttributesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.attributes = AttributeRarityFloor.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): NFTCollectionAttributesResponse {
    return { attributes: isSet(object.attributes) ? AttributeRarityFloor.fromJSON(object.attributes) : undefined };
  },

  toJSON(message: NFTCollectionAttributesResponse): unknown {
    const obj: any = {};
    message.attributes !== undefined &&
      (obj.attributes = message.attributes ? AttributeRarityFloor.toJSON(message.attributes) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<NFTCollectionAttributesResponse>, I>>(
    object: I,
  ): NFTCollectionAttributesResponse {
    const message = createBaseNFTCollectionAttributesResponse();
    message.attributes = (object.attributes !== undefined && object.attributes !== null)
      ? AttributeRarityFloor.fromPartial(object.attributes)
      : undefined;
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
  encode(
    message: Activity,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
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
      denom: isSet(object.denom) ? String(object.denom) : "",
      transactionId: isSet(object.transactionId)
        ? String(object.transactionId)
        : "",
      buyerId: isSet(object.buyerId) ? String(object.buyerId) : "",
      sellerId: isSet(object.sellerId) ? String(object.sellerId) : "",
      usdPrice: isSet(object.usdPrice) ? Number(object.usdPrice) : 0,
    };
  },

  toJSON(message: Activity): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.transactionKind !== undefined &&
      (obj.transactionKind = message.transactionKind);
    message.targetName !== undefined && (obj.targetName = message.targetName);
    message.targetImageUri !== undefined &&
      (obj.targetImageUri = message.targetImageUri);
    message.contractName !== undefined &&
      (obj.contractName = message.contractName);
    message.time !== undefined && (obj.time = message.time);
    message.amount !== undefined && (obj.amount = message.amount);
    message.denom !== undefined && (obj.denom = message.denom);
    message.transactionId !== undefined &&
      (obj.transactionId = message.transactionId);
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
  return { price: "", time: "" };
}

export const PriceDatum = {
  encode(
    message: PriceDatum,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.price !== "") {
      writer.uint32(26).string(message.price);
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
        case 3:
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

  fromPartial<I extends Exact<DeepPartial<PriceDatum>, I>>(
    object: I
  ): PriceDatum {
    const message = createBasePriceDatum();
    message.price = object.price ?? "";
    message.time = object.time ?? "";
    return message;
  },
};

function createBaseCollectionsRequest(): CollectionsRequest {
  return {
    limit: 0,
    offset: 0,
    sort: 0,
    sortDirection: 0,
    upcoming: false,
    networkId: "",
    mintState: 0,
  };
}

export const CollectionsRequest = {
  encode(
    message: CollectionsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
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
      sortDirection: isSet(object.sortDirection)
        ? sortDirectionFromJSON(object.sortDirection)
        : 0,
      upcoming: isSet(object.upcoming) ? Boolean(object.upcoming) : false,
      networkId: isSet(object.networkId) ? String(object.networkId) : "",
      mintState: isSet(object.mintState)
        ? mintStateFromJSON(object.mintState)
        : 0,
    };
  },

  toJSON(message: CollectionsRequest): unknown {
    const obj: any = {};
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.offset !== undefined && (obj.offset = Math.round(message.offset));
    message.sort !== undefined && (obj.sort = sortToJSON(message.sort));
    message.sortDirection !== undefined &&
      (obj.sortDirection = sortDirectionToJSON(message.sortDirection));
    message.upcoming !== undefined && (obj.upcoming = message.upcoming);
    message.networkId !== undefined && (obj.networkId = message.networkId);
    message.mintState !== undefined &&
      (obj.mintState = mintStateToJSON(message.mintState));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CollectionsRequest>, I>>(
    object: I
  ): CollectionsRequest {
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
  return { collectionId: "", ownerId: "" };
}

export const CollectionStatsRequest = {
  encode(
    message: CollectionStatsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.collectionId !== "") {
      writer.uint32(10).string(message.collectionId);
    }
    if (message.ownerId !== "") {
      writer.uint32(18).string(message.ownerId);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): CollectionStatsRequest {
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
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CollectionStatsRequest {
    return {
      collectionId: isSet(object.collectionId)
        ? String(object.collectionId)
        : "",
      ownerId: isSet(object.ownerId) ? String(object.ownerId) : "",
    };
  },

  toJSON(message: CollectionStatsRequest): unknown {
    const obj: any = {};
    message.collectionId !== undefined &&
      (obj.collectionId = message.collectionId);
    message.ownerId !== undefined && (obj.ownerId = message.ownerId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CollectionStatsRequest>, I>>(
    object: I
  ): CollectionStatsRequest {
    const message = createBaseCollectionStatsRequest();
    message.collectionId = object.collectionId ?? "";
    message.ownerId = object.ownerId ?? "";
    return message;
  },
};

function createBaseNFTCollectionAttributesRequest(): NFTCollectionAttributesRequest {
  return { collectionId: "", whereAttributes: [] };
}

export const NFTCollectionAttributesRequest = {
  encode(message: NFTCollectionAttributesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.collectionId !== "") {
      writer.uint32(10).string(message.collectionId);
    }
    for (const v of message.whereAttributes) {
      Attribute.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NFTCollectionAttributesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNFTCollectionAttributesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.collectionId = reader.string();
          break;
        case 2:
          message.whereAttributes.push(Attribute.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): NFTCollectionAttributesRequest {
    return {
      collectionId: isSet(object.collectionId) ? String(object.collectionId) : "",
      whereAttributes: Array.isArray(object?.whereAttributes)
        ? object.whereAttributes.map((e: any) => Attribute.fromJSON(e))
        : [],
    };
  },

  toJSON(message: NFTCollectionAttributesRequest): unknown {
    const obj: any = {};
    message.collectionId !== undefined && (obj.collectionId = message.collectionId);
    if (message.whereAttributes) {
      obj.whereAttributes = message.whereAttributes.map((e) => e ? Attribute.toJSON(e) : undefined);
    } else {
      obj.whereAttributes = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<NFTCollectionAttributesRequest>, I>>(
    object: I,
  ): NFTCollectionAttributesRequest {
    const message = createBaseNFTCollectionAttributesRequest();
    message.collectionId = object.collectionId ?? "";
    message.whereAttributes = object.whereAttributes?.map((e) => Attribute.fromPartial(e)) || [];
    return message;
  },
};

function createBaseCollectionStatsResponse(): CollectionStatsResponse {
  return { stats: undefined };
}

export const CollectionStatsResponse = {
  encode(
    message: CollectionStatsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.stats !== undefined) {
      CollectionStats.encode(message.stats, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): CollectionStatsResponse {
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
    return {
      stats: isSet(object.stats)
        ? CollectionStats.fromJSON(object.stats)
        : undefined,
    };
  },

  toJSON(message: CollectionStatsResponse): unknown {
    const obj: any = {};
    message.stats !== undefined &&
      (obj.stats = message.stats
        ? CollectionStats.toJSON(message.stats)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CollectionStatsResponse>, I>>(
    object: I
  ): CollectionStatsResponse {
    const message = createBaseCollectionStatsResponse();
    message.stats =
      object.stats !== undefined && object.stats !== null
        ? CollectionStats.fromPartial(object.stats)
        : undefined;
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

function createBaseNFTsRequest(): NFTsRequest {
  return {
    limit: 0,
    offset: 0,
    collectionId: "",
    ownerId: "",
    sort: 0,
    sortDirection: 0,
    attributes: [],
    isListed: false,
    priceRange: undefined,
  };
}

export const NFTsRequest = {
  encode(
    message: NFTsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
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
    for (const v of message.attributes) {
      Attribute.encode(v!, writer.uint32(58).fork()).ldelim();
    }
    if (message.isListed === true) {
      writer.uint32(64).bool(message.isListed);
    }
    if (message.priceRange !== undefined) {
      PriceRange.encode(message.priceRange, writer.uint32(74).fork()).ldelim();
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
          message.attributes.push(Attribute.decode(reader, reader.uint32()));
          break;
        case 8:
          message.isListed = reader.bool();
          break;
        case 9:
          message.priceRange = PriceRange.decode(reader, reader.uint32());
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
      collectionId: isSet(object.collectionId)
        ? String(object.collectionId)
        : "",
      ownerId: isSet(object.ownerId) ? String(object.ownerId) : "",
      sort: isSet(object.sort) ? sortFromJSON(object.sort) : 0,
      sortDirection: isSet(object.sortDirection) ? sortDirectionFromJSON(object.sortDirection) : 0,
      attributes: Array.isArray(object?.attributes) ? object.attributes.map((e: any) => Attribute.fromJSON(e)) : [],
      isListed: isSet(object.isListed) ? Boolean(object.isListed) : false,
      priceRange: isSet(object.priceRange) ? PriceRange.fromJSON(object.priceRange) : undefined,
    };
  },

  toJSON(message: NFTsRequest): unknown {
    const obj: any = {};
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.offset !== undefined && (obj.offset = Math.round(message.offset));
    message.collectionId !== undefined &&
      (obj.collectionId = message.collectionId);
    message.ownerId !== undefined && (obj.ownerId = message.ownerId);
    message.sort !== undefined && (obj.sort = sortToJSON(message.sort));
    message.sortDirection !== undefined && (obj.sortDirection = sortDirectionToJSON(message.sortDirection));
    if (message.attributes) {
      obj.attributes = message.attributes.map((e) => e ? Attribute.toJSON(e) : undefined);
    } else {
      obj.attributes = [];
    }
    message.isListed !== undefined && (obj.isListed = message.isListed);
    message.priceRange !== undefined &&
      (obj.priceRange = message.priceRange ? PriceRange.toJSON(message.priceRange) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<NFTsRequest>, I>>(
    object: I
  ): NFTsRequest {
    const message = createBaseNFTsRequest();
    message.limit = object.limit ?? 0;
    message.offset = object.offset ?? 0;
    message.collectionId = object.collectionId ?? "";
    message.ownerId = object.ownerId ?? "";
    message.sort = object.sort ?? 0;
    message.sortDirection = object.sortDirection ?? 0;
    message.attributes = object.attributes?.map((e) => Attribute.fromPartial(e)) || [];
    message.isListed = object.isListed ?? false;
    message.priceRange = (object.priceRange !== undefined && object.priceRange !== null)
      ? PriceRange.fromPartial(object.priceRange)
      : undefined;
    return message;
  },
};

function createBaseNFTsResponse(): NFTsResponse {
  return { nft: undefined };
}

export const NFTsResponse = {
  encode(
    message: NFTsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
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
    message.nft !== undefined &&
      (obj.nft = message.nft ? NFT.toJSON(message.nft) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<NFTsResponse>, I>>(
    object: I
  ): NFTsResponse {
    const message = createBaseNFTsResponse();
    message.nft =
      object.nft !== undefined && object.nft !== null
        ? NFT.fromPartial(object.nft)
        : undefined;
    return message;
  },
};

function createBaseQuestsRequest(): QuestsRequest {
  return { limit: 0, offset: 0, userId: "" };
}

export const QuestsRequest = {
  encode(
    message: QuestsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
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

  fromPartial<I extends Exact<DeepPartial<QuestsRequest>, I>>(
    object: I
  ): QuestsRequest {
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
  encode(
    message: QuestsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
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
    return {
      quest: isSet(object.quest) ? Quest.fromJSON(object.quest) : undefined,
    };
  },

  toJSON(message: QuestsResponse): unknown {
    const obj: any = {};
    message.quest !== undefined &&
      (obj.quest = message.quest ? Quest.toJSON(message.quest) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QuestsResponse>, I>>(
    object: I
  ): QuestsResponse {
    const message = createBaseQuestsResponse();
    message.quest =
      object.quest !== undefined && object.quest !== null
        ? Quest.fromPartial(object.quest)
        : undefined;
    return message;
  },
};

function createBaseActivityRequest(): ActivityRequest {
  return { collectionId: "", nftId: "", limit: 0, offset: 0 };
}

export const ActivityRequest = {
  encode(
    message: ActivityRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
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
      collectionId: isSet(object.collectionId)
        ? String(object.collectionId)
        : "",
      nftId: isSet(object.nftId) ? String(object.nftId) : "",
      limit: isSet(object.limit) ? Number(object.limit) : 0,
      offset: isSet(object.offset) ? Number(object.offset) : 0,
    };
  },

  toJSON(message: ActivityRequest): unknown {
    const obj: any = {};
    message.collectionId !== undefined &&
      (obj.collectionId = message.collectionId);
    message.nftId !== undefined && (obj.nftId = message.nftId);
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.offset !== undefined && (obj.offset = Math.round(message.offset));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ActivityRequest>, I>>(
    object: I
  ): ActivityRequest {
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
  encode(
    message: ActivityResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
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
      activity: isSet(object.activity)
        ? Activity.fromJSON(object.activity)
        : undefined,
      total: isSet(object.total) ? Number(object.total) : 0,
    };
  },

  toJSON(message: ActivityResponse): unknown {
    const obj: any = {};
    message.activity !== undefined &&
      (obj.activity = message.activity
        ? Activity.toJSON(message.activity)
        : undefined);
    message.total !== undefined && (obj.total = Math.round(message.total));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ActivityResponse>, I>>(
    object: I
  ): ActivityResponse {
    const message = createBaseActivityResponse();
    message.activity =
      object.activity !== undefined && object.activity !== null
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
  encode(
    message: NFTPriceHistoryRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): NFTPriceHistoryRequest {
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

  fromPartial<I extends Exact<DeepPartial<NFTPriceHistoryRequest>, I>>(
    object: I
  ): NFTPriceHistoryRequest {
    const message = createBaseNFTPriceHistoryRequest();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseNFTPriceHistoryResponse(): NFTPriceHistoryResponse {
  return { data: [] };
}

export const NFTPriceHistoryResponse = {
  encode(
    message: NFTPriceHistoryResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.data) {
      PriceDatum.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): NFTPriceHistoryResponse {
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
    return {
      data: Array.isArray(object?.data)
        ? object.data.map((e: any) => PriceDatum.fromJSON(e))
        : [],
    };
  },

  toJSON(message: NFTPriceHistoryResponse): unknown {
    const obj: any = {};
    if (message.data) {
      obj.data = message.data.map((e) =>
        e ? PriceDatum.toJSON(e) : undefined
      );
    } else {
      obj.data = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<NFTPriceHistoryResponse>, I>>(
    object: I
  ): NFTPriceHistoryResponse {
    const message = createBaseNFTPriceHistoryResponse();
    message.data = object.data?.map((e) => PriceDatum.fromPartial(e)) || [];
    return message;
  },
};

function createBaseAction(): Action {
  return { label: "", url: "" };
}

export const Action = {
  encode(
    message: Action,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
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
    return {
      label: isSet(object.label) ? String(object.label) : "",
      url: isSet(object.url) ? String(object.url) : "",
    };
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
      actions: Array.isArray(object?.actions)
        ? object.actions.map((e: any) => Action.fromJSON(e))
        : [],
    };
  },

  toJSON(message: News): unknown {
    const obj: any = {};
    message.title !== undefined && (obj.title = message.title);
    message.subtitle !== undefined && (obj.subtitle = message.subtitle);
    message.text !== undefined && (obj.text = message.text);
    message.image !== undefined && (obj.image = message.image);
    if (message.actions) {
      obj.actions = message.actions.map((e) =>
        e ? Action.toJSON(e) : undefined
      );
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

function createBaseDAppGroup(): DAppGroup {
  return { id: "", groupName: "", icon: "", options: [] };
}

export const DAppGroup = {
  encode(
    message: DAppGroup,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.groupName !== "") {
      writer.uint32(18).string(message.groupName);
    }
    if (message.icon !== "") {
      writer.uint32(26).string(message.icon);
    }
    for (const v of message.options) {
      writer.uint32(34).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DAppGroup {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDAppGroup();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.groupName = reader.string();
          break;
        case 3:
          message.icon = reader.string();
          break;
        case 4:
          message.options.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DAppGroup {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      groupName: isSet(object.groupName) ? String(object.groupName) : "",
      icon: isSet(object.icon) ? String(object.icon) : "",
      options: Array.isArray(object?.options)
        ? object.options.map((e: any) => String(e))
        : [],
    };
  },

  toJSON(message: DAppGroup): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.groupName !== undefined && (obj.groupName = message.groupName);
    message.icon !== undefined && (obj.icon = message.icon);
    if (message.options) {
      obj.options = message.options.map((e) => e);
    } else {
      obj.options = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DAppGroup>, I>>(
    object: I
  ): DAppGroup {
    const message = createBaseDAppGroup();
    message.id = object.id ?? "";
    message.groupName = object.groupName ?? "";
    message.icon = object.icon ?? "";
    message.options = object.options?.map((e) => e) || [];
    return message;
  },
};

function createBaseDApp(): DApp {
  return {
    id: "",
    title: "",
    description: "",
    icon: "",
    route: "",
    groupKey: "",
    linkingId: "",
    selectedByDefault: false,
    alwaysOn: false,
  };
}

export const DApp = {
  encode(message: DApp, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.title !== "") {
      writer.uint32(18).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(26).string(message.description);
    }
    if (message.icon !== "") {
      writer.uint32(34).string(message.icon);
    }
    if (message.route !== "") {
      writer.uint32(42).string(message.route);
    }
    if (message.groupKey !== "") {
      writer.uint32(50).string(message.groupKey);
    }
    if (message.linkingId !== "") {
      writer.uint32(58).string(message.linkingId);
    }
    if (message.selectedByDefault === true) {
      writer.uint32(64).bool(message.selectedByDefault);
    }
    if (message.alwaysOn === true) {
      writer.uint32(72).bool(message.alwaysOn);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DApp {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDApp();
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
          message.description = reader.string();
          break;
        case 4:
          message.icon = reader.string();
          break;
        case 5:
          message.route = reader.string();
          break;
        case 6:
          message.groupKey = reader.string();
          break;
        case 7:
          message.linkingId = reader.string();
          break;
        case 8:
          message.selectedByDefault = reader.bool();
          break;
        case 9:
          message.alwaysOn = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DApp {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      title: isSet(object.title) ? String(object.title) : "",
      description: isSet(object.description) ? String(object.description) : "",
      icon: isSet(object.icon) ? String(object.icon) : "",
      route: isSet(object.route) ? String(object.route) : "",
      groupKey: isSet(object.groupKey) ? String(object.groupKey) : "",
      linkingId: isSet(object.linkingId) ? String(object.linkingId) : "",
      selectedByDefault: isSet(object.selectedByDefault)
        ? Boolean(object.selectedByDefault)
        : false,
      alwaysOn: isSet(object.alwaysOn) ? Boolean(object.alwaysOn) : false,
    };
  },

  toJSON(message: DApp): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.title !== undefined && (obj.title = message.title);
    message.description !== undefined &&
      (obj.description = message.description);
    message.icon !== undefined && (obj.icon = message.icon);
    message.route !== undefined && (obj.route = message.route);
    message.groupKey !== undefined && (obj.groupKey = message.groupKey);
    message.linkingId !== undefined && (obj.linkingId = message.linkingId);
    message.selectedByDefault !== undefined &&
      (obj.selectedByDefault = message.selectedByDefault);
    message.alwaysOn !== undefined && (obj.alwaysOn = message.alwaysOn);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DApp>, I>>(object: I): DApp {
    const message = createBaseDApp();
    message.id = object.id ?? "";
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.icon = object.icon ?? "";
    message.route = object.route ?? "";
    message.groupKey = object.groupKey ?? "";
    message.linkingId = object.linkingId ?? "";
    message.selectedByDefault = object.selectedByDefault ?? false;
    message.alwaysOn = object.alwaysOn ?? false;
    return message;
  },
};

function createBaseBanner(): Banner {
  return { image: "", url: "" };
}

export const Banner = {
  encode(
    message: Banner,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
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
    return {
      image: isSet(object.image) ? String(object.image) : "",
      url: isSet(object.url) ? String(object.url) : "",
    };
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
  encode(
    message: BannersRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
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

  fromPartial<I extends Exact<DeepPartial<BannersRequest>, I>>(
    object: I
  ): BannersRequest {
    const message = createBaseBannersRequest();
    message.testnet = object.testnet ?? false;
    return message;
  },
};

function createBaseBannersResponse(): BannersResponse {
  return { banners: [] };
}

export const BannersResponse = {
  encode(
    message: BannersResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
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
    return {
      banners: Array.isArray(object?.banners)
        ? object.banners.map((e: any) => Banner.fromJSON(e))
        : [],
    };
  },

  toJSON(message: BannersResponse): unknown {
    const obj: any = {};
    if (message.banners) {
      obj.banners = message.banners.map((e) =>
        e ? Banner.toJSON(e) : undefined
      );
    } else {
      obj.banners = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<BannersResponse>, I>>(
    object: I
  ): BannersResponse {
    const message = createBaseBannersResponse();
    message.banners = object.banners?.map((e) => Banner.fromPartial(e)) || [];
    return message;
  },
};

function createBaseNewsRequest(): NewsRequest {
  return { testnet: false };
}

export const NewsRequest = {
  encode(
    message: NewsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
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

  fromPartial<I extends Exact<DeepPartial<NewsRequest>, I>>(
    object: I
  ): NewsRequest {
    const message = createBaseNewsRequest();
    message.testnet = object.testnet ?? false;
    return message;
  },
};

function createBaseNewsResponse(): NewsResponse {
  return { news: [] };
}

export const NewsResponse = {
  encode(
    message: NewsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
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
    return {
      news: Array.isArray(object?.news)
        ? object.news.map((e: any) => News.fromJSON(e))
        : [],
    };
  },

  toJSON(message: NewsResponse): unknown {
    const obj: any = {};
    if (message.news) {
      obj.news = message.news.map((e) => (e ? News.toJSON(e) : undefined));
    } else {
      obj.news = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<NewsResponse>, I>>(
    object: I
  ): NewsResponse {
    const message = createBaseNewsResponse();
    message.news = object.news?.map((e) => News.fromPartial(e)) || [];
    return message;
  },
};

function createBaseDAppsRequest(): DAppsRequest {
  return {};
}

export const DAppsRequest = {
  encode(_: DAppsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DAppsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDAppsRequest();
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

  fromJSON(_: any): DAppsRequest {
    return {};
  },

  toJSON(_: DAppsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DAppsRequest>, I>>(_: I): DAppsRequest {
    const message = createBaseDAppsRequest();
    return message;
  },
};

function createBaseDAppsResponse(): DAppsResponse {
  return { group: [] };
}

export const DAppsResponse = {
  encode(message: DAppsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.group) {
      DApp.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DAppsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDAppsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.group.push(DApp.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DAppsResponse {
    return { group: Array.isArray(object?.group) ? object.group.map((e: any) => DApp.fromJSON(e)) : [] };
  },

  toJSON(message: DAppsResponse): unknown {
    const obj: any = {};
    if (message.group) {
      obj.group = message.group.map((e) => (e ? DApp.toJSON(e) : undefined));
    } else {
      obj.group = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DAppsResponse>, I>>(object: I): DAppsResponse {
    const message = createBaseDAppsResponse();
    message.group = object.group?.map((e) => DApp.fromPartial(e)) || [];
    return message;
  },
};

function createBaseDAppsGroupsRequest(): DAppsGroupsRequest {
  return {};
}

export const DAppsGroupsRequest = {
  encode(_: DAppsGroupsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DAppsGroupsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDAppsGroupsRequest();
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

  fromJSON(_: any): DAppsGroupsRequest {
    return {};
  },

  toJSON(_: DAppsGroupsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DAppsGroupsRequest>, I>>(_: I): DAppsGroupsRequest {
    const message = createBaseDAppsGroupsRequest();
    return message;
  },
};

function createBaseDAppsGroupsResponse(): DAppsGroupsResponse {
  return { group: [] };
}

export const DAppsGroupsResponse = {
  encode(message: DAppsGroupsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.group) {
      DAppGroup.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DAppsGroupsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDAppsGroupsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.group.push(DAppGroup.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DAppsGroupsResponse {
    return { group: Array.isArray(object?.group) ? object.group.map((e: any) => DAppGroup.fromJSON(e)) : [] };
  },

  toJSON(message: DAppsGroupsResponse): unknown {
    const obj: any = {};
    if (message.group) {
      obj.group = message.group.map((e) => e ? DAppGroup.toJSON(e) : undefined);
    } else {
      obj.group = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DAppsGroupsResponse>, I>>(object: I): DAppsGroupsResponse {
    const message = createBaseDAppsGroupsResponse();
    message.group = object.group?.map((e) => DAppGroup.fromPartial(e)) || [];
    return message;
  },
};

function createBaseSearchNamesRequest(): SearchNamesRequest {
  return { networkId: "", input: "", limit: 0 };
}

export const SearchNamesRequest = {
  encode(
    message: SearchNamesRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.networkId !== "") {
      writer.uint32(10).string(message.networkId);
    }
    if (message.input !== "") {
      writer.uint32(18).string(message.input);
    }
    if (message.limit !== 0) {
      writer.uint32(24).int32(message.limit);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SearchNamesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSearchNamesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.networkId = reader.string();
          break;
        case 2:
          message.input = reader.string();
          break;
        case 3:
          message.limit = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SearchNamesRequest {
    return {
      networkId: isSet(object.networkId) ? String(object.networkId) : "",
      input: isSet(object.input) ? String(object.input) : "",
      limit: isSet(object.limit) ? Number(object.limit) : 0,
    };
  },

  toJSON(message: SearchNamesRequest): unknown {
    const obj: any = {};
    message.networkId !== undefined && (obj.networkId = message.networkId);
    message.input !== undefined && (obj.input = message.input);
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SearchNamesRequest>, I>>(
    object: I
  ): SearchNamesRequest {
    const message = createBaseSearchNamesRequest();
    message.networkId = object.networkId ?? "";
    message.input = object.input ?? "";
    message.limit = object.limit ?? 0;
    return message;
  },
};

function createBaseSearchNamesResponse(): SearchNamesResponse {
  return { names: [] };
}

export const SearchNamesResponse = {
  encode(
    message: SearchNamesResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.names) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SearchNamesResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSearchNamesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.names.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SearchNamesResponse {
    return {
      names: Array.isArray(object?.names)
        ? object.names.map((e: any) => String(e))
        : [],
    };
  },

  toJSON(message: SearchNamesResponse): unknown {
    const obj: any = {};
    if (message.names) {
      obj.names = message.names.map((e) => e);
    } else {
      obj.names = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SearchNamesResponse>, I>>(
    object: I
  ): SearchNamesResponse {
    const message = createBaseSearchNamesResponse();
    message.names = object.names?.map((e) => e) || [];
    return message;
  },
};

function createBaseSearchCollectionsRequest(): SearchCollectionsRequest {
  return { input: "", limit: 0 };
}

export const SearchCollectionsRequest = {
  encode(
    message: SearchCollectionsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.input !== "") {
      writer.uint32(10).string(message.input);
    }
    if (message.limit !== 0) {
      writer.uint32(16).int32(message.limit);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): SearchCollectionsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSearchCollectionsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.input = reader.string();
          break;
        case 2:
          message.limit = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SearchCollectionsRequest {
    return {
      input: isSet(object.input) ? String(object.input) : "",
      limit: isSet(object.limit) ? Number(object.limit) : 0,
    };
  },

  toJSON(message: SearchCollectionsRequest): unknown {
    const obj: any = {};
    message.input !== undefined && (obj.input = message.input);
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SearchCollectionsRequest>, I>>(
    object: I
  ): SearchCollectionsRequest {
    const message = createBaseSearchCollectionsRequest();
    message.input = object.input ?? "";
    message.limit = object.limit ?? 0;
    return message;
  },
};

function createBaseSearchCollectionsResponse(): SearchCollectionsResponse {
  return { collections: [] };
}

export const SearchCollectionsResponse = {
  encode(
    message: SearchCollectionsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.collections) {
      Collection.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): SearchCollectionsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSearchCollectionsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.collections.push(Collection.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SearchCollectionsResponse {
    return {
      collections: Array.isArray(object?.collections)
        ? object.collections.map((e: any) => Collection.fromJSON(e))
        : [],
    };
  },

  toJSON(message: SearchCollectionsResponse): unknown {
    const obj: any = {};
    if (message.collections) {
      obj.collections = message.collections.map((e) =>
        e ? Collection.toJSON(e) : undefined
      );
    } else {
      obj.collections = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SearchCollectionsResponse>, I>>(
    object: I
  ): SearchCollectionsResponse {
    const message = createBaseSearchCollectionsResponse();
    message.collections =
      object.collections?.map((e) => Collection.fromPartial(e)) || [];
    return message;
  },
};

export interface MarketplaceService {
  Collections(
    request: DeepPartial<CollectionsRequest>,
    metadata?: grpc.Metadata
  ): Observable<CollectionsResponse>;
  CollectionStats(
    request: DeepPartial<CollectionStatsRequest>,
    metadata?: grpc.Metadata
  ): Promise<CollectionStatsResponse>;
  NFTs(request: DeepPartial<NFTsRequest>, metadata?: grpc.Metadata): Observable<NFTsResponse>;
  NFTCollectionAttributes(
    request: DeepPartial<NFTCollectionAttributesRequest>,
    metadata?: grpc.Metadata,
  ): Observable<NFTCollectionAttributesResponse>;
  Quests(request: DeepPartial<QuestsRequest>, metadata?: grpc.Metadata): Observable<QuestsResponse>;
  Activity(request: DeepPartial<ActivityRequest>, metadata?: grpc.Metadata): Observable<ActivityResponse>;
  NFTPriceHistory(
    request: DeepPartial<NFTPriceHistoryRequest>,
    metadata?: grpc.Metadata
  ): Promise<NFTPriceHistoryResponse>;
  Banners(request: DeepPartial<BannersRequest>, metadata?: grpc.Metadata): Promise<BannersResponse>;
  News(request: DeepPartial<NewsRequest>, metadata?: grpc.Metadata): Promise<NewsResponse>;
  DApps(request: DeepPartial<DAppsRequest>, metadata?: grpc.Metadata): Promise<DAppsResponse>;
  DAppsGroups(request: DeepPartial<DAppsGroupsRequest>, metadata?: grpc.Metadata): Promise<DAppsGroupsResponse>;
  SearchNames(request: DeepPartial<SearchNamesRequest>, metadata?: grpc.Metadata): Promise<SearchNamesResponse>;
  SearchCollections(
    request: DeepPartial<SearchCollectionsRequest>,
    metadata?: grpc.Metadata
  ): Promise<SearchCollectionsResponse>;
}

export class MarketplaceServiceClientImpl implements MarketplaceService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Collections = this.Collections.bind(this);
    this.CollectionStats = this.CollectionStats.bind(this);
    this.NFTs = this.NFTs.bind(this);
    this.NFTCollectionAttributes = this.NFTCollectionAttributes.bind(this);
    this.Quests = this.Quests.bind(this);
    this.Activity = this.Activity.bind(this);
    this.NFTPriceHistory = this.NFTPriceHistory.bind(this);
    this.Banners = this.Banners.bind(this);
    this.News = this.News.bind(this);
    this.DApps = this.DApps.bind(this);
    this.DAppsGroups = this.DAppsGroups.bind(this);
    this.SearchNames = this.SearchNames.bind(this);
    this.SearchCollections = this.SearchCollections.bind(this);
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

  CollectionStats(
    request: DeepPartial<CollectionStatsRequest>,
    metadata?: grpc.Metadata
  ): Promise<CollectionStatsResponse> {
    return this.rpc.unary(
      MarketplaceServiceCollectionStatsDesc,
      CollectionStatsRequest.fromPartial(request),
      metadata
    );
  }

  NFTs(
    request: DeepPartial<NFTsRequest>,
    metadata?: grpc.Metadata
  ): Observable<NFTsResponse> {
    return this.rpc.invoke(
      MarketplaceServiceNFTsDesc,
      NFTsRequest.fromPartial(request),
      metadata
    );
  }

  NFTCollectionAttributes(
    request: DeepPartial<NFTCollectionAttributesRequest>,
    metadata?: grpc.Metadata,
  ): Observable<NFTCollectionAttributesResponse> {
    return this.rpc.invoke(
      MarketplaceServiceNFTCollectionAttributesDesc,
      NFTCollectionAttributesRequest.fromPartial(request),
      metadata,
    );
  }

  Quests(request: DeepPartial<QuestsRequest>, metadata?: grpc.Metadata): Observable<QuestsResponse> {
    return this.rpc.invoke(MarketplaceServiceQuestsDesc, QuestsRequest.fromPartial(request), metadata);
  }

  Activity(
    request: DeepPartial<ActivityRequest>,
    metadata?: grpc.Metadata
  ): Observable<ActivityResponse> {
    return this.rpc.invoke(
      MarketplaceServiceActivityDesc,
      ActivityRequest.fromPartial(request),
      metadata
    );
  }

  NFTPriceHistory(
    request: DeepPartial<NFTPriceHistoryRequest>,
    metadata?: grpc.Metadata
  ): Promise<NFTPriceHistoryResponse> {
    return this.rpc.unary(
      MarketplaceServiceNFTPriceHistoryDesc,
      NFTPriceHistoryRequest.fromPartial(request),
      metadata
    );
  }

  Banners(
    request: DeepPartial<BannersRequest>,
    metadata?: grpc.Metadata
  ): Promise<BannersResponse> {
    return this.rpc.unary(
      MarketplaceServiceBannersDesc,
      BannersRequest.fromPartial(request),
      metadata
    );
  }

  News(
    request: DeepPartial<NewsRequest>,
    metadata?: grpc.Metadata
  ): Promise<NewsResponse> {
    return this.rpc.unary(
      MarketplaceServiceNewsDesc,
      NewsRequest.fromPartial(request),
      metadata
    );
  }

  DApps(request: DeepPartial<DAppsRequest>, metadata?: grpc.Metadata): Promise<DAppsResponse> {
    return this.rpc.unary(MarketplaceServiceDAppsDesc, DAppsRequest.fromPartial(request), metadata);
  }

  DAppsGroups(request: DeepPartial<DAppsGroupsRequest>, metadata?: grpc.Metadata): Promise<DAppsGroupsResponse> {
    return this.rpc.unary(MarketplaceServiceDAppsGroupsDesc, DAppsGroupsRequest.fromPartial(request), metadata);
  }

  SearchNames(
    request: DeepPartial<SearchNamesRequest>,
    metadata?: grpc.Metadata
  ): Promise<SearchNamesResponse> {
    return this.rpc.unary(
      MarketplaceServiceSearchNamesDesc,
      SearchNamesRequest.fromPartial(request),
      metadata
    );
  }

  SearchCollections(
    request: DeepPartial<SearchCollectionsRequest>,
    metadata?: grpc.Metadata
  ): Promise<SearchCollectionsResponse> {
    return this.rpc.unary(
      MarketplaceServiceSearchCollectionsDesc,
      SearchCollectionsRequest.fromPartial(request),
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

export const MarketplaceServiceNFTCollectionAttributesDesc: UnaryMethodDefinitionish = {
  methodName: "NFTCollectionAttributes",
  service: MarketplaceServiceDesc,
  requestStream: false,
  responseStream: true,
  requestType: {
    serializeBinary() {
      return NFTCollectionAttributesRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...NFTCollectionAttributesResponse.decode(data),
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

export const MarketplaceServiceDAppsDesc: UnaryMethodDefinitionish = {
  methodName: "DApps",
  service: MarketplaceServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return DAppsRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...DAppsResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const MarketplaceServiceDAppsGroupsDesc: UnaryMethodDefinitionish = {
  methodName: "DAppsGroups",
  service: MarketplaceServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return DAppsGroupsRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...DAppsGroupsResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const MarketplaceServiceSearchNamesDesc: UnaryMethodDefinitionish = {
  methodName: "SearchNames",
  service: MarketplaceServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return SearchNamesRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...SearchNamesResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const MarketplaceServiceSearchCollectionsDesc: UnaryMethodDefinitionish =
  {
    methodName: "SearchCollections",
    service: MarketplaceServiceDesc,
    requestStream: false,
    responseStream: false,
    requestType: {
      serializeBinary() {
        return SearchCollectionsRequest.encode(this).finish();
      },
    } as any,
    responseType: {
      deserializeBinary(data: Uint8Array) {
        return {
          ...SearchCollectionsResponse.decode(data),
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
          transport: ReactNativeTransport({}),
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
  constructor(
    message: string,
    public code: grpc.Code,
    public metadata: grpc.Metadata
  ) {
    super(message);
  }
}
