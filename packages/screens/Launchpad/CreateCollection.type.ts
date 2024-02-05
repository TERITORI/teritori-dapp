export interface NewCollectionAssetsFormValues {
  nftApiKey?: string;
}

export interface ExistingBaseUrlFormValues {
  baseTokenUri?: string;
  coverImageUrl?: string;
}

export interface NewCollectionBasicFormValues {
  name?: string;
  description?: string;
  symbol?: string;
  externalLink?: string;
}
export interface NewCollectionDetailsFormValues {
  websiteLink?: string;
  twitterProfileUrl?: string;
  twitterFollowers: string;
  discordName?: string;
  email?: string;
  projectType?: string;
  projectDesciption?: string;
}

export interface NewCollectionMintFormValues {
  token?: string;
  unitPrice?: string;
  perAddressLimit: string;
  startTime?: string;
}
export interface TeamandInvestmentFormValues {
  teamDesciption?: string;
  teamLink?: string;
  partner?: string;
  investDesciption?: string;
  investLink?: string;
  roadmap?: string;
}

export interface NewCollectionAdditionalFormValues {
  artwork?: string;
  collectionSupply?: string;
  mintPrice?: string;
  mintDate?: string;
  whitelistSpotPercentage?: string;
}

export interface ExistingWhitelistDetailsFormValues {
  whitelistAddress: string;
}
export interface NewWhitelistDetailsFormValues {
  unitPrice: string;
  memberLimit: string;
  perAddresaLimit: string;
  startTime: string;
  endTime: string;
}

export interface NewConfigureRoyaltyDetailsFormValues {
  PaymentAddress: string;
  SharePercentage: string;
}

export interface NewMetadataDetailsFormValues {
  name: string;
  description: string;
  externalURL: string;
  youtubeURL: string;
  attributes: string;
}
