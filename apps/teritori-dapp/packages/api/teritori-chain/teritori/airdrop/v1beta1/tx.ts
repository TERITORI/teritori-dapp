// @ts-nocheck
// @ts-nocheck

import { AirdropAllocation, AirdropAllocationSDKType } from "./allocation";
import * as _m0 from "protobufjs/minimal";
import { DeepPartial } from "../../../helpers";
/** MsgSetAllocation defines an sdk.Msg type that set airdrop allocation */
export interface MsgSetAllocation {
  sender: string;
  allocation: AirdropAllocation;
}
/** MsgSetAllocation defines an sdk.Msg type that set airdrop allocation */
export interface MsgSetAllocationSDKType {
  sender: string;
  allocation: AirdropAllocationSDKType;
}
/** MsgSetAllocationResponse defines the Msg/SetAllocation response type. */
export interface MsgSetAllocationResponse {}
/** MsgSetAllocationResponse defines the Msg/SetAllocation response type. */
export interface MsgSetAllocationResponseSDKType {}
/** MsgClaimAllocation defines an sdk.Msg type that claims airdrop allocation */
export interface MsgClaimAllocation {
  address: string;
  pubKey: string;
  rewardAddress: string;
  signature: string;
}
/** MsgClaimAllocation defines an sdk.Msg type that claims airdrop allocation */
export interface MsgClaimAllocationSDKType {
  address: string;
  pub_key: string;
  reward_address: string;
  signature: string;
}
/** MsgClaimAllocationResponse defines the Msg/ClaimAllocation response type. */
export interface MsgClaimAllocationResponse {}
/** MsgClaimAllocationResponse defines the Msg/ClaimAllocation response type. */
export interface MsgClaimAllocationResponseSDKType {}
/** MsgSignData defines an arbitrary, general-purpose, off-chain message */
export interface MsgSignData {
  /** Signer is the sdk.AccAddress of the message signer */
  signer: string;
  /** data represents the raw bytes of the content that is signed (text, json, etc) */
  data: Uint8Array;
}
/** MsgSignData defines an arbitrary, general-purpose, off-chain message */
export interface MsgSignDataSDKType {
  signer: string;
  data: Uint8Array;
}
export interface MsgTransferModuleOwnership {
  sender: string;
  newOwner: string;
}
export interface MsgTransferModuleOwnershipSDKType {
  sender: string;
  new_owner: string;
}
export interface MsgTransferModuleOwnershipResponse {}
export interface MsgTransferModuleOwnershipResponseSDKType {}
export interface MsgDepositTokens {
  sender: string;
  amount: string[];
}
export interface MsgDepositTokensSDKType {
  sender: string;
  amount: string[];
}
export interface MsgDepositTokensResponse {}
export interface MsgDepositTokensResponseSDKType {}
function createBaseMsgSetAllocation(): MsgSetAllocation {
  return {
    sender: "",
    allocation: AirdropAllocation.fromPartial({})
  };
}
export const MsgSetAllocation = {
  encode(message: MsgSetAllocation, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.allocation !== undefined) {
      AirdropAllocation.encode(message.allocation, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSetAllocation {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSetAllocation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string();
          break;
        case 2:
          message.allocation = AirdropAllocation.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<MsgSetAllocation>): MsgSetAllocation {
    const message = createBaseMsgSetAllocation();
    message.sender = object.sender ?? "";
    message.allocation = object.allocation !== undefined && object.allocation !== null ? AirdropAllocation.fromPartial(object.allocation) : undefined;
    return message;
  }
};
function createBaseMsgSetAllocationResponse(): MsgSetAllocationResponse {
  return {};
}
export const MsgSetAllocationResponse = {
  encode(_: MsgSetAllocationResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSetAllocationResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSetAllocationResponse();
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
  fromPartial(_: DeepPartial<MsgSetAllocationResponse>): MsgSetAllocationResponse {
    const message = createBaseMsgSetAllocationResponse();
    return message;
  }
};
function createBaseMsgClaimAllocation(): MsgClaimAllocation {
  return {
    address: "",
    pubKey: "",
    rewardAddress: "",
    signature: ""
  };
}
export const MsgClaimAllocation = {
  encode(message: MsgClaimAllocation, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    if (message.pubKey !== "") {
      writer.uint32(18).string(message.pubKey);
    }
    if (message.rewardAddress !== "") {
      writer.uint32(26).string(message.rewardAddress);
    }
    if (message.signature !== "") {
      writer.uint32(34).string(message.signature);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): MsgClaimAllocation {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgClaimAllocation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        case 2:
          message.pubKey = reader.string();
          break;
        case 3:
          message.rewardAddress = reader.string();
          break;
        case 4:
          message.signature = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<MsgClaimAllocation>): MsgClaimAllocation {
    const message = createBaseMsgClaimAllocation();
    message.address = object.address ?? "";
    message.pubKey = object.pubKey ?? "";
    message.rewardAddress = object.rewardAddress ?? "";
    message.signature = object.signature ?? "";
    return message;
  }
};
function createBaseMsgClaimAllocationResponse(): MsgClaimAllocationResponse {
  return {};
}
export const MsgClaimAllocationResponse = {
  encode(_: MsgClaimAllocationResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): MsgClaimAllocationResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgClaimAllocationResponse();
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
  fromPartial(_: DeepPartial<MsgClaimAllocationResponse>): MsgClaimAllocationResponse {
    const message = createBaseMsgClaimAllocationResponse();
    return message;
  }
};
function createBaseMsgSignData(): MsgSignData {
  return {
    signer: "",
    data: new Uint8Array()
  };
}
export const MsgSignData = {
  encode(message: MsgSignData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.signer !== "") {
      writer.uint32(10).string(message.signer);
    }
    if (message.data.length !== 0) {
      writer.uint32(18).bytes(message.data);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSignData {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSignData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signer = reader.string();
          break;
        case 2:
          message.data = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<MsgSignData>): MsgSignData {
    const message = createBaseMsgSignData();
    message.signer = object.signer ?? "";
    message.data = object.data ?? new Uint8Array();
    return message;
  }
};
function createBaseMsgTransferModuleOwnership(): MsgTransferModuleOwnership {
  return {
    sender: "",
    newOwner: ""
  };
}
export const MsgTransferModuleOwnership = {
  encode(message: MsgTransferModuleOwnership, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.newOwner !== "") {
      writer.uint32(18).string(message.newOwner);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): MsgTransferModuleOwnership {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgTransferModuleOwnership();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string();
          break;
        case 2:
          message.newOwner = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<MsgTransferModuleOwnership>): MsgTransferModuleOwnership {
    const message = createBaseMsgTransferModuleOwnership();
    message.sender = object.sender ?? "";
    message.newOwner = object.newOwner ?? "";
    return message;
  }
};
function createBaseMsgTransferModuleOwnershipResponse(): MsgTransferModuleOwnershipResponse {
  return {};
}
export const MsgTransferModuleOwnershipResponse = {
  encode(_: MsgTransferModuleOwnershipResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): MsgTransferModuleOwnershipResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgTransferModuleOwnershipResponse();
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
  fromPartial(_: DeepPartial<MsgTransferModuleOwnershipResponse>): MsgTransferModuleOwnershipResponse {
    const message = createBaseMsgTransferModuleOwnershipResponse();
    return message;
  }
};
function createBaseMsgDepositTokens(): MsgDepositTokens {
  return {
    sender: "",
    amount: []
  };
}
export const MsgDepositTokens = {
  encode(message: MsgDepositTokens, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    for (const v of message.amount) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): MsgDepositTokens {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDepositTokens();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string();
          break;
        case 2:
          message.amount.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<MsgDepositTokens>): MsgDepositTokens {
    const message = createBaseMsgDepositTokens();
    message.sender = object.sender ?? "";
    message.amount = object.amount?.map(e => e) || [];
    return message;
  }
};
function createBaseMsgDepositTokensResponse(): MsgDepositTokensResponse {
  return {};
}
export const MsgDepositTokensResponse = {
  encode(_: MsgDepositTokensResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): MsgDepositTokensResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDepositTokensResponse();
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
  fromPartial(_: DeepPartial<MsgDepositTokensResponse>): MsgDepositTokensResponse {
    const message = createBaseMsgDepositTokensResponse();
    return message;
  }
};
