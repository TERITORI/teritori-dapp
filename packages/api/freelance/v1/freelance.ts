/* eslint-disable */
import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "freelance.v1";

export interface SellerProfileRequest {
  sellerAddress: string;
}

export interface SellerProfileResponse {
  sellerAddress: string;
  ipfs: string;
  isActive: boolean;
}

export interface GigListRequest {
  limit: number;
  offset: number;
}

export interface GigListUserRequest {
  address: string;
}

export interface EscrowListRequest {
  address: string;
}

export interface EscrowInfo {
  id: number;
  sender: string;
  receiver: string;
  amount: string;
  amountDenom: string;
  expireAt: string;
  status: number;
}

export interface EscrowListResponse {
  escrows: EscrowInfo[];
}

export interface GigInfo {
  id: number;
  address: string;
  gigData: string;
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

function createBaseSellerProfileRequest(): SellerProfileRequest {
  return { sellerAddress: "" };
}

export const SellerProfileRequest = {
  encode(message: SellerProfileRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sellerAddress !== "") {
      writer.uint32(10).string(message.sellerAddress);
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
          message.sellerAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SellerProfileRequest {
    return { sellerAddress: isSet(object.sellerAddress) ? String(object.sellerAddress) : "" };
  },

  toJSON(message: SellerProfileRequest): unknown {
    const obj: any = {};
    message.sellerAddress !== undefined && (obj.sellerAddress = message.sellerAddress);
    return obj;
  },

  create<I extends Exact<DeepPartial<SellerProfileRequest>, I>>(base?: I): SellerProfileRequest {
    return SellerProfileRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SellerProfileRequest>, I>>(object: I): SellerProfileRequest {
    const message = createBaseSellerProfileRequest();
    message.sellerAddress = object.sellerAddress ?? "";
    return message;
  },
};

function createBaseSellerProfileResponse(): SellerProfileResponse {
  return { sellerAddress: "", ipfs: "", isActive: false };
}

export const SellerProfileResponse = {
  encode(message: SellerProfileResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sellerAddress !== "") {
      writer.uint32(10).string(message.sellerAddress);
    }
    if (message.ipfs !== "") {
      writer.uint32(18).string(message.ipfs);
    }
    if (message.isActive === true) {
      writer.uint32(24).bool(message.isActive);
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
          message.sellerAddress = reader.string();
          break;
        case 2:
          message.ipfs = reader.string();
          break;
        case 3:
          message.isActive = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SellerProfileResponse {
    return {
      sellerAddress: isSet(object.sellerAddress) ? String(object.sellerAddress) : "",
      ipfs: isSet(object.ipfs) ? String(object.ipfs) : "",
      isActive: isSet(object.isActive) ? Boolean(object.isActive) : false,
    };
  },

  toJSON(message: SellerProfileResponse): unknown {
    const obj: any = {};
    message.sellerAddress !== undefined && (obj.sellerAddress = message.sellerAddress);
    message.ipfs !== undefined && (obj.ipfs = message.ipfs);
    message.isActive !== undefined && (obj.isActive = message.isActive);
    return obj;
  },

  create<I extends Exact<DeepPartial<SellerProfileResponse>, I>>(base?: I): SellerProfileResponse {
    return SellerProfileResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SellerProfileResponse>, I>>(object: I): SellerProfileResponse {
    const message = createBaseSellerProfileResponse();
    message.sellerAddress = object.sellerAddress ?? "";
    message.ipfs = object.ipfs ?? "";
    message.isActive = object.isActive ?? false;
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

function createBaseEscrowListRequest(): EscrowListRequest {
  return { address: "" };
}

export const EscrowListRequest = {
  encode(message: EscrowListRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EscrowListRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEscrowListRequest();
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

  fromJSON(object: any): EscrowListRequest {
    return { address: isSet(object.address) ? String(object.address) : "" };
  },

  toJSON(message: EscrowListRequest): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    return obj;
  },

  create<I extends Exact<DeepPartial<EscrowListRequest>, I>>(base?: I): EscrowListRequest {
    return EscrowListRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<EscrowListRequest>, I>>(object: I): EscrowListRequest {
    const message = createBaseEscrowListRequest();
    message.address = object.address ?? "";
    return message;
  },
};

function createBaseEscrowInfo(): EscrowInfo {
  return { id: 0, sender: "", receiver: "", amount: "", amountDenom: "", expireAt: "", status: 0 };
}

export const EscrowInfo = {
  encode(message: EscrowInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).uint32(message.id);
    }
    if (message.sender !== "") {
      writer.uint32(18).string(message.sender);
    }
    if (message.receiver !== "") {
      writer.uint32(26).string(message.receiver);
    }
    if (message.amount !== "") {
      writer.uint32(34).string(message.amount);
    }
    if (message.amountDenom !== "") {
      writer.uint32(42).string(message.amountDenom);
    }
    if (message.expireAt !== "") {
      writer.uint32(50).string(message.expireAt);
    }
    if (message.status !== 0) {
      writer.uint32(56).uint32(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EscrowInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEscrowInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.uint32();
          break;
        case 2:
          message.sender = reader.string();
          break;
        case 3:
          message.receiver = reader.string();
          break;
        case 4:
          message.amount = reader.string();
          break;
        case 5:
          message.amountDenom = reader.string();
          break;
        case 6:
          message.expireAt = reader.string();
          break;
        case 7:
          message.status = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EscrowInfo {
    return {
      id: isSet(object.id) ? Number(object.id) : 0,
      sender: isSet(object.sender) ? String(object.sender) : "",
      receiver: isSet(object.receiver) ? String(object.receiver) : "",
      amount: isSet(object.amount) ? String(object.amount) : "",
      amountDenom: isSet(object.amountDenom) ? String(object.amountDenom) : "",
      expireAt: isSet(object.expireAt) ? String(object.expireAt) : "",
      status: isSet(object.status) ? Number(object.status) : 0,
    };
  },

  toJSON(message: EscrowInfo): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    message.sender !== undefined && (obj.sender = message.sender);
    message.receiver !== undefined && (obj.receiver = message.receiver);
    message.amount !== undefined && (obj.amount = message.amount);
    message.amountDenom !== undefined && (obj.amountDenom = message.amountDenom);
    message.expireAt !== undefined && (obj.expireAt = message.expireAt);
    message.status !== undefined && (obj.status = Math.round(message.status));
    return obj;
  },

  create<I extends Exact<DeepPartial<EscrowInfo>, I>>(base?: I): EscrowInfo {
    return EscrowInfo.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<EscrowInfo>, I>>(object: I): EscrowInfo {
    const message = createBaseEscrowInfo();
    message.id = object.id ?? 0;
    message.sender = object.sender ?? "";
    message.receiver = object.receiver ?? "";
    message.amount = object.amount ?? "";
    message.amountDenom = object.amountDenom ?? "";
    message.expireAt = object.expireAt ?? "";
    message.status = object.status ?? 0;
    return message;
  },
};

function createBaseEscrowListResponse(): EscrowListResponse {
  return { escrows: [] };
}

export const EscrowListResponse = {
  encode(message: EscrowListResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.escrows) {
      EscrowInfo.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EscrowListResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEscrowListResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.escrows.push(EscrowInfo.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EscrowListResponse {
    return { escrows: Array.isArray(object?.escrows) ? object.escrows.map((e: any) => EscrowInfo.fromJSON(e)) : [] };
  },

  toJSON(message: EscrowListResponse): unknown {
    const obj: any = {};
    if (message.escrows) {
      obj.escrows = message.escrows.map((e) => e ? EscrowInfo.toJSON(e) : undefined);
    } else {
      obj.escrows = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EscrowListResponse>, I>>(base?: I): EscrowListResponse {
    return EscrowListResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<EscrowListResponse>, I>>(object: I): EscrowListResponse {
    const message = createBaseEscrowListResponse();
    message.escrows = object.escrows?.map((e) => EscrowInfo.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGigInfo(): GigInfo {
  return { id: 0, address: "", gigData: "" };
}

export const GigInfo = {
  encode(message: GigInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).int32(message.id);
    }
    if (message.address !== "") {
      writer.uint32(18).string(message.address);
    }
    if (message.gigData !== "") {
      writer.uint32(26).string(message.gigData);
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
          message.gigData = reader.string();
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
      gigData: isSet(object.gigData) ? String(object.gigData) : "",
    };
  },

  toJSON(message: GigInfo): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    message.address !== undefined && (obj.address = message.address);
    message.gigData !== undefined && (obj.gigData = message.gigData);
    return obj;
  },

  create<I extends Exact<DeepPartial<GigInfo>, I>>(base?: I): GigInfo {
    return GigInfo.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GigInfo>, I>>(object: I): GigInfo {
    const message = createBaseGigInfo();
    message.id = object.id ?? 0;
    message.address = object.address ?? "";
    message.gigData = object.gigData ?? "";
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
  sellerProfile(request: DeepPartial<SellerProfileRequest>, metadata?: grpc.Metadata): Promise<SellerProfileResponse>;
  gigList(request: DeepPartial<GigListRequest>, metadata?: grpc.Metadata): Promise<GigListResponse>;
  gigListUser(request: DeepPartial<GigListUserRequest>, metadata?: grpc.Metadata): Promise<GigListResponse>;
  gigData(request: DeepPartial<GigDataRequest>, metadata?: grpc.Metadata): Promise<GigResponse>;
  escrowAllList(request: DeepPartial<EscrowListRequest>, metadata?: grpc.Metadata): Promise<EscrowListResponse>;
  escrowSenderList(request: DeepPartial<EscrowListRequest>, metadata?: grpc.Metadata): Promise<EscrowListResponse>;
  escrowReceiverList(request: DeepPartial<EscrowListRequest>, metadata?: grpc.Metadata): Promise<EscrowListResponse>;
}

export class FreelanceServiceClientImpl implements FreelanceService {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.sellerProfile = this.sellerProfile.bind(this);
    this.gigList = this.gigList.bind(this);
    this.gigListUser = this.gigListUser.bind(this);
    this.gigData = this.gigData.bind(this);
    this.escrowAllList = this.escrowAllList.bind(this);
    this.escrowSenderList = this.escrowSenderList.bind(this);
    this.escrowReceiverList = this.escrowReceiverList.bind(this);
  }

  sellerProfile(request: DeepPartial<SellerProfileRequest>, metadata?: grpc.Metadata): Promise<SellerProfileResponse> {
    return this.rpc.unary(FreelanceServiceSellerProfileDesc, SellerProfileRequest.fromPartial(request), metadata);
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

  escrowAllList(request: DeepPartial<EscrowListRequest>, metadata?: grpc.Metadata): Promise<EscrowListResponse> {
    return this.rpc.unary(FreelanceServiceEscrowAllListDesc, EscrowListRequest.fromPartial(request), metadata);
  }

  escrowSenderList(request: DeepPartial<EscrowListRequest>, metadata?: grpc.Metadata): Promise<EscrowListResponse> {
    return this.rpc.unary(FreelanceServiceEscrowSenderListDesc, EscrowListRequest.fromPartial(request), metadata);
  }

  escrowReceiverList(request: DeepPartial<EscrowListRequest>, metadata?: grpc.Metadata): Promise<EscrowListResponse> {
    return this.rpc.unary(FreelanceServiceEscrowReceiverListDesc, EscrowListRequest.fromPartial(request), metadata);
  }
}

export const FreelanceServiceDesc = { serviceName: "freelance.v1.FreelanceService" };

export const FreelanceServiceSellerProfileDesc: UnaryMethodDefinitionish = {
  methodName: "SellerProfile",
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

export const FreelanceServiceEscrowAllListDesc: UnaryMethodDefinitionish = {
  methodName: "EscrowAllList",
  service: FreelanceServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return EscrowListRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = EscrowListResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const FreelanceServiceEscrowSenderListDesc: UnaryMethodDefinitionish = {
  methodName: "EscrowSenderList",
  service: FreelanceServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return EscrowListRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = EscrowListResponse.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

export const FreelanceServiceEscrowReceiverListDesc: UnaryMethodDefinitionish = {
  methodName: "EscrowReceiverList",
  service: FreelanceServiceDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return EscrowListRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = EscrowListResponse.decode(data);
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
