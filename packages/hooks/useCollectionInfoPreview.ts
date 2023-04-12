import { useQuery } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import Long from "long";

import { TeritoriBunkerMinterQueryClient } from "../contracts-clients/teritori-bunker-minter/TeritoriBunkerMinter.client";
import { TeritoriMinter__factory } from "../evm-contracts-clients/teritori-bunker-minter/TeritoriMinter__factory";
import {
  CosmosNetworkInfo,
  EthereumNetworkInfo,
  mustGetNonSigningCosmWasmClient,
  parseNetworkObjectId,
  WEI_TOKEN_ADDRESS,
  NetworkKind,
} from "../networks";
import { prettyPrice } from "../utils/coins";
import { getEthereumProvider } from "../utils/ethereum";
import { CollectionInfoPreview, MintPhase } from "../utils/types/collections";

export type MintState = "not-started" | "whitelist" | "public-sale" | "ended";

const getCosmosBunkerCollectionInfo = async (
  network: CosmosNetworkInfo,
  mintAddress: string
) => {
  const cosmwasm = await mustGetNonSigningCosmWasmClient(network.id);
  const minterClient = new TeritoriBunkerMinterQueryClient(
    cosmwasm,
    mintAddress
  );
  const conf = await minterClient.config();
  const secondsSinceEpoch = Date.now() / 1000;
  const mintedAmount = await minterClient.currentSupply();
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

  const info: CollectionInfoPreview = {
    prettyUnitPrice: prettyPrice(network.id, unitPrice, conf.price_denom),
    maxSupply: conf.nft_max_supply,
    mintedAmount,
  };

  return info;
};
const getEthereumTeritoriBunkerCollectionInfo = async (
  network: EthereumNetworkInfo,
  mintAddress: string
) => {
  const provider = await getEthereumProvider(network);
  let info: CollectionInfoPreview = {};
  if (!provider) {
    console.error("no eth provider found");
    return info;
  }

  const minterClient = TeritoriMinter__factory.connect(mintAddress, provider);
  const minterConfig = await minterClient.callStatic.config();
  const secondsSinceEpoch = Long.fromNumber(Date.now() / 1000);
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

  let unitPrice = minterConfig.publicMintPrice.toString();
  if (state === "whitelist" && currentPhase !== undefined) {
    const phaseData = whitelistPhases[currentPhase];
    unitPrice = phaseData.mintPrice.toString();
  }

  info = {
    prettyUnitPrice: prettyPrice(network.id, unitPrice, priceDenom),
    maxSupply,
    mintedAmount,
  };
  return info;
};

// NOTE: consider using the indexer for this
export const useCollectionInfoPreview = (id: string) => {
  const [network, mintAddress] = parseNetworkObjectId(id);

  const { data, error, refetch } = useQuery(
    ["collectionInfoPreview", id],
    async (): Promise<CollectionInfoPreview> => {
      let info: CollectionInfoPreview = {};

      try {
        if (
          !network ||
          (network.kind === NetworkKind.Cosmos &&
            (mintAddress === network.riotContractAddressGen1 ||
              mintAddress === network.nameServiceContractAddress))
        ) {
          return info;
        }

        switch (network.kind) {
          case NetworkKind.Cosmos: {
            info = await getCosmosBunkerCollectionInfo(network, mintAddress);
            break;
          }
          case NetworkKind.Ethereum: {
            info = await getEthereumTeritoriBunkerCollectionInfo(
              network,
              mintAddress
            );
            break;
          }
        }
      } catch (e) {
        console.error(e);
      }
      return info;
    },
    { refetchInterval: Infinity, staleTime: Infinity }
  );

  return { info: data, notFound: !!error, refetchCollectionInfo: refetch };
};
