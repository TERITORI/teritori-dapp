// @ts-nocheck
import { AminoMsg } from "@cosmjs/amino";
import { MsgBurnTokens } from "./tx";
import {Coin} from "../../../cosmos/base/v1beta1/coin";
export interface MsgBurnTokensAminoType extends AminoMsg {
  type: "teritori/mint/MsgBurnTokens";
  value: {
    sender: string;
    amount: Coin[];
  };
}
export const AminoConverter = {
  "/teritori.mint.v1beta1.MsgBurnTokens": {
    aminoType: "teritori/mint/MsgBurnTokens",
    toAmino: ({
      sender,
      amount
    }: MsgBurnTokens): MsgBurnTokensAminoType["value"] => {
      const m = {
        amount: amount.map(coinStr => {
          const coin = Coin.decode(Buffer.from(coinStr));
          return {
            denom: coin.denom,
            amount: coin.amount,
          }
        }),
        sender,
      }
      return m
    },
    fromAmino: ({
      sender,
      amount
    }: MsgBurnTokensAminoType["value"]): MsgBurnTokens => {
      return {
        sender,
        amount: amount.map(coin => {
          const str = Buffer.from(Coin.encode(coin).finish()).toString();
          return str;
        })
      };
    }
  }
};
