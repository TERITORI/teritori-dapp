import { Decimal } from "@cosmjs/math";

import { useCoingeckoPrices } from "./useCoingeckoPrices";
import { useNSMintAvailability } from "./useNSMintAvailability";
import { useNSMintPrice } from "./useNSMintPrice";
import { useVaultNFTInfo } from "./useVaultNFTInfo";

import {
  getNativeCurrency,
  getNetwork,
  getNftId,
  NetworkInfo,
  NetworkKind,
} from "@/networks";
import { CoingeckoCoin } from "@/utils/coingecko";
import { prettyPrice } from "@/utils/coins";
import { NSAvailability } from "@/utils/types/tns";

const getNameOrTokenIdByNetwork = (
  network: NetworkInfo | undefined,
  name: string,
) => {
  return network?.kind === NetworkKind.Cosmos
    ? name + network?.nameServiceTLD
    : name;
};

const getNftIdByNetwork = (
  network: NetworkInfo | undefined,
  tokenId: string,
) => {
  return network?.kind === NetworkKind.Cosmos
    ? getNftId(network.id, network?.nameServiceContractAddress, tokenId)
    : ""; // NOTE: username on Gno is not tokenID
};

export const useNSAvailability = (
  networkId: string | undefined,
  name: string,
): NSAvailability => {
  const network = getNetwork(networkId);
  const tokenId = getNameOrTokenIdByNetwork(network, name);

  const { nsMintPrice, isLoading: isLoadingNSMintPrice } = useNSMintPrice(
    networkId,
    tokenId,
  );

  const { nameAvailable, loading: isLoadingNameAvailability } =
    useNSMintAvailability(networkId, tokenId);

  const { vaultNFTInfo, isLoading: isLoadingVaultNFTInfo } = useVaultNFTInfo(
    getNftIdByNetwork(network, tokenId),
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
        network?.id,
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
        network?.id,
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
