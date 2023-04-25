/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "musicplayer.v1";

export interface UploadAlbumRequest {
  name: string;
  description: string;
  image: string;
}

export interface UploadAlbumResponse {
  result: number;
}

export interface UploadMusicRequest {
  albumId: number;
  name: string;
  duration: number;
  ipfs: string;
}

export interface UploadMusicResponse {
  result: number;
}

export interface GetAlbumListRequest {
}

export interface AlbumShortInfo {
  id: number;
  name: string;
  description: string;
  image: string;
}

export interface GetAlbumListResponse {
  albums: AlbumShortInfo[];
}

export interface GetAlbumRequest {
  id: number;
}

export interface MusicFileInfo {
  albumId: number;
  fileId: number;
  name: string;
  duration: number;
  ipfs: string;
}

export interface AlbumInfo {
  id: number;
  name: string;
  description: string;
  image: string;
  musics: MusicFileInfo[];
}

export interface GetAlbumResponse {
  album: AlbumInfo | undefined;
}

function createBaseUploadAlbumRequest(): UploadAlbumRequest {
  return { name: "", description: "", image: "" };
}

export const UploadAlbumRequest = {
  encode(message: UploadAlbumRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.image !== "") {
      writer.uint32(26).string(message.image);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UploadAlbumRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUploadAlbumRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        case 3:
          message.image = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UploadAlbumRequest {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      description: isSet(object.description) ? String(object.description) : "",
      image: isSet(object.image) ? String(object.image) : "",
    };
  },

  toJSON(message: UploadAlbumRequest): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.description !== undefined && (obj.description = message.description);
    message.image !== undefined && (obj.image = message.image);
    return obj;
  },

  create<I extends Exact<DeepPartial<UploadAlbumRequest>, I>>(base?: I): UploadAlbumRequest {
    return UploadAlbumRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UploadAlbumRequest>, I>>(object: I): UploadAlbumRequest {
    const message = createBaseUploadAlbumRequest();
    message.name = object.name ?? "";
    message.description = object.description ?? "";
    message.image = object.image ?? "";
    return message;
  },
};

function createBaseUploadAlbumResponse(): UploadAlbumResponse {
  return { result: 0 };
}

