// @ts-nocheck
import { Rpc } from "../../../helpers";
import * as _m0 from "protobufjs/minimal";
import { MsgClaimAllocation, MsgClaimAllocationResponse, MsgSetAllocation, MsgSetAllocationResponse, MsgTransferModuleOwnership, MsgTransferModuleOwnershipResponse, MsgDepositTokens, MsgDepositTokensResponse } from "./tx";
/** Msg defines the staking Msg service. */
export interface Msg {
  /** ClaimAllocation defines a method to claim allocation */
  claimAllocation(request: MsgClaimAllocation): Promise<MsgClaimAllocationResponse>;
  /** SetAllocation defines a method to set allocation */
  setAllocation(request: MsgSetAllocation): Promise<MsgSetAllocationResponse>;
  /** TransferModuleOwnership defines a method to transfer module ownership to other address */
  transferModuleOwnership(request: MsgTransferModuleOwnership): Promise<MsgTransferModuleOwnershipResponse>;
  /** DepositTokens defines a method to deposit tokens to the module */
  depositTokens(request: MsgDepositTokens): Promise<MsgDepositTokensResponse>;
}
export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.claimAllocation = this.claimAllocation.bind(this);
    this.setAllocation = this.setAllocation.bind(this);
    this.transferModuleOwnership = this.transferModuleOwnership.bind(this);
    this.depositTokens = this.depositTokens.bind(this);
  }
  claimAllocation(request: MsgClaimAllocation): Promise<MsgClaimAllocationResponse> {
    const data = MsgClaimAllocation.encode(request).finish();
    const promise = this.rpc.request("teritori.airdrop.v1beta1.Msg", "ClaimAllocation", data);
    return promise.then(data => MsgClaimAllocationResponse.decode(new _m0.Reader(data)));
  }
  setAllocation(request: MsgSetAllocation): Promise<MsgSetAllocationResponse> {
    const data = MsgSetAllocation.encode(request).finish();
    const promise = this.rpc.request("teritori.airdrop.v1beta1.Msg", "SetAllocation", data);
    return promise.then(data => MsgSetAllocationResponse.decode(new _m0.Reader(data)));
  }
  transferModuleOwnership(request: MsgTransferModuleOwnership): Promise<MsgTransferModuleOwnershipResponse> {
    const data = MsgTransferModuleOwnership.encode(request).finish();
    const promise = this.rpc.request("teritori.airdrop.v1beta1.Msg", "TransferModuleOwnership", data);
    return promise.then(data => MsgTransferModuleOwnershipResponse.decode(new _m0.Reader(data)));
  }
  depositTokens(request: MsgDepositTokens): Promise<MsgDepositTokensResponse> {
    const data = MsgDepositTokens.encode(request).finish();
    const promise = this.rpc.request("teritori.airdrop.v1beta1.Msg", "DepositTokens", data);
    return promise.then(data => MsgDepositTokensResponse.decode(new _m0.Reader(data)));
  }
}
