import { coins, StdFee, Coin } from "@cosmjs/stargate";

export const defaultExecuteFee: StdFee = {
  amount: coins(5000, process.env.PUBLIC_STAKING_DENOM!),
  gas: "1000000",
};

export const defaultMintFee: StdFee = {
  amount: coins(5000, process.env.PUBLIC_STAKING_DENOM!),
  gas: "1000000",
};

// todo - should parse and validate these more elegantly
export const getMintCost = (username: string): Coin[] => {
  const surchargeOwed =
    username.length < parseInt(process.env.PUBLIC_SURCHARGE_MAX_CHARACTERS!, 10)
      ? parseInt(process.env.PUBLIC_SURCHARGE_FEE!, 10)
      : 0;

  const baseFee = parseInt(process.env.PUBLIC_BASE_MINT_FEE!, 10);
  const totalFee = baseFee + surchargeOwed;
  return coins(totalFee, process.env.PUBLIC_STAKING_DENOM!);
};
