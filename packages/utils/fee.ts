import { StdFee } from "@cosmjs/amino";
import { coins } from "@cosmjs/stargate";

export const defaultSocialFeedFee: StdFee = {
  amount: coins(5000, process.env.PUBLIC_STAKING_DENOM!),
  gas: "30010000",
};
