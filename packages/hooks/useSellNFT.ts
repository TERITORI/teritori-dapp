import { Decimal } from "cosmwasm";
import { useCallback } from "react";
import { useSelector } from "react-redux";

import { initialToastError, useFeedbacks } from "../context/FeedbacksProvider";
import { TeritoriNftClient } from "../contracts-clients/teritori-nft/TeritoriNft.client";
import { getNativeCurrency, getNetwork } from "../networks";
import { selectSelectedNetworkId } from "../store/slices/settings";
import { getSigningCosmWasmClient } from "../utils/keplr";
import { vaultContractAddress } from "../utils/teritori";
import useSelectedWallet from "./useSelectedWallet";

export const useSellNFT = () => {
  const { setToastError } = useFeedbacks();
  const wallet = useSelectedWallet();
  const selectedNetworkId = useSelector(selectSelectedNetworkId);
  const selectedNetwork = getNetwork(selectedNetworkId);
  return useCallback(
    async (
      nftContractAddress: string,
      tokenId: string,
      price: string,
      denom: string | undefined
    ) => {
      if (!wallet?.address || !wallet.connected) {
        setToastError({
          title: "Failed to list NFT",
          message: "Bad wallet",
        });
        return;
      }
      setToastError(initialToastError);
      try {
        if (!denom) {
          setToastError({
            title: "Failed to list NFT",
            message: "No denom",
          });
          return;
        }
        const cosmwasmClient = await getSigningCosmWasmClient(selectedNetwork);
        const nftClient = new TeritoriNftClient(
          cosmwasmClient,
          wallet.address,
          nftContractAddress
        );
        const currency = getNativeCurrency(selectedNetworkId, denom);
        if (!currency) {
          setToastError({
            title: "Failed to list NFT",
            message: "Unknown currency",
          });
          return;
        }
        const atomicPrice = Decimal.fromUserInput(price, currency.decimals);
        const amount = atomicPrice.atomics;
        const reply = await nftClient.sendNft({
          contract: vaultContractAddress,
          tokenId,
          msg: Buffer.from(
            JSON.stringify({
              deposit: {
                denom,
                amount,
              },
            })
          ).toString("base64"),
        });
        return reply;
      } catch (err) {
        console.error(err);
        if (err instanceof Error) {
          setToastError({
            title: "Failed to list NFT",
            message: err.message,
          });
        }
      }
    },
    [wallet, setToastError]
  );
};
