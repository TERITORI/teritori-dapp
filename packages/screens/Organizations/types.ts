import { LocalFileData } from "../../utils/types/files";

export enum DaoType {
  MEMBER_BASED = 0,
  TOKEN_BASED = 1,
  NFT_BASED = 2,
  COOP_BASED = 3,
}

export type CreateDaoFormType = {
  organizationName: string;
  associatedTeritoriNameService: string;
  userOwnsName: boolean;
  networkId: string;
  organizationDescription: string;
  structure: DaoType;
  image: LocalFileData;
};

export type ConfigureVotingFormType = {
  supportPercent: number;
  minimumApprovalPercent: number;
  days: string;
  hours: string;
  minutes: string;
};

export type NFTSettingFormType = {
  considerListedNFTs: boolean;
  nftContractAddress: string;
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
