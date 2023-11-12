import { useMemo } from "react";

import { useBunkerMinterConfig } from "./useBunkerMinterConfig";
import { useBunkerMinterCurrentSupply } from "./useBunkerMinterCurrentSupply";
import { useEthMinterConfig } from "./useEthMinterConfig";
import { useEthMinterCurrentSupply } from "./useEthMinterCurrentSupply";
import { useEthMinterWhitelists } from "./useEthMinterWhitelists";
import { parseNetworkObjectId } from "../../networks";
import {
  collectionContractKindFromID,
  CollectionContractKind,
  CollectionThumbnailInfo,
  expandCosmosBunkerConfig,
  expandEthereumBunkerConfig,
} from "../../utils/collection";

export const useCollectionThumbnailInfo = (id: string) => {
  const contractKind = collectionContractKindFromID(id);
  const [network, mintAddress] = parseNetworkObjectId(id);
  const cosmwasmBunkerInfo = useCosmosBunkerCollectionThumbnailInfo(
    network?.id,
    mintAddress,
    contractKind === CollectionContractKind.CosmwasmBunkerV0,
  );
  const ethereumBunkerInfo = useEthereumBunkerCollectionThumbnailInfo(
    network?.id,
    mintAddress,
    contractKind === CollectionContractKind.EthereumBunkerV0,
  );
  return useMemo(() => {
    switch (contractKind) {
      case CollectionContractKind.CosmwasmBunkerV0:
        return cosmwasmBunkerInfo;
      case CollectionContractKind.EthereumBunkerV0:
        return ethereumBunkerInfo;
    }
    return undefined;
  }, [contractKind, cosmwasmBunkerInfo, ethereumBunkerInfo]);
};

const useCosmosBunkerCollectionThumbnailInfo = (
  networkId: string | undefined,
  mintAddress: string | undefined,
  enabled?: boolean,
) => {
  const { bunkerMinterConfig: conf } = useBunkerMinterConfig(
    networkId,
    mintAddress,
    enabled,
  );
  const { bunkerMinterCurrentSupply: mintedAmount } =
    useBunkerMinterCurrentSupply(networkId, mintAddress, enabled);

  return useMemo(() => {
    if (!conf) {
      return undefined;
    }

    const { prettyUnitPrice } = expandCosmosBunkerConfig(
      networkId,
      conf,
      mintedAmount,
    );

    const maxSupply = parseInt(conf.nft_max_supply, 10);
    const info: CollectionThumbnailInfo = {
      prettyUnitPrice,
      maxSupply,
      percentageMinted: Math.round(
        (parseInt(mintedAmount || "0", 10) * 100) / maxSupply,
      ),
    };
    return info;
  }, [conf, mintedAmount, networkId]);
};

const useEthereumBunkerCollectionThumbnailInfo = (
  networkId: string | undefined,
  mintAddress: string | undefined,
  enabled?: boolean,
) => {
  const { data: minterConfig } = useEthMinterConfig(
    networkId,
    mintAddress,
    enabled,
  );
  const { data: whitelists } = useEthMinterWhitelists(
    networkId,
    mintAddress,
    enabled,
  );
  const { data: currentSupply } = useEthMinterCurrentSupply(
    networkId,
    mintAddress,
    enabled,
  );
  return useMemo(() => {
    if (!whitelists || !minterConfig || !currentSupply) {
      return undefined;
    }

    const { prettyUnitPrice } = expandEthereumBunkerConfig(
      networkId,
      minterConfig,
      whitelists,
      currentSupply,
    );
    const maxSupply = minterConfig.maxSupply.toNumber();
    const info: CollectionThumbnailInfo = {
      prettyUnitPrice,
      maxSupply,
      percentageMinted: Math.round((currentSupply.toNumber() || 0) / maxSupply),
    };

    return info;
  }, [currentSupply, minterConfig, networkId, whitelists]);
};
