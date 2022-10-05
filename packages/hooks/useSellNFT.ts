import { Decimal } from "cosmwasm";
import { useCallback } from "react";

import { initialToastError, useFeedbacks } from "../context/FeedbacksProvider";
import { TeritoriNftClient } from "../contracts-clients/teritori-nft/TeritoriNft.client";
import { getSigningCosmWasmClient } from "../utils/keplr";
import { Network } from "../utils/network";
import { vaultContractAddress, toriCurrency } from "../utils/teritori";
import useSelectedWallet from "./useSelectedWallet";

export const useSellNFT = () => {
  const { setToastError } = useFeedbacks();
  const wallet = useSelectedWallet();
  return useCallback(
    async (nftContractAddress: string, tokenId: string, price: string) => {
      if (
        wallet?.network !== Network.Teritori ||
        !wallet.publicKey ||
        !wallet.connected
      ) {
        setToastError({
          title: "Failed to list NFT",
          message: "Bad wallet",
        });
        return;
      }
      setToastError(initialToastError);
      try {
        const cosmwasmClient = await getSigningCosmWasmClient();
        const nftClient = new TeritoriNftClient(
          cosmwasmClient,
          wallet.publicKey,
          nftContractAddress
        );
        const currency = toriCurrency;
        const atomicPrice = Decimal.fromUserInput(price, currency.coinDecimals);
        const amount = atomicPrice.atomics;
        const reply = await nftClient.sendNft({
          contract: vaultContractAddress,
          tokenId,
          msg: Buffer.from(
            JSON.stringify({
              deposit: {
                denom: currency.coinMinimalDenom,
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
