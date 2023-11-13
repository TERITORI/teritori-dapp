import { Decimal } from "@cosmjs/math";
import { ethers } from "ethers";
import { useCallback } from "react";

import { Wallet } from "./../context/WalletsProvider/wallet";
import { getMetaMaskEthereumSigner } from "./../utils/ethereum";
import useSelectedWallet from "./useSelectedWallet";
import { initialToastError, useFeedbacks } from "../context/FeedbacksProvider";
import { TeritoriNftClient } from "../contracts-clients/teritori-nft/TeritoriNft.client";
import { TeritoriNft__factory } from "../evm-contracts-clients/teritori-nft/TeritoriNft__factory";
import { NFTVault__factory } from "../evm-contracts-clients/teritori-nft-vault/NFTVault__factory";
import {
  getKeplrSigningCosmWasmClient,
  getNativeCurrency,
  mustGetCosmosNetwork,
  mustGetEthereumNetwork,
  WEI_TOKEN_ADDRESS,
  NetworkKind,
} from "../networks";

const teritoriSellNFT = async (
  wallet: Wallet,
  nftContractAddress: string,
  tokenId: string,
  price: string,
  denom: string | undefined,
) => {
  const network = mustGetCosmosNetwork(wallet.networkId);
  if (!network.vaultContractAddress) {
    throw new Error("network not supported");
  }
  const cosmwasmClient = await getKeplrSigningCosmWasmClient(network.id);
  const nftClient = new TeritoriNftClient(
    cosmwasmClient,
    wallet.address,
    nftContractAddress,
  );
  const currency = getNativeCurrency(network.id, denom);
  if (!currency) {
    throw Error("Unknown currency");
  }
  const atomicPrice = Decimal.fromUserInput(price, currency.decimals);
  const amount = atomicPrice.atomics;
  const reply = await nftClient.sendNft({
    contract: network.vaultContractAddress,
    tokenId,
    msg: Buffer.from(
      JSON.stringify({
        deposit: {
          denom,
          amount,
        },
      }),
    ).toString("base64"),
  });
  return reply.transactionHash;
};

const ethereumSellNFT = async (
  wallet: Wallet,
  nftContractAddress: string,
  tokenId: string,
  price: string,
  denom: string | undefined,
) => {
  const network = mustGetEthereumNetwork(wallet.networkId);

  const signer = await getMetaMaskEthereumSigner(network, wallet.address);
  if (!signer) {
    throw Error("Unable to get signer");
  }

  const { maxFeePerGas: maxFee, maxPriorityFeePerGas: maxPrio } =
    await signer.getFeeData();
  const maxFeePerGas = maxFee?.toNumber();
  const maxPriorityFeePerGas = maxPrio?.toNumber();
  const txFeeData = { maxFeePerGas, maxPriorityFeePerGas };

  // Approve
  const nftClient = TeritoriNft__factory.connect(nftContractAddress, signer);

  const approveTx = await nftClient.approve(
    network.vaultContractAddress,
    tokenId,
    txFeeData,
  );
  await approveTx.wait();

  const vaultClient = NFTVault__factory.connect(
    network.vaultContractAddress,
    signer,
  );

  const sellTx = await vaultClient.listNFT(
    nftContractAddress,
    tokenId,
    {
      token: WEI_TOKEN_ADDRESS,
      amount: ethers.utils.parseEther(price),
    },
    txFeeData,
  );

  await sellTx.wait();

  return sellTx.hash;
};

export const useSellNFT = (networkKind: NetworkKind | undefined) => {
  const { setToastError } = useFeedbacks();
  const wallet = useSelectedWallet();

  return useCallback(
    async (
      nftContractAddress: string,
      tokenId: string,
      price: string,
      denom: string | undefined,
    ) => {
      try {
        if (!wallet?.address || !wallet.connected) {
          throw Error("Bad wallet");
        }

        if (!denom) {
          throw Error("No denom");
        }

        let sellNFTFunc;
        switch (networkKind) {
          case NetworkKind.Cosmos:
            sellNFTFunc = teritoriSellNFT;
            break;
          case NetworkKind.Ethereum:
            sellNFTFunc = ethereumSellNFT;
            break;
          default:
            throw Error(`Unsupported network ${networkKind}`);
        }

        setToastError(initialToastError);
        const txHash = await sellNFTFunc(
          wallet,
          nftContractAddress,
          tokenId,
          price,
          denom,
        );

        return txHash;
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
    [wallet, setToastError, networkKind],
  );
};
