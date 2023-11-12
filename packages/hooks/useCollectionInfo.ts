import Long from "long";
import { useCallback, useMemo } from "react";

import { useBunkerMinterConfig } from "./collection/useBunkerMinterConfig";
import { useBunkerMinterCurrentSupply } from "./collection/useBunkerMinterCurrentSupply";
import { useBunkerMinterWhitelistSize } from "./collection/useBunkerMinterWhitelistSize";
import { useEthMinterConfig } from "./collection/useEthMinterConfig";
import { useEthMinterCurrentSupply } from "./collection/useEthMinterCurrentSupply";
import { useEthMinterIsPaused } from "./collection/useEthMinterIsPaused";
import { useEthMinterNFTAddress } from "./collection/useEthMinterNFTAddress";
import { useEthMinterWhitelists } from "./collection/useEthMinterWhitelists";
import { useEthNFTContractName } from "./collection/useEthNFTContractName";
import { useEthNFTContractURI } from "./collection/useEthNFTContractURI";
import { useBreedingConfig } from "./useBreedingConfig";
import { useCW721ContractInfo } from "./useNFTContractInfo";
import { useRemoteJSON } from "./useRemoteJSON";
import { parseNetworkObjectId, NetworkKind } from "../networks";
import {
  CollectionContractKind,
  CollectionInfo,
  MintPhase,
  collectionContractKindFromID,
  expandCosmosBunkerConfig,
  expandEthereumBunkerConfig,
  getCollectionMetadata,
  getTnsCollectionInfo,
} from "../utils/collection";

// NOTE: consider using the indexer for this
export const useCollectionInfo = (
  id: string,
  forceInterval?: number,
): {
  collectionInfo: CollectionInfo;
  notFound: boolean;
  refetch: () => void;
} => {
  const contractKind = collectionContractKindFromID(id);
  const [network, mintAddress] = parseNetworkObjectId(id);

  const {
    info: breedingCollectionInfo,
    notFound: breedingNotFound,
    refetch: breedingRefetch,
  } = useTeritoriBreedingCollectionInfo(
    network?.id,
    contractKind === CollectionContractKind.CosmwasmBreedingV0,
  );
  const {
    info: bunkerCollectionInfo,
    notFound: bunkerNotFound,
    refetch: bunkerRefetch,
  } = useCosmosBunkerCollectionInfo(
    network?.id,
    mintAddress,
    contractKind === CollectionContractKind.CosmwasmBunkerV0,
  );
  const {
    info: ethereumCollectionInfo,
    notFound: ethNotFound,
    refetch: ethRefetch,
  } = useEthereumTeritoriBunkerCollectionInfo(
    network?.id,
    mintAddress,
    contractKind === CollectionContractKind.EthereumBunkerV0,
  );

  return useMemo(() => {
    switch (contractKind) {
      case CollectionContractKind.CosmwasmNameServiceV0:
        if (network?.kind === NetworkKind.Cosmos) {
          return {
            collectionInfo: getTnsCollectionInfo(network),
            notFound: false,
            refetch: () => {},
          };
        } else {
          return {
            collectionInfo: { mintPhases: [] },
            notFound: true,
            refetch: () => {},
          };
        }
      case CollectionContractKind.CosmwasmBreedingV0:
        return {
          collectionInfo: breedingCollectionInfo,
          notFound: breedingNotFound,
          refetch: breedingRefetch,
        };
      case CollectionContractKind.CosmwasmBunkerV0:
        return {
          collectionInfo: bunkerCollectionInfo,
          notFound: bunkerNotFound,
          refetch: bunkerRefetch,
        };
      case CollectionContractKind.EthereumBunkerV0:
        return {
          collectionInfo: ethereumCollectionInfo,
          notFound: ethNotFound,
          refetch: ethRefetch,
        };
      default:
        return {
          collectionInfo: { mintPhases: [] },
          notFound: true,
          refetch: () => {},
        };
    }
  }, [
    breedingCollectionInfo,
    breedingNotFound,
    breedingRefetch,
    bunkerCollectionInfo,
    bunkerNotFound,
    bunkerRefetch,
    contractKind,
    ethNotFound,
    ethRefetch,
    ethereumCollectionInfo,
    network,
  ]);
};

const useTeritoriBreedingCollectionInfo = (
  networkId: string | undefined,
  enabled?: boolean,
) => {
  const {
    breedingConfig: conf,
    isError,
    refetch: refetchConf,
  } = useBreedingConfig(networkId, enabled);
  const { cw721ContractInfo: nftInfo, refetch: refetchContractInfo } =
    useCW721ContractInfo(networkId, conf?.child_contract_addr);
  const { data: metadata, refetch: reftechMetadata } = useRemoteJSON(
    conf?.child_base_uri,
  );

  const info = useMemo(() => {
    const info = getCollectionMetadata(metadata);
    info.name = nftInfo?.name;
    return info;
  }, [metadata, nftInfo?.name]);

  const refetch = useCallback(() => {
    refetchConf();
    refetchContractInfo();
    reftechMetadata();
  }, [refetchConf, refetchContractInfo, reftechMetadata]);

  return { info, notFound: isError, refetch };
};

