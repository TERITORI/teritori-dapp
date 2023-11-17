import { Decimal } from "@cosmjs/math";

import { useCoingeckoPrices } from "./useCoingeckoPrices";
import { useNSMintAvailability } from "./useNSMintAvailability";
import { useNSMintPrice } from "./useNSMintPrice";
import { useVaultNFTInfo } from "./useVaultNFTInfo";
import { getCosmosNetwork, getNativeCurrency, getNftId } from "../networks";
import { CoingeckoCoin } from "../utils/coingecko";

type NSAvailability =
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
    }
  | {
      availability: "none";
    };

export const useNSAvailability = (
  networkId: string | undefined,
  tokenId: string,
): NSAvailability => {
  const cosmosNetwork = getCosmosNetwork(networkId);
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

  console.log("prices", prices);

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
      usdPrice,
    };
  }

  console.log("vaultinfo", vaultNFTInfo);

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
      usdPrice,
    };
  }

  return {
    availability: "none",
  };
};
