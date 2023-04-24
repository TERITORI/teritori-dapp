import { StdFee } from "@cosmjs/amino";
import { coins } from "@cosmjs/stargate";

import { env } from "./env";

export const defaultSocialFeedFee: StdFee = {
  amount: coins(5000, env.PUBLIC_STAKING_DENOM!),
  gas: "30010000",
};