const useCosmosBunkerCollectionInfo = (
  networkId: string | undefined,
  mintAddress: string,
  enabled?: boolean,
) => {
  const {
    bunkerMinterConfig: conf,
    isError,
    refetch: refetchConf,
  } = useBunkerMinterConfig(networkId, mintAddress, enabled);
  const {
    bunkerMinterCurrentSupply: mintedAmount,
    refetch: refetchCurrentSupply,
  } = useBunkerMinterCurrentSupply(networkId, mintAddress, enabled);
  const {
    bunkerMinterWhitelistSize: whitelistSize,
    refetch: refetchWhitelistSize,
  } = useBunkerMinterWhitelistSize(networkId, mintAddress, enabled);

  const { cw721ContractInfo: nftInfo, refetch: refetchNFTInfo } =
    useCW721ContractInfo(networkId, conf?.nft_addr);
  const { data: metadata } = useRemoteJSON(conf?.nft_base_uri);

  const info = useMemo(() => {
    const info = getCollectionMetadata(metadata);

    info.name = nftInfo?.name;

    if (!conf) {
      return info;
    }

    const {
      hasWhitelistPeriod,
      unitPrice,
      prettyUnitPrice,
      mintStarted,
      publicSaleEnded,
      state,
      whitelistEnd,
    } = expandCosmosBunkerConfig(networkId, conf, mintedAmount);

    const mintPhases: MintPhase[] = [];
    if (hasWhitelistPeriod && typeof whitelistSize === "number") {
      const start = Long.fromNumber(conf.mint_start_time);
      mintPhases.push({
        mintPrice: Long.fromString(conf.whitelist_mint_price_amount || "0"),
        mintMax: Long.fromString(conf.whitelist_mint_max || "0"),
        mintPeriod: Long.fromNumber(conf.whitelist_mint_period),
        start,
        end: start.add(conf.whitelist_mint_period),
        size: Long.fromNumber(whitelistSize),
      });
    }

    info.prettyUnitPrice = prettyUnitPrice;
    info.unitPrice = unitPrice;
    info.priceDenom = conf.price_denom;
    info.maxSupply = conf.nft_max_supply;
    info.mintStarted = mintStarted;
    info.mintedAmount = mintedAmount;
    info.maxPerAddress = conf.mint_max || undefined;
    info.hasPresale = hasWhitelistPeriod;
    info.publicSaleEnded = publicSaleEnded;
    info.isMintable = !publicSaleEnded && conf.is_mintable;
    info.isInPresalePeriod = state === "whitelist";
    info.publicSaleStartTime = whitelistEnd;
    info.mintPhases = mintPhases;
    info.state = state;

    return info;
  }, [conf, metadata, mintedAmount, networkId, nftInfo, whitelistSize]);

  const refetch = useCallback(() => {
    refetchConf();
    refetchCurrentSupply();
    refetchWhitelistSize();
    refetchNFTInfo();
  }, [refetchConf, refetchCurrentSupply, refetchNFTInfo, refetchWhitelistSize]);

  return { info, notFound: isError, refetch };
};

const useEthereumTeritoriBunkerCollectionInfo = (
  networkId: string | undefined,
  mintAddress: string,
  enabled?: boolean,
) => {
  const {
    data: minterConfig,
    isError,
    refetch: refetchConf,
  } = useEthMinterConfig(networkId, mintAddress, enabled);
  const { data: nftAddress } = useEthMinterNFTAddress(
    networkId,
    mintAddress,
    enabled,
  );
  const { data: isPaused, refetch: refetchIsPaused } = useEthMinterIsPaused(
    networkId,
    mintAddress,
    enabled,
  );
  const { data: whitelists, refetch: refetchWhitelists } =
    useEthMinterWhitelists(networkId, mintAddress, enabled);
  const { data: currentSupply, refetch: refetchCurrentSupply } =
    useEthMinterCurrentSupply(networkId, mintAddress, enabled);

  const { data: contractURI } = useEthNFTContractURI(networkId, nftAddress);
  const { data: name } = useEthNFTContractName(networkId, nftAddress);

  const { data: metadata } = useRemoteJSON(contractURI);

  const info = useMemo(() => {
    if (!minterConfig || !whitelists || !currentSupply) {
      return getCollectionMetadata(metadata);
    }

    const {
      prettyUnitPrice,
      unitPrice,
      priceDenom,
      mintStarted,
      state,
      hasWhitelistPeriod,
      publicSaleEnded,
      whitelistEndedAt,
      whitelistPhases,
    } = expandEthereumBunkerConfig(
      networkId,
      minterConfig,
      whitelists,
      currentSupply,
    );

    const info = getCollectionMetadata(metadata);
    info.name = name;
    info.prettyUnitPrice = prettyUnitPrice;
    info.unitPrice = unitPrice;
    info.priceDenom = priceDenom;
    info.maxSupply = minterConfig.maxSupply.toString();
    info.mintStarted = mintStarted;
    info.mintedAmount = currentSupply.toString();
    info.maxPerAddress = minterConfig.publicMintMax.toString();
    info.hasPresale = hasWhitelistPeriod;
    info.publicSaleEnded = publicSaleEnded;
    info.isMintable = !publicSaleEnded && !isPaused;
    info.isInPresalePeriod = state === "whitelist";
    info.publicSaleStartTime = whitelistEndedAt.toNumber();
    info.state = state;
    info.mintPhases = whitelistPhases;

    return info;
  }, [
    currentSupply,
    isPaused,
    metadata,
    minterConfig,
    name,
    networkId,
    whitelists,
  ]);

  const refetch = useCallback(() => {
    refetchConf();
    refetchIsPaused();
    refetchWhitelists();
    refetchCurrentSupply();
  }, [refetchConf, refetchCurrentSupply, refetchIsPaused, refetchWhitelists]);

  return { info, notFound: isError, refetch };
};
