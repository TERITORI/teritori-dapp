import { Uint128 } from "@/contracts-clients/nft-launchpad";
import { LocalFileData } from "@/utils/types/files";

export interface ExistingBaseUrlFormValues {
  baseTokenUri?: string;
  coverImageUrl?: string;
}

export interface CollectionFormValues {
  name?: string;
  description?: string;
  symbol?: string;
  externalLink?: string;
  websiteLink?: string;
  twitterProfileUrl: string;
  nbTwitterFollowers: number;
  discordName: string;
  email: string;
  projectTypes: string[];
  projectDescription: string;
  tokensCount: number;
  revealTime?: string;
  teamDescription: string;
  teamLink: string;
  partnersDescription: string;
  investDescription: string;
  investLink: string;
  roadmapLink: string;
  artworkDescription: string;
  expectedSupply: number;
  expectedPublicMintPrice: number;
  expectedMintDate: string;
  coverImage?: LocalFileData;
  isPreviouslyApplied: boolean;
  isDerivativeProject: boolean;
  isReadyForMint: boolean;
  isDox: boolean;
  escrowMintProceedsPeriod: number;
  daoWhitelistCount: number;
  mintPeriods: CollectionMintPeriodFormValues[];
  royaltyAddress?: string;
  royaltyPercentage?: number;
  assetsMetadatas: CollectionAssetsMetadataFormValues[];
}

export interface CollectionMintPeriodFormValues {
  unitPrice?: Uint128;
  denom?: string;
  maxTokens?: number;
  perAddressLimit?: number;
  startTime?: string;
  endTime?: string;
  whitelistAddressesFile?: LocalFileData;
  whitelistAddresses?: string[];
  isOpen: boolean;
}

export interface CollectionAssetsMetadataFormValues {
  image?: LocalFileData;
  externalUrl?: string;
  description?: string;
  name?: string;
  youtubeUrl?: string;
  attributes?: string;
}

export interface NewMetadataDetailsFormValues {
  name: string;
  description: string;
  externalURL: string;
  youtubeURL: string;
  attributes: string;
}
