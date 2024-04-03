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
  nbTokens: number;
  unitPrice: Uint128;
  perAddressLimit: number;
  teamDescription: string;
  teamLink: string;
  partnersDescription: string;
  investDescription: string;
  investLink: string;
  roadmapLink: string;
  artworkDescription: string;
  expectedSupply: number;
  expectedPublicMintPrice: number;
  expectedMintDate: number;
  nftApiKey?: string;
  coverImage?: LocalFileData;
  isPreviouslyApplied: boolean;
  isDerivativeProject: boolean;
  isReadyForMint: boolean;
  isDox: boolean;
  escrowMintProceedsPeriod: number;
  daoWhitelistCount: number;
  whitelistMintInfos: CollectionWhitelistFormValues[];
  royaltyAddress?: string;
  royaltyPercentage?: number;
}

export interface CollectionWhitelistFormValues {
  endTime: number;
  perAddressLimit: number;
  startTime: number;
  unitPrice: Uint128;
  isOpen: boolean;
  addressesFile?: LocalFileData;
}

export interface NewCollectionAssetsFormValues {
  nftApiKey?: string;
}

export interface NewMetadataDetailsFormValues {
  name: string;
  description: string;
  externalURL: string;
  youtubeURL: string;
  attributes: string;
}
