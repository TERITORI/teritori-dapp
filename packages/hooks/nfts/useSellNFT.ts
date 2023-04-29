import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Decimal } from "@cosmjs/math";
import { ethers } from "ethers";
import { useCallback } from "react";

import {
  initialToastError,
  useFeedbacks,
} from "../../context/FeedbacksProvider";
import { Wallet } from "../../context/WalletsProvider/wallet";
import { TeritoriNftClient } from "../../contracts-clients/teritori-nft/TeritoriNft.client";
import { TeritoriNft__factory } from "../../evm-contracts-clients/teritori-nft/TeritoriNft__factory";
import { NFTVault__factory } from "../../evm-contracts-clients/teritori-nft-vault/NFTVault__factory";
import {
  getNativeCurrency,
  mustGetCosmosNetwork,
  mustGetEthereumNetwork,
  WEI_TOKEN_ADDRESS,
  NetworkKind,
  getNetwork,
} from "../../networks";
import { getMetaMaskEthereumSigner } from "../../utils/ethereum";
import { useWallet } from "../wallets/useWallet";
import { useWalletCosmWasmClient } from "../wallets/useWalletClients";

const teritoriSellNFT = async (
  cosmwasmClient: SigningCosmWasmClient | undefined,
  wallet: Wallet,
  nftContractAddress: string,
  tokenId: string,
  price: string,
  denom: string | undefined
) => {
  if (!cosmwasmClient) {
    throw new Error("no client");
  }
  const network = mustGetCosmosNetwork(wallet.networkId);
  if (!network.vaultContractAddress) {
    throw new Error("network not supported");
  }
  const nftClient = new TeritoriNftClient(
    cosmwasmClient,
    wallet.address,
    nftContractAddress
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
      })
    ).toString("base64"),
  });
  return reply.transactionHash;
};

const ethereumSellNFT = async (
  wallet: Wallet,
  nftContractAddress: string,
  tokenId: string,
  price: string
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
    txFeeData
  );
  await approveTx.wait();

  const vaultClient = NFTVault__factory.connect(
    network.vaultContractAddress,
    signer
  );

  const sellTx = await vaultClient.listNFT(
    nftContractAddress,
    tokenId,
    {
      token: WEI_TOKEN_ADDRESS,
      amount: ethers.utils.parseEther(price),
    },
    txFeeData
  );

  await sellTx.wait();

  return sellTx.hash;
};

export const useSellNFT = (walletId: string | undefined) => {
  const { setToastError } = useFeedbacks();
  const wallet = useWallet(walletId);
  const cosmWasmClient = useWalletCosmWasmClient(walletId);
  const network = getNetwork(wallet?.networkId);

  return useCallback(
    async (
      nftContractAddress: string,
      tokenId: string,
      price: string,
      denom: string | undefined
    ) => {
      try {
        if (!network || !wallet?.address || !wallet.connected) {
          throw Error("Bad wallet");
        }

        if (!denom) {
          throw Error("No denom");
        }

        let txHash;
        switch (network.kind) {
          case NetworkKind.Cosmos:
            txHash = await teritoriSellNFT(
              cosmWasmClient,
              wallet,
              nftContractAddress,
              tokenId,
              price,
              denom
            );
            break;
          case NetworkKind.Ethereum:
            txHash = await ethereumSellNFT(
              wallet,
              nftContractAddress,
              tokenId,
              price
            );
            break;
          default:
            throw Error(`Unsupported network ${network.kind}`);
        }

        setToastError(initialToastError);

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
    [cosmWasmClient, network, setToastError, wallet]
  );
};
