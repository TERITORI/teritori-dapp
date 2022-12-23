import { EncodeObject } from "@cosmjs/proto-signing";
import { isDeliverTxFailure } from "@cosmjs/stargate";
import { Coin } from "cosmwasm";
import { useCallback, useEffect, useState } from "react";

import { TeritoriBreedingQueryClient } from "../../contracts-clients/teritori-breeding/TeritoriBreeding.client";
import { THE_RIOT_BREEDING_CONTRACT_ADDRESS } from "../../screens/RiotGame/settings";
import { buildApproveNFTMsg, buildBreedingMsg } from "../../utils/game";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import {
  getNonSigningCosmWasmClient,
  getSigningCosmWasmClient,
} from "../../utils/keplr";
import { defaultMemo } from "../../utils/memo";
import useSelectedWallet from "../useSelectedWallet";
import { ConfigResponse } from "./../../contracts-clients/teritori-breeding/TeritoriBreeding.types";

export const useBreeding = () => {
  const [breedingConfig, setBreedingConfig] = useState<ConfigResponse>();
  const [remainingTokens, setRemainingTokens] = useState<number>(0);

  const selectedWallet = useSelectedWallet();

  const getBreedingQueryClient = useCallback(async () => {
    const nonSigningClient = await getNonSigningCosmWasmClient();
    return new TeritoriBreedingQueryClient(
      nonSigningClient,
      THE_RIOT_BREEDING_CONTRACT_ADDRESS
    );
  }, []);

  const breed = async (
    breedingPrice: Coin,
    breedDuration: number,
    tokenId1: string,
    tokenId2: string,
    parentContract: string
  ) => {
    if (!tokenId1 || !tokenId2) {
      throw Error("Not select enough rippers to breed");
    }

    const client = await getSigningCosmWasmClient();
    const sender = selectedWallet?.address || "";

    let msgs: EncodeObject[] = [];

    if (breedDuration > 0) {
      const approveMsgs = [tokenId1, tokenId2].map((tokenId) =>
        buildApproveNFTMsg(
          sender,
          THE_RIOT_BREEDING_CONTRACT_ADDRESS,
          tokenId,
          parentContract
        )
      );
      msgs = [...msgs, ...approveMsgs];
    }

    const breedMsg = buildBreedingMsg(
      sender,
      breedingPrice,
      tokenId1,
      tokenId2
    );

    msgs = [...msgs, breedMsg];

    const tx = await client.signAndBroadcast(sender, msgs, "auto", defaultMemo);

    if (isDeliverTxFailure(tx)) {
      throw Error(tx.transactionHash);
    }

    return tx;
  };

  const getChildTokenIds = async (
    userAddress: string,
    childContractAddress: string
  ) => {
    const client = await getNonSigningCosmWasmClient();
    const { tokens } = await client.queryContractSmart(childContractAddress, {
      tokens: {
        owner: userAddress,
      },
    });

    return tokens;
  };

  const fetchBreedingConfig = async () => {
    // Just load config once
    if (breedingConfig) return;

    const breedingQueryClient = await getBreedingQueryClient();
    const config: ConfigResponse = await breedingQueryClient.config();
    setBreedingConfig(config);
  };

  const fetchRemainingTokens = async (breedingConfig: ConfigResponse) => {
    const client = await getNonSigningCosmWasmClient();
    const { count } = await client.queryContractSmart(
      breedingConfig.child_contract_addr,
      {
        num_tokens: {},
      }
    );
    setRemainingTokens(breedingConfig.child_nft_max_supply - count);
  };

  const getTokenInfo = async (
    tokenId: string,
    childContractAddress: string
  ) => {
    const client = await getNonSigningCosmWasmClient();

    const {
      extension: { image },
    } = await client.queryContractSmart(childContractAddress, {
      nft_info: {
        token_id: tokenId,
      },
    });

    const tokenInfo = { id: tokenId, imageUri: ipfsURLToHTTPURL(image) };
    return tokenInfo;
  };

  const getBreedingsLefts = async (tokenId: string) => {
    const breedingQueryClient = await getBreedingQueryClient();
    const breededCount = await breedingQueryClient.breededCount({
      parentNftTokenId: tokenId,
    });
    // TODO: from contract config breed_count_limit = 5 but breededCount max = 6
    // => add 1 to adjust the display
    return (breedingConfig?.breed_count_limit || 0) - breededCount + 1;
  };

  useEffect(() => {
    fetchBreedingConfig();
  }, []); // Depend on one attribute to avoid deep compare

  useEffect(() => {
    if (!breedingConfig?.child_contract_addr) return;

    fetchRemainingTokens(breedingConfig);
  }, [breedingConfig?.child_contract_addr]);

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
