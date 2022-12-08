import { isDeliverTxFailure } from "@cosmjs/stargate";
import { Coin } from "cosmwasm";
import moment from "moment";
import { useEffect, useState } from "react";

import { TeritoriBreedingQueryClient } from "../../contracts-clients/teritori-breeding/TeritoriBreeding.client";
import { THE_RIOT_BREEDING_CONTRACT_ADDRESS } from "../../screens/RiotGame/settings";
import { buildApproveNFTMsg, buildBreedingMsg } from "../../utils/game";
import { getSigningCosmWasmClient } from "../../utils/keplr";
import { defaultMemo } from "../../utils/memo";
import { useContractClients } from "../useContractClients";
import useSelectedWallet from "../useSelectedWallet";
import { Config } from "./../../contracts-clients/teritori-breeding/TeritoriBreeding.types";

export const useBreeding = () => {
  const [breedingConfig, setBreedingConfig] = useState<Config>();
  const [lastBreedAt, setLastBreedAt] = useState<moment.Moment>();

  const { queryClient } = useContractClients(
    THE_RIOT_BREEDING_CONTRACT_ADDRESS,
    "teritori-breeding"
  );

  const breedingQueryClient = queryClient as TeritoriBreedingQueryClient;

  const selectedWallet = useSelectedWallet();

  const breed = async (
    breedingPrice: Coin,
    tokenId1: string,
    tokenId2: string,
    parentContract: string
  ) => {
    if (!tokenId1 || !tokenId2) {
      throw Error("Not select enough rippers to breed");
    }

    const client = await getSigningCosmWasmClient();
    const sender = selectedWallet?.address || "";

    const approveMsgs = [tokenId1, tokenId2].map((tokenId) =>
      buildApproveNFTMsg(
        sender,
        THE_RIOT_BREEDING_CONTRACT_ADDRESS,
        tokenId,
        parentContract
      )
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

  const fetchBreedingConfig = async (
    breedingQueryClient: TeritoriBreedingQueryClient
  ) => {
    // Just load config once
    if (breedingConfig) return;

    const config: Config = await breedingQueryClient.config();
    console.log("Breading config:", { config });
    setBreedingConfig(config);
  };

  useEffect(() => {
    if (!breedingQueryClient) return;

    fetchBreedingConfig(breedingQueryClient);
  }, [breedingQueryClient?.contractAddress]); // Depend on one attribute to avoid deep compare

  return {
    breedingConfig,
    breed,
    lastBreedAt,
  };
};
