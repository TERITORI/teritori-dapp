import { BigNumber } from "ethers";
import Long from "long";

import { prettyPrice } from "./coins";
import { nameServiceDefaultImage } from "./tns";
import { ConfigResponse } from "../contracts-clients/teritori-bunker-minter/TeritoriBunkerMinter.types";
import {
  CosmosNetworkInfo,
  NetworkKind,
  WEI_TOKEN_ADDRESS,
  parseNetworkObjectId,
} from "../networks";

type MintState = "not-started" | "whitelist" | "public-sale" | "ended";

export interface MintPhase {
  mintMax: Long;
  start: Long;
  end: Long;
  mintPrice: Long;
  mintPeriod: Long;
  size: Long;
}

export interface CollectionInfo {
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
  hasPresale?: boolean;
  isInPresalePeriod?: boolean;
  isMintable?: boolean;
  publicSaleEnded?: boolean;
  bannerImage?: string;
  mintStarted?: boolean;
  publicSaleStartTime?: number; // seconds since epoch
  state?: MintState;
  mintPhases: MintPhase[];
}

export interface CollectionThumbnailInfo {
  prettyUnitPrice: string;
  maxSupply: number;
  percentageMinted: number;
}

export enum CollectionContractKind {
  Unknown = "Unknown",
  CosmwasmBreedingV0 = "CosmwasmBreedingV0",
  CosmwasmNameServiceV0 = "CosmwasmNameServiceV0",
  CosmwasmBunkerV0 = "CosmwasmBunkerV0",
  EthereumBunkerV0 = "EthereumBunkerV0",
}

export const collectionContractKindFromID = (id: string | undefined) => {
  const [network, rootAddress] = parseNetworkObjectId(id);
  if (!network || !rootAddress) {
    return CollectionContractKind.Unknown;
  }
  switch (network.kind) {
    case NetworkKind.Ethereum:
      return CollectionContractKind.EthereumBunkerV0;
    case NetworkKind.Cosmos:
      if (rootAddress === network.riotContractAddressGen1) {
        return CollectionContractKind.CosmwasmBreedingV0;
      }
      if (rootAddress === network.nameServiceContractAddress) {
        return CollectionContractKind.CosmwasmNameServiceV0;
      }
      return CollectionContractKind.CosmwasmBunkerV0;
  }
  return CollectionContractKind.Unknown;
};

export const getCollectionMetadata = (umetadata: unknown): CollectionInfo => {
  const info: CollectionInfo = { mintPhases: [] };

  // FIXME: remove any cast
  const metadata = umetadata as any; // current ts version does not support logical casts for 'in' keyword

  if (typeof metadata !== "object" || !metadata) {
    return info;
  }

  if ("image" in metadata && typeof metadata.image === "string")
    info.image = metadata.image;
  if ("description" in metadata && typeof metadata.description === "string")
    info.description = metadata.description;
  if ("discord" in metadata && typeof metadata.discord === "string")
    info.discord = metadata.discord;
  if ("twitter" in metadata && typeof metadata.twitter === "string")
    info.twitter = metadata.twitter;
  if ("website" in metadata && typeof metadata.website === "string")
    info.website = metadata.website;
  if ("banner" in metadata && typeof metadata.banner === "string")
    info.bannerImage = metadata.banner;

  return info;
};

export const getTnsCollectionInfo = (
  network: CosmosNetworkInfo,
): CollectionInfo => {
  return {
    name: `${network.displayName} Name Service`, // FIXME: should fetch from contract or be in env
    image: nameServiceDefaultImage(false, network),
    mintPhases: [],
  };
};

