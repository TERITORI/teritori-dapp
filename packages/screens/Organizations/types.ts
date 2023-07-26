export enum DaoType {
  MEMBER_BASED = 0,
  TOKEN_BASED = 1,
  NFT_BASED = 2,
  COOP_BASED = 3,
}

export type CreateDaoFormType = {
  organizationName: string;
  associatedTeritoriNameService: string;
  organizationDescription: string;
  structure: DaoType;
  imageUrl: string;
};

export type ConfigureVotingFormType = {
  supportPercent: number;
  minimumApprovalPercent: number;
  days: string;
  hours: string;
  minutes: string;
};

export type NFTSettingFormType = {
  considerListedNFT: boolean;
  contracts: { address: string }[];
};

export type TokenSettingFormType = {
  tokenName: string;
  tokenSymbol: string;
  tokenHolders: { address: string; balance: string }[];
};

export type MemberSettingFormType = {
  members: { addr: string; weight: string }[];
};

export type LaunchingProcessStepType = {
  title: string;
  completeText: string;
  isComplete?: boolean;
};
