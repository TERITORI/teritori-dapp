/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "video.v1";

export interface GetUserVideoListRequest {
  createdBy: string;
  limit: number;
  offset: number;
}

export interface GetUserVideoListResponse {
  videoInfos: VideoInfo[];
}

export interface GetVideoRequest {
  identifier: string;
}

export interface GetVideoResponse {
  videoInfo: VideoInfo | undefined;
}

export interface GetVideoListRequest {
  limit: number;
  offset: number;
}

export interface GetVideoListResponse {
  videoInfos: VideoInfo[];
}

export interface GetVideoListForLibraryRequest {
  user: string;
}

export interface GetVideoListForLibraryResponse {
  videoInfos: VideoInfo[];
}

export interface VideoInfo {
  identifier: string;
  metadata: string;
  createdBy: string;
  createdAt: number;
  viewCount: number;
  like: number;
  dislike: number;
}

export interface CommentInfo {
  comment: string;
  createdBy: string;
  createdAt: number;
}

export interface IncreaseViewCountRequest {
  identifier: string;
  user: string;
}

export interface IncreaseViewCountResponse {
  res: number;
}

export interface LikeRequest {
  identifier: string;
  user: string;
}

export interface LikeResponse {
  res: number;
}

export interface DislikeRequest {
  identifier: string;
  user: string;
}

export interface DislikeResponse {
  res: number;
}

export interface GetCommentListRequest {
  identifier: string;
}

export interface GetCommentListResponse {
  commentInfos: CommentInfo[];
}

function createBaseGetUserVideoListRequest(): GetUserVideoListRequest {
  return { createdBy: "", limit: 0, offset: 0 };
}