export const expandCosmosBunkerConfig = (
  networkId: string | undefined,
  conf: ConfigResponse,
  mintedAmount: string | undefined,
) => {
  const secondsSinceEpoch = Date.now() / 1000;

  const whitelistEnd = conf.mint_start_time + conf.whitelist_mint_period;
  const hasWhitelistPeriod = !!conf.whitelist_mint_period;
  const publicSaleEnded = mintedAmount === conf.nft_max_supply;

  const mintStarted =
    conf.mint_start_time !== 0 && secondsSinceEpoch >= conf.mint_start_time;

  let state: MintState;
  if (!mintStarted) {
    state = "not-started";
  } else if (hasWhitelistPeriod && secondsSinceEpoch < whitelistEnd) {
    state = "whitelist";
  } else if (!publicSaleEnded) {
    state = "public-sale";
  } else {
    state = "ended";
  }

  let unitPrice: string;
  if (state === "not-started" || state === "whitelist") {
    unitPrice = conf.whitelist_mint_price_amount || conf.nft_price_amount;
  } else {
    unitPrice = conf.nft_price_amount;
  }

  const prettyUnitPrice = prettyPrice(networkId, unitPrice, conf.price_denom);

  return {
    whitelistEnd,
    hasWhitelistPeriod,
    publicSaleEnded,
    mintStarted,
    state,
    unitPrice,
    prettyUnitPrice,
  };
};

export const expandEthereumBunkerConfig = (
  networkId: string | undefined,
  minterConfig: [
    BigNumber,
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
  ] & {
    maxSupply: BigNumber;
    mintToken: string;
    mintStartTime: BigNumber;
    whitelistCount: BigNumber;
    publicMintPrice: BigNumber;
    publicMintMax: BigNumber;
  },
  whitelists: MintPhase[],
  currentSupply: BigNumber,
) => {
  const secondsSinceEpoch = Long.fromNumber(Date.now() / 1000);

  const priceDenom = WEI_TOKEN_ADDRESS;

  const mintStartedAt = Long.fromString(
    minterConfig.mintStartTime.toString() || "0",
  );
  const mintStarted = secondsSinceEpoch.greaterThanOrEqual(mintStartedAt);

  // Fetch all whitelist phrases
  const whitelistPhases: MintPhase[] = [];
  const phase = 0;
  let phaseStart = mintStartedAt;

  for (const phaseConfig of whitelists) {
    const mintPeriod = phaseConfig.mintPeriod;
    const phaseEnd = phaseStart.add(mintPeriod);
    whitelistPhases[phase] = whitelists[phase];
    whitelistPhases[phase].start = phaseStart;
    whitelistPhases[phase].end = phaseEnd;
    phaseStart = phaseEnd;
  }

  // Detect current while list phase
  let currentPhase;
  let whitelistEndedAt = mintStartedAt;
  for (const [idx, whitelistPhase] of whitelistPhases.entries()) {
    whitelistEndedAt = whitelistPhase.end;
    if (secondsSinceEpoch.lessThan(whitelistEndedAt)) {
      currentPhase = idx;
      break;
    }
  }

  const publicSaleEnded = currentSupply.eq(minterConfig.maxSupply);
  const hasWhitelistPeriod = whitelistPhases.length > 0;

  let state: MintState;
  if (!mintStarted) {
    state = "not-started";
  } else if (
    hasWhitelistPeriod &&
    secondsSinceEpoch.lessThan(whitelistEndedAt)
  ) {
    state = "whitelist";
  } else if (!publicSaleEnded) {
    state = "public-sale";
  } else {
    state = "ended";
  }

  let unitPrice = minterConfig.publicMintPrice.toString();
  if (state === "whitelist" && currentPhase !== undefined) {
    const phaseData = whitelistPhases[currentPhase];
    unitPrice = phaseData.mintPrice.toString();
  }

  const prettyUnitPrice = prettyPrice(networkId, unitPrice, priceDenom);

  return {
    prettyUnitPrice,
    unitPrice,
    priceDenom,
    mintStarted,
    state,
    hasWhitelistPeriod,
    publicSaleEnded,
    whitelistEndedAt,
    whitelistPhases,
  };
};
