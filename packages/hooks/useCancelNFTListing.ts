import { useCallback } from "react";
import { useSelector } from "react-redux";

import { useFeedbacks } from "../context/FeedbacksProvider";
import { TeritoriNftVaultClient } from "../contracts-clients/teritori-nft-vault/TeritoriNftVault.client";
import { getNetwork } from "../networks";
import { selectSelectedNetworkId } from "../store/slices/settings";
import { getSigningCosmWasmClient } from "../utils/keplr";
import { vaultContractAddress } from "../utils/teritori";
import useSelectedWallet from "./useSelectedWallet";

export const useCancelNFTListing = (
  nftContractAddress: string,
  tokenId: string
) => {
  const wallet = useSelectedWallet();
  const selectedNetworkId = useSelector(selectSelectedNetworkId);
  const selectedNetwork = getNetwork(selectedNetworkId);
  const { setToastError } = useFeedbacks();
  return useCallback(async () => {
    if (!wallet?.address || !wallet.connected) {
      setToastError({
        title: "Failed to cancel NFT listing",
        message: "Bad wallet",
      });
      return;
    }
    try {
      const cosmwasmClient = await getSigningCosmWasmClient(selectedNetwork);
      const vaultClient = new TeritoriNftVaultClient(
        cosmwasmClient,
        wallet.address,
        vaultContractAddress
      );
      const reply = await vaultClient.withdraw({
        nftContractAddr: nftContractAddress,
        nftTokenId: tokenId,
      });
      return reply;
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setToastError({
          title: "Failed to cancel NFT listing",
          message: err.message,
        });
      }
    }
  }, [nftContractAddress, tokenId, wallet]);
};
