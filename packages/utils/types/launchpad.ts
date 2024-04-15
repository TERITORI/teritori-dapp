import { Coin } from "@/contracts-clients/nft-launchpad";
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
  nbTwitterFollowers: string;
  discordName: string;
  email: string;
  projectTypes: string[];
  projectDescription: string;
  tokensCount: string;
  revealTime?: string;
  teamDescription: string;
  teamLink: string;
  partnersDescription: string;
  investDescription: string;
  investLink: string;
  roadmapLink: string;
  artworkDescription: string;
  expectedSupply: string;
  expectedPublicMintPrice: string;
  expectedMintDate: string;
  coverImage: LocalFileData;
  isPreviouslyApplied: boolean;
  isDerivativeProject: boolean;
  isReadyForMint: boolean;
  isDox: boolean;
  escrowMintProceedsPeriod: string;
  daoWhitelistCount: string;
  mintPeriods: CollectionMintPeriodFormValues[];
  royaltyAddress?: string;
  royaltyPercentage?: string;
  assetsMetadatas: CollectionAssetsMetadataFormValues[];
}

export interface CollectionMintPeriodFormValues {
  price: Coin;
  maxTokens: string;
  perAddressLimit: string;
  startTime: string;
  endTime: string;
  whitelistAddressesFile?: LocalFileData;
  whitelistAddresses?: string[];
  isOpen: boolean;
}

export interface CollectionAssetsMetadataFormValues {
  image: LocalFileData;
  externalUrl: string;
  description?: string;
  name: string;
  youtubeUrl?: string;
  attributes: string;
}
