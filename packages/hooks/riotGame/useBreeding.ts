import { Coin } from "@cosmjs/amino";
import { EncodeObject } from "@cosmjs/proto-signing";
import { isDeliverTxFailure } from "@cosmjs/stargate";
import { useCallback, useEffect, useState } from "react";

import { ConfigResponse } from "./../../contracts-clients/teritori-breeding/TeritoriBreeding.types";
import { TeritoriBreedingQueryClient } from "../../contracts-clients/teritori-breeding/TeritoriBreeding.client";
import {
  getCosmosNetwork,
  getKeplrSigningCosmWasmClient,
  mustGetNonSigningCosmWasmClient,
} from "../../networks";
import { buildApproveNFTMsg, buildBreedingMsg } from "../../utils/game";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { useBreedingConfig } from "../useBreedingConfig";
import useSelectedWallet from "../useSelectedWallet";

export const useBreeding = (networkId: string | undefined) => {
  const [remainingTokens, setRemainingTokens] = useState<number>(0);

  const selectedWallet = useSelectedWallet();
  const { breedingConfig } = useBreedingConfig(networkId);
  const breedingContractAddress =
    getCosmosNetwork(networkId)?.riotContractAddressGen1;

  const getBreedingQueryClient = useCallback(async () => {
    if (!networkId) {
      throw new Error("no network id");
    }
    if (!breedingContractAddress) {
      throw new Error("no breeding contract address");
    }
    const nonSigningClient = await mustGetNonSigningCosmWasmClient(networkId);
    return new TeritoriBreedingQueryClient(
      nonSigningClient,
      breedingContractAddress,
    );
  }, [breedingContractAddress, networkId]);

  const breed = useCallback(
    async (
      breedingPrice: Coin,
      breedDuration: number,
      tokenId1: string,
      tokenId2: string,
      parentContract: string,
    ) => {
      if (!networkId) {
        throw new Error("no network id");
      }

      if (!breedingContractAddress) {
        throw new Error("no breeding contract address");
      }

      if (!tokenId1 || !tokenId2) {
        throw Error("Not select enough rippers to breed");
      }

      const client = await getKeplrSigningCosmWasmClient(networkId);
      const sender = selectedWallet?.address || "";

      let msgs: EncodeObject[] = [];

      if (breedDuration > 0) {
        const approveMsgs = [tokenId1, tokenId2].map((tokenId) =>
          buildApproveNFTMsg(
            sender,
            breedingContractAddress,
            tokenId,
            parentContract,
          ),
        );
        msgs = [...msgs, ...approveMsgs];
      }

      const breedMsg = buildBreedingMsg(
        sender,
        breedingPrice,
        tokenId1,
        tokenId2,
        breedingContractAddress,
      );

      msgs = [...msgs, breedMsg];

      const tx = await client.signAndBroadcast(sender, msgs, "auto");

      if (isDeliverTxFailure(tx)) {
        throw Error(tx.transactionHash);
      }

      return tx;
    },
    [breedingContractAddress, networkId, selectedWallet?.address],
  );

  const getChildTokenIds = useCallback(
    async (userAddress: string, childContractAddress: string) => {
      if (!networkId) {
        throw new Error("no network id");
      }
      const client = await mustGetNonSigningCosmWasmClient(networkId);
      const { tokens } = await client.queryContractSmart(childContractAddress, {
        tokens: {
          owner: userAddress,
        },
      });

      return tokens;
    },
    [networkId],
  );

  const fetchRemainingTokens = useCallback(
    async (breedingConfig: ConfigResponse) => {
      if (!networkId) {
        throw new Error("no network id");
      }
      const client = await mustGetNonSigningCosmWasmClient(networkId);
      const { count } = await client.queryContractSmart(
        breedingConfig.child_contract_addr,
        {
          num_tokens: {},
        },
      );
      setRemainingTokens(breedingConfig.child_nft_max_supply - count);
    },
    [networkId],
  );

  const getTokenInfo = useCallback(
    async (tokenId: string, childContractAddress: string) => {
      if (!networkId) {
        throw new Error("no network id");
      }
      const client = await mustGetNonSigningCosmWasmClient(networkId);

      const {
        extension: { image },
      } = await client.queryContractSmart(childContractAddress, {
        nft_info: {
          token_id: tokenId,
        },
      });

      const tokenInfo = { id: tokenId, imageUri: ipfsURLToHTTPURL(image) };
      return tokenInfo;
    },
    [networkId],
  );

  const getBreedingsLefts = useCallback(
    async (tokenId: string) => {
      const breedingQueryClient = await getBreedingQueryClient();
      const breededCount = await breedingQueryClient.breededCount({
        parentNftTokenId: tokenId,
      });
      return (breedingConfig?.breed_count_limit || 0) - breededCount;
    },
    [breedingConfig?.breed_count_limit, getBreedingQueryClient],
  );

  useEffect(() => {
    if (!breedingConfig?.child_contract_addr) return;

    fetchRemainingTokens(breedingConfig);
  }, [breedingConfig, fetchRemainingTokens]);

  return {
    breedingConfig,
    breed,
    remainingTokens,
    getChildTokenIds,
    getTokenInfo,
    getBreedingsLefts,
    fetchRemainingTokens,
  };
};
