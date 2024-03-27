import { WhitelistMintInfo } from "@/api/launchpad/v1/launchpad";
import { Uint128 } from "@/contracts-clients/nft-launchpad";
import { LocalFileData } from "@/utils/types/files";

export interface ExistingBaseUrlFormValues {
  baseTokenUri?: string;
  coverImageUrl?: string;
}

export interface CreateCollectionFormValues {
  name?: string;
  description?: string;
  symbol?: string;
  externalLink?: string;
  websiteLink?: string;
  twitterProfileUrl?: string;
  nbTwitterFollowers?: number;
  discordName?: string;
  email?: string;
  projectTypes?: string[];
  projectDescription?: string;
  nbTokens?: number;
  unitPrice?: Uint128;
  perAddressLimit?: number;
  startTime?: number;
  teamDescription?: string;
  teamLink?: string;
  partnersDescription?: string;
  investDescription?: string;
  investLink?: string;
  roadmapLink?: string;
  artworkDescription?: string;
  expectedSupply?: number;
  expectedPublicMintPrice?: number;
  expectedMintDate?: number;
  nftApiKey?: string;
  coverImage?: LocalFileData;
  isPreviouslyApplied?: boolean;
  isDerivativeProject?: boolean;
  isReadyForMint?: boolean;
  isDox?: boolean;
  escrowMintProceedsPeriod?: number;
  daoWhitelistCount?: number;
  whitelistMintInfos: WhitelistMintInfo[];
  royaltyAddress?: string;
  royaltyPercentage?: number;
}
export interface CreateCollectionWhitelist {
  addressesCount?: number;
  denom?: string;
  endTime?: number;
  perAddressLimit?: number;
  merkleRoot?: string;
  startTime?: number;
  unitPrice?: Uint128;
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
