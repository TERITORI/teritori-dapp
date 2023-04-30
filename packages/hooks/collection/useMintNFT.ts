import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { toUtf8 } from "@cosmjs/encoding";
import { EncodeObject } from "@cosmjs/proto-signing";
import { isDeliverTxFailure } from "@cosmjs/stargate";
import { useCallback } from "react";

import {
  initialToastError,
  useFeedbacks,
} from "../../context/FeedbacksProvider";
import { TeritoriMinter__factory } from "../../evm-contracts-clients/teritori-bunker-minter/TeritoriMinter__factory";
import {
  EthereumNetworkInfo,
  NetworkKind,
  parseCollectionId,
} from "../../networks";
import { getMetaMaskEthereumSigner } from "../../utils/ethereum";
import { useCollectionInfo } from "../useCollectionInfo";
import { useWallet } from "../wallets/useWallet";
import { useWalletCosmWasmClient } from "../wallets/useWalletClients";

export const useMintNFT = (
  walletId: string | undefined,
  collectionId: string
) => {
  const { collectionInfo } = useCollectionInfo(collectionId);
  const { setToastError } = useFeedbacks();
  const wallet = useWallet(walletId);
  const getCosmWasmClient = useWalletCosmWasmClient(wallet?.id);
  const mint = useCallback(
    async (amount: number, onSuccess?: () => void) => {
      setToastError(initialToastError);
      try {
        const [network, mintAddress] = parseCollectionId(collectionId);
        if (!wallet) {
          setToastError({
            title: "Error",
            message: `no wallet`,
          });
          return;
        }
        switch (network?.kind) {
          case NetworkKind.Cosmos:
            await cosmosMint(
              collectionInfo.unitPrice,
              collectionInfo.priceDenom,
              mintAddress,
              wallet.address,
              await getCosmWasmClient(),
              amount
            );
            break;
          case NetworkKind.Ethereum:
            await ethereumMint(network, wallet.address, mintAddress, amount);
            break;
          default:
            setToastError({
              title: "Error",
              message: `unsupported network ${network?.id}`,
            });
            return;
        }

        onSuccess && onSuccess();
      } catch (e) {
        if (e instanceof Error) {
          return setToastError({
            title: "Mint failed",
            message: prettyError(e),
          });
        }
        console.error(e);
      }
    },
    [
      collectionId,
      getCosmWasmClient,
      collectionInfo.priceDenom,
      collectionInfo.unitPrice,
      setToastError,
      wallet,
    ]
  );

  return mint;
};

const cosmosMint = async (
  unitPrice: string | undefined,
  priceDenom: string | undefined,
  mintAddress: string,
  sender: string,
  cosmwasmClient: SigningCosmWasmClient | undefined,
  amount: number
) => {
  if (!sender || !unitPrice || !priceDenom || !cosmwasmClient) {
    throw Error("invalid mint args");
  }

  const msgs: EncodeObject[] = [];

  for (let i = 0; i < amount; i++) {
    let funds;
    if (unitPrice !== "0") {
      funds = [{ amount: unitPrice, denom: priceDenom }];
    }

    const msg = {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: {
        sender,
        msg: toUtf8(
          JSON.stringify({
            request_mint: {
              addr: sender,
            },
          })
        ),
        contract: mintAddress,
        funds,
      },
    };

    msgs.push(msg);
  }

  const tx = await cosmwasmClient.signAndBroadcast(sender, msgs, "auto");

  if (isDeliverTxFailure(tx)) {
    throw Error(tx.transactionHash);
  }
};

const ethereumMint = async (
  network: EthereumNetworkInfo,
  walletAddress: string,
  mintAddress: string,
  amount: number
) => {
  const signer = await getMetaMaskEthereumSigner(network, walletAddress);
  if (!signer) {
    throw Error("no account connected");
  }

  const minterClient = TeritoriMinter__factory.connect(mintAddress, signer);
  const userState = await minterClient.callStatic.userState(walletAddress);

  // TODO: check this properly later
  // if (!userState.userCanMint) {
  //   throw Error("You cannot mint now");
  // }

  const address = await signer.getAddress();

  const { maxFeePerGas, maxPriorityFeePerGas } = await signer.getFeeData();

  const estimatedGasLimit = await minterClient.estimateGas.requestMint(
    address,
    amount,
    {
      value: userState.mintPrice.mul(amount),
    }
  );

  const tx = await minterClient.requestMint(address, amount, {
    value: userState.mintPrice.mul(amount),
    maxFeePerGas: maxFeePerGas?.toNumber(),
    maxPriorityFeePerGas: maxPriorityFeePerGas?.toNumber(),
    gasLimit: estimatedGasLimit.mul(150).div(100),
  });
  await tx.wait();
};

const prettyError = (err: any) => {
  const msg = err?.message;
  if (typeof msg !== "string") {
    return `${err}`;
  }
  if (
    msg.includes("Already minted maximum for whitelist period") ||
    msg.includes("EXCEED_WHITELIST_MINT_MAX")
  ) {
    return "You already minted the maximum allowed per address during presale";
  }
  if (
    msg.includes("Already minted maximum") ||
    msg.includes("EXCEED_MINT_MAX")
  ) {
    return "You already minted the maximum allowed per address";
  }
  if (msg.includes("Not whitelisted!") || msg.includes("NOT_WHITELISTED")) {
    return "You are not in the presale whitelist";
  }
  return msg;
};
