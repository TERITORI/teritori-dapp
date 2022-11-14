export type ValidatorInfo = {
  rank: string;
  moniker: string;
  imageURL: string;
  votingPower: string;
  commission: string;
  description: string;
  website: string;
  identity: string;
  status: string;
  address: string;
  jailed: boolean;
  consensusPubKey: { type: string; key: string };
  claimableRewardAmount?: number;
};

export type StakeFormValuesType = {
  validatorName: string;
  amount: string;
};
