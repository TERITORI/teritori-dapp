import { isDeliverTxFailure } from "@cosmjs/stargate";
import { Coin } from "cosmwasm";
import moment from "moment";
import { useEffect, useRef, useState } from "react";

import { TeritoriBreedingQueryClient } from "../../contracts-clients/teritori-breeding/TeritoriBreeding.client";
import { THE_RIOT_BREEDING_CONTRACT_ADDRESS } from "../../screens/RiotGame/settings";
import { buildApproveNFTMsg, buildBreedingMsg } from "../../utils/game";
import { getSigningCosmWasmClient } from "../../utils/keplr";
import { defaultMemo } from "../../utils/memo";
import { useContractClients } from "../useContractClients";
import useSelectedWallet from "../useSelectedWallet";
import { Config as GetConfigResponse } from "./../../contracts-clients/teritori-breeding/TeritoriBreeding.types";

export const useBreeding = () => {
  const [breedingConfig, setBreedingConfig] = useState<GetConfigResponse>();
  const [lastBreedAt, setLastBreedAt] = useState<moment.Moment>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { client, queryClient } = useContractClients(
    THE_RIOT_BREEDING_CONTRACT_ADDRESS,
    "teritori-breeding"
  );

  const breedingQueryClient = queryClient as TeritoriBreedingQueryClient;

  const selectedWallet = useSelectedWallet();

  const breed = async (
    breedingPrice: Coin,
    tokenId1: string,
    tokenId2: string
  ) => {
    if (!tokenId1 || !tokenId2) {
      throw Error("Not select enough rippers to breed");
    }

    const client = await getSigningCosmWasmClient();
    const sender = selectedWallet?.address || "";

    const approveMsgs = [tokenId1, tokenId2].map((tokenId) =>
      buildApproveNFTMsg(sender, THE_RIOT_BREEDING_CONTRACT_ADDRESS, tokenId)
    );

    const breedMsg = buildBreedingMsg(
      sender,
      breedingPrice,
      tokenId1,
      tokenId2
    );
    const msgs = [...approveMsgs, breedMsg];

    setLastBreedAt(moment());
    const tx = await client.signAndBroadcast(sender, msgs, "auto", defaultMemo);

    if (isDeliverTxFailure(tx)) {
      throw Error(tx.transactionHash);
    }

    return tx;
  };

  const _fetchBreedingConfig = async (
    breedingQueryClient: TeritoriBreedingQueryClient
  ) => {
    // Just load config once
    if (breedingConfig) return;

    const config: GetConfigResponse = await breedingQueryClient.config();
    console.log("Breading config:", { config });
    setBreedingConfig(config);
  };

  useEffect(() => {
    if (!breedingQueryClient) return;

    _fetchBreedingConfig(breedingQueryClient);
  }, [breedingQueryClient?.contractAddress]); // Depend on one attribute to avoid deep compare

  return {
    breedingConfig,
    breed,
    lastBreedAt,
  };
};
