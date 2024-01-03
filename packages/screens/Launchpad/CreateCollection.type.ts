export interface NewCollectionFormValues {
  nftApiKey?: string;
}

export interface NewCollectionFormForEistingBaseUrlValues {
  baseTokenUri?: string;
  coverImageUrl?: string;
}

export interface NewCollectionDetailsFormValues {
  name?: string;
  description?: string;
  symbol?: string;
  externalLink?: string;
  websiteLink?: string;
  twitterProfileUrl?: string;
  twitterFollowers: string;
  discordName?: string;
  email?: string;
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
