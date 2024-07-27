/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "launchpad.v1";

export enum Sort {
  SORT_UNSPECIFIED = 0,
  SORT_COLLECTION_NAME = 1,
  UNRECOGNIZED = -1,
}

export function sortFromJSON(object: any): Sort {
  switch (object) {
    case 0:
    case "SORT_UNSPECIFIED":
      return Sort.SORT_UNSPECIFIED;
    case 1:
    case "SORT_COLLECTION_NAME":
      return Sort.SORT_COLLECTION_NAME;
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
    case Sort.SORT_COLLECTION_NAME:
      return "SORT_COLLECTION_NAME";
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

export enum Status {
  STATUS_UNSPECIFIED = 0,
  STATUS_INCOMPLETE = 1,
  STATUS_COMPLETE = 2,
  STATUS_CONFIRMED = 3,
  STATUS_DEPLOYED = 4,
  UNRECOGNIZED = -1,
}

export function statusFromJSON(object: any): Status {
  switch (object) {
    case 0:
    case "STATUS_UNSPECIFIED":
      return Status.STATUS_UNSPECIFIED;
    case 1:
    case "STATUS_INCOMPLETE":
      return Status.STATUS_INCOMPLETE;
    case 2:
    case "STATUS_COMPLETE":
      return Status.STATUS_COMPLETE;
    case 3:
    case "STATUS_CONFIRMED":
      return Status.STATUS_CONFIRMED;
    case 4:
    case "STATUS_DEPLOYED":
      return Status.STATUS_DEPLOYED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Status.UNRECOGNIZED;
  }
}

export function statusToJSON(object: Status): string {
  switch (object) {
    case Status.STATUS_UNSPECIFIED:
      return "STATUS_UNSPECIFIED";
    case Status.STATUS_INCOMPLETE:
      return "STATUS_INCOMPLETE";
    case Status.STATUS_COMPLETE:
      return "STATUS_COMPLETE";
    case Status.STATUS_CONFIRMED:
      return "STATUS_CONFIRMED";
    case Status.STATUS_DEPLOYED:
      return "STATUS_DEPLOYED";
    case Status.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface CollectionsByCreatorRequest {
  creatorId: string;
  networkId: string;
  limit: number;
  offset: number;
  sort: Sort;
  sortDirection: SortDirection;
  status?: Status | undefined;
}

export interface CollectionsByCreatorResponse {
  collections: string[];
}

export interface LaunchpadProjectsRequest {
  networkId: string;
  limit: number;
  offset: number;
  sort: Sort;
  sortDirection: SortDirection;
  /** TODO: user authentication (Member of the admin DAO) using a token */
  userAddress: string;
  status?: Status | undefined;
}

export interface LaunchpadProjectsResponse {
  projects: LaunchpadProject[];
}

export interface LaunchpadProjectByIdRequest {
  networkId: string;
  projectId: string;
  /** TODO: user authentication (Member of the admin DAO) using a token */
  userAddress: string;
}

export interface LaunchpadProjectByIdResponse {
  project: LaunchpadProject | undefined;
}

export interface UploadMetadatasRequest {
  sender: string;
  networkId: string;
  projectId: string;
  metadatas: Metadata[];
  pinataJwt?: string | undefined;
}

export interface UploadMetadatasResponse {
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
  projectId: string;
  tokenId: number;
}

export interface TokenMetadataResponse {
  merkleRoot: string;
  metadata: Metadata | undefined;
  merkleProof: string[];
}

export interface LaunchpadProjectsCountRequest {
  /** TODO: user authentication (Member of the admin DAO) using a token */
  userAddress: string;
  networkId: string;
  status?: Status | undefined;
}

export interface LaunchpadProjectsCountResponse {
  count: number;
}

export interface LaunchpadProject {
  id: string;
  networkId: string;
  creatorId: string;
  collectionData: string;
  merkleRoot?: string | undefined;
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

function createBaseCollectionsByCreatorRequest(): CollectionsByCreatorRequest {
  return { creatorId: "", networkId: "", limit: 0, offset: 0, sort: 0, sortDirection: 0, status: undefined };
}

export const CollectionsByCreatorRequest = {
  encode(message: CollectionsByCreatorRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creatorId !== "") {
      writer.uint32(10).string(message.creatorId);
    }
    if (message.networkId !== "") {
      writer.uint32(18).string(message.networkId);
    }
    if (message.limit !== 0) {
      writer.uint32(24).int32(message.limit);
    }
    if (message.offset !== 0) {
      writer.uint32(32).int32(message.offset);
    }
    if (message.sort !== 0) {
      writer.uint32(40).int32(message.sort);
    }
    if (message.sortDirection !== 0) {
      writer.uint32(48).int32(message.sortDirection);
    }
    if (message.status !== undefined) {
      writer.uint32(56).int32(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CollectionsByCreatorRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCollectionsByCreatorRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.creatorId = reader.string();
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

          message.limit = reader.int32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.offset = reader.int32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.sort = reader.int32() as any;
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.sortDirection = reader.int32() as any;
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.status = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CollectionsByCreatorRequest {
    return {
      creatorId: isSet(object.creatorId) ? globalThis.String(object.creatorId) : "",
      networkId: isSet(object.networkId) ? globalThis.String(object.networkId) : "",
      limit: isSet(object.limit) ? globalThis.Number(object.limit) : 0,
      offset: isSet(object.offset) ? globalThis.Number(object.offset) : 0,
      sort: isSet(object.sort) ? sortFromJSON(object.sort) : 0,
      sortDirection: isSet(object.sortDirection) ? sortDirectionFromJSON(object.sortDirection) : 0,
      status: isSet(object.status) ? statusFromJSON(object.status) : undefined,
    };
  },

  toJSON(message: CollectionsByCreatorRequest): unknown {
    const obj: any = {};
    if (message.creatorId !== "") {
      obj.creatorId = message.creatorId;
    }
    if (message.networkId !== "") {
      obj.networkId = message.networkId;
    }
    if (message.limit !== 0) {
      obj.limit = Math.round(message.limit);
    }
    if (message.offset !== 0) {
      obj.offset = Math.round(message.offset);
    }
    if (message.sort !== 0) {
      obj.sort = sortToJSON(message.sort);
    }
    if (message.sortDirection !== 0) {
      obj.sortDirection = sortDirectionToJSON(message.sortDirection);
    }
    if (message.status !== undefined) {
      obj.status = statusToJSON(message.status);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CollectionsByCreatorRequest>, I>>(base?: I): CollectionsByCreatorRequest {
    return CollectionsByCreatorRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CollectionsByCreatorRequest>, I>>(object: I): CollectionsByCreatorRequest {
    const message = createBaseCollectionsByCreatorRequest();
    message.creatorId = object.creatorId ?? "";
    message.networkId = object.networkId ?? "";
    message.limit = object.limit ?? 0;
    message.offset = object.offset ?? 0;
    message.sort = object.sort ?? 0;
    message.sortDirection = object.sortDirection ?? 0;
    message.status = object.status ?? undefined;
    return message;
  },
};

function createBaseCollectionsByCreatorResponse(): CollectionsByCreatorResponse {
  return { collections: [] };
}

export const CollectionsByCreatorResponse = {
  encode(message: CollectionsByCreatorResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.collections) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CollectionsByCreatorResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCollectionsByCreatorResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.collections.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CollectionsByCreatorResponse {
    return {
      collections: globalThis.Array.isArray(object?.collections)
        ? object.collections.map((e: any) => globalThis.String(e))
        : [],
    };
  },

  toJSON(message: CollectionsByCreatorResponse): unknown {
    const obj: any = {};
    if (message.collections?.length) {
      obj.collections = message.collections;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CollectionsByCreatorResponse>, I>>(base?: I): CollectionsByCreatorResponse {
    return CollectionsByCreatorResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CollectionsByCreatorResponse>, I>>(object: I): CollectionsByCreatorResponse {
    const message = createBaseCollectionsByCreatorResponse();
    message.collections = object.collections?.map((e) => e) || [];
    return message;
  },
};

function createBaseLaunchpadProjectsRequest(): LaunchpadProjectsRequest {
  return { networkId: "", limit: 0, offset: 0, sort: 0, sortDirection: 0, userAddress: "", status: undefined };
}

export const LaunchpadProjectsRequest = {
  encode(message: LaunchpadProjectsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.networkId !== "") {
      writer.uint32(10).string(message.networkId);
    }
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
    if (message.userAddress !== "") {
      writer.uint32(50).string(message.userAddress);
    }
    if (message.status !== undefined) {
      writer.uint32(56).int32(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LaunchpadProjectsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLaunchpadProjectsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.networkId = reader.string();
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
        case 4:
          if (tag !== 32) {
            break;
          }

          message.sort = reader.int32() as any;
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.sortDirection = reader.int32() as any;
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.userAddress = reader.string();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.status = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LaunchpadProjectsRequest {
    return {
      networkId: isSet(object.networkId) ? globalThis.String(object.networkId) : "",
      limit: isSet(object.limit) ? globalThis.Number(object.limit) : 0,
      offset: isSet(object.offset) ? globalThis.Number(object.offset) : 0,
      sort: isSet(object.sort) ? sortFromJSON(object.sort) : 0,
      sortDirection: isSet(object.sortDirection) ? sortDirectionFromJSON(object.sortDirection) : 0,
      userAddress: isSet(object.userAddress) ? globalThis.String(object.userAddress) : "",
      status: isSet(object.status) ? statusFromJSON(object.status) : undefined,
    };
  },

  toJSON(message: LaunchpadProjectsRequest): unknown {
    const obj: any = {};
    if (message.networkId !== "") {
      obj.networkId = message.networkId;
    }
    if (message.limit !== 0) {
      obj.limit = Math.round(message.limit);
    }
    if (message.offset !== 0) {
      obj.offset = Math.round(message.offset);
    }
    if (message.sort !== 0) {
      obj.sort = sortToJSON(message.sort);
    }
    if (message.sortDirection !== 0) {
      obj.sortDirection = sortDirectionToJSON(message.sortDirection);
    }
    if (message.userAddress !== "") {
      obj.userAddress = message.userAddress;
    }
    if (message.status !== undefined) {
      obj.status = statusToJSON(message.status);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LaunchpadProjectsRequest>, I>>(base?: I): LaunchpadProjectsRequest {
    return LaunchpadProjectsRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LaunchpadProjectsRequest>, I>>(object: I): LaunchpadProjectsRequest {
    const message = createBaseLaunchpadProjectsRequest();
    message.networkId = object.networkId ?? "";
    message.limit = object.limit ?? 0;
    message.offset = object.offset ?? 0;
    message.sort = object.sort ?? 0;
    message.sortDirection = object.sortDirection ?? 0;
    message.userAddress = object.userAddress ?? "";
    message.status = object.status ?? undefined;
    return message;
  },
};

function createBaseLaunchpadProjectsResponse(): LaunchpadProjectsResponse {
  return { projects: [] };
}

export const LaunchpadProjectsResponse = {
  encode(message: LaunchpadProjectsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.projects) {
      LaunchpadProject.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LaunchpadProjectsResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLaunchpadProjectsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.projects.push(LaunchpadProject.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LaunchpadProjectsResponse {
    return {
      projects: globalThis.Array.isArray(object?.projects)
        ? object.projects.map((e: any) => LaunchpadProject.fromJSON(e))
        : [],
    };
  },

  toJSON(message: LaunchpadProjectsResponse): unknown {
    const obj: any = {};
    if (message.projects?.length) {
      obj.projects = message.projects.map((e) => LaunchpadProject.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LaunchpadProjectsResponse>, I>>(base?: I): LaunchpadProjectsResponse {
    return LaunchpadProjectsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LaunchpadProjectsResponse>, I>>(object: I): LaunchpadProjectsResponse {
    const message = createBaseLaunchpadProjectsResponse();
    message.projects = object.projects?.map((e) => LaunchpadProject.fromPartial(e)) || [];
    return message;
  },
};

function createBaseLaunchpadProjectByIdRequest(): LaunchpadProjectByIdRequest {
  return { networkId: "", projectId: "", userAddress: "" };
}

export const LaunchpadProjectByIdRequest = {
  encode(message: LaunchpadProjectByIdRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.networkId !== "") {
      writer.uint32(10).string(message.networkId);
    }
    if (message.projectId !== "") {
      writer.uint32(18).string(message.projectId);
    }
    if (message.userAddress !== "") {
      writer.uint32(26).string(message.userAddress);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LaunchpadProjectByIdRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLaunchpadProjectByIdRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.networkId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.projectId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.userAddress = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LaunchpadProjectByIdRequest {
    return {
      networkId: isSet(object.networkId) ? globalThis.String(object.networkId) : "",
      projectId: isSet(object.projectId) ? globalThis.String(object.projectId) : "",
      userAddress: isSet(object.userAddress) ? globalThis.String(object.userAddress) : "",
    };
  },

  toJSON(message: LaunchpadProjectByIdRequest): unknown {
    const obj: any = {};
    if (message.networkId !== "") {
      obj.networkId = message.networkId;
    }
    if (message.projectId !== "") {
      obj.projectId = message.projectId;
    }
    if (message.userAddress !== "") {
      obj.userAddress = message.userAddress;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LaunchpadProjectByIdRequest>, I>>(base?: I): LaunchpadProjectByIdRequest {
    return LaunchpadProjectByIdRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LaunchpadProjectByIdRequest>, I>>(object: I): LaunchpadProjectByIdRequest {
    const message = createBaseLaunchpadProjectByIdRequest();
    message.networkId = object.networkId ?? "";
    message.projectId = object.projectId ?? "";
    message.userAddress = object.userAddress ?? "";
    return message;
  },
};

function createBaseLaunchpadProjectByIdResponse(): LaunchpadProjectByIdResponse {
  return { project: undefined };
}

export const LaunchpadProjectByIdResponse = {
  encode(message: LaunchpadProjectByIdResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.project !== undefined) {
      LaunchpadProject.encode(message.project, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LaunchpadProjectByIdResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLaunchpadProjectByIdResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.project = LaunchpadProject.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LaunchpadProjectByIdResponse {
    return { project: isSet(object.project) ? LaunchpadProject.fromJSON(object.project) : undefined };
  },

  toJSON(message: LaunchpadProjectByIdResponse): unknown {
    const obj: any = {};
    if (message.project !== undefined) {
      obj.project = LaunchpadProject.toJSON(message.project);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LaunchpadProjectByIdResponse>, I>>(base?: I): LaunchpadProjectByIdResponse {
    return LaunchpadProjectByIdResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LaunchpadProjectByIdResponse>, I>>(object: I): LaunchpadProjectByIdResponse {
    const message = createBaseLaunchpadProjectByIdResponse();
    message.project = (object.project !== undefined && object.project !== null)
      ? LaunchpadProject.fromPartial(object.project)
      : undefined;
    return message;
  },
};

function createBaseUploadMetadatasRequest(): UploadMetadatasRequest {
  return { sender: "", networkId: "", projectId: "", metadatas: [], pinataJwt: undefined };
}

export const UploadMetadatasRequest = {
  encode(message: UploadMetadatasRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.networkId !== "") {
      writer.uint32(18).string(message.networkId);
    }
    if (message.projectId !== "") {
      writer.uint32(26).string(message.projectId);
    }
    for (const v of message.metadatas) {
      Metadata.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    if (message.pinataJwt !== undefined) {
      writer.uint32(42).string(message.pinataJwt);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UploadMetadatasRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUploadMetadatasRequest();
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
          if (tag !== 26) {
            break;
          }

          message.projectId = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.metadatas.push(Metadata.decode(reader, reader.uint32()));
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.pinataJwt = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UploadMetadatasRequest {
    return {
      sender: isSet(object.sender) ? globalThis.String(object.sender) : "",
      networkId: isSet(object.networkId) ? globalThis.String(object.networkId) : "",
      projectId: isSet(object.projectId) ? globalThis.String(object.projectId) : "",
      metadatas: globalThis.Array.isArray(object?.metadatas)
        ? object.metadatas.map((e: any) => Metadata.fromJSON(e))
        : [],
      pinataJwt: isSet(object.pinataJwt) ? globalThis.String(object.pinataJwt) : undefined,
    };
  },

  toJSON(message: UploadMetadatasRequest): unknown {
    const obj: any = {};
    if (message.sender !== "") {
      obj.sender = message.sender;
    }
    if (message.networkId !== "") {
      obj.networkId = message.networkId;
    }
    if (message.projectId !== "") {
      obj.projectId = message.projectId;
    }
    if (message.metadatas?.length) {
      obj.metadatas = message.metadatas.map((e) => Metadata.toJSON(e));
    }
    if (message.pinataJwt !== undefined) {
      obj.pinataJwt = message.pinataJwt;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UploadMetadatasRequest>, I>>(base?: I): UploadMetadatasRequest {
    return UploadMetadatasRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UploadMetadatasRequest>, I>>(object: I): UploadMetadatasRequest {
    const message = createBaseUploadMetadatasRequest();
    message.sender = object.sender ?? "";
    message.networkId = object.networkId ?? "";
    message.projectId = object.projectId ?? "";
    message.metadatas = object.metadatas?.map((e) => Metadata.fromPartial(e)) || [];
    message.pinataJwt = object.pinataJwt ?? undefined;
    return message;
  },
};

function createBaseUploadMetadatasResponse(): UploadMetadatasResponse {
  return { merkleRoot: "" };
}

export const UploadMetadatasResponse = {
  encode(message: UploadMetadatasResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.merkleRoot !== "") {
      writer.uint32(10).string(message.merkleRoot);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UploadMetadatasResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUploadMetadatasResponse();
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

  fromJSON(object: any): UploadMetadatasResponse {
    return { merkleRoot: isSet(object.merkleRoot) ? globalThis.String(object.merkleRoot) : "" };
  },

  toJSON(message: UploadMetadatasResponse): unknown {
    const obj: any = {};
    if (message.merkleRoot !== "") {
      obj.merkleRoot = message.merkleRoot;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UploadMetadatasResponse>, I>>(base?: I): UploadMetadatasResponse {
    return UploadMetadatasResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UploadMetadatasResponse>, I>>(object: I): UploadMetadatasResponse {
    const message = createBaseUploadMetadatasResponse();
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
  return { sender: "", networkId: "", projectId: "", tokenId: 0 };
}

export const TokenMetadataRequest = {
  encode(message: TokenMetadataRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.networkId !== "") {
      writer.uint32(18).string(message.networkId);
    }
    if (message.projectId !== "") {
      writer.uint32(26).string(message.projectId);
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
          if (tag !== 26) {
            break;
          }

          message.projectId = reader.string();
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
      projectId: isSet(object.projectId) ? globalThis.String(object.projectId) : "",
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
    if (message.projectId !== "") {
      obj.projectId = message.projectId;
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
    message.projectId = object.projectId ?? "";
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

function createBaseLaunchpadProjectsCountRequest(): LaunchpadProjectsCountRequest {
  return { userAddress: "", networkId: "", status: undefined };
}

export const LaunchpadProjectsCountRequest = {
  encode(message: LaunchpadProjectsCountRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userAddress !== "") {
      writer.uint32(10).string(message.userAddress);
    }
    if (message.networkId !== "") {
      writer.uint32(18).string(message.networkId);
    }
    if (message.status !== undefined) {
      writer.uint32(24).int32(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LaunchpadProjectsCountRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLaunchpadProjectsCountRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.userAddress = reader.string();
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

          message.status = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LaunchpadProjectsCountRequest {
    return {
      userAddress: isSet(object.userAddress) ? globalThis.String(object.userAddress) : "",
      networkId: isSet(object.networkId) ? globalThis.String(object.networkId) : "",
      status: isSet(object.status) ? statusFromJSON(object.status) : undefined,
    };
  },

  toJSON(message: LaunchpadProjectsCountRequest): unknown {
    const obj: any = {};
    if (message.userAddress !== "") {
      obj.userAddress = message.userAddress;
    }
    if (message.networkId !== "") {
      obj.networkId = message.networkId;
    }
    if (message.status !== undefined) {
      obj.status = statusToJSON(message.status);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LaunchpadProjectsCountRequest>, I>>(base?: I): LaunchpadProjectsCountRequest {
    return LaunchpadProjectsCountRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LaunchpadProjectsCountRequest>, I>>(
    object: I,
  ): LaunchpadProjectsCountRequest {
    const message = createBaseLaunchpadProjectsCountRequest();
    message.userAddress = object.userAddress ?? "";
    message.networkId = object.networkId ?? "";
    message.status = object.status ?? undefined;
    return message;
  },
};

function createBaseLaunchpadProjectsCountResponse(): LaunchpadProjectsCountResponse {
  return { count: 0 };
}

export const LaunchpadProjectsCountResponse = {
  encode(message: LaunchpadProjectsCountResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.count !== 0) {
      writer.uint32(8).uint32(message.count);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LaunchpadProjectsCountResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLaunchpadProjectsCountResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.count = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LaunchpadProjectsCountResponse {
    return { count: isSet(object.count) ? globalThis.Number(object.count) : 0 };
  },

  toJSON(message: LaunchpadProjectsCountResponse): unknown {
    const obj: any = {};
    if (message.count !== 0) {
      obj.count = Math.round(message.count);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LaunchpadProjectsCountResponse>, I>>(base?: I): LaunchpadProjectsCountResponse {
    return LaunchpadProjectsCountResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LaunchpadProjectsCountResponse>, I>>(
    object: I,
  ): LaunchpadProjectsCountResponse {
    const message = createBaseLaunchpadProjectsCountResponse();
    message.count = object.count ?? 0;
    return message;
  },
};

function createBaseLaunchpadProject(): LaunchpadProject {
  return { id: "", networkId: "", creatorId: "", collectionData: "", merkleRoot: undefined };
}

export const LaunchpadProject = {
  encode(message: LaunchpadProject, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.networkId !== "") {
      writer.uint32(18).string(message.networkId);
    }
    if (message.creatorId !== "") {
      writer.uint32(26).string(message.creatorId);
    }
    if (message.collectionData !== "") {
      writer.uint32(34).string(message.collectionData);
    }
    if (message.merkleRoot !== undefined) {
      writer.uint32(42).string(message.merkleRoot);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LaunchpadProject {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLaunchpadProject();
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

          message.networkId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.creatorId = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.collectionData = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
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

  fromJSON(object: any): LaunchpadProject {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      networkId: isSet(object.networkId) ? globalThis.String(object.networkId) : "",
      creatorId: isSet(object.creatorId) ? globalThis.String(object.creatorId) : "",
      collectionData: isSet(object.collectionData) ? globalThis.String(object.collectionData) : "",
      merkleRoot: isSet(object.merkleRoot) ? globalThis.String(object.merkleRoot) : undefined,
    };
  },

  toJSON(message: LaunchpadProject): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.networkId !== "") {
      obj.networkId = message.networkId;
    }
    if (message.creatorId !== "") {
      obj.creatorId = message.creatorId;
    }
    if (message.collectionData !== "") {
      obj.collectionData = message.collectionData;
    }
    if (message.merkleRoot !== undefined) {
      obj.merkleRoot = message.merkleRoot;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LaunchpadProject>, I>>(base?: I): LaunchpadProject {
    return LaunchpadProject.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LaunchpadProject>, I>>(object: I): LaunchpadProject {
    const message = createBaseLaunchpadProject();
    message.id = object.id ?? "";
    message.networkId = object.networkId ?? "";
    message.creatorId = object.creatorId ?? "";
    message.collectionData = object.collectionData ?? "";
    message.merkleRoot = object.merkleRoot ?? undefined;
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

export interface LaunchpadService {
  UploadMetadatas(
    request: DeepPartial<UploadMetadatasRequest>,
    metadata?: grpc.Metadata,
  ): Promise<UploadMetadatasResponse>;
  CalculateCollectionMerkleRoot(
    request: DeepPartial<CalculateCollectionMerkleRootRequest>,
    metadata?: grpc.Metadata,
  ): Promise<CalculateCollectionMerkleRootResponse>;
  TokenMetadata(request: DeepPartial<TokenMetadataRequest>, metadata?: grpc.Metadata): Promise<TokenMetadataResponse>;
  CollectionsByCreator(
    request: DeepPartial<CollectionsByCreatorRequest>,
    metadata?: grpc.Metadata,
  ): Promise<CollectionsByCreatorResponse>;
  LaunchpadProjects(
    request: DeepPartial<LaunchpadProjectsRequest>,
    metadata?: grpc.Metadata,
  ): Promise<LaunchpadProjectsResponse>;
  LaunchpadProjectById(
    request: DeepPartial<LaunchpadProjectByIdRequest>,
    metadata?: grpc.Metadata,
  ): Promise<LaunchpadProjectByIdResponse>;
  LaunchpadProjectsCount(
    request: DeepPartial<LaunchpadProjectsCountRequest>,
    metadata?: grpc.Metadata,
  ): Promise<LaunchpadProjectsCountResponse>;
}

export class LaunchpadServiceClientImpl implements LaunchpadService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.UploadMetadatas = this.UploadMetadatas.bind(this);
    this.CalculateCollectionMerkleRoot = this.CalculateCollectionMerkleRoot.bind(this);
    this.TokenMetadata = this.TokenMetadata.bind(this);
    this.CollectionsByCreator = this.CollectionsByCreator.bind(this);
    this.LaunchpadProjects = this.LaunchpadProjects.bind(this);
    this.LaunchpadProjectById = this.LaunchpadProjectById.bind(this);
    this.LaunchpadProjectsCount = this.LaunchpadProjectsCount.bind(this);
  }

  UploadMetadatas(
    request: DeepPartial<UploadMetadatasRequest>,
    metadata?: grpc.Metadata,
  ): Promise<UploadMetadatasResponse> {
    return this.rpc.unary(LaunchpadServiceUploadMetadatasDesc, UploadMetadatasRequest.fromPartial(request), metadata);
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

  TokenMetadata(request: DeepPartial<TokenMetadataRequest>, metadata?: grpc.Metadata): Promise<TokenMetadataResponse> {
    return this.rpc.unary(LaunchpadServiceTokenMetadataDesc, TokenMetadataRequest.fromPartial(request), metadata);
  }

  CollectionsByCreator(
    request: DeepPartial<CollectionsByCreatorRequest>,
    metadata?: grpc.Metadata,
  ): Promise<CollectionsByCreatorResponse> {
    return this.rpc.unary(
      LaunchpadServiceCollectionsByCreatorDesc,
      CollectionsByCreatorRequest.fromPartial(request),
      metadata,
    );
  }

  LaunchpadProjects(
    request: DeepPartial<LaunchpadProjectsRequest>,
    metadata?: grpc.Metadata,
  ): Promise<LaunchpadProjectsResponse> {
    return this.rpc.unary(
      LaunchpadServiceLaunchpadProjectsDesc,
      LaunchpadProjectsRequest.fromPartial(request),
      metadata,
    );
  }

  LaunchpadProjectById(
    request: DeepPartial<LaunchpadProjectByIdRequest>,
    metadata?: grpc.Metadata,
  ): Promise<LaunchpadProjectByIdResponse> {
    return this.rpc.unary(
      LaunchpadServiceLaunchpadProjectByIdDesc,
      LaunchpadProjectByIdRequest.fromPartial(request),
      metadata,
    );
  }

  LaunchpadProjectsCount(
    request: DeepPartial<LaunchpadProjectsCountRequest>,
    metadata?: grpc.Metadata,
  ): Promise<LaunchpadProjectsCountResponse> {
    return this.rpc.unary(
      LaunchpadServiceLaunchpadProjectsCountDesc,
      LaunchpadProjectsCountRequest.fromPartial(request),
      metadata,
    );
  }
}

export const LaunchpadServiceDesc = { serviceName: "launchpad.v1.LaunchpadService" };

export const LaunchpadServiceUploadMetadatasDesc: UnaryMethodDefinitionish = {
  methodName: "UploadMetadatas",
  service: LaunchpadServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return UploadMetadatasRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = UploadMetadatasResponse.decode(data);
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

export const LaunchpadServiceCollectionsByCreatorDesc: UnaryMethodDefinitionish = {
  methodName: "CollectionsByCreator",
  service: LaunchpadServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return CollectionsByCreatorRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = CollectionsByCreatorResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const LaunchpadServiceLaunchpadProjectsDesc: UnaryMethodDefinitionish = {
  methodName: "LaunchpadProjects",
  service: LaunchpadServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return LaunchpadProjectsRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = LaunchpadProjectsResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const LaunchpadServiceLaunchpadProjectByIdDesc: UnaryMethodDefinitionish = {
  methodName: "LaunchpadProjectById",
  service: LaunchpadServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return LaunchpadProjectByIdRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = LaunchpadProjectByIdResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const LaunchpadServiceLaunchpadProjectsCountDesc: UnaryMethodDefinitionish = {
  methodName: "LaunchpadProjectsCount",
  service: LaunchpadServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return LaunchpadProjectsCountRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = LaunchpadProjectsCountResponse.decode(data);
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