export const UploadAlbumResponse = {
  encode(message: UploadAlbumResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== 0) {
      writer.uint32(8).int32(message.result);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UploadAlbumResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUploadAlbumResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.result = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UploadAlbumResponse {
    return { result: isSet(object.result) ? Number(object.result) : 0 };
  },

  toJSON(message: UploadAlbumResponse): unknown {
    const obj: any = {};
    message.result !== undefined && (obj.result = Math.round(message.result));
    return obj;
  },

  create<I extends Exact<DeepPartial<UploadAlbumResponse>, I>>(base?: I): UploadAlbumResponse {
    return UploadAlbumResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UploadAlbumResponse>, I>>(object: I): UploadAlbumResponse {
    const message = createBaseUploadAlbumResponse();
    message.result = object.result ?? 0;
    return message;
  },
};

function createBaseUploadMusicRequest(): UploadMusicRequest {
  return { albumId: 0, name: "", duration: 0, ipfs: "" };
}

export const UploadMusicRequest = {
  encode(message: UploadMusicRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.albumId !== 0) {
      writer.uint32(8).uint32(message.albumId);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.duration !== 0) {
      writer.uint32(24).uint32(message.duration);
    }
    if (message.ipfs !== "") {
      writer.uint32(34).string(message.ipfs);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UploadMusicRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUploadMusicRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.albumId = reader.uint32();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.duration = reader.uint32();
          break;
        case 4:
          message.ipfs = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UploadMusicRequest {
    return {
      albumId: isSet(object.albumId) ? Number(object.albumId) : 0,
      name: isSet(object.name) ? String(object.name) : "",
      duration: isSet(object.duration) ? Number(object.duration) : 0,
      ipfs: isSet(object.ipfs) ? String(object.ipfs) : "",
    };
  },

  toJSON(message: UploadMusicRequest): unknown {
    const obj: any = {};
    message.albumId !== undefined && (obj.albumId = Math.round(message.albumId));
    message.name !== undefined && (obj.name = message.name);
    message.duration !== undefined && (obj.duration = Math.round(message.duration));
    message.ipfs !== undefined && (obj.ipfs = message.ipfs);
    return obj;
  },

  create<I extends Exact<DeepPartial<UploadMusicRequest>, I>>(base?: I): UploadMusicRequest {
    return UploadMusicRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UploadMusicRequest>, I>>(object: I): UploadMusicRequest {
    const message = createBaseUploadMusicRequest();
    message.albumId = object.albumId ?? 0;
    message.name = object.name ?? "";
    message.duration = object.duration ?? 0;
    message.ipfs = object.ipfs ?? "";
    return message;
  },
};

function createBaseUploadMusicResponse(): UploadMusicResponse {
  return { result: 0 };
}

export const UploadMusicResponse = {
  encode(message: UploadMusicResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== 0) {
      writer.uint32(8).int32(message.result);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UploadMusicResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUploadMusicResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.result = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UploadMusicResponse {
    return { result: isSet(object.result) ? Number(object.result) : 0 };
  },

  toJSON(message: UploadMusicResponse): unknown {
    const obj: any = {};
    message.result !== undefined && (obj.result = Math.round(message.result));
    return obj;
  },

  create<I extends Exact<DeepPartial<UploadMusicResponse>, I>>(base?: I): UploadMusicResponse {
    return UploadMusicResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UploadMusicResponse>, I>>(object: I): UploadMusicResponse {
    const message = createBaseUploadMusicResponse();
    message.result = object.result ?? 0;
    return message;
  },
};

function createBaseGetAlbumListRequest(): GetAlbumListRequest {
  return {};
}

export const GetAlbumListRequest = {
  encode(_: GetAlbumListRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAlbumListRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAlbumListRequest();
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

  fromJSON(_: any): GetAlbumListRequest {
    return {};
  },

  toJSON(_: GetAlbumListRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<GetAlbumListRequest>, I>>(base?: I): GetAlbumListRequest {
    return GetAlbumListRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetAlbumListRequest>, I>>(_: I): GetAlbumListRequest {
    const message = createBaseGetAlbumListRequest();
    return message;
  },
};

function createBaseAlbumShortInfo(): AlbumShortInfo {
  return { id: 0, name: "", description: "", image: "" };
}

export const AlbumShortInfo = {
  encode(message: AlbumShortInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).uint32(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.description !== "") {
      writer.uint32(26).string(message.description);
    }
    if (message.image !== "") {
      writer.uint32(34).string(message.image);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AlbumShortInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAlbumShortInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.uint32();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.description = reader.string();
          break;
        case 4:
          message.image = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AlbumShortInfo {
    return {
      id: isSet(object.id) ? Number(object.id) : 0,
      name: isSet(object.name) ? String(object.name) : "",
      description: isSet(object.description) ? String(object.description) : "",
      image: isSet(object.image) ? String(object.image) : "",
    };
  },

  toJSON(message: AlbumShortInfo): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    message.name !== undefined && (obj.name = message.name);
    message.description !== undefined && (obj.description = message.description);
    message.image !== undefined && (obj.image = message.image);
    return obj;
  },

  create<I extends Exact<DeepPartial<AlbumShortInfo>, I>>(base?: I): AlbumShortInfo {
    return AlbumShortInfo.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<AlbumShortInfo>, I>>(object: I): AlbumShortInfo {
    const message = createBaseAlbumShortInfo();
    message.id = object.id ?? 0;
    message.name = object.name ?? "";
    message.description = object.description ?? "";
    message.image = object.image ?? "";
    return message;
  },
};

function createBaseGetAlbumListResponse(): GetAlbumListResponse {
  return { albums: [] };
}

export const GetAlbumListResponse = {
  encode(message: GetAlbumListResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.albums) {
      AlbumShortInfo.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAlbumListResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAlbumListResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.albums.push(AlbumShortInfo.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetAlbumListResponse {
    return { albums: Array.isArray(object?.albums) ? object.albums.map((e: any) => AlbumShortInfo.fromJSON(e)) : [] };
  },

  toJSON(message: GetAlbumListResponse): unknown {
    const obj: any = {};
    if (message.albums) {
      obj.albums = message.albums.map((e) => e ? AlbumShortInfo.toJSON(e) : undefined);
    } else {
      obj.albums = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetAlbumListResponse>, I>>(base?: I): GetAlbumListResponse {
    return GetAlbumListResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetAlbumListResponse>, I>>(object: I): GetAlbumListResponse {
    const message = createBaseGetAlbumListResponse();
    message.albums = object.albums?.map((e) => AlbumShortInfo.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetAlbumRequest(): GetAlbumRequest {
  return { id: 0 };
}

export const GetAlbumRequest = {
  encode(message: GetAlbumRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).uint32(message.id);
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
          message.id = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetAlbumRequest {
    return { id: isSet(object.id) ? Number(object.id) : 0 };
  },

  toJSON(message: GetAlbumRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    return obj;
  },

  create<I extends Exact<DeepPartial<GetAlbumRequest>, I>>(base?: I): GetAlbumRequest {
    return GetAlbumRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetAlbumRequest>, I>>(object: I): GetAlbumRequest {
    const message = createBaseGetAlbumRequest();
    message.id = object.id ?? 0;
    return message;
  },
};

function createBaseMusicFileInfo(): MusicFileInfo {
  return { albumId: 0, fileId: 0, name: "", duration: 0, ipfs: "" };
}

export const MusicFileInfo = {
  encode(message: MusicFileInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.albumId !== 0) {
      writer.uint32(8).uint32(message.albumId);
    }
    if (message.fileId !== 0) {
      writer.uint32(16).uint32(message.fileId);
    }
    if (message.name !== "") {
      writer.uint32(26).string(message.name);
    }
    if (message.duration !== 0) {
      writer.uint32(32).uint32(message.duration);
    }
    if (message.ipfs !== "") {
      writer.uint32(42).string(message.ipfs);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MusicFileInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMusicFileInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.albumId = reader.uint32();
          break;
        case 2:
          message.fileId = reader.uint32();
          break;
        case 3:
          message.name = reader.string();
          break;
        case 4:
          message.duration = reader.uint32();
          break;
        case 5:
          message.ipfs = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MusicFileInfo {
    return {
      albumId: isSet(object.albumId) ? Number(object.albumId) : 0,
      fileId: isSet(object.fileId) ? Number(object.fileId) : 0,
      name: isSet(object.name) ? String(object.name) : "",
      duration: isSet(object.duration) ? Number(object.duration) : 0,
      ipfs: isSet(object.ipfs) ? String(object.ipfs) : "",
    };
  },

  toJSON(message: MusicFileInfo): unknown {
    const obj: any = {};
    message.albumId !== undefined && (obj.albumId = Math.round(message.albumId));
    message.fileId !== undefined && (obj.fileId = Math.round(message.fileId));
    message.name !== undefined && (obj.name = message.name);
    message.duration !== undefined && (obj.duration = Math.round(message.duration));
    message.ipfs !== undefined && (obj.ipfs = message.ipfs);
    return obj;
  },

  create<I extends Exact<DeepPartial<MusicFileInfo>, I>>(base?: I): MusicFileInfo {
    return MusicFileInfo.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<MusicFileInfo>, I>>(object: I): MusicFileInfo {
    const message = createBaseMusicFileInfo();
    message.albumId = object.albumId ?? 0;
    message.fileId = object.fileId ?? 0;
    message.name = object.name ?? "";
    message.duration = object.duration ?? 0;
    message.ipfs = object.ipfs ?? "";
    return message;
  },
};

function createBaseAlbumInfo(): AlbumInfo {
  return { id: 0, name: "", description: "", image: "", musics: [] };
}

export const AlbumInfo = {
  encode(message: AlbumInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).uint32(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.description !== "") {
      writer.uint32(26).string(message.description);
    }
    if (message.image !== "") {
      writer.uint32(34).string(message.image);
    }
    for (const v of message.musics) {
      MusicFileInfo.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AlbumInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAlbumInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.uint32();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.description = reader.string();
          break;
        case 4:
          message.image = reader.string();
          break;
        case 5:
          message.musics.push(MusicFileInfo.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AlbumInfo {
    return {
      id: isSet(object.id) ? Number(object.id) : 0,
      name: isSet(object.name) ? String(object.name) : "",
      description: isSet(object.description) ? String(object.description) : "",
      image: isSet(object.image) ? String(object.image) : "",
      musics: Array.isArray(object?.musics) ? object.musics.map((e: any) => MusicFileInfo.fromJSON(e)) : [],
    };
  },

  toJSON(message: AlbumInfo): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    message.name !== undefined && (obj.name = message.name);
    message.description !== undefined && (obj.description = message.description);
    message.image !== undefined && (obj.image = message.image);
    if (message.musics) {
      obj.musics = message.musics.map((e) => e ? MusicFileInfo.toJSON(e) : undefined);
    } else {
      obj.musics = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AlbumInfo>, I>>(base?: I): AlbumInfo {
    return AlbumInfo.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<AlbumInfo>, I>>(object: I): AlbumInfo {
    const message = createBaseAlbumInfo();
    message.id = object.id ?? 0;
    message.name = object.name ?? "";
    message.description = object.description ?? "";
    message.image = object.image ?? "";
    message.musics = object.musics?.map((e) => MusicFileInfo.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetAlbumResponse(): GetAlbumResponse {
  return { album: undefined };
}

export const GetAlbumResponse = {
  encode(message: GetAlbumResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.album !== undefined) {
      AlbumInfo.encode(message.album, writer.uint32(10).fork()).ldelim();
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
          message.album = AlbumInfo.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetAlbumResponse {
    return { album: isSet(object.album) ? AlbumInfo.fromJSON(object.album) : undefined };
  },

  toJSON(message: GetAlbumResponse): unknown {
    const obj: any = {};
    message.album !== undefined && (obj.album = message.album ? AlbumInfo.toJSON(message.album) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetAlbumResponse>, I>>(base?: I): GetAlbumResponse {
    return GetAlbumResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetAlbumResponse>, I>>(object: I): GetAlbumResponse {
    const message = createBaseGetAlbumResponse();
    message.album = (object.album !== undefined && object.album !== null)
      ? AlbumInfo.fromPartial(object.album)
      : undefined;
    return message;
  },
};

export interface MusicplayerService {
  uploadAlbum(request: DeepPartial<UploadAlbumRequest>, metadata?: grpc.Metadata): Promise<UploadAlbumResponse>;
  uploadMusic(request: DeepPartial<UploadMusicRequest>, metadata?: grpc.Metadata): Promise<UploadMusicResponse>;
  getAlbumList(request: DeepPartial<GetAlbumListRequest>, metadata?: grpc.Metadata): Promise<GetAlbumListResponse>;
  getAlbum(request: DeepPartial<GetAlbumRequest>, metadata?: grpc.Metadata): Promise<GetAlbumResponse>;
}

export class MusicplayerServiceClientImpl implements MusicplayerService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.uploadAlbum = this.uploadAlbum.bind(this);
    this.uploadMusic = this.uploadMusic.bind(this);
    this.getAlbumList = this.getAlbumList.bind(this);
    this.getAlbum = this.getAlbum.bind(this);
  }

  uploadAlbum(request: DeepPartial<UploadAlbumRequest>, metadata?: grpc.Metadata): Promise<UploadAlbumResponse> {
    return this.rpc.unary(MusicplayerServiceUploadAlbumDesc, UploadAlbumRequest.fromPartial(request), metadata);
  }

  uploadMusic(request: DeepPartial<UploadMusicRequest>, metadata?: grpc.Metadata): Promise<UploadMusicResponse> {
    return this.rpc.unary(MusicplayerServiceUploadMusicDesc, UploadMusicRequest.fromPartial(request), metadata);
  }

  getAlbumList(request: DeepPartial<GetAlbumListRequest>, metadata?: grpc.Metadata): Promise<GetAlbumListResponse> {
    return this.rpc.unary(MusicplayerServiceGetAlbumListDesc, GetAlbumListRequest.fromPartial(request), metadata);
  }

  getAlbum(request: DeepPartial<GetAlbumRequest>, metadata?: grpc.Metadata): Promise<GetAlbumResponse> {
    return this.rpc.unary(MusicplayerServiceGetAlbumDesc, GetAlbumRequest.fromPartial(request), metadata);
  }
}

export const MusicplayerServiceDesc = { serviceName: "musicplayer.v1.MusicplayerService" };

export const MusicplayerServiceUploadAlbumDesc: UnaryMethodDefinitionish = {
  methodName: "UploadAlbum",
  service: MusicplayerServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return UploadAlbumRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = UploadAlbumResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const MusicplayerServiceUploadMusicDesc: UnaryMethodDefinitionish = {
  methodName: "UploadMusic",
  service: MusicplayerServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return UploadMusicRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = UploadMusicResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const MusicplayerServiceGetAlbumListDesc: UnaryMethodDefinitionish = {
  methodName: "GetAlbumList",
  service: MusicplayerServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GetAlbumListRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = GetAlbumListResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
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
      const value = GetAlbumResponse.decode(data);
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

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var tsProtoGlobalThis: any = (() => {
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

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export class GrpcWebError extends tsProtoGlobalThis.Error {
  constructor(message: string, public code: grpc.Code, public metadata: grpc.Metadata) {
    super(message);
  }
}