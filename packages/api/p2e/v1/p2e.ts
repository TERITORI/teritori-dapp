/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";
import { share } from "rxjs/operators";

export const protobufPackage = "p2e.v1";

export interface AllSeasonsRequest {
}

export interface SeasonWithoutPrize {
  id: string;
  bossName: string;
  bossHp: number;
}

export interface AllSeasonsResponse {
  seasons: SeasonWithoutPrize[];
}

export interface CurrentSeasonRequest {
}

export interface CurrentSeasonResponse {
  id: string;
  denom: string;
  totalPrize: number;
  bossName: string;
  bossHp: number;
  remainingHp: number;
  bossImage: string;
  isPre: boolean;
}

export interface UserRankRequest {
  seasonId: string;
  userId: string;
}

export interface UserRankResponse {
  userScore: UserScore | undefined;
  totalUsers: number;
}

export interface LeaderboardRequest {
  seasonId: string;
  limit: number;
  offset: number;
}

export interface UserScore {
  rank: number;
  snapshotRank: number;
  userId: string;
  inProgressScore: number;
  snapshotScore: number;
  seasonId: string;
}

export interface LeaderboardResponse {
  userScore: UserScore | undefined;
}

function createBaseAllSeasonsRequest(): AllSeasonsRequest {
  return {};
}

