import { Decimal } from "@cosmjs/math";

import { useCoingeckoPrices } from "./useCoingeckoPrices";
import { useNSMintAvailability } from "./useNSMintAvailability";
import { useNSMintPrice } from "./useNSMintPrice";
import { useVaultNFTInfo } from "./useVaultNFTInfo";
import { getCosmosNetwork, getNativeCurrency, getNftId } from "../networks";
import { CoingeckoCoin } from "../utils/coingecko";
import { prettyPrice } from "../utils/coins";

export type NSAvailability =
  | {
      availability: "loading";
    }
  | {
      availability: "invalid";
    }
  | {
      availability: "mint" | "market";
      price: {
        denom: string;
        amount: string;
      };
      usdPrice?: number;
      prettyPrice: string;
    }
  | {
      availability: "none";
    };

// TODO: support gno

export const useNSAvailability = (
  networkId: string | undefined,
  name: string,
): NSAvailability => {
  const cosmosNetwork = getCosmosNetwork(networkId);
  const tokenId = name + cosmosNetwork?.nameServiceTLD;
  const { nsMintPrice, isLoading: isLoadingNSMintPrice } = useNSMintPrice(
    networkId,
    tokenId,
  );
  const { nameAvailable, loading: isLoadingNameAvailability } =
    useNSMintAvailability(networkId, tokenId);
  const { vaultNFTInfo, isLoading: isLoadingVaultNFTInfo } = useVaultNFTInfo(
    getNftId(networkId, cosmosNetwork?.nameServiceContractAddress, tokenId),
  );
  const requestedPrices: CoingeckoCoin[] = [];
  if (nsMintPrice) {
    requestedPrices.push({ networkId, denom: nsMintPrice.denom });
  }
  if (vaultNFTInfo) {
    requestedPrices.push({ networkId, denom: vaultNFTInfo.denom });
  }
  const { prices } = useCoingeckoPrices(requestedPrices);

  // TODO: handle already owned case

  if (
    isLoadingNSMintPrice ||
    isLoadingNameAvailability ||
    isLoadingVaultNFTInfo
  ) {
    return {
      availability: "loading",
    };
  }

  if (nsMintPrice?.invalid) {
    return {
      availability: "invalid",
    };
  }

  if (nameAvailable && nsMintPrice) {
    const currency = getNativeCurrency(networkId, nsMintPrice.denom);
    const currencyUSDPrice = prices[currency?.coingeckoId || ""]?.usd;
    const usdPrice = currencyUSDPrice
      ? currencyUSDPrice *
        Decimal.fromAtomics(
          nsMintPrice.amount,
          currency?.decimals || 0,
        ).toFloatApproximation()
      : undefined;
    return {
      availability: "mint",
      price: nsMintPrice,
      prettyPrice: prettyPrice(
        cosmosNetwork?.id,
        nsMintPrice.amount,
        nsMintPrice.denom,
      ),
      usdPrice,
    };
  }

  if (vaultNFTInfo) {
    const currency = getNativeCurrency(networkId, vaultNFTInfo.denom);
    const currencyUSDPrice = prices[currency?.coingeckoId || ""]?.usd;
    const usdPrice = currencyUSDPrice
      ? currencyUSDPrice *
        Decimal.fromAtomics(
          vaultNFTInfo.amount,
          getNativeCurrency(networkId, vaultNFTInfo.denom)?.decimals || 0,
        ).toFloatApproximation()
      : undefined;
    return {
      availability: "market",
      price: {
        denom: vaultNFTInfo.denom,
        amount: vaultNFTInfo.amount,
      },
      prettyPrice: prettyPrice(
        cosmosNetwork?.id,
        vaultNFTInfo.amount,
        vaultNFTInfo.denom,
      ),
      usdPrice,
    };
  }

  return {
    availability: "none",
  };
};
