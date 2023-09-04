import { StdFee } from "@cosmjs/amino";
import { calculateFee, GasPrice } from "@cosmjs/stargate";

export const defaultSocialFeedFee: StdFee = calculateFee(
  300000,
  GasPrice.fromString("0.0001utori")
);
