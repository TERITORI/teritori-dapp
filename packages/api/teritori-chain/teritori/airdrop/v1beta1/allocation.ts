// @ts-nocheck
import * as _m0 from "protobufjs/minimal";
import { DeepPartial } from "../../../helpers";
/** AirdropAllocation defines the user's airdrop allocation. */
export interface AirdropAllocation {
  chain: string;
  address: string;
  amount: string;
  claimedAmount: string;
}
/** AirdropAllocation defines the user's airdrop allocation. */
export interface AirdropAllocationSDKType {
  chain: string;
  address: string;
  amount: string;
  claimed_amount: string;
}
function createBaseAirdropAllocation(): AirdropAllocation {
  return {
    chain: "",
    address: "",
    amount: "",
    claimedAmount: ""
  };
}
export const AirdropAllocation = {
  encode(message: AirdropAllocation, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.chain !== "") {
      writer.uint32(10).string(message.chain);
    }
    if (message.address !== "") {
      writer.uint32(18).string(message.address);
    }
    if (message.amount !== "") {
      writer.uint32(26).string(message.amount);
    }
    if (message.claimedAmount !== "") {
      writer.uint32(34).string(message.claimedAmount);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): AirdropAllocation {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAirdropAllocation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.chain = reader.string();
          break;
        case 2:
          message.address = reader.string();
          break;
        case 3:
          message.amount = reader.string();
          break;
        case 4:
          message.claimedAmount = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<AirdropAllocation>): AirdropAllocation {
    const message = createBaseAirdropAllocation();
    message.chain = object.chain ?? "";
    message.address = object.address ?? "";
    message.amount = object.amount ?? "";
    message.claimedAmount = object.claimedAmount ?? "";
    return message;
  }
};
