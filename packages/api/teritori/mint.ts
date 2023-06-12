/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "teritori.mint.v1beta1";

/** MsgBurnTokens defines an sdk.Msg type that burn tokens */
export interface MsgBurnTokens {
  sender: string;
  amount: string[];
}

/** MsgBurnTokensResponse defines the Msg/BurnTokens response type. */
export interface MsgBurnTokensResponse {
}

function createBaseMsgBurnTokens(): MsgBurnTokens {
  return { sender: "", amount: [] };
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

  fromJSON(object: any): MsgBurnTokens {
    return {
      sender: isSet(object.sender) ? String(object.sender) : "",
      amount: Array.isArray(object?.amount) ? object.amount.map((e: any) => String(e)) : [],
    };
  },

  toJSON(message: MsgBurnTokens): unknown {
    const obj: any = {};
    message.sender !== undefined && (obj.sender = message.sender);
    if (message.amount) {
      obj.amount = message.amount.map((e) => e);
    } else {
      obj.amount = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgBurnTokens>, I>>(object: I): MsgBurnTokens {
    const message = createBaseMsgBurnTokens();
    message.sender = object.sender ?? "";
    message.amount = object.amount?.map((e) => e) || [];
    return message;
  },
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

  fromJSON(_: any): MsgBurnTokensResponse {
    return {};
  },

  toJSON(_: MsgBurnTokensResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgBurnTokensResponse>, I>>(_: I): MsgBurnTokensResponse {
    const message = createBaseMsgBurnTokensResponse();
    return message;
  },
};

/** Msg defines the mint Msg service. */
export interface Msg {
  /** BurnTokens defines a method to burn tokens */
  BurnTokens(request: MsgBurnTokens): Promise<MsgBurnTokensResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.BurnTokens = this.BurnTokens.bind(this);
  }
  BurnTokens(request: MsgBurnTokens): Promise<MsgBurnTokensResponse> {
    const data = MsgBurnTokens.encode(request).finish();
    const promise = this.rpc.request("teritori.mint.v1beta1.Msg", "BurnTokens", data);
    return promise.then((data) => MsgBurnTokensResponse.decode(new _m0.Reader(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Long ? string | number | Long : T extends Array<infer U> ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