export const GetUserVideoListRequest = {
  encode(message: GetUserVideoListRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
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

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUserVideoListRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserVideoListRequest();
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

  fromJSON(object: any): GetUserVideoListRequest {
    return {
      createdBy: isSet(object.createdBy) ? String(object.createdBy) : "",
      limit: isSet(object.limit) ? Number(object.limit) : 0,
      offset: isSet(object.offset) ? Number(object.offset) : 0,
    };
  },

  toJSON(message: GetUserVideoListRequest): unknown {
    const obj: any = {};
    message.createdBy !== undefined && (obj.createdBy = message.createdBy);
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.offset !== undefined && (obj.offset = Math.round(message.offset));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetUserVideoListRequest>, I>>(object: I): GetUserVideoListRequest {
    const message = createBaseGetUserVideoListRequest();
    message.createdBy = object.createdBy ?? "";
    message.limit = object.limit ?? 0;
    message.offset = object.offset ?? 0;
    return message;
  },
};

function createBaseGetUserVideoListResponse(): GetUserVideoListResponse {
  return { videoInfos: [] };
}

export const GetUserVideoListResponse = {
  encode(message: GetUserVideoListResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.videoInfos) {
      VideoInfo.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUserVideoListResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserVideoListResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.videoInfos.push(VideoInfo.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetUserVideoListResponse {
    return {
      videoInfos: Array.isArray(object?.videoInfos) ? object.videoInfos.map((e: any) => VideoInfo.fromJSON(e)) : [],
    };
  },

  toJSON(message: GetUserVideoListResponse): unknown {
    const obj: any = {};
    if (message.videoInfos) {
      obj.videoInfos = message.videoInfos.map((e) => e ? VideoInfo.toJSON(e) : undefined);
    } else {
      obj.videoInfos = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetUserVideoListResponse>, I>>(object: I): GetUserVideoListResponse {
    const message = createBaseGetUserVideoListResponse();
    message.videoInfos = object.videoInfos?.map((e) => VideoInfo.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetVideoRequest(): GetVideoRequest {
  return { identifier: "" };
}

export const GetVideoRequest = {
  encode(message: GetVideoRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identifier !== "") {
      writer.uint32(10).string(message.identifier);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetVideoRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetVideoRequest();
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

  fromJSON(object: any): GetVideoRequest {
    return { identifier: isSet(object.identifier) ? String(object.identifier) : "" };
  },

  toJSON(message: GetVideoRequest): unknown {
    const obj: any = {};
    message.identifier !== undefined && (obj.identifier = message.identifier);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetVideoRequest>, I>>(object: I): GetVideoRequest {
    const message = createBaseGetVideoRequest();
    message.identifier = object.identifier ?? "";
    return message;
  },
};

function createBaseGetVideoResponse(): GetVideoResponse {
  return { videoInfo: undefined };
}

export const GetVideoResponse = {
  encode(message: GetVideoResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.videoInfo !== undefined) {
      VideoInfo.encode(message.videoInfo, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetVideoResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetVideoResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.videoInfo = VideoInfo.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetVideoResponse {
    return { videoInfo: isSet(object.videoInfo) ? VideoInfo.fromJSON(object.videoInfo) : undefined };
  },

  toJSON(message: GetVideoResponse): unknown {
    const obj: any = {};
    message.videoInfo !== undefined &&
      (obj.videoInfo = message.videoInfo ? VideoInfo.toJSON(message.videoInfo) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetVideoResponse>, I>>(object: I): GetVideoResponse {
    const message = createBaseGetVideoResponse();
    message.videoInfo = (object.videoInfo !== undefined && object.videoInfo !== null)
      ? VideoInfo.fromPartial(object.videoInfo)
      : undefined;
    return message;
  },
};

function createBaseGetVideoListRequest(): GetVideoListRequest {
  return { limit: 0, offset: 0 };
}

export const GetVideoListRequest = {
  encode(message: GetVideoListRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.limit !== 0) {
      writer.uint32(8).uint32(message.limit);
    }
    if (message.offset !== 0) {
      writer.uint32(16).uint32(message.offset);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetVideoListRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetVideoListRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.limit = reader.uint32();
          break;
        case 2:
          message.offset = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetVideoListRequest {
    return {
      limit: isSet(object.limit) ? Number(object.limit) : 0,
      offset: isSet(object.offset) ? Number(object.offset) : 0,
    };
  },

  toJSON(message: GetVideoListRequest): unknown {
    const obj: any = {};
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.offset !== undefined && (obj.offset = Math.round(message.offset));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetVideoListRequest>, I>>(object: I): GetVideoListRequest {
    const message = createBaseGetVideoListRequest();
    message.limit = object.limit ?? 0;
    message.offset = object.offset ?? 0;
    return message;
  },
};

function createBaseGetVideoListResponse(): GetVideoListResponse {
  return { videoInfos: [] };
}

export const GetVideoListResponse = {
  encode(message: GetVideoListResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.videoInfos) {
      VideoInfo.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetVideoListResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetVideoListResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.videoInfos.push(VideoInfo.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetVideoListResponse {
    return {
      videoInfos: Array.isArray(object?.videoInfos) ? object.videoInfos.map((e: any) => VideoInfo.fromJSON(e)) : [],
    };
  },

  toJSON(message: GetVideoListResponse): unknown {
    const obj: any = {};
    if (message.videoInfos) {
      obj.videoInfos = message.videoInfos.map((e) => e ? VideoInfo.toJSON(e) : undefined);
    } else {
      obj.videoInfos = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetVideoListResponse>, I>>(object: I): GetVideoListResponse {
    const message = createBaseGetVideoListResponse();
    message.videoInfos = object.videoInfos?.map((e) => VideoInfo.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetVideoListForLibraryRequest(): GetVideoListForLibraryRequest {
  return { user: "" };
}

export const GetVideoListForLibraryRequest = {
  encode(message: GetVideoListForLibraryRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.user !== "") {
      writer.uint32(10).string(message.user);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetVideoListForLibraryRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetVideoListForLibraryRequest();
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

  fromJSON(object: any): GetVideoListForLibraryRequest {
    return { user: isSet(object.user) ? String(object.user) : "" };
  },

  toJSON(message: GetVideoListForLibraryRequest): unknown {
    const obj: any = {};
    message.user !== undefined && (obj.user = message.user);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetVideoListForLibraryRequest>, I>>(
    object: I,
  ): GetVideoListForLibraryRequest {
    const message = createBaseGetVideoListForLibraryRequest();
    message.user = object.user ?? "";
    return message;
  },
};

function createBaseGetVideoListForLibraryResponse(): GetVideoListForLibraryResponse {
  return { videoInfos: [] };
}

export const GetVideoListForLibraryResponse = {
  encode(message: GetVideoListForLibraryResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.videoInfos) {
      VideoInfo.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetVideoListForLibraryResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetVideoListForLibraryResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.videoInfos.push(VideoInfo.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetVideoListForLibraryResponse {
    return {
      videoInfos: Array.isArray(object?.videoInfos) ? object.videoInfos.map((e: any) => VideoInfo.fromJSON(e)) : [],
    };
  },

  toJSON(message: GetVideoListForLibraryResponse): unknown {
    const obj: any = {};
    if (message.videoInfos) {
      obj.videoInfos = message.videoInfos.map((e) => e ? VideoInfo.toJSON(e) : undefined);
    } else {
      obj.videoInfos = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetVideoListForLibraryResponse>, I>>(
    object: I,
  ): GetVideoListForLibraryResponse {
    const message = createBaseGetVideoListForLibraryResponse();
    message.videoInfos = object.videoInfos?.map((e) => VideoInfo.fromPartial(e)) || [];
    return message;
  },
};

function createBaseVideoInfo(): VideoInfo {
  return { identifier: "", metadata: "", createdBy: "", createdAt: 0, viewCount: 0, like: 0, dislike: 0 };
}

export const VideoInfo = {
  encode(message: VideoInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identifier !== "") {
      writer.uint32(10).string(message.identifier);
    }
    if (message.metadata !== "") {
      writer.uint32(18).string(message.metadata);
    }
    if (message.createdBy !== "") {
      writer.uint32(26).string(message.createdBy);
    }
    if (message.createdAt !== 0) {
      writer.uint32(32).uint32(message.createdAt);
    }
    if (message.viewCount !== 0) {
      writer.uint32(40).uint32(message.viewCount);
    }
    if (message.like !== 0) {
      writer.uint32(48).uint32(message.like);
    }
    if (message.dislike !== 0) {
      writer.uint32(56).uint32(message.dislike);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): VideoInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVideoInfo();
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
        case 4:
          message.createdAt = reader.uint32();
          break;
        case 5:
          message.viewCount = reader.uint32();
          break;
        case 6:
          message.like = reader.uint32();
          break;
        case 7:
          message.dislike = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): VideoInfo {
    return {
      identifier: isSet(object.identifier) ? String(object.identifier) : "",
      metadata: isSet(object.metadata) ? String(object.metadata) : "",
      createdBy: isSet(object.createdBy) ? String(object.createdBy) : "",
      createdAt: isSet(object.createdAt) ? Number(object.createdAt) : 0,
      viewCount: isSet(object.viewCount) ? Number(object.viewCount) : 0,
      like: isSet(object.like) ? Number(object.like) : 0,
      dislike: isSet(object.dislike) ? Number(object.dislike) : 0,
    };
  },

  toJSON(message: VideoInfo): unknown {
    const obj: any = {};
    message.identifier !== undefined && (obj.identifier = message.identifier);
    message.metadata !== undefined && (obj.metadata = message.metadata);
    message.createdBy !== undefined && (obj.createdBy = message.createdBy);
    message.createdAt !== undefined && (obj.createdAt = Math.round(message.createdAt));
    message.viewCount !== undefined && (obj.viewCount = Math.round(message.viewCount));
    message.like !== undefined && (obj.like = Math.round(message.like));
    message.dislike !== undefined && (obj.dislike = Math.round(message.dislike));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<VideoInfo>, I>>(object: I): VideoInfo {
    const message = createBaseVideoInfo();
    message.identifier = object.identifier ?? "";
    message.metadata = object.metadata ?? "";
    message.createdBy = object.createdBy ?? "";
    message.createdAt = object.createdAt ?? 0;
    message.viewCount = object.viewCount ?? 0;
    message.like = object.like ?? 0;
    message.dislike = object.dislike ?? 0;
    return message;
  },
};

function createBaseCommentInfo(): CommentInfo {
  return { comment: "", createdBy: "", createdAt: 0 };
}

export const CommentInfo = {
  encode(message: CommentInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.comment !== "") {
      writer.uint32(10).string(message.comment);
    }
    if (message.createdBy !== "") {
      writer.uint32(18).string(message.createdBy);
    }
    if (message.createdAt !== 0) {
      writer.uint32(24).uint32(message.createdAt);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CommentInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCommentInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.comment = reader.string();
          break;
        case 2:
          message.createdBy = reader.string();
          break;
        case 3:
          message.createdAt = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CommentInfo {
    return {
      comment: isSet(object.comment) ? String(object.comment) : "",
      createdBy: isSet(object.createdBy) ? String(object.createdBy) : "",
      createdAt: isSet(object.createdAt) ? Number(object.createdAt) : 0,
    };
  },

  toJSON(message: CommentInfo): unknown {
    const obj: any = {};
    message.comment !== undefined && (obj.comment = message.comment);
    message.createdBy !== undefined && (obj.createdBy = message.createdBy);
    message.createdAt !== undefined && (obj.createdAt = Math.round(message.createdAt));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CommentInfo>, I>>(object: I): CommentInfo {
    const message = createBaseCommentInfo();
    message.comment = object.comment ?? "";
    message.createdBy = object.createdBy ?? "";
    message.createdAt = object.createdAt ?? 0;
    return message;
  },
};

function createBaseIncreaseViewCountRequest(): IncreaseViewCountRequest {
  return { identifier: "", user: "" };
}

export const IncreaseViewCountRequest = {
  encode(message: IncreaseViewCountRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identifier !== "") {
      writer.uint32(10).string(message.identifier);
    }
    if (message.user !== "") {
      writer.uint32(18).string(message.user);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IncreaseViewCountRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIncreaseViewCountRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.identifier = reader.string();
          break;
        case 2:
          message.user = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): IncreaseViewCountRequest {
    return {
      identifier: isSet(object.identifier) ? String(object.identifier) : "",
      user: isSet(object.user) ? String(object.user) : "",
    };
  },

  toJSON(message: IncreaseViewCountRequest): unknown {
    const obj: any = {};
    message.identifier !== undefined && (obj.identifier = message.identifier);
    message.user !== undefined && (obj.user = message.user);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<IncreaseViewCountRequest>, I>>(object: I): IncreaseViewCountRequest {
    const message = createBaseIncreaseViewCountRequest();
    message.identifier = object.identifier ?? "";
    message.user = object.user ?? "";
    return message;
  },
};

function createBaseIncreaseViewCountResponse(): IncreaseViewCountResponse {
  return { res: 0 };
}

export const IncreaseViewCountResponse = {
  encode(message: IncreaseViewCountResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.res !== 0) {
      writer.uint32(8).uint32(message.res);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IncreaseViewCountResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIncreaseViewCountResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.res = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): IncreaseViewCountResponse {
    return { res: isSet(object.res) ? Number(object.res) : 0 };
  },

  toJSON(message: IncreaseViewCountResponse): unknown {
    const obj: any = {};
    message.res !== undefined && (obj.res = Math.round(message.res));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<IncreaseViewCountResponse>, I>>(object: I): IncreaseViewCountResponse {
    const message = createBaseIncreaseViewCountResponse();
    message.res = object.res ?? 0;
    return message;
  },
};

function createBaseLikeRequest(): LikeRequest {
  return { identifier: "", user: "" };
}

export const LikeRequest = {
  encode(message: LikeRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identifier !== "") {
      writer.uint32(10).string(message.identifier);
    }
    if (message.user !== "") {
      writer.uint32(18).string(message.user);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LikeRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLikeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.identifier = reader.string();
          break;
        case 2:
          message.user = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LikeRequest {
    return {
      identifier: isSet(object.identifier) ? String(object.identifier) : "",
      user: isSet(object.user) ? String(object.user) : "",
    };
  },

  toJSON(message: LikeRequest): unknown {
    const obj: any = {};
    message.identifier !== undefined && (obj.identifier = message.identifier);
    message.user !== undefined && (obj.user = message.user);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<LikeRequest>, I>>(object: I): LikeRequest {
    const message = createBaseLikeRequest();
    message.identifier = object.identifier ?? "";
    message.user = object.user ?? "";
    return message;
  },
};

function createBaseLikeResponse(): LikeResponse {
  return { res: 0 };
}

export const LikeResponse = {
  encode(message: LikeResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.res !== 0) {
      writer.uint32(8).uint32(message.res);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LikeResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLikeResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.res = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LikeResponse {
    return { res: isSet(object.res) ? Number(object.res) : 0 };
  },

  toJSON(message: LikeResponse): unknown {
    const obj: any = {};
    message.res !== undefined && (obj.res = Math.round(message.res));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<LikeResponse>, I>>(object: I): LikeResponse {
    const message = createBaseLikeResponse();
    message.res = object.res ?? 0;
    return message;
  },
};

function createBaseDislikeRequest(): DislikeRequest {
  return { identifier: "", user: "" };
}

export const DislikeRequest = {
  encode(message: DislikeRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identifier !== "") {
      writer.uint32(10).string(message.identifier);
    }
    if (message.user !== "") {
      writer.uint32(18).string(message.user);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DislikeRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDislikeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.identifier = reader.string();
          break;
        case 2:
          message.user = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DislikeRequest {
    return {
      identifier: isSet(object.identifier) ? String(object.identifier) : "",
      user: isSet(object.user) ? String(object.user) : "",
    };
  },

  toJSON(message: DislikeRequest): unknown {
    const obj: any = {};
    message.identifier !== undefined && (obj.identifier = message.identifier);
    message.user !== undefined && (obj.user = message.user);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DislikeRequest>, I>>(object: I): DislikeRequest {
    const message = createBaseDislikeRequest();
    message.identifier = object.identifier ?? "";
    message.user = object.user ?? "";
    return message;
  },
};

function createBaseDislikeResponse(): DislikeResponse {
  return { res: 0 };
}

export const DislikeResponse = {
  encode(message: DislikeResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.res !== 0) {
      writer.uint32(8).uint32(message.res);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DislikeResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDislikeResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.res = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DislikeResponse {
    return { res: isSet(object.res) ? Number(object.res) : 0 };
  },

  toJSON(message: DislikeResponse): unknown {
    const obj: any = {};
    message.res !== undefined && (obj.res = Math.round(message.res));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DislikeResponse>, I>>(object: I): DislikeResponse {
    const message = createBaseDislikeResponse();
    message.res = object.res ?? 0;
    return message;
  },
};

function createBaseGetCommentListRequest(): GetCommentListRequest {
  return { identifier: "" };
}

export const GetCommentListRequest = {
  encode(message: GetCommentListRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identifier !== "") {
      writer.uint32(10).string(message.identifier);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetCommentListRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetCommentListRequest();
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

  fromJSON(object: any): GetCommentListRequest {
    return { identifier: isSet(object.identifier) ? String(object.identifier) : "" };
  },

  toJSON(message: GetCommentListRequest): unknown {
    const obj: any = {};
    message.identifier !== undefined && (obj.identifier = message.identifier);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetCommentListRequest>, I>>(object: I): GetCommentListRequest {
    const message = createBaseGetCommentListRequest();
    message.identifier = object.identifier ?? "";
    return message;
  },
};

function createBaseGetCommentListResponse(): GetCommentListResponse {
  return { commentInfos: [] };
}

export const GetCommentListResponse = {
  encode(message: GetCommentListResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.commentInfos) {
      CommentInfo.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetCommentListResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetCommentListResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.commentInfos.push(CommentInfo.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetCommentListResponse {
    return {
      commentInfos: Array.isArray(object?.commentInfos)
        ? object.commentInfos.map((e: any) => CommentInfo.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GetCommentListResponse): unknown {
    const obj: any = {};
    if (message.commentInfos) {
      obj.commentInfos = message.commentInfos.map((e) => e ? CommentInfo.toJSON(e) : undefined);
    } else {
      obj.commentInfos = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetCommentListResponse>, I>>(object: I): GetCommentListResponse {
    const message = createBaseGetCommentListResponse();
    message.commentInfos = object.commentInfos?.map((e) => CommentInfo.fromPartial(e)) || [];
    return message;
  },
};

export interface VideoService {
  GetVideoList(request: DeepPartial<GetVideoListRequest>, metadata?: grpc.Metadata): Promise<GetVideoListResponse>;
  GetUserVideoList(
    request: DeepPartial<GetUserVideoListRequest>,
    metadata?: grpc.Metadata,
  ): Promise<GetUserVideoListResponse>;
  GetVideo(request: DeepPartial<GetVideoRequest>, metadata?: grpc.Metadata): Promise<GetVideoResponse>;
  GetVideoListForLibrary(
    request: DeepPartial<GetVideoListForLibraryRequest>,
    metadata?: grpc.Metadata,
  ): Promise<GetVideoListForLibraryResponse>;
  GetCommentList(
    request: DeepPartial<GetCommentListRequest>,
    metadata?: grpc.Metadata,
  ): Promise<GetCommentListResponse>;
  IncreaseViewCount(
    request: DeepPartial<IncreaseViewCountRequest>,
    metadata?: grpc.Metadata,
  ): Promise<IncreaseViewCountResponse>;
  Like(request: DeepPartial<LikeRequest>, metadata?: grpc.Metadata): Promise<LikeResponse>;
  Dislike(request: DeepPartial<DislikeRequest>, metadata?: grpc.Metadata): Promise<DislikeResponse>;
}

export class VideoServiceClientImpl implements VideoService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.GetVideoList = this.GetVideoList.bind(this);
    this.GetUserVideoList = this.GetUserVideoList.bind(this);
    this.GetVideo = this.GetVideo.bind(this);
    this.GetVideoListForLibrary = this.GetVideoListForLibrary.bind(this);
    this.GetCommentList = this.GetCommentList.bind(this);
    this.IncreaseViewCount = this.IncreaseViewCount.bind(this);
    this.Like = this.Like.bind(this);
    this.Dislike = this.Dislike.bind(this);
  }

  GetVideoList(request: DeepPartial<GetVideoListRequest>, metadata?: grpc.Metadata): Promise<GetVideoListResponse> {
    return this.rpc.unary(VideoServiceGetVideoListDesc, GetVideoListRequest.fromPartial(request), metadata);
  }

  GetUserVideoList(
    request: DeepPartial<GetUserVideoListRequest>,
    metadata?: grpc.Metadata,
  ): Promise<GetUserVideoListResponse> {
    return this.rpc.unary(VideoServiceGetUserVideoListDesc, GetUserVideoListRequest.fromPartial(request), metadata);
  }

  GetVideo(request: DeepPartial<GetVideoRequest>, metadata?: grpc.Metadata): Promise<GetVideoResponse> {
    return this.rpc.unary(VideoServiceGetVideoDesc, GetVideoRequest.fromPartial(request), metadata);
  }

  GetVideoListForLibrary(
    request: DeepPartial<GetVideoListForLibraryRequest>,
    metadata?: grpc.Metadata,
  ): Promise<GetVideoListForLibraryResponse> {
    return this.rpc.unary(
      VideoServiceGetVideoListForLibraryDesc,
      GetVideoListForLibraryRequest.fromPartial(request),
      metadata,
    );
  }

  GetCommentList(
    request: DeepPartial<GetCommentListRequest>,
    metadata?: grpc.Metadata,
  ): Promise<GetCommentListResponse> {
    return this.rpc.unary(VideoServiceGetCommentListDesc, GetCommentListRequest.fromPartial(request), metadata);
  }

  IncreaseViewCount(
    request: DeepPartial<IncreaseViewCountRequest>,
    metadata?: grpc.Metadata,
  ): Promise<IncreaseViewCountResponse> {
    return this.rpc.unary(VideoServiceIncreaseViewCountDesc, IncreaseViewCountRequest.fromPartial(request), metadata);
  }

  Like(request: DeepPartial<LikeRequest>, metadata?: grpc.Metadata): Promise<LikeResponse> {
    return this.rpc.unary(VideoServiceLikeDesc, LikeRequest.fromPartial(request), metadata);
  }

  Dislike(request: DeepPartial<DislikeRequest>, metadata?: grpc.Metadata): Promise<DislikeResponse> {
    return this.rpc.unary(VideoServiceDislikeDesc, DislikeRequest.fromPartial(request), metadata);
  }
}

export const VideoServiceDesc = { serviceName: "video.v1.VideoService" };

export const VideoServiceGetVideoListDesc: UnaryMethodDefinitionish = {
  methodName: "GetVideoList",
  service: VideoServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GetVideoListRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...GetVideoListResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const VideoServiceGetUserVideoListDesc: UnaryMethodDefinitionish = {
  methodName: "GetUserVideoList",
  service: VideoServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GetUserVideoListRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...GetUserVideoListResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const VideoServiceGetVideoDesc: UnaryMethodDefinitionish = {
  methodName: "GetVideo",
  service: VideoServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GetVideoRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...GetVideoResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const VideoServiceGetVideoListForLibraryDesc: UnaryMethodDefinitionish = {
  methodName: "GetVideoListForLibrary",
  service: VideoServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GetVideoListForLibraryRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...GetVideoListForLibraryResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const VideoServiceGetCommentListDesc: UnaryMethodDefinitionish = {
  methodName: "GetCommentList",
  service: VideoServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GetCommentListRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...GetCommentListResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const VideoServiceIncreaseViewCountDesc: UnaryMethodDefinitionish = {
  methodName: "IncreaseViewCount",
  service: VideoServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return IncreaseViewCountRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...IncreaseViewCountResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const VideoServiceLikeDesc: UnaryMethodDefinitionish = {
  methodName: "Like",
  service: VideoServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return LikeRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...LikeResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const VideoServiceDislikeDesc: UnaryMethodDefinitionish = {
  methodName: "Dislike",
  service: VideoServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return DislikeRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...DislikeResponse.decode(data),
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
