import { useCallback } from "react";

import { useFeedbacks } from "../context/FeedbacksProvider";
import { TeritoriNftVaultClient } from "../contracts-clients/teritori-nft-vault/TeritoriNftVault.client";
import { getSigningCosmWasmClient } from "../utils/keplr";
import { Network } from "../utils/network";
import { teritoriVaultContractAddress } from "../utils/teritori";
import useSelectedWallet from "./useSelectedWallet";

export const useCancelNFTListing = (
  nftContractAddress: string,
  tokenId: string
) => {
  const wallet = useSelectedWallet();
  const { setToastError } = useFeedbacks();
  return useCallback(async () => {
    if (
      !wallet?.publicKey ||
      wallet.network !== Network.Teritori ||
      !wallet.connected
    ) {
      setToastError({
        title: "Failed to cancel NFT listing",
        message: "Bad wallet",
      });
      return;
    }
    try {
      const cosmwasmClient = await getSigningCosmWasmClient();
      const vaultClient = new TeritoriNftVaultClient(
        cosmwasmClient,
        wallet.publicKey,
        teritoriVaultContractAddress
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
