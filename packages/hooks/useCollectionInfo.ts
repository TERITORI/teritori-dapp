import { useQuery } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import Long from "long";

import { TeritoriBreedingQueryClient } from "../contracts-clients/teritori-breeding/TeritoriBreeding.client";
import { TeritoriBunkerMinterQueryClient } from "../contracts-clients/teritori-bunker-minter/TeritoriBunkerMinter.client";
import { TeritoriNftQueryClient } from "../contracts-clients/teritori-nft/TeritoriNft.client";
import { WEI_TOKEN_ADDRESS } from "../networks";
import { prettyPrice } from "../utils/coins";
import { getEthereumProvider } from "../utils/ethereum";
import { ipfsURLToHTTPURL } from "../utils/ipfs";
import { getNonSigningCosmWasmClient } from "../utils/keplr";
import { TeritoriMinter__factory } from "./../evm-contracts-clients/teritori-bunker-minter/TeritoriMinter__factory";
import { TeritoriNft__factory } from "./../evm-contracts-clients/teritori-nft/TeritoriNft__factory";

export type MintState = "not-started" | "whitelist" | "public-sale" | "ended";

export interface MintPhase {
  mintMax: Long;
  start: Long;
  end: Long;
  mintPrice: Long;
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

const getTnsCollectionInfo = (): CollectionInfo => {
  return {
    name: "Teritori Name Service", // FIXME: should fetch from contract or be in env
    image: ipfsURLToHTTPURL(
      process.env.TERITORI_NAME_SERVICE_DEFAULT_IMAGE_URL || ""
    ),
    mintPhases: [],
  };
};

const getBreedingCollectionInfo = async (
  mintAddress: string
): Promise<CollectionInfo> => {
  const cosmwasm = await getNonSigningCosmWasmClient();

  const breedingClient = new TeritoriBreedingQueryClient(cosmwasm, mintAddress);
  const conf = await breedingClient.config();

  const nftClient = new TeritoriNftQueryClient(
    cosmwasm,
    conf.child_contract_addr
  );
  const nftInfo = await nftClient.contractInfo();

  const metadataURL = ipfsURLToHTTPURL(conf.child_base_uri);
  const metadataReply = await fetch(metadataURL);
  const metadata = await metadataReply.json();

  const info: CollectionInfo = {
    name: nftInfo.name,
    image: ipfsURLToHTTPURL(metadata.image || ""),
    description: metadata.description,
    discord: metadata.discord,
    twitter: metadata.twitter,
    website: metadata.website,
    bannerImage: ipfsURLToHTTPURL(metadata.banner),
    mintPhases: [],
  };
  return info;
};

const getTeritoriBunkerCollectionInfo = async (
  mintAddress: string
): Promise<CollectionInfo> => {
  const cosmwasm = await getNonSigningCosmWasmClient();
  const minterClient = new TeritoriBunkerMinterQueryClient(
    cosmwasm,
    mintAddress
  );
  const conf = await minterClient.config();

  const nftClient = new TeritoriNftQueryClient(cosmwasm, conf.nft_addr);
  const nftInfo = await nftClient.contractInfo();

  const metadataURL = ipfsURLToHTTPURL(conf.nft_base_uri);
  const metadataReply = await fetch(metadataURL);

  const metadata = await metadataReply.json();

  const secondsSinceEpoch = Date.now() / 1000;

  const mintedAmount = await minterClient.currentSupply();

  const whitelistEnd = conf.mint_start_time + conf.whitelist_mint_period;
  const hasWhitelistPeriod = !!conf.whitelist_mint_period;
  const publicSaleEnded = mintedAmount === conf.nft_max_supply;

  const whitelistSize = await minterClient.whitelistSize();

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

  const mintPhases: MintPhase[] = [];
  if (hasWhitelistPeriod) {
    const start = Long.fromNumber(conf.mint_start_time);
    mintPhases.push({
      mintPrice: Long.fromString(conf.whitelist_mint_price_amount || "0"),
      mintMax: Long.fromString(conf.whitelist_mint_max || "0"),
      start,
      end: start.add(conf.whitelist_mint_period),
      size: Long.fromNumber(whitelistSize),
    });
  }

  const info: CollectionInfo = {
    name: nftInfo.name,
    image: ipfsURLToHTTPURL(metadata.image || ""),
    description: metadata.description,
    prettyUnitPrice: prettyPrice(
      process.env.TERITORI_NETWORK_ID || "",
      unitPrice,
      conf.price_denom
    ),
    unitPrice,
    priceDenom: conf.price_denom,
    maxSupply: conf.nft_max_supply,
    mintStarted,
    mintedAmount,
    discord: metadata.discord,
    twitter: metadata.twitter,
    website: metadata.website,
    maxPerAddress: conf.mint_max || undefined,
    hasPresale: hasWhitelistPeriod,
    publicSaleEnded,
    isMintable: !publicSaleEnded && conf.is_mintable,
    isInPresalePeriod: state === "whitelist",
    publicSaleStartTime: whitelistEnd,
    bannerImage: ipfsURLToHTTPURL(metadata.banner),
    mintPhases,
    state,
  };

  return info;
};

const getEthereumTeritoriBunkerCollectionInfo = async (
  mintAddress: string
): Promise<CollectionInfo> => {
  const provider = await getEthereumProvider();
  if (!provider) {
    console.error("no eth provider found");
    return { mintPhases: [] };
  }

  const minterClient = TeritoriMinter__factory.connect(mintAddress, provider);
  const minterConfig = await minterClient.callStatic.config();
  const nftAddress = await minterClient.callStatic.nft();

  const isPaused = await minterClient.callStatic.paused();
  const nftClient = TeritoriNft__factory.connect(nftAddress, provider);

  const contractURI = await nftClient.callStatic.contractURI();
  const metadataURL = ipfsURLToHTTPURL(contractURI);
  const metadataReply = await fetch(metadataURL);
  const metadata = await metadataReply.json();

  const secondsSinceEpoch = Long.fromNumber(Date.now() / 1000);

  const name = await nftClient.callStatic.name();

  const priceDenom = WEI_TOKEN_ADDRESS;
  const maxSupply = minterConfig.maxSupply.toString();
  const mintStartedAt = Long.fromString(minterConfig.mintStartTime.toString());
  const mintStarted = secondsSinceEpoch.greaterThanOrEqual(mintStartedAt);

  // Fetch all whitelist phrases
  const whitelistPhases: MintPhase[] = [];
  let isLastPhase = false;
  let phase = BigNumber.from(0);
  let phaseStart = mintStartedAt;

  while (!isLastPhase) {
    const phaseConfig = await minterClient.callStatic.whitelists(phase);

    const size = await minterClient.callStatic.whitelistSize(phase);

    const mintPeriod = Long.fromString(phaseConfig.mintPeriod.toString());

    const phaseEnd = phaseStart.add(mintPeriod);

    // If phase is invalid
    if (!phaseConfig.mintPeriod.toNumber()) {
      isLastPhase = true;
    } else {
      whitelistPhases.push({
        mintMax: Long.fromString(phaseConfig.mintMax.toString()),
        start: phaseStart,
        end: phaseEnd,
        mintPrice: Long.fromString(phaseConfig.mintPrice.toString()),
        size: Long.fromString(size.toString()),
      });
      phase = phase.add(1);
      phaseStart = phaseEnd;
      isLastPhase = false;
    }
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

  const mintedAmount = (await minterClient.currentSupply()).toString();
  const publicSaleEnded = mintedAmount === maxSupply;
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

  const maxPerAddress = minterConfig.publicMintMax.toString() || undefined;
  let unitPrice = minterConfig.publicMintPrice.toString();
  if (state === "whitelist" && currentPhase !== undefined) {
    const phaseData = whitelistPhases[currentPhase];
    unitPrice = phaseData.mintPrice.toString();
  }

  const info: CollectionInfo = {
    name,
    image: ipfsURLToHTTPURL(metadata.image || ""),
    description: metadata.description,
    prettyUnitPrice: prettyPrice(
      process.env.ETHEREUM_NETWORK_ID || "",
      unitPrice,
      priceDenom
    ),
    unitPrice,
    priceDenom,
    maxSupply,
    mintStarted,
    mintedAmount,
    discord: metadata.discord,
    twitter: metadata.twitter,
    website: metadata.website,
    maxPerAddress,
    hasPresale: hasWhitelistPeriod,
    publicSaleEnded,
    isMintable: !publicSaleEnded && !isPaused,
    isInPresalePeriod: state === "whitelist",
    publicSaleStartTime: whitelistEndedAt.toNumber(),
    bannerImage: ipfsURLToHTTPURL(metadata.banner),
    state,
    mintPhases: whitelistPhases,
  };
  return info;
};

// NOTE: consider using the indexer for this
export const useCollectionInfo = (id: string) => {
  // Request to ETH blockchain is not free so for ETH we do not re-fetch much
  const refetchInterval = id.startsWith("eth-") ? 60_000 : 5000;

  const { data, error, refetch } = useQuery(
    ["collectionInfo", id],
    async (): Promise<CollectionInfo> => {
      let info: CollectionInfo = { mintPhases: [] };

      const [addressPrefix, mintAddress] = id.split("-");

      if (addressPrefix === "tori") {
        switch (mintAddress) {
          case process.env.TERITORI_NAME_SERVICE_CONTRACT_ADDRESS:
            info = await getTnsCollectionInfo();
            break;
          case process.env.THE_RIOT_BREEDING_CONTRACT_ADDRESS:
            info = await getBreedingCollectionInfo(mintAddress);
            break;
          default:
            info = await getTeritoriBunkerCollectionInfo(mintAddress);
        }
      } else if (addressPrefix === "eth") {
        info = await getEthereumTeritoriBunkerCollectionInfo(mintAddress);
      }
      return info;
    },
    { refetchInterval, staleTime: refetchInterval }
  );

  return { info: data, notFound: !!error, refetchCollectionInfo: refetch };
};
