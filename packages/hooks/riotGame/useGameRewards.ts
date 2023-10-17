import { useQuery } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import { useCallback, useState } from "react";

import { useFeedbacks } from "../../context/FeedbacksProvider";
import {
  TeritoriDistributorClient,
  TeritoriDistributorQueryClient,
} from "../../contracts-clients/teritori-distributor/TeritoriDistributor.client";
import { Distributor__factory } from "../../evm-contracts-clients/distributor/Distributor__factory";
import {
  CosmosNetworkInfo,
  EthereumNetworkInfo,
  getKeplrSigningCosmWasmClient,
  mustGetNonSigningCosmWasmClient,
  NetworkKind,
  parseUserId,
} from "../../networks";
import { mustGetP2eClient } from "../../utils/backend";
import { getMetaMaskEthereumSigner } from "../../utils/ethereum";
import useSelectedWallet from "../useSelectedWallet";

const cosmosGetClaimableAmount = async (
  network: CosmosNetworkInfo,
  distributorContractAddress: string,
  userAddress: string
) => {
  const nonSigningClient = await mustGetNonSigningCosmWasmClient(network.id);
  const distributorQueryClient = new TeritoriDistributorQueryClient(
    nonSigningClient,
    distributorContractAddress
  );
  return await distributorQueryClient.userClaimable({
    addr: userAddress,
  });
};

const ethereumGetClaimableAmount = async (
  network: EthereumNetworkInfo,
  userAddress: string
) => {
  const p2eClient = mustGetP2eClient(network?.id);
  const data = await p2eClient.MerkleData({
    userId: userAddress,
    token: network.currencies[0].denom,
    networkId: network?.id,
  });
  return data.claimableAmount;
};

const cosmosClaim = async (
  networkId: string,
  userAddress: string,
  distributorContractAddress: string
) => {
  const signingClient = await getKeplrSigningCosmWasmClient(networkId);
  const distributorClient = new TeritoriDistributorClient(
    signingClient,
    userAddress,
    distributorContractAddress
  );

  await distributorClient.claim();
};

const ethereumClaim = async (
  network: EthereumNetworkInfo,
  userAddress: string,
  distributorContractAddress: string
) => {
  const p2eClient = mustGetP2eClient(network.id);
  const resp = await p2eClient.MerkleData({
    userId: userAddress,
    token: network.currencies[0].denom,
    networkId: network.id,
  });
  const allocation = resp.userReward?.amount || "0";

  const signer = await getMetaMaskEthereumSigner(network, userAddress);
  if (!signer) {
    throw Error("Unable to get signer");
  }

  const distributorClient = Distributor__factory.connect(
    distributorContractAddress,
    signer
  );

  const claimableAmount = BigNumber.from(allocation);

  const { maxFeePerGas, maxPriorityFeePerGas } = await signer.getFeeData();
  const estimatedGasLimit = await distributorClient.estimateGas.claim(
    network.currencies[0].denom,
    claimableAmount,
    resp.proof
  );
  const tx = await distributorClient.claim(
    network.currencies[0].denom,
    claimableAmount,
    resp.proof,
    {
      maxFeePerGas: maxFeePerGas?.toNumber(),
      maxPriorityFeePerGas: maxPriorityFeePerGas?.toNumber(),
      gasLimit: estimatedGasLimit.mul(150).div(100),
    }
  );
  await tx.wait();

  return true;
};

export const useGameRewards = () => {
  const selectedWallet = useSelectedWallet();
  const userId = selectedWallet?.userId;
  const { setToastSuccess, setToastError } = useFeedbacks();
  const [isClaiming, setIsClaiming] = useState(false);

  const { data } = useQuery(
    ["claimableAmount", userId],
    async () => {
      const [network, userAddress] = parseUserId(userId);

      const distributorContractAddress = network?.distributorContractAddress;

      if (!distributorContractAddress || !userAddress) {
        return "0";
      }

      if (network?.kind === NetworkKind.Cosmos) {
        return await cosmosGetClaimableAmount(
          network,
          distributorContractAddress,
          userAddress
        );
      } else if (network?.kind === NetworkKind.Ethereum) {
        const claimable = await ethereumGetClaimableAmount(
          network,
          userAddress
        );
        return claimable;
      } else {
        throw Error("failed to get claimable amount: unknown network");
      }
    },
    { staleTime: Infinity }
  );
  const claimableAmount = data || 0;

  const claimRewards = useCallback(async () => {
    setIsClaiming(true);
    try {
      const [network, userAddress] = parseUserId(userId);

      if (!network?.distributorContractAddress || !userAddress) {
        throw new Error("invalid user id");
      }

      if (network?.kind === NetworkKind.Cosmos) {
        await cosmosClaim(
          network.id,
          userAddress,
          network.distributorContractAddress
        );
      } else if (network?.kind === NetworkKind.Ethereum) {
        await ethereumClaim(
          network,
          userAddress,
          network.distributorContractAddress
        );
      } else {
        throw Error("Unknown network");
      }

      setToastSuccess({
        title: "Success",
        message: "Your rewards have been sent to your wallet",
      });
    } catch (e: any) {
      setToastError({ title: "Error", message: e.message });
    } finally {
      setIsClaiming(false);
    }
  }, [userId, setToastError, setToastSuccess]);

  return { isClaiming, claimableAmount, claimRewards };
};
