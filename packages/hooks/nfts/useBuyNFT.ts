import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { useCallback } from "react";

import { useFeedbacks } from "../../context/FeedbacksProvider";
import { Wallet } from "../../context/WalletsProvider";
import { TeritoriNftVaultClient } from "../../contracts-clients/teritori-nft-vault/TeritoriNftVault.client";
import { NFTVault__factory } from "../../evm-contracts-clients/teritori-nft-vault/NFTVault__factory";
import {
  getNetwork,
  mustGetCosmosNetwork,
  mustGetEthereumNetwork,
  NetworkKind,
} from "../../networks";
import { NFTInfo } from "../../screens/Marketplace/NFTDetailScreen";
import { getMetaMaskEthereumSigner } from "../../utils/ethereum";
import { useWallet } from "../wallets/useWallet";
import { useWalletCosmWasmClient } from "../wallets/useWalletClients";

export const useBuyNFT = (walletId: string | undefined) => {
  const { setToastError } = useFeedbacks();
  const wallet = useWallet(walletId);
  const cosmWasmClient = useWalletCosmWasmClient(walletId);
  const network = getNetwork(wallet?.networkId);

  // Query the Vault client to buy the NFT and returns the transaction reply
  return useCallback(
    async (info: NFTInfo | undefined, onSuccces?: () => void) => {
      if (!wallet?.connected || !wallet.address || !info?.nftAddress) {
        return;
      }

      try {
        let txHash;
        switch (network?.kind) {
          case NetworkKind.Cosmos:
            txHash = await teritoriBuy(cosmWasmClient, wallet, info);
            break;
          case NetworkKind.Ethereum:
            txHash = await ethereumBuy(wallet, info);
            break;
          default:
            setToastError({
              title: "Error",
              message: `Unsupported network kind ${network?.kind}`,
            });
            return;
        }

        console.log("buy", txHash);
        onSuccces && onSuccces();

        return txHash;
      } catch (e) {
        console.error(e);
        if (e instanceof Error) {
          setToastError({
            title: "Failed to buy NFT",
            message: e.message,
          });
        }
      }
    },
    [cosmWasmClient, network?.kind, setToastError, wallet]
  );
};

const teritoriBuy = async (
  client: SigningCosmWasmClient | undefined,
  wallet: Wallet,
  info: NFTInfo
) => {
  if (!client) {
    throw new Error("no client");
  }
  const network = mustGetCosmosNetwork(info.networkId);
  if (!network.vaultContractAddress) {
    throw new Error("network not supported");
  }
  const signingVaultClient = new TeritoriNftVaultClient(
    client,
    wallet.address,
    network.vaultContractAddress
  );
  const tx = await signingVaultClient.buy(
    { nftContractAddr: info.nftAddress, nftTokenId: info.tokenId },
    "auto",
    undefined,
    [
      {
        amount: info.price,
        denom: info.priceDenom,
      },
    ]
  );
  return tx.transactionHash;
};

const ethereumBuy = async (wallet: Wallet, nftInfo: NFTInfo) => {
  const network = mustGetEthereumNetwork(nftInfo.networkId);
  const signer = await getMetaMaskEthereumSigner(network, wallet.address);
  if (!signer) {
    throw Error("Unable to get signer");
  }

  const vaultClient = NFTVault__factory.connect(
    network.vaultContractAddress,
    signer
  );

  const { maxFeePerGas, maxPriorityFeePerGas } = await signer.getFeeData();
  const tx = await vaultClient.buyNFT(nftInfo.nftAddress, nftInfo.tokenId, {
    maxFeePerGas: maxFeePerGas?.toNumber(),
    maxPriorityFeePerGas: maxPriorityFeePerGas?.toNumber(),
    value: nftInfo.price,
  });

  await tx.wait();

  return tx.hash;
};
