// @ts-nocheck
import { GeneratedType, Registry } from "@cosmjs/proto-signing";
import { MsgBurnTokens } from "./tx";
export const registry: ReadonlyArray<[string, GeneratedType]> = [["/teritori.mint.v1beta1.MsgBurnTokens", MsgBurnTokens]];
export const load = (protoRegistry: Registry) => {
  registry.forEach(([typeUrl, mod]) => {
    protoRegistry.register(typeUrl, mod);
  });
};
export const MessageComposer = {
  encoded: {
    burnTokens(value: MsgBurnTokens) {
      return {
        typeUrl: "/teritori.mint.v1beta1.MsgBurnTokens",
        value: MsgBurnTokens.encode(value).finish()
      };
    }
  },
  withTypeUrl: {
    burnTokens(value: MsgBurnTokens) {
      return {
        typeUrl: "/teritori.mint.v1beta1.MsgBurnTokens",
        value
      };
    }
  },
  fromPartial: {
    burnTokens(value: MsgBurnTokens) {
      return {
        typeUrl: "/teritori.mint.v1beta1.MsgBurnTokens",
        value: MsgBurnTokens.fromPartial(value)
      };
    }
  }
};
