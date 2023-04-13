/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "freelance.v1";

export interface ReportRequest {
  desc: string;
  refUrl: string;
}

export interface ReportResponse {
  result: number;
}

export interface SellerProfileRequest {
  userId: string;
  profileHash: string;
}

export interface SellerProfileResponse {
  result: number;
}

export interface GigAddRequest {
  address: string;
  data: string;
}

export interface GigAddResponse {
  result: number;
}

export interface GigListRequest {
  limit: number;
  offset: number;
}

export interface GigListUserRequest {
  address: string;
}

export interface GigInfo {
  id: number;
  address: string;
  data: string;
}

export interface GigListResponse {
  gigs: GigInfo[];
}

export interface GigDataRequest {
  id: number;
}

export interface GigResponse {
  gig: GigInfo | undefined;
}

function createBaseReportRequest(): ReportRequest {
  return { desc: "", refUrl: "" };
}

export const ReportRequest = {
  encode(message: ReportRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.desc !== "") {
      writer.uint32(10).string(message.desc);
    }
    if (message.refUrl !== "") {
      writer.uint32(18).string(message.refUrl);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReportRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReportRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.desc = reader.string();
          break;
        case 2:
          message.refUrl = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ReportRequest {
    return {
      desc: isSet(object.desc) ? String(object.desc) : "",
      refUrl: isSet(object.refUrl) ? String(object.refUrl) : "",
    };
  },

  toJSON(message: ReportRequest): unknown {
    const obj: any = {};
    message.desc !== undefined && (obj.desc = message.desc);
    message.refUrl !== undefined && (obj.refUrl = message.refUrl);
    return obj;
  },

  create<I extends Exact<DeepPartial<ReportRequest>, I>>(base?: I): ReportRequest {
    return ReportRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ReportRequest>, I>>(object: I): ReportRequest {
    const message = createBaseReportRequest();
    message.desc = object.desc ?? "";
    message.refUrl = object.refUrl ?? "";
    return message;
  },
};

function createBaseReportResponse(): ReportResponse {
  return { result: 0 };
}

export const ReportResponse = {
  encode(message: ReportResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== 0) {
      writer.uint32(8).int32(message.result);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReportResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReportResponse();
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

  fromJSON(object: any): ReportResponse {
    return { result: isSet(object.result) ? Number(object.result) : 0 };
  },

  toJSON(message: ReportResponse): unknown {
    const obj: any = {};
    message.result !== undefined && (obj.result = Math.round(message.result));
    return obj;
  },

  create<I extends Exact<DeepPartial<ReportResponse>, I>>(base?: I): ReportResponse {
    return ReportResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ReportResponse>, I>>(object: I): ReportResponse {
    const message = createBaseReportResponse();
    message.result = object.result ?? 0;
    return message;
  },
};

function createBaseSellerProfileRequest(): SellerProfileRequest {
  return { userId: "", profileHash: "" };
}

export const SellerProfileRequest = {
  encode(message: SellerProfileRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.profileHash !== "") {
      writer.uint32(18).string(message.profileHash);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SellerProfileRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSellerProfileRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.profileHash = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SellerProfileRequest {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
      profileHash: isSet(object.profileHash) ? String(object.profileHash) : "",
    };
  },

  toJSON(message: SellerProfileRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    message.profileHash !== undefined && (obj.profileHash = message.profileHash);
    return obj;
  },

  create<I extends Exact<DeepPartial<SellerProfileRequest>, I>>(base?: I): SellerProfileRequest {
    return SellerProfileRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SellerProfileRequest>, I>>(object: I): SellerProfileRequest {
    const message = createBaseSellerProfileRequest();
    message.userId = object.userId ?? "";
    message.profileHash = object.profileHash ?? "";
    return message;
  },
};

function createBaseSellerProfileResponse(): SellerProfileResponse {
  return { result: 0 };
}

export const SellerProfileResponse = {
  encode(message: SellerProfileResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== 0) {
      writer.uint32(8).int32(message.result);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SellerProfileResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSellerProfileResponse();
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

  fromJSON(object: any): SellerProfileResponse {
    return { result: isSet(object.result) ? Number(object.result) : 0 };
  },

  toJSON(message: SellerProfileResponse): unknown {
    const obj: any = {};
    message.result !== undefined && (obj.result = Math.round(message.result));
    return obj;
  },

  create<I extends Exact<DeepPartial<SellerProfileResponse>, I>>(base?: I): SellerProfileResponse {
    return SellerProfileResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SellerProfileResponse>, I>>(object: I): SellerProfileResponse {
    const message = createBaseSellerProfileResponse();
    message.result = object.result ?? 0;
    return message;
  },
};

function createBaseGigAddRequest(): GigAddRequest {
  return { address: "", data: "" };
}

export const GigAddRequest = {
  encode(message: GigAddRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    if (message.data !== "") {
      writer.uint32(18).string(message.data);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GigAddRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGigAddRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        case 2:
          message.data = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GigAddRequest {
    return {
      address: isSet(object.address) ? String(object.address) : "",
      data: isSet(object.data) ? String(object.data) : "",
    };
  },

  toJSON(message: GigAddRequest): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    message.data !== undefined && (obj.data = message.data);
    return obj;
  },

  create<I extends Exact<DeepPartial<GigAddRequest>, I>>(base?: I): GigAddRequest {
    return GigAddRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GigAddRequest>, I>>(object: I): GigAddRequest {
    const message = createBaseGigAddRequest();
    message.address = object.address ?? "";
    message.data = object.data ?? "";
    return message;
  },
};

function createBaseGigAddResponse(): GigAddResponse {
  return { result: 0 };
}

export const GigAddResponse = {
  encode(message: GigAddResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== 0) {
      writer.uint32(8).int32(message.result);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GigAddResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGigAddResponse();
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

  fromJSON(object: any): GigAddResponse {
    return { result: isSet(object.result) ? Number(object.result) : 0 };
  },

  toJSON(message: GigAddResponse): unknown {
    const obj: any = {};
    message.result !== undefined && (obj.result = Math.round(message.result));
    return obj;
  },

  create<I extends Exact<DeepPartial<GigAddResponse>, I>>(base?: I): GigAddResponse {
    return GigAddResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GigAddResponse>, I>>(object: I): GigAddResponse {
    const message = createBaseGigAddResponse();
    message.result = object.result ?? 0;
    return message;
  },
};

function createBaseGigListRequest(): GigListRequest {
  return { limit: 0, offset: 0 };
}

export const GigListRequest = {
  encode(message: GigListRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.limit !== 0) {
      writer.uint32(8).int32(message.limit);
    }
    if (message.offset !== 0) {
      writer.uint32(16).int32(message.offset);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GigListRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGigListRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.limit = reader.int32();
          break;
        case 2:
          message.offset = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GigListRequest {
    return {
      limit: isSet(object.limit) ? Number(object.limit) : 0,
      offset: isSet(object.offset) ? Number(object.offset) : 0,
    };
  },

  toJSON(message: GigListRequest): unknown {
    const obj: any = {};
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.offset !== undefined && (obj.offset = Math.round(message.offset));
    return obj;
  },

  create<I extends Exact<DeepPartial<GigListRequest>, I>>(base?: I): GigListRequest {
    return GigListRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GigListRequest>, I>>(object: I): GigListRequest {
    const message = createBaseGigListRequest();
    message.limit = object.limit ?? 0;
    message.offset = object.offset ?? 0;
    return message;
  },
};

function createBaseGigListUserRequest(): GigListUserRequest {
  return { address: "" };
}

export const GigListUserRequest = {
  encode(message: GigListUserRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GigListUserRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGigListUserRequest();
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

  fromJSON(object: any): GigListUserRequest {
    return { address: isSet(object.address) ? String(object.address) : "" };
  },

  toJSON(message: GigListUserRequest): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    return obj;
  },

  create<I extends Exact<DeepPartial<GigListUserRequest>, I>>(base?: I): GigListUserRequest {
    return GigListUserRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GigListUserRequest>, I>>(object: I): GigListUserRequest {
    const message = createBaseGigListUserRequest();
    message.address = object.address ?? "";
    return message;
  },
};

function createBaseGigInfo(): GigInfo {
  return { id: 0, address: "", data: "" };
}

export const GigInfo = {
  encode(message: GigInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).int32(message.id);
    }
    if (message.address !== "") {
      writer.uint32(18).string(message.address);
    }
    if (message.data !== "") {
      writer.uint32(26).string(message.data);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GigInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGigInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.int32();
          break;
        case 2:
          message.address = reader.string();
          break;
        case 3:
          message.data = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GigInfo {
    return {
      id: isSet(object.id) ? Number(object.id) : 0,
      address: isSet(object.address) ? String(object.address) : "",
      data: isSet(object.data) ? String(object.data) : "",
    };
  },

  toJSON(message: GigInfo): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    message.address !== undefined && (obj.address = message.address);
    message.data !== undefined && (obj.data = message.data);
    return obj;
  },

  create<I extends Exact<DeepPartial<GigInfo>, I>>(base?: I): GigInfo {
    return GigInfo.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GigInfo>, I>>(object: I): GigInfo {
    const message = createBaseGigInfo();
    message.id = object.id ?? 0;
    message.address = object.address ?? "";
    message.data = object.data ?? "";
    return message;
  },
};

function createBaseGigListResponse(): GigListResponse {
  return { gigs: [] };
}

export const GigListResponse = {
  encode(message: GigListResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.gigs) {
      GigInfo.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GigListResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGigListResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.gigs.push(GigInfo.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GigListResponse {
    return { gigs: Array.isArray(object?.gigs) ? object.gigs.map((e: any) => GigInfo.fromJSON(e)) : [] };
  },

  toJSON(message: GigListResponse): unknown {
    const obj: any = {};
    if (message.gigs) {
      obj.gigs = message.gigs.map((e) => e ? GigInfo.toJSON(e) : undefined);
    } else {
      obj.gigs = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GigListResponse>, I>>(base?: I): GigListResponse {
    return GigListResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GigListResponse>, I>>(object: I): GigListResponse {
    const message = createBaseGigListResponse();
    message.gigs = object.gigs?.map((e) => GigInfo.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGigDataRequest(): GigDataRequest {
  return { id: 0 };
}

export const GigDataRequest = {
  encode(message: GigDataRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).int32(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GigDataRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGigDataRequest();
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

  fromJSON(object: any): GigDataRequest {
    return { id: isSet(object.id) ? Number(object.id) : 0 };
  },

  toJSON(message: GigDataRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    return obj;
  },

  create<I extends Exact<DeepPartial<GigDataRequest>, I>>(base?: I): GigDataRequest {
    return GigDataRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GigDataRequest>, I>>(object: I): GigDataRequest {
    const message = createBaseGigDataRequest();
    message.id = object.id ?? 0;
    return message;
  },
};

function createBaseGigResponse(): GigResponse {
  return { gig: undefined };
}

export const GigResponse = {
  encode(message: GigResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.gig !== undefined) {
      GigInfo.encode(message.gig, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GigResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGigResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.gig = GigInfo.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GigResponse {
    return { gig: isSet(object.gig) ? GigInfo.fromJSON(object.gig) : undefined };
  },

  toJSON(message: GigResponse): unknown {
    const obj: any = {};
    message.gig !== undefined && (obj.gig = message.gig ? GigInfo.toJSON(message.gig) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<GigResponse>, I>>(base?: I): GigResponse {
    return GigResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GigResponse>, I>>(object: I): GigResponse {
    const message = createBaseGigResponse();
    message.gig = (object.gig !== undefined && object.gig !== null) ? GigInfo.fromPartial(object.gig) : undefined;
    return message;
  },
};

export interface FreelanceService {
  report(request: DeepPartial<ReportRequest>, metadata?: grpc.Metadata): Promise<ReportResponse>;
  updateProfile(request: DeepPartial<SellerProfileRequest>, metadata?: grpc.Metadata): Promise<SellerProfileResponse>;
  addGig(request: DeepPartial<GigAddRequest>, metadata?: grpc.Metadata): Promise<GigAddResponse>;
  gigList(request: DeepPartial<GigListRequest>, metadata?: grpc.Metadata): Promise<GigListResponse>;
  gigListUser(request: DeepPartial<GigListUserRequest>, metadata?: grpc.Metadata): Promise<GigListResponse>;
  gigData(request: DeepPartial<GigDataRequest>, metadata?: grpc.Metadata): Promise<GigResponse>;
}

export class FreelanceServiceClientImpl implements FreelanceService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.report = this.report.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.addGig = this.addGig.bind(this);
    this.gigList = this.gigList.bind(this);
    this.gigListUser = this.gigListUser.bind(this);
    this.gigData = this.gigData.bind(this);
  }

  report(request: DeepPartial<ReportRequest>, metadata?: grpc.Metadata): Promise<ReportResponse> {
    return this.rpc.unary(FreelanceServiceReportDesc, ReportRequest.fromPartial(request), metadata);
  }

  updateProfile(request: DeepPartial<SellerProfileRequest>, metadata?: grpc.Metadata): Promise<SellerProfileResponse> {
    return this.rpc.unary(FreelanceServiceUpdateProfileDesc, SellerProfileRequest.fromPartial(request), metadata);
  }

  addGig(request: DeepPartial<GigAddRequest>, metadata?: grpc.Metadata): Promise<GigAddResponse> {
    return this.rpc.unary(FreelanceServiceAddGigDesc, GigAddRequest.fromPartial(request), metadata);
  }

  gigList(request: DeepPartial<GigListRequest>, metadata?: grpc.Metadata): Promise<GigListResponse> {
    return this.rpc.unary(FreelanceServiceGigListDesc, GigListRequest.fromPartial(request), metadata);
  }

  gigListUser(request: DeepPartial<GigListUserRequest>, metadata?: grpc.Metadata): Promise<GigListResponse> {
    return this.rpc.unary(FreelanceServiceGigListUserDesc, GigListUserRequest.fromPartial(request), metadata);
  }

  gigData(request: DeepPartial<GigDataRequest>, metadata?: grpc.Metadata): Promise<GigResponse> {
    return this.rpc.unary(FreelanceServiceGigDataDesc, GigDataRequest.fromPartial(request), metadata);
  }

}

export const FreelanceServiceDesc = { serviceName: "freelance.v1.FreelanceService" };

export const FreelanceServiceReportDesc: UnaryMethodDefinitionish = {
  methodName: "Report",
  service: FreelanceServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return ReportRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = ReportResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const FreelanceServiceUpdateProfileDesc: UnaryMethodDefinitionish = {
  methodName: "UpdateProfile",
  service: FreelanceServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return SellerProfileRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = SellerProfileResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const FreelanceServiceAddGigDesc: UnaryMethodDefinitionish = {
  methodName: "AddGig",
  service: FreelanceServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GigAddRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = GigAddResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const FreelanceServiceGigListDesc: UnaryMethodDefinitionish = {
  methodName: "GigList",
  service: FreelanceServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GigListRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = GigListResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const FreelanceServiceGigListUserDesc: UnaryMethodDefinitionish = {
  methodName: "GigListUser",
  service: FreelanceServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GigListUserRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = GigListResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const FreelanceServiceGigDataDesc: UnaryMethodDefinitionish = {
  methodName: "GigData",
  service: FreelanceServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GigDataRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = GigResponse.decode(data);
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
