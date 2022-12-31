import { Decimal } from "cosmwasm";
import { ethers } from "ethers";
import { useCallback } from "react";

import { initialToastError, useFeedbacks } from "../context/FeedbacksProvider";
import { TeritoriNftClient } from "../contracts-clients/teritori-nft/TeritoriNft.client";
import { NFTVault__factory } from "../evm-contracts-clients/teritori-nft-vault/NFTVault__factory";
import { TeritoriNft__factory } from "../evm-contracts-clients/teritori-nft/TeritoriNft__factory";
import { getNativeCurrency } from "../networks";
import { getSigningCosmWasmClient } from "../utils/keplr";
import { Network } from "../utils/network";
import { vaultContractAddress } from "../utils/teritori";
import { Wallet } from "./../context/WalletsProvider/wallet";
import {
  getMetaMaskEthereumSigner,
  WEI_TOKEN_ADDRESS,
} from "./../utils/ethereum";
import useSelectedWallet from "./useSelectedWallet";

const teritoriSellNFT = async (
  wallet: Wallet,
  nftContractAddress: string,
  tokenId: string,
  price: string,
  denom: string | undefined
) => {
  const cosmwasmClient = await getSigningCosmWasmClient();
  const nftClient = new TeritoriNftClient(
    cosmwasmClient,
    wallet.address,
    nftContractAddress
  );
  const currency = getNativeCurrency(process.env.TERITORI_NETWORK_ID, denom);
  if (!currency) {
    throw Error("Unknown currency");
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
  return reply.transactionHash;
};

const ethereumSellNFT = async (
  wallet: Wallet,
  nftContractAddress: string,
  tokenId: string,
  price: string,
  denom: string | undefined
) => {
  const signer = await getMetaMaskEthereumSigner(wallet.address);
  if (!signer) {
    throw Error("Unable to get signer");
  }

  const { maxFeePerGas: maxFee, maxPriorityFeePerGas: maxPrio } =
    await signer.getFeeData();
  const maxFeePerGas = maxFee?.toNumber();
  const maxPriorityFeePerGas = maxPrio?.toNumber();
  const txFeeData = { maxFeePerGas, maxPriorityFeePerGas };

  // Approve
  const nftClient = await TeritoriNft__factory.connect(
    nftContractAddress,
    signer
  );
  const approveTx = await nftClient.approve(
    process.env.ETHEREUM_VAULT_ADDRESS || "",
    tokenId,
    txFeeData
  );
  await approveTx.wait();

  const vaultClient = await NFTVault__factory.connect(
    process.env.ETHEREUM_VAULT_ADDRESS || "",
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

export const useSellNFT = (network: Network | undefined) => {
  const { setToastError } = useFeedbacks();
  const wallet = useSelectedWallet();

  return useCallback(
    async (
      nftContractAddress: string,
      tokenId: string,
      price: string,
      denom: string | undefined
    ) => {
      try {
        if (!wallet?.address || !wallet.connected) {
          throw Error("Bad wallet");
        }

        if (!denom) {
          throw Error("No denom");
        }

        let sellNFTFunc: CallableFunction | null = null;
        switch (network) {
          case Network.Teritori:
            sellNFTFunc = teritoriSellNFT;
            break;
          case Network.Ethereum:
            sellNFTFunc = ethereumSellNFT;
            break;
          default:
            throw Error(`Unsupported network ${network}`);
        }

        setToastError(initialToastError);
        const txHash = await sellNFTFunc(
          wallet,
          nftContractAddress,
          tokenId,
          price,
          denom
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
    [wallet, setToastError, network]
  );
};
