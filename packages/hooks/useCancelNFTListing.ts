import { useCallback } from "react";

import { useFeedbacks } from "../context/FeedbacksProvider";
import { TeritoriNftVaultClient } from "../contracts-clients/teritori-nft-vault/TeritoriNftVault.client";
import { NFTVault__factory } from "../evm-contracts-clients/teritori-nft-vault/NFTVault__factory";
import { getMetaMaskEthereumSigner } from "../utils/ethereum";
import { getSigningCosmWasmClient } from "../utils/keplr";
import { vaultContractAddress } from "../utils/teritori";
import { Network } from "./../utils/network";
import useSelectedWallet from "./useSelectedWallet";

const teritoriCancelNFTListing = async (
  sender: string,
  nftContractAddress: string,
  tokenId: string
) => {
  const cosmwasmClient = await getSigningCosmWasmClient();
  const vaultClient = new TeritoriNftVaultClient(
    cosmwasmClient,
    sender,
    vaultContractAddress
  );
  const reply = await vaultClient.withdraw({
    nftContractAddr: nftContractAddress,
    nftTokenId: tokenId,
  });
  return reply.transactionHash;
};

const ethereumCancelNFTListing = async (
  sender: string,
  nftContractAddress: string,
  tokenId: string
) => {
  const signer = await getMetaMaskEthereumSigner(sender);
  if (!signer) {
    throw Error("Unable to get signer");
  }

  const { maxFeePerGas, maxPriorityFeePerGas } = await signer.getFeeData();
  const vaultClient = await NFTVault__factory.connect(
    process.env.ETHEREUM_VAULT_ADDRESS || "",
    signer
  );

  const cancelListingTx = await vaultClient.withdrawNFT(
    nftContractAddress,
    tokenId,
    {
      maxFeePerGas: maxFeePerGas?.toNumber(),
      maxPriorityFeePerGas: maxPriorityFeePerGas?.toNumber(),
    }
  );

  await cancelListingTx.wait();

  return cancelListingTx.hash;
};

export const useCancelNFTListing = (
  network: Network | undefined,
  nftContractAddress: string,
  tokenId: string
) => {
  const wallet = useSelectedWallet();
  const { setToastError } = useFeedbacks();

  return useCallback(async () => {
    try {
      if (!wallet?.address || !wallet.connected) {
        throw Error("Bad wallet");
      }

      let cancelNFTListingFunc;
      switch (network) {
        case Network.Teritori:
          cancelNFTListingFunc = teritoriCancelNFTListing;
          break;
        case Network.Ethereum:
          cancelNFTListingFunc = ethereumCancelNFTListing;
          break;
        default:
          throw Error(`Unsupported network ${network}`);
      }

      return await cancelNFTListingFunc(
        wallet.address,
        nftContractAddress,
        tokenId
      );
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setToastError({
          title: "Failed to cancel NFT listing",
          message: err.message,
        });
      }
    }
  }, [network, nftContractAddress, setToastError, tokenId, wallet]);
};
