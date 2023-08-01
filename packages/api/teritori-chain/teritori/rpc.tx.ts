// @ts-nocheck
import { Rpc } from "../helpers";
export const createRPCMsgClient = async ({
  rpc
}: {
  rpc: Rpc;
}) => ({
  teritori: {
    airdrop: {
      v1beta1: new (await import("./airdrop/v1beta1/tx.rpc.msg")).MsgClientImpl(rpc)
    },
    mint: {
      v1beta1: new (await import("./mint/v1beta1/tx.rpc.msg")).MsgClientImpl(rpc)
    }
  }
});
