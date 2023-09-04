/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "musicplayer.v1";

export interface GetAllAlbumListRequest {
  limit: number;
  offset: number;
}

export interface GetUserAlbumListRequest {
  createdBy: string;
  limit: number;
  offset: number;
}

export interface GetAlbumIdListForLibraryRequest {
  user: string;
}

export interface GetOtherAlbumListRequest {
  idList: string[];
  limit: number;
  offset: number;
}

export interface MusicAlbumInfo {
  identifier: string;
  metadata: string;
  createdBy: string;
}

export interface AlbumLibraryInfo {
  identifier: string;
}

export interface GetAllAlbumListResponse {
  musicAlbums: MusicAlbumInfo[];
}

export interface GetUserAlbumListResponse {
  musicAlbums: MusicAlbumInfo[];
}

export interface GetOtherAlbumListResponse {
  musicAlbums: MusicAlbumInfo[];
}

export interface GetAlbumRequest {
  identifier: string;
}

export interface GetAlbumResponse {
  musicAlbum: MusicAlbumInfo | undefined;
}

export interface GetAlbumIdListForLibraryResponse {
  albumLibraries: AlbumLibraryInfo[];
}

function createBaseGetAllAlbumListRequest(): GetAllAlbumListRequest {
  return { limit: 0, offset: 0 };
}