export const AllSeasonsRequest = {
  encode(_: AllSeasonsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AllSeasonsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAllSeasonsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): AllSeasonsRequest {
    return {};
  },

  toJSON(_: AllSeasonsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<AllSeasonsRequest>, I>>(base?: I): AllSeasonsRequest {
    return AllSeasonsRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AllSeasonsRequest>, I>>(_: I): AllSeasonsRequest {
    const message = createBaseAllSeasonsRequest();
    return message;
  },
};

function createBaseSeasonWithoutPrize(): SeasonWithoutPrize {
  return { id: "", bossName: "", bossHp: 0 };
}

export const SeasonWithoutPrize = {
  encode(message: SeasonWithoutPrize, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.bossName !== "") {
      writer.uint32(18).string(message.bossName);
    }
    if (message.bossHp !== 0) {
      writer.uint32(24).int32(message.bossHp);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SeasonWithoutPrize {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSeasonWithoutPrize();
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

          message.bossName = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.bossHp = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SeasonWithoutPrize {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      bossName: isSet(object.bossName) ? globalThis.String(object.bossName) : "",
      bossHp: isSet(object.bossHp) ? globalThis.Number(object.bossHp) : 0,
    };
  },

  toJSON(message: SeasonWithoutPrize): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.bossName !== "") {
      obj.bossName = message.bossName;
    }
    if (message.bossHp !== 0) {
      obj.bossHp = Math.round(message.bossHp);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SeasonWithoutPrize>, I>>(base?: I): SeasonWithoutPrize {
    return SeasonWithoutPrize.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SeasonWithoutPrize>, I>>(object: I): SeasonWithoutPrize {
    const message = createBaseSeasonWithoutPrize();
    message.id = object.id ?? "";
    message.bossName = object.bossName ?? "";
    message.bossHp = object.bossHp ?? 0;
    return message;
  },
};

function createBaseAllSeasonsResponse(): AllSeasonsResponse {
  return { seasons: [] };
}

export const AllSeasonsResponse = {
  encode(message: AllSeasonsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.seasons) {
      SeasonWithoutPrize.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AllSeasonsResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAllSeasonsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.seasons.push(SeasonWithoutPrize.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AllSeasonsResponse {
    return {
      seasons: globalThis.Array.isArray(object?.seasons)
        ? object.seasons.map((e: any) => SeasonWithoutPrize.fromJSON(e))
        : [],
    };
  },

  toJSON(message: AllSeasonsResponse): unknown {
    const obj: any = {};
    if (message.seasons?.length) {
      obj.seasons = message.seasons.map((e) => SeasonWithoutPrize.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AllSeasonsResponse>, I>>(base?: I): AllSeasonsResponse {
    return AllSeasonsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AllSeasonsResponse>, I>>(object: I): AllSeasonsResponse {
    const message = createBaseAllSeasonsResponse();
    message.seasons = object.seasons?.map((e) => SeasonWithoutPrize.fromPartial(e)) || [];
    return message;
  },
};

function createBaseCurrentSeasonRequest(): CurrentSeasonRequest {
  return {};
}

export const CurrentSeasonRequest = {
  encode(_: CurrentSeasonRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CurrentSeasonRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCurrentSeasonRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): CurrentSeasonRequest {
    return {};
  },

  toJSON(_: CurrentSeasonRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<CurrentSeasonRequest>, I>>(base?: I): CurrentSeasonRequest {
    return CurrentSeasonRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CurrentSeasonRequest>, I>>(_: I): CurrentSeasonRequest {
    const message = createBaseCurrentSeasonRequest();
    return message;
  },
};

function createBaseCurrentSeasonResponse(): CurrentSeasonResponse {
  return { id: "", denom: "", totalPrize: 0, bossName: "", bossHp: 0, remainingHp: 0, bossImage: "", isPre: false };
}

export const CurrentSeasonResponse = {
  encode(message: CurrentSeasonResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.denom !== "") {
      writer.uint32(18).string(message.denom);
    }
    if (message.totalPrize !== 0) {
      writer.uint32(24).int32(message.totalPrize);
    }
    if (message.bossName !== "") {
      writer.uint32(34).string(message.bossName);
    }
    if (message.bossHp !== 0) {
      writer.uint32(40).int32(message.bossHp);
    }
    if (message.remainingHp !== 0) {
      writer.uint32(53).float(message.remainingHp);
    }
    if (message.bossImage !== "") {
      writer.uint32(58).string(message.bossImage);
    }
    if (message.isPre === true) {
      writer.uint32(64).bool(message.isPre);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CurrentSeasonResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCurrentSeasonResponse();
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

          message.denom = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.totalPrize = reader.int32();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.bossName = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.bossHp = reader.int32();
          continue;
        case 6:
          if (tag !== 53) {
            break;
          }

          message.remainingHp = reader.float();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.bossImage = reader.string();
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.isPre = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CurrentSeasonResponse {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      denom: isSet(object.denom) ? globalThis.String(object.denom) : "",
      totalPrize: isSet(object.totalPrize) ? globalThis.Number(object.totalPrize) : 0,
      bossName: isSet(object.bossName) ? globalThis.String(object.bossName) : "",
      bossHp: isSet(object.bossHp) ? globalThis.Number(object.bossHp) : 0,
      remainingHp: isSet(object.remainingHp) ? globalThis.Number(object.remainingHp) : 0,
      bossImage: isSet(object.bossImage) ? globalThis.String(object.bossImage) : "",
      isPre: isSet(object.isPre) ? globalThis.Boolean(object.isPre) : false,
    };
  },

  toJSON(message: CurrentSeasonResponse): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.denom !== "") {
      obj.denom = message.denom;
    }
    if (message.totalPrize !== 0) {
      obj.totalPrize = Math.round(message.totalPrize);
    }
    if (message.bossName !== "") {
      obj.bossName = message.bossName;
    }
    if (message.bossHp !== 0) {
      obj.bossHp = Math.round(message.bossHp);
    }
    if (message.remainingHp !== 0) {
      obj.remainingHp = message.remainingHp;
    }
    if (message.bossImage !== "") {
      obj.bossImage = message.bossImage;
    }
    if (message.isPre === true) {
      obj.isPre = message.isPre;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CurrentSeasonResponse>, I>>(base?: I): CurrentSeasonResponse {
    return CurrentSeasonResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CurrentSeasonResponse>, I>>(object: I): CurrentSeasonResponse {
    const message = createBaseCurrentSeasonResponse();
    message.id = object.id ?? "";
    message.denom = object.denom ?? "";
    message.totalPrize = object.totalPrize ?? 0;
    message.bossName = object.bossName ?? "";
    message.bossHp = object.bossHp ?? 0;
    message.remainingHp = object.remainingHp ?? 0;
    message.bossImage = object.bossImage ?? "";
    message.isPre = object.isPre ?? false;
    return message;
  },
};

function createBaseUserRankRequest(): UserRankRequest {
  return { seasonId: "", userId: "" };
}

export const UserRankRequest = {
  encode(message: UserRankRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.seasonId !== "") {
      writer.uint32(10).string(message.seasonId);
    }
    if (message.userId !== "") {
      writer.uint32(18).string(message.userId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UserRankRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUserRankRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.seasonId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.userId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UserRankRequest {
    return {
      seasonId: isSet(object.seasonId) ? globalThis.String(object.seasonId) : "",
      userId: isSet(object.userId) ? globalThis.String(object.userId) : "",
    };
  },

  toJSON(message: UserRankRequest): unknown {
    const obj: any = {};
    if (message.seasonId !== "") {
      obj.seasonId = message.seasonId;
    }
    if (message.userId !== "") {
      obj.userId = message.userId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UserRankRequest>, I>>(base?: I): UserRankRequest {
    return UserRankRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UserRankRequest>, I>>(object: I): UserRankRequest {
    const message = createBaseUserRankRequest();
    message.seasonId = object.seasonId ?? "";
    message.userId = object.userId ?? "";
    return message;
  },
};

function createBaseUserRankResponse(): UserRankResponse {
  return { userScore: undefined, totalUsers: 0 };
}

export const UserRankResponse = {
  encode(message: UserRankResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userScore !== undefined) {
      UserScore.encode(message.userScore, writer.uint32(10).fork()).ldelim();
    }
    if (message.totalUsers !== 0) {
      writer.uint32(16).int32(message.totalUsers);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UserRankResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUserRankResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.userScore = UserScore.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.totalUsers = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UserRankResponse {
    return {
      userScore: isSet(object.userScore) ? UserScore.fromJSON(object.userScore) : undefined,
      totalUsers: isSet(object.totalUsers) ? globalThis.Number(object.totalUsers) : 0,
    };
  },

  toJSON(message: UserRankResponse): unknown {
    const obj: any = {};
    if (message.userScore !== undefined) {
      obj.userScore = UserScore.toJSON(message.userScore);
    }
    if (message.totalUsers !== 0) {
      obj.totalUsers = Math.round(message.totalUsers);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UserRankResponse>, I>>(base?: I): UserRankResponse {
    return UserRankResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UserRankResponse>, I>>(object: I): UserRankResponse {
    const message = createBaseUserRankResponse();
    message.userScore = (object.userScore !== undefined && object.userScore !== null)
      ? UserScore.fromPartial(object.userScore)
      : undefined;
    message.totalUsers = object.totalUsers ?? 0;
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLeaderboardRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.seasonId = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.limit = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.offset = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LeaderboardRequest {
    return {
      seasonId: isSet(object.seasonId) ? globalThis.String(object.seasonId) : "",
      limit: isSet(object.limit) ? globalThis.Number(object.limit) : 0,
      offset: isSet(object.offset) ? globalThis.Number(object.offset) : 0,
    };
  },

  toJSON(message: LeaderboardRequest): unknown {
    const obj: any = {};
    if (message.seasonId !== "") {
      obj.seasonId = message.seasonId;
    }
    if (message.limit !== 0) {
      obj.limit = Math.round(message.limit);
    }
    if (message.offset !== 0) {
      obj.offset = Math.round(message.offset);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LeaderboardRequest>, I>>(base?: I): LeaderboardRequest {
    return LeaderboardRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LeaderboardRequest>, I>>(object: I): LeaderboardRequest {
    const message = createBaseLeaderboardRequest();
    message.seasonId = object.seasonId ?? "";
    message.limit = object.limit ?? 0;
    message.offset = object.offset ?? 0;
    return message;
  },
};

function createBaseUserScore(): UserScore {
  return { rank: 0, snapshotRank: 0, userId: "", inProgressScore: 0, snapshotScore: 0, seasonId: "" };
}

export const UserScore = {
  encode(message: UserScore, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.rank !== 0) {
      writer.uint32(8).int32(message.rank);
    }
    if (message.snapshotRank !== 0) {
      writer.uint32(16).int32(message.snapshotRank);
    }
    if (message.userId !== "") {
      writer.uint32(26).string(message.userId);
    }
    if (message.inProgressScore !== 0) {
      writer.uint32(32).int64(message.inProgressScore);
    }
    if (message.snapshotScore !== 0) {
      writer.uint32(40).int64(message.snapshotScore);
    }
    if (message.seasonId !== "") {
      writer.uint32(50).string(message.seasonId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UserScore {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUserScore();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.rank = reader.int32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.snapshotRank = reader.int32();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.userId = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.inProgressScore = longToNumber(reader.int64() as Long);
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.snapshotScore = longToNumber(reader.int64() as Long);
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.seasonId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UserScore {
    return {
      rank: isSet(object.rank) ? globalThis.Number(object.rank) : 0,
      snapshotRank: isSet(object.snapshotRank) ? globalThis.Number(object.snapshotRank) : 0,
      userId: isSet(object.userId) ? globalThis.String(object.userId) : "",
      inProgressScore: isSet(object.inProgressScore) ? globalThis.Number(object.inProgressScore) : 0,
      snapshotScore: isSet(object.snapshotScore) ? globalThis.Number(object.snapshotScore) : 0,
      seasonId: isSet(object.seasonId) ? globalThis.String(object.seasonId) : "",
    };
  },

  toJSON(message: UserScore): unknown {
    const obj: any = {};
    if (message.rank !== 0) {
      obj.rank = Math.round(message.rank);
    }
    if (message.snapshotRank !== 0) {
      obj.snapshotRank = Math.round(message.snapshotRank);
    }
    if (message.userId !== "") {
      obj.userId = message.userId;
    }
    if (message.inProgressScore !== 0) {
      obj.inProgressScore = Math.round(message.inProgressScore);
    }
    if (message.snapshotScore !== 0) {
      obj.snapshotScore = Math.round(message.snapshotScore);
    }
    if (message.seasonId !== "") {
      obj.seasonId = message.seasonId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UserScore>, I>>(base?: I): UserScore {
    return UserScore.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UserScore>, I>>(object: I): UserScore {
    const message = createBaseUserScore();
    message.rank = object.rank ?? 0;
    message.snapshotRank = object.snapshotRank ?? 0;
    message.userId = object.userId ?? "";
    message.inProgressScore = object.inProgressScore ?? 0;
    message.snapshotScore = object.snapshotScore ?? 0;
    message.seasonId = object.seasonId ?? "";
    return message;
  },
};

function createBaseLeaderboardResponse(): LeaderboardResponse {
  return { userScore: undefined };
}

export const LeaderboardResponse = {
  encode(message: LeaderboardResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userScore !== undefined) {
      UserScore.encode(message.userScore, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LeaderboardResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLeaderboardResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.userScore = UserScore.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LeaderboardResponse {
    return { userScore: isSet(object.userScore) ? UserScore.fromJSON(object.userScore) : undefined };
  },

  toJSON(message: LeaderboardResponse): unknown {
    const obj: any = {};
    if (message.userScore !== undefined) {
      obj.userScore = UserScore.toJSON(message.userScore);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LeaderboardResponse>, I>>(base?: I): LeaderboardResponse {
    return LeaderboardResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LeaderboardResponse>, I>>(object: I): LeaderboardResponse {
    const message = createBaseLeaderboardResponse();
    message.userScore = (object.userScore !== undefined && object.userScore !== null)
      ? UserScore.fromPartial(object.userScore)
      : undefined;
    return message;
  },
};

export interface P2eService {
  Leaderboard(request: DeepPartial<LeaderboardRequest>, metadata?: grpc.Metadata): Observable<LeaderboardResponse>;
  CurrentSeason(request: DeepPartial<CurrentSeasonRequest>, metadata?: grpc.Metadata): Promise<CurrentSeasonResponse>;
  UserRank(request: DeepPartial<UserRankRequest>, metadata?: grpc.Metadata): Promise<UserRankResponse>;
  AllSeasons(request: DeepPartial<AllSeasonsRequest>, metadata?: grpc.Metadata): Promise<AllSeasonsResponse>;
}

export class P2eServiceClientImpl implements P2eService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Leaderboard = this.Leaderboard.bind(this);
    this.CurrentSeason = this.CurrentSeason.bind(this);
    this.UserRank = this.UserRank.bind(this);
    this.AllSeasons = this.AllSeasons.bind(this);
  }

  Leaderboard(request: DeepPartial<LeaderboardRequest>, metadata?: grpc.Metadata): Observable<LeaderboardResponse> {
    return this.rpc.invoke(P2eServiceLeaderboardDesc, LeaderboardRequest.fromPartial(request), metadata);
  }

  CurrentSeason(request: DeepPartial<CurrentSeasonRequest>, metadata?: grpc.Metadata): Promise<CurrentSeasonResponse> {
    return this.rpc.unary(P2eServiceCurrentSeasonDesc, CurrentSeasonRequest.fromPartial(request), metadata);
  }

  UserRank(request: DeepPartial<UserRankRequest>, metadata?: grpc.Metadata): Promise<UserRankResponse> {
    return this.rpc.unary(P2eServiceUserRankDesc, UserRankRequest.fromPartial(request), metadata);
  }

  AllSeasons(request: DeepPartial<AllSeasonsRequest>, metadata?: grpc.Metadata): Promise<AllSeasonsResponse> {
    return this.rpc.unary(P2eServiceAllSeasonsDesc, AllSeasonsRequest.fromPartial(request), metadata);
  }
}

export const P2eServiceDesc = { serviceName: "p2e.v1.P2eService" };

export const P2eServiceLeaderboardDesc: UnaryMethodDefinitionish = {
  methodName: "Leaderboard",
  service: P2eServiceDesc,
  requestStream: false,
  responseStream: true,
  requestType: {
    serializeBinary() {
      return LeaderboardRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = LeaderboardResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const P2eServiceCurrentSeasonDesc: UnaryMethodDefinitionish = {
  methodName: "CurrentSeason",
  service: P2eServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return CurrentSeasonRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = CurrentSeasonResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const P2eServiceUserRankDesc: UnaryMethodDefinitionish = {
  methodName: "UserRank",
  service: P2eServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return UserRankRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = UserRankResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const P2eServiceAllSeasonsDesc: UnaryMethodDefinitionish = {
  methodName: "AllSeasons",
  service: P2eServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return AllSeasonsRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = AllSeasonsResponse.decode(data);
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

  invoke<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    _request: any,
    metadata: grpc.Metadata | undefined,
  ): Observable<any> {
    const upStreamCodes = this.options.upStreamRetryCodes ?? [];
    const DEFAULT_TIMEOUT_TIME: number = 3_000;
    const request = { ..._request, ...methodDesc.requestType };
    const transport = this.options.streamingTransport ?? this.options.transport;
    const maybeCombinedMetadata = metadata && this.options.metadata
      ? new BrowserHeaders({ ...this.options?.metadata.headersMap, ...metadata?.headersMap })
      : metadata ?? this.options.metadata;
    return new Observable((observer) => {
      const upStream = () => {
        const client = grpc.invoke(methodDesc, {
          host: this.host,
          request,
          ...(transport !== undefined ? { transport } : {}),
          metadata: maybeCombinedMetadata ?? {},
          debug: this.options.debug ?? false,
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
        observer.add(() => {
          return client.close();
        });
      };
      upStream();
    }).pipe(share());
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
