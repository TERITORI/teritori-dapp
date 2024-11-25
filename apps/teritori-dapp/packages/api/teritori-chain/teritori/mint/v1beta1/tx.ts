// @ts-nocheck
import * as _m0 from "protobufjs/minimal";
import { DeepPartial } from "../../../helpers";
/** MsgBurnTokens defines an sdk.Msg type that burn tokens */
export interface MsgBurnTokens {
  sender: string;
  amount: string[];
}
/** MsgBurnTokens defines an sdk.Msg type that burn tokens */
export interface MsgBurnTokensSDKType {
  sender: string;
  amount: string[];
}
/** MsgBurnTokensResponse defines the Msg/BurnTokens response type. */
export interface MsgBurnTokensResponse {}
/** MsgBurnTokensResponse defines the Msg/BurnTokens response type. */
export interface MsgBurnTokensResponseSDKType {}
function createBaseMsgBurnTokens(): MsgBurnTokens {
  return {
    sender: "",
    amount: []
  };
}
export const MsgBurnTokens = {
  encode(message: MsgBurnTokens, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    for (const v of message.amount) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): MsgBurnTokens {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgBurnTokens();
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
  fromPartial(object: DeepPartial<MsgBurnTokens>): MsgBurnTokens {
    const message = createBaseMsgBurnTokens();
    message.sender = object.sender ?? "";
    message.amount = object.amount?.map(e => e) || [];
    return message;
  }
};
function createBaseMsgBurnTokensResponse(): MsgBurnTokensResponse {
  return {};
}
export const MsgBurnTokensResponse = {
  encode(_: MsgBurnTokensResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): MsgBurnTokensResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgBurnTokensResponse();
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
  fromPartial(_: DeepPartial<MsgBurnTokensResponse>): MsgBurnTokensResponse {
    const message = createBaseMsgBurnTokensResponse();
    return message;
  }
};