export const GetAllAlbumListRequest = {
  encode(message: GetAllAlbumListRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.limit !== 0) {
      writer.uint32(16).uint32(message.limit);
    }
    if (message.offset !== 0) {
      writer.uint32(24).uint32(message.offset);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAllAlbumListRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAllAlbumListRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.limit = reader.uint32();
          break;
        case 3:
          message.offset = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetAllAlbumListRequest {
    return {
      limit: isSet(object.limit) ? Number(object.limit) : 0,
      offset: isSet(object.offset) ? Number(object.offset) : 0,
    };
  },

  toJSON(message: GetAllAlbumListRequest): unknown {
    const obj: any = {};
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.offset !== undefined && (obj.offset = Math.round(message.offset));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetAllAlbumListRequest>, I>>(object: I): GetAllAlbumListRequest {
    const message = createBaseGetAllAlbumListRequest();
    message.limit = object.limit ?? 0;
    message.offset = object.offset ?? 0;
    return message;
  },
};

function createBaseGetUserAlbumListRequest(): GetUserAlbumListRequest {
  return { createdBy: "", limit: 0, offset: 0 };
}

export const GetUserAlbumListRequest = {
  encode(message: GetUserAlbumListRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.createdBy !== "") {
      writer.uint32(10).string(message.createdBy);
    }
    if (message.limit !== 0) {
      writer.uint32(16).uint32(message.limit);
    }
    if (message.offset !== 0) {
      writer.uint32(24).uint32(message.offset);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUserAlbumListRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserAlbumListRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.createdBy = reader.string();
          break;
        case 2:
          message.limit = reader.uint32();
          break;
        case 3:
          message.offset = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetUserAlbumListRequest {
    return {
      createdBy: isSet(object.createdBy) ? String(object.createdBy) : "",
      limit: isSet(object.limit) ? Number(object.limit) : 0,
      offset: isSet(object.offset) ? Number(object.offset) : 0,
    };
  },

  toJSON(message: GetUserAlbumListRequest): unknown {
    const obj: any = {};
    message.createdBy !== undefined && (obj.createdBy = message.createdBy);
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.offset !== undefined && (obj.offset = Math.round(message.offset));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetUserAlbumListRequest>, I>>(object: I): GetUserAlbumListRequest {
    const message = createBaseGetUserAlbumListRequest();
    message.createdBy = object.createdBy ?? "";
    message.limit = object.limit ?? 0;
    message.offset = object.offset ?? 0;
    return message;
  },
};

function createBaseGetAlbumIdListForLibraryRequest(): GetAlbumIdListForLibraryRequest {
  return { user: "" };
}

export const GetAlbumIdListForLibraryRequest = {
  encode(message: GetAlbumIdListForLibraryRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.user !== "") {
      writer.uint32(10).string(message.user);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAlbumIdListForLibraryRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAlbumIdListForLibraryRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.user = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetAlbumIdListForLibraryRequest {
    return { user: isSet(object.user) ? String(object.user) : "" };
  },

  toJSON(message: GetAlbumIdListForLibraryRequest): unknown {
    const obj: any = {};
    message.user !== undefined && (obj.user = message.user);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetAlbumIdListForLibraryRequest>, I>>(
    object: I,
  ): GetAlbumIdListForLibraryRequest {
    const message = createBaseGetAlbumIdListForLibraryRequest();
    message.user = object.user ?? "";
    return message;
  },
};

function createBaseGetOtherAlbumListRequest(): GetOtherAlbumListRequest {
  return { idList: [], limit: 0, offset: 0 };
}

export const GetOtherAlbumListRequest = {
  encode(message: GetOtherAlbumListRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.idList) {
      writer.uint32(10).string(v!);
    }
    if (message.limit !== 0) {
      writer.uint32(16).uint32(message.limit);
    }
    if (message.offset !== 0) {
      writer.uint32(24).uint32(message.offset);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetOtherAlbumListRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetOtherAlbumListRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.idList.push(reader.string());
          break;
        case 2:
          message.limit = reader.uint32();
          break;
        case 3:
          message.offset = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetOtherAlbumListRequest {
    return {
      idList: Array.isArray(object?.idList) ? object.idList.map((e: any) => String(e)) : [],
      limit: isSet(object.limit) ? Number(object.limit) : 0,
      offset: isSet(object.offset) ? Number(object.offset) : 0,
    };
  },

  toJSON(message: GetOtherAlbumListRequest): unknown {
    const obj: any = {};
    if (message.idList) {
      obj.idList = message.idList.map((e) => e);
    } else {
      obj.idList = [];
    }
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.offset !== undefined && (obj.offset = Math.round(message.offset));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetOtherAlbumListRequest>, I>>(object: I): GetOtherAlbumListRequest {
    const message = createBaseGetOtherAlbumListRequest();
    message.idList = object.idList?.map((e) => e) || [];
    message.limit = object.limit ?? 0;
    message.offset = object.offset ?? 0;
    return message;
  },
};

function createBaseMusicAlbumInfo(): MusicAlbumInfo {
  return { identifier: "", metadata: "", createdBy: "" };
}

export const MusicAlbumInfo = {
  encode(message: MusicAlbumInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identifier !== "") {
      writer.uint32(10).string(message.identifier);
    }
    if (message.metadata !== "") {
      writer.uint32(18).string(message.metadata);
    }
    if (message.createdBy !== "") {
      writer.uint32(26).string(message.createdBy);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MusicAlbumInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMusicAlbumInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.identifier = reader.string();
          break;
        case 2:
          message.metadata = reader.string();
          break;
        case 3:
          message.createdBy = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MusicAlbumInfo {
    return {
      identifier: isSet(object.identifier) ? String(object.identifier) : "",
      metadata: isSet(object.metadata) ? String(object.metadata) : "",
      createdBy: isSet(object.createdBy) ? String(object.createdBy) : "",
    };
  },

  toJSON(message: MusicAlbumInfo): unknown {
    const obj: any = {};
    message.identifier !== undefined && (obj.identifier = message.identifier);
    message.metadata !== undefined && (obj.metadata = message.metadata);
    message.createdBy !== undefined && (obj.createdBy = message.createdBy);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MusicAlbumInfo>, I>>(object: I): MusicAlbumInfo {
    const message = createBaseMusicAlbumInfo();
    message.identifier = object.identifier ?? "";
    message.metadata = object.metadata ?? "";
    message.createdBy = object.createdBy ?? "";
    return message;
  },
};

function createBaseAlbumLibraryInfo(): AlbumLibraryInfo {
  return { identifier: "" };
}

export const AlbumLibraryInfo = {
  encode(message: AlbumLibraryInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identifier !== "") {
      writer.uint32(10).string(message.identifier);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AlbumLibraryInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAlbumLibraryInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.identifier = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AlbumLibraryInfo {
    return { identifier: isSet(object.identifier) ? String(object.identifier) : "" };
  },

  toJSON(message: AlbumLibraryInfo): unknown {
    const obj: any = {};
    message.identifier !== undefined && (obj.identifier = message.identifier);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<AlbumLibraryInfo>, I>>(object: I): AlbumLibraryInfo {
    const message = createBaseAlbumLibraryInfo();
    message.identifier = object.identifier ?? "";
    return message;
  },
};

function createBaseGetAllAlbumListResponse(): GetAllAlbumListResponse {
  return { musicAlbums: [] };
}

export const GetAllAlbumListResponse = {
  encode(message: GetAllAlbumListResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.musicAlbums) {
      MusicAlbumInfo.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAllAlbumListResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAllAlbumListResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.musicAlbums.push(MusicAlbumInfo.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetAllAlbumListResponse {
    return {
      musicAlbums: Array.isArray(object?.musicAlbums)
        ? object.musicAlbums.map((e: any) => MusicAlbumInfo.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GetAllAlbumListResponse): unknown {
    const obj: any = {};
    if (message.musicAlbums) {
      obj.musicAlbums = message.musicAlbums.map((e) => e ? MusicAlbumInfo.toJSON(e) : undefined);
    } else {
      obj.musicAlbums = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetAllAlbumListResponse>, I>>(object: I): GetAllAlbumListResponse {
    const message = createBaseGetAllAlbumListResponse();
    message.musicAlbums = object.musicAlbums?.map((e) => MusicAlbumInfo.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetUserAlbumListResponse(): GetUserAlbumListResponse {
  return { musicAlbums: [] };
}

export const GetUserAlbumListResponse = {
  encode(message: GetUserAlbumListResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.musicAlbums) {
      MusicAlbumInfo.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUserAlbumListResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserAlbumListResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.musicAlbums.push(MusicAlbumInfo.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetUserAlbumListResponse {
    return {
      musicAlbums: Array.isArray(object?.musicAlbums)
        ? object.musicAlbums.map((e: any) => MusicAlbumInfo.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GetUserAlbumListResponse): unknown {
    const obj: any = {};
    if (message.musicAlbums) {
      obj.musicAlbums = message.musicAlbums.map((e) => e ? MusicAlbumInfo.toJSON(e) : undefined);
    } else {
      obj.musicAlbums = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetUserAlbumListResponse>, I>>(object: I): GetUserAlbumListResponse {
    const message = createBaseGetUserAlbumListResponse();
    message.musicAlbums = object.musicAlbums?.map((e) => MusicAlbumInfo.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetOtherAlbumListResponse(): GetOtherAlbumListResponse {
  return { musicAlbums: [] };
}

export const GetOtherAlbumListResponse = {
  encode(message: GetOtherAlbumListResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.musicAlbums) {
      MusicAlbumInfo.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetOtherAlbumListResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetOtherAlbumListResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.musicAlbums.push(MusicAlbumInfo.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetOtherAlbumListResponse {
    return {
      musicAlbums: Array.isArray(object?.musicAlbums)
        ? object.musicAlbums.map((e: any) => MusicAlbumInfo.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GetOtherAlbumListResponse): unknown {
    const obj: any = {};
    if (message.musicAlbums) {
      obj.musicAlbums = message.musicAlbums.map((e) => e ? MusicAlbumInfo.toJSON(e) : undefined);
    } else {
      obj.musicAlbums = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetOtherAlbumListResponse>, I>>(object: I): GetOtherAlbumListResponse {
    const message = createBaseGetOtherAlbumListResponse();
    message.musicAlbums = object.musicAlbums?.map((e) => MusicAlbumInfo.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetAlbumRequest(): GetAlbumRequest {
  return { identifier: "" };
}

export const GetAlbumRequest = {
  encode(message: GetAlbumRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identifier !== "") {
      writer.uint32(10).string(message.identifier);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAlbumRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAlbumRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.identifier = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetAlbumRequest {
    return { identifier: isSet(object.identifier) ? String(object.identifier) : "" };
  },

  toJSON(message: GetAlbumRequest): unknown {
    const obj: any = {};
    message.identifier !== undefined && (obj.identifier = message.identifier);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetAlbumRequest>, I>>(object: I): GetAlbumRequest {
    const message = createBaseGetAlbumRequest();
    message.identifier = object.identifier ?? "";
    return message;
  },
};

function createBaseGetAlbumResponse(): GetAlbumResponse {
  return { musicAlbum: undefined };
}

export const GetAlbumResponse = {
  encode(message: GetAlbumResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.musicAlbum !== undefined) {
      MusicAlbumInfo.encode(message.musicAlbum, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAlbumResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAlbumResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.musicAlbum = MusicAlbumInfo.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetAlbumResponse {
    return { musicAlbum: isSet(object.musicAlbum) ? MusicAlbumInfo.fromJSON(object.musicAlbum) : undefined };
  },

  toJSON(message: GetAlbumResponse): unknown {
    const obj: any = {};
    message.musicAlbum !== undefined &&
      (obj.musicAlbum = message.musicAlbum ? MusicAlbumInfo.toJSON(message.musicAlbum) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetAlbumResponse>, I>>(object: I): GetAlbumResponse {
    const message = createBaseGetAlbumResponse();
    message.musicAlbum = (object.musicAlbum !== undefined && object.musicAlbum !== null)
      ? MusicAlbumInfo.fromPartial(object.musicAlbum)
      : undefined;
    return message;
  },
};

function createBaseGetAlbumIdListForLibraryResponse(): GetAlbumIdListForLibraryResponse {
  return { albumLibraries: [] };
}

export const GetAlbumIdListForLibraryResponse = {
  encode(message: GetAlbumIdListForLibraryResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.albumLibraries) {
      AlbumLibraryInfo.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAlbumIdListForLibraryResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAlbumIdListForLibraryResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.albumLibraries.push(AlbumLibraryInfo.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetAlbumIdListForLibraryResponse {
    return {
      albumLibraries: Array.isArray(object?.albumLibraries)
        ? object.albumLibraries.map((e: any) => AlbumLibraryInfo.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GetAlbumIdListForLibraryResponse): unknown {
    const obj: any = {};
    if (message.albumLibraries) {
      obj.albumLibraries = message.albumLibraries.map((e) => e ? AlbumLibraryInfo.toJSON(e) : undefined);
    } else {
      obj.albumLibraries = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetAlbumIdListForLibraryResponse>, I>>(
    object: I,
  ): GetAlbumIdListForLibraryResponse {
    const message = createBaseGetAlbumIdListForLibraryResponse();
    message.albumLibraries = object.albumLibraries?.map((e) => AlbumLibraryInfo.fromPartial(e)) || [];
    return message;
  },
};

export interface MusicplayerService {
  GetAllAlbumList(
    request: DeepPartial<GetAllAlbumListRequest>,
    metadata?: grpc.Metadata,
  ): Promise<GetAllAlbumListResponse>;
  GetUserAlbumList(
    request: DeepPartial<GetUserAlbumListRequest>,
    metadata?: grpc.Metadata,
  ): Promise<GetUserAlbumListResponse>;
  GetAlbum(request: DeepPartial<GetAlbumRequest>, metadata?: grpc.Metadata): Promise<GetAlbumResponse>;
  GetAlbumIdListForLibrary(
    request: DeepPartial<GetAlbumIdListForLibraryRequest>,
    metadata?: grpc.Metadata,
  ): Promise<GetAlbumIdListForLibraryResponse>;
  GetOtherAlbumList(
    request: DeepPartial<GetOtherAlbumListRequest>,
    metadata?: grpc.Metadata,
  ): Promise<GetOtherAlbumListResponse>;
}

export class MusicplayerServiceClientImpl implements MusicplayerService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.GetAllAlbumList = this.GetAllAlbumList.bind(this);
    this.GetUserAlbumList = this.GetUserAlbumList.bind(this);
    this.GetAlbum = this.GetAlbum.bind(this);
    this.GetAlbumIdListForLibrary = this.GetAlbumIdListForLibrary.bind(this);
    this.GetOtherAlbumList = this.GetOtherAlbumList.bind(this);
  }

  GetAllAlbumList(
    request: DeepPartial<GetAllAlbumListRequest>,
    metadata?: grpc.Metadata,
  ): Promise<GetAllAlbumListResponse> {
    return this.rpc.unary(MusicplayerServiceGetAllAlbumListDesc, GetAllAlbumListRequest.fromPartial(request), metadata);
  }

  GetUserAlbumList(
    request: DeepPartial<GetUserAlbumListRequest>,
    metadata?: grpc.Metadata,
  ): Promise<GetUserAlbumListResponse> {
    return this.rpc.unary(
      MusicplayerServiceGetUserAlbumListDesc,
      GetUserAlbumListRequest.fromPartial(request),
      metadata,
    );
  }

  GetAlbum(request: DeepPartial<GetAlbumRequest>, metadata?: grpc.Metadata): Promise<GetAlbumResponse> {
    return this.rpc.unary(MusicplayerServiceGetAlbumDesc, GetAlbumRequest.fromPartial(request), metadata);
  }

  GetAlbumIdListForLibrary(
    request: DeepPartial<GetAlbumIdListForLibraryRequest>,
    metadata?: grpc.Metadata,
  ): Promise<GetAlbumIdListForLibraryResponse> {
    return this.rpc.unary(
      MusicplayerServiceGetAlbumIdListForLibraryDesc,
      GetAlbumIdListForLibraryRequest.fromPartial(request),
      metadata,
    );
  }

  GetOtherAlbumList(
    request: DeepPartial<GetOtherAlbumListRequest>,
    metadata?: grpc.Metadata,
  ): Promise<GetOtherAlbumListResponse> {
    return this.rpc.unary(
      MusicplayerServiceGetOtherAlbumListDesc,
      GetOtherAlbumListRequest.fromPartial(request),
      metadata,
    );
  }
}

export const MusicplayerServiceDesc = { serviceName: "musicplayer.v1.MusicplayerService" };

export const MusicplayerServiceGetAllAlbumListDesc: UnaryMethodDefinitionish = {
  methodName: "GetAllAlbumList",
  service: MusicplayerServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GetAllAlbumListRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...GetAllAlbumListResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const MusicplayerServiceGetUserAlbumListDesc: UnaryMethodDefinitionish = {
  methodName: "GetUserAlbumList",
  service: MusicplayerServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GetUserAlbumListRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...GetUserAlbumListResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const MusicplayerServiceGetAlbumDesc: UnaryMethodDefinitionish = {
  methodName: "GetAlbum",
  service: MusicplayerServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GetAlbumRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...GetAlbumResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const MusicplayerServiceGetAlbumIdListForLibraryDesc: UnaryMethodDefinitionish = {
  methodName: "GetAlbumIdListForLibrary",
  service: MusicplayerServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GetAlbumIdListForLibraryRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...GetAlbumIdListForLibraryResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const MusicplayerServiceGetOtherAlbumListDesc: UnaryMethodDefinitionish = {
  methodName: "GetOtherAlbumList",
  service: MusicplayerServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GetOtherAlbumListRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...GetOtherAlbumListResponse.decode(data),
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
