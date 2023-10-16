// @ts-nocheck
// @ts-nocheck

import { Minter, MinterSDKType, Params, ParamsSDKType, TeamVestingMonthInfo, TeamVestingMonthInfoSDKType } from "./mint";
import { Long, DeepPartial } from "../../../helpers";
import * as _m0 from "protobufjs/minimal";
/** GenesisState defines the mint module's genesis state. */
export interface GenesisState {
  /** minter is a space for holding current rewards information. */
  minter: Minter;
  /** params defines all the paramaters of the module. */
  params: Params;
  /** required values for team rewards */
  monthInfo: TeamVestingMonthInfo;
  /** current reduction period start block */
  reductionStartedBlock: Long;
}
/** GenesisState defines the mint module's genesis state. */
export interface GenesisStateSDKType {
  minter: MinterSDKType;
  params: ParamsSDKType;
  month_info: TeamVestingMonthInfoSDKType;
  reduction_started_block: Long;
}
function createBaseGenesisState(): GenesisState {
  return {
    minter: Minter.fromPartial({}),
    params: Params.fromPartial({}),
    monthInfo: TeamVestingMonthInfo.fromPartial({}),
    reductionStartedBlock: Long.ZERO
  };
}
export const GenesisState = {
  encode(message: GenesisState, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.minter !== undefined) {
      Minter.encode(message.minter, writer.uint32(10).fork()).ldelim();
    }
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(18).fork()).ldelim();
    }
    if (message.monthInfo !== undefined) {
      TeamVestingMonthInfo.encode(message.monthInfo, writer.uint32(26).fork()).ldelim();
    }
    if (!message.reductionStartedBlock.isZero()) {
      writer.uint32(32).int64(message.reductionStartedBlock);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): GenesisState {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGenesisState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.minter = Minter.decode(reader, reader.uint32());
          break;
        case 2:
          message.params = Params.decode(reader, reader.uint32());
          break;
        case 3:
          message.monthInfo = TeamVestingMonthInfo.decode(reader, reader.uint32());
          break;
        case 4:
          message.reductionStartedBlock = (reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<GenesisState>): GenesisState {
    const message = createBaseGenesisState();
    message.minter = object.minter !== undefined && object.minter !== null ? Minter.fromPartial(object.minter) : undefined;
    message.params = object.params !== undefined && object.params !== null ? Params.fromPartial(object.params) : undefined;
    message.monthInfo = object.monthInfo !== undefined && object.monthInfo !== null ? TeamVestingMonthInfo.fromPartial(object.monthInfo) : undefined;
    message.reductionStartedBlock = object.reductionStartedBlock !== undefined && object.reductionStartedBlock !== null ? Long.fromValue(object.reductionStartedBlock) : Long.ZERO;
    return message;
  }
};
