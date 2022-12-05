
export const defaultSocialFeedFee: StdFee = {
  amount: coins(5000, process.env.PUBLIC_STAKING_DENOM!),
  gas: "30010000",
};
