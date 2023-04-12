import Long from "long";

export interface MintPhase {
  mintMax: Long;
  start: Long;
  end: Long;
  mintPrice: Long;
  size: Long;
}

export interface CollectionInfoMint {
  image?: string;
  description?: string;
  prettyUnitPrice?: string;
  unitPrice?: string;
  priceDenom?: string;
  maxSupply?: string;
  mintedAmount?: string;
  name?: string;
  discord?: string;
  twitter?: string;
  website?: string;
  maxPerAddress?: string;
  isInPresalePeriod?: boolean;
  isMintable?: boolean;
  publicSaleEnded?: boolean;
  mintStarted?: boolean;
  publicSaleStartTime?: number; // seconds since epoch
  mintPhases: MintPhase[];
}

export interface CollectionInfoPreview {
  maxSupply?: string;
  mintedAmount?: string;
  prettyUnitPrice?: string;
}

export interface CollectionInfoHeader {
  name?: string;
  image?: string;
  discord?: string;
  twitter?: string;
  website?: string;
  bannerImage?: string;
}

export interface CollectionInfoThumb {
  image?: string;
  name?: string;
}
