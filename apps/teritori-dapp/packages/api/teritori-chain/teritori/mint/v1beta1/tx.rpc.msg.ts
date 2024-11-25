// @ts-nocheck
import { Rpc } from "../../../helpers";
import * as _m0 from "protobufjs/minimal";
import { MsgBurnTokens, MsgBurnTokensResponse } from "./tx";
/** Msg defines the mint Msg service. */
export interface Msg {
  /** BurnTokens defines a method to burn tokens */
  burnTokens(request: MsgBurnTokens): Promise<MsgBurnTokensResponse>;
}
export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.burnTokens = this.burnTokens.bind(this);
  }
  burnTokens(request: MsgBurnTokens): Promise<MsgBurnTokensResponse> {
    const data = MsgBurnTokens.encode(request).finish();
    const promise = this.rpc.request("teritori.mint.v1beta1.Msg", "BurnTokens", data);
    return promise.then(data => MsgBurnTokensResponse.decode(new _m0.Reader(data)));
  }
}
