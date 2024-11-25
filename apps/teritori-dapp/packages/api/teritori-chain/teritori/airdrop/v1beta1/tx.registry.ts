// @ts-nocheck
import { GeneratedType, Registry } from "@cosmjs/proto-signing";
import { MsgClaimAllocation, MsgSetAllocation, MsgTransferModuleOwnership, MsgDepositTokens } from "./tx";
export const registry: ReadonlyArray<[string, GeneratedType]> = [["/teritori.airdrop.v1beta1.MsgClaimAllocation", MsgClaimAllocation], ["/teritori.airdrop.v1beta1.MsgSetAllocation", MsgSetAllocation], ["/teritori.airdrop.v1beta1.MsgTransferModuleOwnership", MsgTransferModuleOwnership], ["/teritori.airdrop.v1beta1.MsgDepositTokens", MsgDepositTokens]];
export const load = (protoRegistry: Registry) => {
  registry.forEach(([typeUrl, mod]) => {
    protoRegistry.register(typeUrl, mod);
  });
};
export const MessageComposer = {
  encoded: {
    claimAllocation(value: MsgClaimAllocation) {
      return {
        typeUrl: "/teritori.airdrop.v1beta1.MsgClaimAllocation",
        value: MsgClaimAllocation.encode(value).finish()
      };
    },
    setAllocation(value: MsgSetAllocation) {
      return {
        typeUrl: "/teritori.airdrop.v1beta1.MsgSetAllocation",
        value: MsgSetAllocation.encode(value).finish()
      };
    },
    transferModuleOwnership(value: MsgTransferModuleOwnership) {
      return {
        typeUrl: "/teritori.airdrop.v1beta1.MsgTransferModuleOwnership",
        value: MsgTransferModuleOwnership.encode(value).finish()
      };
    },
    depositTokens(value: MsgDepositTokens) {
      return {
        typeUrl: "/teritori.airdrop.v1beta1.MsgDepositTokens",
        value: MsgDepositTokens.encode(value).finish()
      };
    }
  },
  withTypeUrl: {
    claimAllocation(value: MsgClaimAllocation) {
      return {
        typeUrl: "/teritori.airdrop.v1beta1.MsgClaimAllocation",
        value
      };
    },
    setAllocation(value: MsgSetAllocation) {
      return {
        typeUrl: "/teritori.airdrop.v1beta1.MsgSetAllocation",
        value
      };
    },
    transferModuleOwnership(value: MsgTransferModuleOwnership) {
      return {
        typeUrl: "/teritori.airdrop.v1beta1.MsgTransferModuleOwnership",
        value
      };
    },
    depositTokens(value: MsgDepositTokens) {
      return {
        typeUrl: "/teritori.airdrop.v1beta1.MsgDepositTokens",
        value
      };
    }
  },
  fromPartial: {
    claimAllocation(value: MsgClaimAllocation) {
      return {
        typeUrl: "/teritori.airdrop.v1beta1.MsgClaimAllocation",
        value: MsgClaimAllocation.fromPartial(value)
      };
    },
    setAllocation(value: MsgSetAllocation) {
      return {
        typeUrl: "/teritori.airdrop.v1beta1.MsgSetAllocation",
        value: MsgSetAllocation.fromPartial(value)
      };
    },
    transferModuleOwnership(value: MsgTransferModuleOwnership) {
      return {
        typeUrl: "/teritori.airdrop.v1beta1.MsgTransferModuleOwnership",
        value: MsgTransferModuleOwnership.fromPartial(value)
      };
    },
    depositTokens(value: MsgDepositTokens) {
      return {
        typeUrl: "/teritori.airdrop.v1beta1.MsgDepositTokens",
        value: MsgDepositTokens.fromPartial(value)
      };
    }
  }
};
