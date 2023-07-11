/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";
import { share } from "rxjs/operators";

export const protobufPackage = "pathwar.v1";

export enum Status {
  OPEN = 0,
  CLOSE = 1,
  UNRECOGNIZED = -1,
}

export function statusFromJSON(object: any): Status {
  switch (object) {
    case 0:
    case "OPEN":
      return Status.OPEN;
    case 1:
    case "CLOSE":
      return Status.CLOSE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Status.UNRECOGNIZED;
  }
}

export function statusToJSON(object: Status): string {
  switch (object) {
    case Status.OPEN:
      return "OPEN";
    case Status.CLOSE:
      return "CLOSE";
    case Status.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface Category {
  id: number;
  text: string;
}

export interface Tag {
  id: number;
  text: string;
}

export interface Money {
  denom: string;
  amount: string;
}

export interface PublicUser {
  address: string;
}

/** user */
export interface RegisterUserRequest {
  address: string;
}

export interface RegisterUserResponse {
  status: string;
}

/** stats page */
export interface LeaderboardRequest {
  seasonId: string;
  limit: number;
  offset: number;
}

export interface PathwarLeaderboardItem {
  rank: number;
  address: string;
  team: string;
  lastTournament: string;
  score: number;
  balance: Money | undefined;
}

export interface LeaderboardResponse {
  statistics: PathwarLeaderboardItem[];
}

export interface ResourcesRequest {
  type: number;
  limit: number;
  offset: number;
}

export interface Resources {
  id: number;
  /** video, article, etc */
  type: number;
  /** cosmos, gno, web, etc */
  category: Category[];
  tags: Tag[];
  thumbnail: string;
  title: string;
  liked: boolean;
  description: string;
}

export interface ResourcesResponse {
  resources: Resources[];
}

export interface TournamentsRequest {
  limit: number;
  offset: number;
  /** needed for is bought ... */
  userAddress: string;
}

export interface Tournament {
  id: number;
  price: Money | undefined;
  thumbnail: string;
  title: string;
  tagline: string;
  description: string;
  difficulty: string;
  /** open, soon, closed */
  status: Status;
  duration: string;
  numUsersJoined: number;
  rewards: Money[];
  bought: boolean;
}

export interface TournamentsResponse {
  tournaments: Tournament[];
}

export interface Challenge {
  id: number;
  price: Money | undefined;
  thumbnail: string;
  title: string;
  tagline: string;
  description: string;
  difficulty: string;
  /** open, soon, closed */
  status: Status;
  duration: string;
  numUsersJoined: number;
  rewards: Money[];
  bought: boolean;
  tags: Tag[];
  starUser: PublicUser | undefined;
  topUsers: PublicUser[];
  solved: boolean;
  solvedCount: number;
}

export interface ChallengeRequest {
  id: number;
}

export interface ChallengeResponse {
  challenge: Challenge | undefined;
}

export interface ChallengeValidateRequest {
  id: number;
  passphrase: string;
  comment: string;
}

export interface ChallengeValidateResponse {
  status: string;
}

export interface ChallengeListingRequest {
  limit: number;
  offset: number;
  /** needed for is bought ... */
  userAddress: string;
}

export interface ChallengeListingResponse {
  challenges: Challenge[];
}

function createBaseCategory(): Category {
  return { id: 0, text: "" };
}

export const Category = {
  encode(message: Category, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).int32(message.id);
    }
    if (message.text !== "") {
      writer.uint32(18).string(message.text);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Category {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCategory();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.int32();
          break;
        case 2:
          message.text = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Category {
    return { id: isSet(object.id) ? Number(object.id) : 0, text: isSet(object.text) ? String(object.text) : "" };
  },

  toJSON(message: Category): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    message.text !== undefined && (obj.text = message.text);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Category>, I>>(object: I): Category {
    const message = createBaseCategory();
    message.id = object.id ?? 0;
    message.text = object.text ?? "";
    return message;
  },
};

function createBaseTag(): Tag {
  return { id: 0, text: "" };
}

export const Tag = {
  encode(message: Tag, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).int32(message.id);
    }
    if (message.text !== "") {
      writer.uint32(18).string(message.text);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Tag {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTag();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.int32();
          break;
        case 2:
          message.text = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Tag {
    return { id: isSet(object.id) ? Number(object.id) : 0, text: isSet(object.text) ? String(object.text) : "" };
  },

  toJSON(message: Tag): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    message.text !== undefined && (obj.text = message.text);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Tag>, I>>(object: I): Tag {
    const message = createBaseTag();
    message.id = object.id ?? 0;
    message.text = object.text ?? "";
    return message;
  },
};

function createBaseMoney(): Money {
  return { denom: "", amount: "" };
}

export const Money = {
  encode(message: Money, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.denom !== "") {
      writer.uint32(10).string(message.denom);
    }
    if (message.amount !== "") {
      writer.uint32(18).string(message.amount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Money {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMoney();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.denom = reader.string();
          break;
        case 2:
          message.amount = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Money {
    return {
      denom: isSet(object.denom) ? String(object.denom) : "",
      amount: isSet(object.amount) ? String(object.amount) : "",
    };
  },

  toJSON(message: Money): unknown {
    const obj: any = {};
    message.denom !== undefined && (obj.denom = message.denom);
    message.amount !== undefined && (obj.amount = message.amount);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Money>, I>>(object: I): Money {
    const message = createBaseMoney();
    message.denom = object.denom ?? "";
    message.amount = object.amount ?? "";
    return message;
  },
};

function createBasePublicUser(): PublicUser {
  return { address: "" };
}

export const PublicUser = {
  encode(message: PublicUser, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PublicUser {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePublicUser();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PublicUser {
    return { address: isSet(object.address) ? String(object.address) : "" };
  },

  toJSON(message: PublicUser): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PublicUser>, I>>(object: I): PublicUser {
    const message = createBasePublicUser();
    message.address = object.address ?? "";
    return message;
  },
};

function createBaseRegisterUserRequest(): RegisterUserRequest {
  return { address: "" };
}

export const RegisterUserRequest = {
  encode(message: RegisterUserRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RegisterUserRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRegisterUserRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RegisterUserRequest {
    return { address: isSet(object.address) ? String(object.address) : "" };
  },

  toJSON(message: RegisterUserRequest): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RegisterUserRequest>, I>>(object: I): RegisterUserRequest {
    const message = createBaseRegisterUserRequest();
    message.address = object.address ?? "";
    return message;
  },
};

function createBaseRegisterUserResponse(): RegisterUserResponse {
  return { status: "" };
}

export const RegisterUserResponse = {
  encode(message: RegisterUserResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.status !== "") {
      writer.uint32(10).string(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RegisterUserResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRegisterUserResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.status = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RegisterUserResponse {
    return { status: isSet(object.status) ? String(object.status) : "" };
  },

  toJSON(message: RegisterUserResponse): unknown {
    const obj: any = {};
    message.status !== undefined && (obj.status = message.status);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RegisterUserResponse>, I>>(object: I): RegisterUserResponse {
    const message = createBaseRegisterUserResponse();
    message.status = object.status ?? "";
    return message;
  },
};

function createBaseLeaderboardRequest(): LeaderboardRequest {
  return { seasonId: "", limit: 0, offset: 0 };
}

export const LeaderboardRequest = {
  encode(message: LeaderboardRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.seasonId !== "") {
      writer.uint32(10).string(message.seasonId);
    }
    if (message.limit !== 0) {
      writer.uint32(16).int32(message.limit);
    }
    if (message.offset !== 0) {
      writer.uint32(24).int32(message.offset);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LeaderboardRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLeaderboardRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.seasonId = reader.string();
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

  fromJSON(object: any): LeaderboardRequest {
    return {
      seasonId: isSet(object.seasonId) ? String(object.seasonId) : "",
      limit: isSet(object.limit) ? Number(object.limit) : 0,
      offset: isSet(object.offset) ? Number(object.offset) : 0,
    };
  },

  toJSON(message: LeaderboardRequest): unknown {
    const obj: any = {};
    message.seasonId !== undefined && (obj.seasonId = message.seasonId);
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.offset !== undefined && (obj.offset = Math.round(message.offset));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<LeaderboardRequest>, I>>(object: I): LeaderboardRequest {
    const message = createBaseLeaderboardRequest();
    message.seasonId = object.seasonId ?? "";
    message.limit = object.limit ?? 0;
    message.offset = object.offset ?? 0;
    return message;
  },
};

function createBasePathwarLeaderboardItem(): PathwarLeaderboardItem {
  return { rank: 0, address: "", team: "", lastTournament: "", score: 0, balance: undefined };
}

export const PathwarLeaderboardItem = {
  encode(message: PathwarLeaderboardItem, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.rank !== 0) {
      writer.uint32(8).int32(message.rank);
    }
    if (message.address !== "") {
      writer.uint32(18).string(message.address);
    }
    if (message.team !== "") {
      writer.uint32(26).string(message.team);
    }
    if (message.lastTournament !== "") {
      writer.uint32(34).string(message.lastTournament);
    }
    if (message.score !== 0) {
      writer.uint32(40).int32(message.score);
    }
    if (message.balance !== undefined) {
      Money.encode(message.balance, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PathwarLeaderboardItem {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePathwarLeaderboardItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.rank = reader.int32();
          break;
        case 2:
          message.address = reader.string();
          break;
        case 3:
          message.team = reader.string();
          break;
        case 4:
          message.lastTournament = reader.string();
          break;
        case 5:
          message.score = reader.int32();
          break;
        case 6:
          message.balance = Money.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PathwarLeaderboardItem {
    return {
      rank: isSet(object.rank) ? Number(object.rank) : 0,
      address: isSet(object.address) ? String(object.address) : "",
      team: isSet(object.team) ? String(object.team) : "",
      lastTournament: isSet(object.lastTournament) ? String(object.lastTournament) : "",
      score: isSet(object.score) ? Number(object.score) : 0,
      balance: isSet(object.balance) ? Money.fromJSON(object.balance) : undefined,
    };
  },

  toJSON(message: PathwarLeaderboardItem): unknown {
    const obj: any = {};
    message.rank !== undefined && (obj.rank = Math.round(message.rank));
    message.address !== undefined && (obj.address = message.address);
    message.team !== undefined && (obj.team = message.team);
    message.lastTournament !== undefined && (obj.lastTournament = message.lastTournament);
    message.score !== undefined && (obj.score = Math.round(message.score));
    message.balance !== undefined && (obj.balance = message.balance ? Money.toJSON(message.balance) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PathwarLeaderboardItem>, I>>(object: I): PathwarLeaderboardItem {
    const message = createBasePathwarLeaderboardItem();
    message.rank = object.rank ?? 0;
    message.address = object.address ?? "";
    message.team = object.team ?? "";
    message.lastTournament = object.lastTournament ?? "";
    message.score = object.score ?? 0;
    message.balance = (object.balance !== undefined && object.balance !== null)
      ? Money.fromPartial(object.balance)
      : undefined;
    return message;
  },
};

function createBaseLeaderboardResponse(): LeaderboardResponse {
  return { statistics: [] };
}

export const LeaderboardResponse = {
  encode(message: LeaderboardResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.statistics) {
      PathwarLeaderboardItem.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LeaderboardResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLeaderboardResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.statistics.push(PathwarLeaderboardItem.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LeaderboardResponse {
    return {
      statistics: Array.isArray(object?.statistics)
        ? object.statistics.map((e: any) => PathwarLeaderboardItem.fromJSON(e))
        : [],
    };
  },

  toJSON(message: LeaderboardResponse): unknown {
    const obj: any = {};
    if (message.statistics) {
      obj.statistics = message.statistics.map((e) => e ? PathwarLeaderboardItem.toJSON(e) : undefined);
    } else {
      obj.statistics = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<LeaderboardResponse>, I>>(object: I): LeaderboardResponse {
    const message = createBaseLeaderboardResponse();
    message.statistics = object.statistics?.map((e) => PathwarLeaderboardItem.fromPartial(e)) || [];
    return message;
  },
};

function createBaseResourcesRequest(): ResourcesRequest {
  return { type: 0, limit: 0, offset: 0 };
}

export const ResourcesRequest = {
  encode(message: ResourcesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.type !== 0) {
      writer.uint32(8).int32(message.type);
    }
    if (message.limit !== 0) {
      writer.uint32(16).int32(message.limit);
    }
    if (message.offset !== 0) {
      writer.uint32(24).int32(message.offset);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ResourcesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseResourcesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.type = reader.int32();
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

  fromJSON(object: any): ResourcesRequest {
    return {
      type: isSet(object.type) ? Number(object.type) : 0,
      limit: isSet(object.limit) ? Number(object.limit) : 0,
      offset: isSet(object.offset) ? Number(object.offset) : 0,
    };
  },

  toJSON(message: ResourcesRequest): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = Math.round(message.type));
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.offset !== undefined && (obj.offset = Math.round(message.offset));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ResourcesRequest>, I>>(object: I): ResourcesRequest {
    const message = createBaseResourcesRequest();
    message.type = object.type ?? 0;
    message.limit = object.limit ?? 0;
    message.offset = object.offset ?? 0;
    return message;
  },
};

function createBaseResources(): Resources {
  return { id: 0, type: 0, category: [], tags: [], thumbnail: "", title: "", liked: false, description: "" };
}

export const Resources = {
  encode(message: Resources, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).int32(message.id);
    }
    if (message.type !== 0) {
      writer.uint32(16).int32(message.type);
    }
    for (const v of message.category) {
      Category.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.tags) {
      Tag.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    if (message.thumbnail !== "") {
      writer.uint32(42).string(message.thumbnail);
    }
    if (message.title !== "") {
      writer.uint32(50).string(message.title);
    }
    if (message.liked === true) {
      writer.uint32(56).bool(message.liked);
    }
    if (message.description !== "") {
      writer.uint32(66).string(message.description);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Resources {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseResources();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.int32();
          break;
        case 2:
          message.type = reader.int32();
          break;
        case 3:
          message.category.push(Category.decode(reader, reader.uint32()));
          break;
        case 4:
          message.tags.push(Tag.decode(reader, reader.uint32()));
          break;
        case 5:
          message.thumbnail = reader.string();
          break;
        case 6:
          message.title = reader.string();
          break;
        case 7:
          message.liked = reader.bool();
          break;
        case 8:
          message.description = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Resources {
    return {
      id: isSet(object.id) ? Number(object.id) : 0,
      type: isSet(object.type) ? Number(object.type) : 0,
      category: Array.isArray(object?.category) ? object.category.map((e: any) => Category.fromJSON(e)) : [],
      tags: Array.isArray(object?.tags) ? object.tags.map((e: any) => Tag.fromJSON(e)) : [],
      thumbnail: isSet(object.thumbnail) ? String(object.thumbnail) : "",
      title: isSet(object.title) ? String(object.title) : "",
      liked: isSet(object.liked) ? Boolean(object.liked) : false,
      description: isSet(object.description) ? String(object.description) : "",
    };
  },

  toJSON(message: Resources): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    message.type !== undefined && (obj.type = Math.round(message.type));
    if (message.category) {
      obj.category = message.category.map((e) => e ? Category.toJSON(e) : undefined);
    } else {
      obj.category = [];
    }
    if (message.tags) {
      obj.tags = message.tags.map((e) => e ? Tag.toJSON(e) : undefined);
    } else {
      obj.tags = [];
    }
    message.thumbnail !== undefined && (obj.thumbnail = message.thumbnail);
    message.title !== undefined && (obj.title = message.title);
    message.liked !== undefined && (obj.liked = message.liked);
    message.description !== undefined && (obj.description = message.description);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Resources>, I>>(object: I): Resources {
    const message = createBaseResources();
    message.id = object.id ?? 0;
    message.type = object.type ?? 0;
    message.category = object.category?.map((e) => Category.fromPartial(e)) || [];
    message.tags = object.tags?.map((e) => Tag.fromPartial(e)) || [];
    message.thumbnail = object.thumbnail ?? "";
    message.title = object.title ?? "";
    message.liked = object.liked ?? false;
    message.description = object.description ?? "";
    return message;
  },
};

function createBaseResourcesResponse(): ResourcesResponse {
  return { resources: [] };
}

export const ResourcesResponse = {
  encode(message: ResourcesResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.resources) {
      Resources.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ResourcesResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseResourcesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.resources.push(Resources.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ResourcesResponse {
    return {
      resources: Array.isArray(object?.resources) ? object.resources.map((e: any) => Resources.fromJSON(e)) : [],
    };
  },

  toJSON(message: ResourcesResponse): unknown {
    const obj: any = {};
    if (message.resources) {
      obj.resources = message.resources.map((e) => e ? Resources.toJSON(e) : undefined);
    } else {
      obj.resources = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ResourcesResponse>, I>>(object: I): ResourcesResponse {
    const message = createBaseResourcesResponse();
    message.resources = object.resources?.map((e) => Resources.fromPartial(e)) || [];
    return message;
  },
};

function createBaseTournamentsRequest(): TournamentsRequest {
  return { limit: 0, offset: 0, userAddress: "" };
}

export const TournamentsRequest = {
  encode(message: TournamentsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.limit !== 0) {
      writer.uint32(8).int32(message.limit);
    }
    if (message.offset !== 0) {
      writer.uint32(16).int32(message.offset);
    }
    if (message.userAddress !== "") {
      writer.uint32(26).string(message.userAddress);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TournamentsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTournamentsRequest();
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
          message.userAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TournamentsRequest {
    return {
      limit: isSet(object.limit) ? Number(object.limit) : 0,
      offset: isSet(object.offset) ? Number(object.offset) : 0,
      userAddress: isSet(object.userAddress) ? String(object.userAddress) : "",
    };
  },

  toJSON(message: TournamentsRequest): unknown {
    const obj: any = {};
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.offset !== undefined && (obj.offset = Math.round(message.offset));
    message.userAddress !== undefined && (obj.userAddress = message.userAddress);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TournamentsRequest>, I>>(object: I): TournamentsRequest {
    const message = createBaseTournamentsRequest();
    message.limit = object.limit ?? 0;
    message.offset = object.offset ?? 0;
    message.userAddress = object.userAddress ?? "";
    return message;
  },
};

function createBaseTournament(): Tournament {
  return {
    id: 0,
    price: undefined,
    thumbnail: "",
    title: "",
    tagline: "",
    description: "",
    difficulty: "",
    status: 0,
    duration: "",
    numUsersJoined: 0,
    rewards: [],
    bought: false,
  };
}

export const Tournament = {
  encode(message: Tournament, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).int32(message.id);
    }
    if (message.price !== undefined) {
      Money.encode(message.price, writer.uint32(18).fork()).ldelim();
    }
    if (message.thumbnail !== "") {
      writer.uint32(26).string(message.thumbnail);
    }
    if (message.title !== "") {
      writer.uint32(34).string(message.title);
    }
    if (message.tagline !== "") {
      writer.uint32(42).string(message.tagline);
    }
    if (message.description !== "") {
      writer.uint32(50).string(message.description);
    }
    if (message.difficulty !== "") {
      writer.uint32(58).string(message.difficulty);
    }
    if (message.status !== 0) {
      writer.uint32(64).int32(message.status);
    }
    if (message.duration !== "") {
      writer.uint32(74).string(message.duration);
    }
    if (message.numUsersJoined !== 0) {
      writer.uint32(80).int32(message.numUsersJoined);
    }
    for (const v of message.rewards) {
      Money.encode(v!, writer.uint32(90).fork()).ldelim();
    }
    if (message.bought === true) {
      writer.uint32(96).bool(message.bought);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Tournament {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTournament();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.int32();
          break;
        case 2:
          message.price = Money.decode(reader, reader.uint32());
          break;
        case 3:
          message.thumbnail = reader.string();
          break;
        case 4:
          message.title = reader.string();
          break;
        case 5:
          message.tagline = reader.string();
          break;
        case 6:
          message.description = reader.string();
          break;
        case 7:
          message.difficulty = reader.string();
          break;
        case 8:
          message.status = reader.int32() as any;
          break;
        case 9:
          message.duration = reader.string();
          break;
        case 10:
          message.numUsersJoined = reader.int32();
          break;
        case 11:
          message.rewards.push(Money.decode(reader, reader.uint32()));
          break;
        case 12:
          message.bought = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Tournament {
    return {
      id: isSet(object.id) ? Number(object.id) : 0,
      price: isSet(object.price) ? Money.fromJSON(object.price) : undefined,
      thumbnail: isSet(object.thumbnail) ? String(object.thumbnail) : "",
      title: isSet(object.title) ? String(object.title) : "",
      tagline: isSet(object.tagline) ? String(object.tagline) : "",
      description: isSet(object.description) ? String(object.description) : "",
      difficulty: isSet(object.difficulty) ? String(object.difficulty) : "",
      status: isSet(object.status) ? statusFromJSON(object.status) : 0,
      duration: isSet(object.duration) ? String(object.duration) : "",
      numUsersJoined: isSet(object.numUsersJoined) ? Number(object.numUsersJoined) : 0,
      rewards: Array.isArray(object?.rewards) ? object.rewards.map((e: any) => Money.fromJSON(e)) : [],
      bought: isSet(object.bought) ? Boolean(object.bought) : false,
    };
  },

  toJSON(message: Tournament): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    message.price !== undefined && (obj.price = message.price ? Money.toJSON(message.price) : undefined);
    message.thumbnail !== undefined && (obj.thumbnail = message.thumbnail);
    message.title !== undefined && (obj.title = message.title);
    message.tagline !== undefined && (obj.tagline = message.tagline);
    message.description !== undefined && (obj.description = message.description);
    message.difficulty !== undefined && (obj.difficulty = message.difficulty);
    message.status !== undefined && (obj.status = statusToJSON(message.status));
    message.duration !== undefined && (obj.duration = message.duration);
    message.numUsersJoined !== undefined && (obj.numUsersJoined = Math.round(message.numUsersJoined));
    if (message.rewards) {
      obj.rewards = message.rewards.map((e) => e ? Money.toJSON(e) : undefined);
    } else {
      obj.rewards = [];
    }
    message.bought !== undefined && (obj.bought = message.bought);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Tournament>, I>>(object: I): Tournament {
    const message = createBaseTournament();
    message.id = object.id ?? 0;
    message.price = (object.price !== undefined && object.price !== null) ? Money.fromPartial(object.price) : undefined;
    message.thumbnail = object.thumbnail ?? "";
    message.title = object.title ?? "";
    message.tagline = object.tagline ?? "";
    message.description = object.description ?? "";
    message.difficulty = object.difficulty ?? "";
    message.status = object.status ?? 0;
    message.duration = object.duration ?? "";
    message.numUsersJoined = object.numUsersJoined ?? 0;
    message.rewards = object.rewards?.map((e) => Money.fromPartial(e)) || [];
    message.bought = object.bought ?? false;
    return message;
  },
};

function createBaseTournamentsResponse(): TournamentsResponse {
  return { tournaments: [] };
}

export const TournamentsResponse = {
  encode(message: TournamentsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.tournaments) {
      Tournament.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TournamentsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTournamentsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tournaments.push(Tournament.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TournamentsResponse {
    return {
      tournaments: Array.isArray(object?.tournaments) ? object.tournaments.map((e: any) => Tournament.fromJSON(e)) : [],
    };
  },

  toJSON(message: TournamentsResponse): unknown {
    const obj: any = {};
    if (message.tournaments) {
      obj.tournaments = message.tournaments.map((e) => e ? Tournament.toJSON(e) : undefined);
    } else {
      obj.tournaments = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TournamentsResponse>, I>>(object: I): TournamentsResponse {
    const message = createBaseTournamentsResponse();
    message.tournaments = object.tournaments?.map((e) => Tournament.fromPartial(e)) || [];
    return message;
  },
};

function createBaseChallenge(): Challenge {
  return {
    id: 0,
    price: undefined,
    thumbnail: "",
    title: "",
    tagline: "",
    description: "",
    difficulty: "",
    status: 0,
    duration: "",
    numUsersJoined: 0,
    rewards: [],
    bought: false,
    tags: [],
    starUser: undefined,
    topUsers: [],
    solved: false,
    solvedCount: 0,
  };
}

export const Challenge = {
  encode(message: Challenge, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).int32(message.id);
    }
    if (message.price !== undefined) {
      Money.encode(message.price, writer.uint32(18).fork()).ldelim();
    }
    if (message.thumbnail !== "") {
      writer.uint32(26).string(message.thumbnail);
    }
    if (message.title !== "") {
      writer.uint32(34).string(message.title);
    }
    if (message.tagline !== "") {
      writer.uint32(42).string(message.tagline);
    }
    if (message.description !== "") {
      writer.uint32(50).string(message.description);
    }
    if (message.difficulty !== "") {
      writer.uint32(58).string(message.difficulty);
    }
    if (message.status !== 0) {
      writer.uint32(64).int32(message.status);
    }
    if (message.duration !== "") {
      writer.uint32(74).string(message.duration);
    }
    if (message.numUsersJoined !== 0) {
      writer.uint32(80).int32(message.numUsersJoined);
    }
    for (const v of message.rewards) {
      Money.encode(v!, writer.uint32(90).fork()).ldelim();
    }
    if (message.bought === true) {
      writer.uint32(96).bool(message.bought);
    }
    for (const v of message.tags) {
      Tag.encode(v!, writer.uint32(106).fork()).ldelim();
    }
    if (message.starUser !== undefined) {
      PublicUser.encode(message.starUser, writer.uint32(114).fork()).ldelim();
    }
    for (const v of message.topUsers) {
      PublicUser.encode(v!, writer.uint32(122).fork()).ldelim();
    }
    if (message.solved === true) {
      writer.uint32(128).bool(message.solved);
    }
    if (message.solvedCount !== 0) {
      writer.uint32(136).int32(message.solvedCount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Challenge {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChallenge();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.int32();
          break;
        case 2:
          message.price = Money.decode(reader, reader.uint32());
          break;
        case 3:
          message.thumbnail = reader.string();
          break;
        case 4:
          message.title = reader.string();
          break;
        case 5:
          message.tagline = reader.string();
          break;
        case 6:
          message.description = reader.string();
          break;
        case 7:
          message.difficulty = reader.string();
          break;
        case 8:
          message.status = reader.int32() as any;
          break;
        case 9:
          message.duration = reader.string();
          break;
        case 10:
          message.numUsersJoined = reader.int32();
          break;
        case 11:
          message.rewards.push(Money.decode(reader, reader.uint32()));
          break;
        case 12:
          message.bought = reader.bool();
          break;
        case 13:
          message.tags.push(Tag.decode(reader, reader.uint32()));
          break;
        case 14:
          message.starUser = PublicUser.decode(reader, reader.uint32());
          break;
        case 15:
          message.topUsers.push(PublicUser.decode(reader, reader.uint32()));
          break;
        case 16:
          message.solved = reader.bool();
          break;
        case 17:
          message.solvedCount = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Challenge {
    return {
      id: isSet(object.id) ? Number(object.id) : 0,
      price: isSet(object.price) ? Money.fromJSON(object.price) : undefined,
      thumbnail: isSet(object.thumbnail) ? String(object.thumbnail) : "",
      title: isSet(object.title) ? String(object.title) : "",
      tagline: isSet(object.tagline) ? String(object.tagline) : "",
      description: isSet(object.description) ? String(object.description) : "",
      difficulty: isSet(object.difficulty) ? String(object.difficulty) : "",
      status: isSet(object.status) ? statusFromJSON(object.status) : 0,
      duration: isSet(object.duration) ? String(object.duration) : "",
      numUsersJoined: isSet(object.numUsersJoined) ? Number(object.numUsersJoined) : 0,
      rewards: Array.isArray(object?.rewards) ? object.rewards.map((e: any) => Money.fromJSON(e)) : [],
      bought: isSet(object.bought) ? Boolean(object.bought) : false,
      tags: Array.isArray(object?.tags) ? object.tags.map((e: any) => Tag.fromJSON(e)) : [],
      starUser: isSet(object.starUser) ? PublicUser.fromJSON(object.starUser) : undefined,
      topUsers: Array.isArray(object?.topUsers) ? object.topUsers.map((e: any) => PublicUser.fromJSON(e)) : [],
      solved: isSet(object.solved) ? Boolean(object.solved) : false,
      solvedCount: isSet(object.solvedCount) ? Number(object.solvedCount) : 0,
    };
  },

  toJSON(message: Challenge): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    message.price !== undefined && (obj.price = message.price ? Money.toJSON(message.price) : undefined);
    message.thumbnail !== undefined && (obj.thumbnail = message.thumbnail);
    message.title !== undefined && (obj.title = message.title);
    message.tagline !== undefined && (obj.tagline = message.tagline);
    message.description !== undefined && (obj.description = message.description);
    message.difficulty !== undefined && (obj.difficulty = message.difficulty);
    message.status !== undefined && (obj.status = statusToJSON(message.status));
    message.duration !== undefined && (obj.duration = message.duration);
    message.numUsersJoined !== undefined && (obj.numUsersJoined = Math.round(message.numUsersJoined));
    if (message.rewards) {
      obj.rewards = message.rewards.map((e) => e ? Money.toJSON(e) : undefined);
    } else {
      obj.rewards = [];
    }
    message.bought !== undefined && (obj.bought = message.bought);
    if (message.tags) {
      obj.tags = message.tags.map((e) => e ? Tag.toJSON(e) : undefined);
    } else {
      obj.tags = [];
    }
    message.starUser !== undefined &&
      (obj.starUser = message.starUser ? PublicUser.toJSON(message.starUser) : undefined);
    if (message.topUsers) {
      obj.topUsers = message.topUsers.map((e) => e ? PublicUser.toJSON(e) : undefined);
    } else {
      obj.topUsers = [];
    }
    message.solved !== undefined && (obj.solved = message.solved);
    message.solvedCount !== undefined && (obj.solvedCount = Math.round(message.solvedCount));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Challenge>, I>>(object: I): Challenge {
    const message = createBaseChallenge();
    message.id = object.id ?? 0;
    message.price = (object.price !== undefined && object.price !== null) ? Money.fromPartial(object.price) : undefined;
    message.thumbnail = object.thumbnail ?? "";
    message.title = object.title ?? "";
    message.tagline = object.tagline ?? "";
    message.description = object.description ?? "";
    message.difficulty = object.difficulty ?? "";
    message.status = object.status ?? 0;
    message.duration = object.duration ?? "";
    message.numUsersJoined = object.numUsersJoined ?? 0;
    message.rewards = object.rewards?.map((e) => Money.fromPartial(e)) || [];
    message.bought = object.bought ?? false;
    message.tags = object.tags?.map((e) => Tag.fromPartial(e)) || [];
    message.starUser = (object.starUser !== undefined && object.starUser !== null)
      ? PublicUser.fromPartial(object.starUser)
      : undefined;
    message.topUsers = object.topUsers?.map((e) => PublicUser.fromPartial(e)) || [];
    message.solved = object.solved ?? false;
    message.solvedCount = object.solvedCount ?? 0;
    return message;
  },
};

function createBaseChallengeRequest(): ChallengeRequest {
  return { id: 0 };
}

export const ChallengeRequest = {
  encode(message: ChallengeRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).int32(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChallengeRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChallengeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ChallengeRequest {
    return { id: isSet(object.id) ? Number(object.id) : 0 };
  },

  toJSON(message: ChallengeRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ChallengeRequest>, I>>(object: I): ChallengeRequest {
    const message = createBaseChallengeRequest();
    message.id = object.id ?? 0;
    return message;
  },
};

function createBaseChallengeResponse(): ChallengeResponse {
  return { challenge: undefined };
}

export const ChallengeResponse = {
  encode(message: ChallengeResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.challenge !== undefined) {
      Challenge.encode(message.challenge, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChallengeResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChallengeResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.challenge = Challenge.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ChallengeResponse {
    return { challenge: isSet(object.challenge) ? Challenge.fromJSON(object.challenge) : undefined };
  },

  toJSON(message: ChallengeResponse): unknown {
    const obj: any = {};
    message.challenge !== undefined &&
      (obj.challenge = message.challenge ? Challenge.toJSON(message.challenge) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ChallengeResponse>, I>>(object: I): ChallengeResponse {
    const message = createBaseChallengeResponse();
    message.challenge = (object.challenge !== undefined && object.challenge !== null)
      ? Challenge.fromPartial(object.challenge)
      : undefined;
    return message;
  },
};

function createBaseChallengeValidateRequest(): ChallengeValidateRequest {
  return { id: 0, passphrase: "", comment: "" };
}

export const ChallengeValidateRequest = {
  encode(message: ChallengeValidateRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).int32(message.id);
    }
    if (message.passphrase !== "") {
      writer.uint32(18).string(message.passphrase);
    }
    if (message.comment !== "") {
      writer.uint32(26).string(message.comment);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChallengeValidateRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChallengeValidateRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.int32();
          break;
        case 2:
          message.passphrase = reader.string();
          break;
        case 3:
          message.comment = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ChallengeValidateRequest {
    return {
      id: isSet(object.id) ? Number(object.id) : 0,
      passphrase: isSet(object.passphrase) ? String(object.passphrase) : "",
      comment: isSet(object.comment) ? String(object.comment) : "",
    };
  },

  toJSON(message: ChallengeValidateRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    message.passphrase !== undefined && (obj.passphrase = message.passphrase);
    message.comment !== undefined && (obj.comment = message.comment);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ChallengeValidateRequest>, I>>(object: I): ChallengeValidateRequest {
    const message = createBaseChallengeValidateRequest();
    message.id = object.id ?? 0;
    message.passphrase = object.passphrase ?? "";
    message.comment = object.comment ?? "";
    return message;
  },
};

function createBaseChallengeValidateResponse(): ChallengeValidateResponse {
  return { status: "" };
}

export const ChallengeValidateResponse = {
  encode(message: ChallengeValidateResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.status !== "") {
      writer.uint32(10).string(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChallengeValidateResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChallengeValidateResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.status = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ChallengeValidateResponse {
    return { status: isSet(object.status) ? String(object.status) : "" };
  },

  toJSON(message: ChallengeValidateResponse): unknown {
    const obj: any = {};
    message.status !== undefined && (obj.status = message.status);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ChallengeValidateResponse>, I>>(object: I): ChallengeValidateResponse {
    const message = createBaseChallengeValidateResponse();
    message.status = object.status ?? "";
    return message;
  },
};

function createBaseChallengeListingRequest(): ChallengeListingRequest {
  return { limit: 0, offset: 0, userAddress: "" };
}

export const ChallengeListingRequest = {
  encode(message: ChallengeListingRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.limit !== 0) {
      writer.uint32(8).int32(message.limit);
    }
    if (message.offset !== 0) {
      writer.uint32(16).int32(message.offset);
    }
    if (message.userAddress !== "") {
      writer.uint32(26).string(message.userAddress);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChallengeListingRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChallengeListingRequest();
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
          message.userAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ChallengeListingRequest {
    return {
      limit: isSet(object.limit) ? Number(object.limit) : 0,
      offset: isSet(object.offset) ? Number(object.offset) : 0,
      userAddress: isSet(object.userAddress) ? String(object.userAddress) : "",
    };
  },

  toJSON(message: ChallengeListingRequest): unknown {
    const obj: any = {};
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.offset !== undefined && (obj.offset = Math.round(message.offset));
    message.userAddress !== undefined && (obj.userAddress = message.userAddress);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ChallengeListingRequest>, I>>(object: I): ChallengeListingRequest {
    const message = createBaseChallengeListingRequest();
    message.limit = object.limit ?? 0;
    message.offset = object.offset ?? 0;
    message.userAddress = object.userAddress ?? "";
    return message;
  },
};

function createBaseChallengeListingResponse(): ChallengeListingResponse {
  return { challenges: [] };
}

export const ChallengeListingResponse = {
  encode(message: ChallengeListingResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.challenges) {
      Challenge.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChallengeListingResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChallengeListingResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.challenges.push(Challenge.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ChallengeListingResponse {
    return {
      challenges: Array.isArray(object?.challenges) ? object.challenges.map((e: any) => Challenge.fromJSON(e)) : [],
    };
  },

  toJSON(message: ChallengeListingResponse): unknown {
    const obj: any = {};
    if (message.challenges) {
      obj.challenges = message.challenges.map((e) => e ? Challenge.toJSON(e) : undefined);
    } else {
      obj.challenges = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ChallengeListingResponse>, I>>(object: I): ChallengeListingResponse {
    const message = createBaseChallengeListingResponse();
    message.challenges = object.challenges?.map((e) => Challenge.fromPartial(e)) || [];
    return message;
  },
};

export interface PathwarService {
  RegisterUser(request: DeepPartial<RegisterUserRequest>, metadata?: grpc.Metadata): Observable<RegisterUserResponse>;
  Leaderboard(request: DeepPartial<LeaderboardRequest>, metadata?: grpc.Metadata): Observable<LeaderboardResponse>;
  Resources(request: DeepPartial<ResourcesRequest>, metadata?: grpc.Metadata): Observable<ResourcesResponse>;
  Tournaments(request: DeepPartial<TournamentsRequest>, metadata?: grpc.Metadata): Observable<TournamentsResponse>;
  Challenge(request: DeepPartial<ChallengeRequest>, metadata?: grpc.Metadata): Observable<ChallengeResponse>;
  ChallengeListing(
    request: DeepPartial<ChallengeListingRequest>,
    metadata?: grpc.Metadata,
  ): Observable<ChallengeListingResponse>;
  ChallengeValidate(
    request: DeepPartial<ChallengeValidateRequest>,
    metadata?: grpc.Metadata,
  ): Observable<ChallengeValidateResponse>;
}

export class PathwarServiceClientImpl implements PathwarService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.RegisterUser = this.RegisterUser.bind(this);
    this.Leaderboard = this.Leaderboard.bind(this);
    this.Resources = this.Resources.bind(this);
    this.Tournaments = this.Tournaments.bind(this);
    this.Challenge = this.Challenge.bind(this);
    this.ChallengeListing = this.ChallengeListing.bind(this);
    this.ChallengeValidate = this.ChallengeValidate.bind(this);
  }

  RegisterUser(request: DeepPartial<RegisterUserRequest>, metadata?: grpc.Metadata): Observable<RegisterUserResponse> {
    return this.rpc.invoke(PathwarServiceRegisterUserDesc, RegisterUserRequest.fromPartial(request), metadata);
  }

  Leaderboard(request: DeepPartial<LeaderboardRequest>, metadata?: grpc.Metadata): Observable<LeaderboardResponse> {
    return this.rpc.invoke(PathwarServiceLeaderboardDesc, LeaderboardRequest.fromPartial(request), metadata);
  }

  Resources(request: DeepPartial<ResourcesRequest>, metadata?: grpc.Metadata): Observable<ResourcesResponse> {
    return this.rpc.invoke(PathwarServiceResourcesDesc, ResourcesRequest.fromPartial(request), metadata);
  }

  Tournaments(request: DeepPartial<TournamentsRequest>, metadata?: grpc.Metadata): Observable<TournamentsResponse> {
    return this.rpc.invoke(PathwarServiceTournamentsDesc, TournamentsRequest.fromPartial(request), metadata);
  }

  Challenge(request: DeepPartial<ChallengeRequest>, metadata?: grpc.Metadata): Observable<ChallengeResponse> {
    return this.rpc.invoke(PathwarServiceChallengeDesc, ChallengeRequest.fromPartial(request), metadata);
  }

  ChallengeListing(
    request: DeepPartial<ChallengeListingRequest>,
    metadata?: grpc.Metadata,
  ): Observable<ChallengeListingResponse> {
    return this.rpc.invoke(PathwarServiceChallengeListingDesc, ChallengeListingRequest.fromPartial(request), metadata);
  }

  ChallengeValidate(
    request: DeepPartial<ChallengeValidateRequest>,
    metadata?: grpc.Metadata,
  ): Observable<ChallengeValidateResponse> {
    return this.rpc.invoke(
      PathwarServiceChallengeValidateDesc,
      ChallengeValidateRequest.fromPartial(request),
      metadata,
    );
  }
}

export const PathwarServiceDesc = { serviceName: "pathwar.v1.PathwarService" };

export const PathwarServiceRegisterUserDesc: UnaryMethodDefinitionish = {
  methodName: "RegisterUser",
  service: PathwarServiceDesc,
  requestStream: false,
  responseStream: true,
  requestType: {
    serializeBinary() {
      return RegisterUserRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...RegisterUserResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const PathwarServiceLeaderboardDesc: UnaryMethodDefinitionish = {
  methodName: "Leaderboard",
  service: PathwarServiceDesc,
  requestStream: false,
  responseStream: true,
  requestType: {
    serializeBinary() {
      return LeaderboardRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...LeaderboardResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const PathwarServiceResourcesDesc: UnaryMethodDefinitionish = {
  methodName: "Resources",
  service: PathwarServiceDesc,
  requestStream: false,
  responseStream: true,
  requestType: {
    serializeBinary() {
      return ResourcesRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...ResourcesResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const PathwarServiceTournamentsDesc: UnaryMethodDefinitionish = {
  methodName: "Tournaments",
  service: PathwarServiceDesc,
  requestStream: false,
  responseStream: true,
  requestType: {
    serializeBinary() {
      return TournamentsRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...TournamentsResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const PathwarServiceChallengeDesc: UnaryMethodDefinitionish = {
  methodName: "Challenge",
  service: PathwarServiceDesc,
  requestStream: false,
  responseStream: true,
  requestType: {
    serializeBinary() {
      return ChallengeRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...ChallengeResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const PathwarServiceChallengeListingDesc: UnaryMethodDefinitionish = {
  methodName: "ChallengeListing",
  service: PathwarServiceDesc,
  requestStream: false,
  responseStream: true,
  requestType: {
    serializeBinary() {
      return ChallengeListingRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...ChallengeListingResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const PathwarServiceChallengeValidateDesc: UnaryMethodDefinitionish = {
  methodName: "ChallengeValidate",
  service: PathwarServiceDesc,
  requestStream: false,
  responseStream: true,
  requestType: {
    serializeBinary() {
      return ChallengeValidateRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...ChallengeValidateResponse.decode(data),
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
