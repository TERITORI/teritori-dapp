import { calculateFee } from "cosmwasm";
import { useEffect, useState } from "react";

import {
  TeritoriSquadStakingClient,
  TeritoriSquadStakingQueryClient,
} from "../../contracts-clients/teritori-squad-staking/TeritoriSquadStaking.client";
import { defaultExecuteFee } from "../../utils/fee";
import { buildApproveMsg, buildStakingMsg } from "../../utils/game";
import { getSigningCosmWasmClient } from "../../utils/keplr";
import { defaultMemo } from "../../utils/memo";
import { teritoriGasPrice } from "../../utils/teritori";
import { useContractClients } from "../useContractClients";
import useSelectedWallet from "../useSelectedWallet";
import {
  GetSquadResponse,
  GetConfigResponse,
} from "./../../contracts-clients/teritori-squad-staking/TeritoriSquadStaking.types";

const THE_RIOT_SQUAD_STAKING_CONTRACT_ADDRESS =
  process.env.THE_RIOT_SQUAD_STAKING_CONTRACT_ADDRESS || "";

export const useSquadStaking = () => {
  const [squadStakingConfig, setSquadStakingConfig] =
    useState<GetConfigResponse>();
  const [currentSquad, setCurrentSquad] = useState<GetSquadResponse>();
  const selectedWallet = useSelectedWallet();

  const {
    client: squadStakingClient,
    queryClient: squadStakingQueryClient,
  }: {
    client: TeritoriSquadStakingClient;
    queryClient: TeritoriSquadStakingQueryClient;
  } = useContractClients(
    THE_RIOT_SQUAD_STAKING_CONTRACT_ADDRESS,
    TeritoriSquadStakingClient,
    TeritoriSquadStakingQueryClient
  );

  const fetchSquadStakingConfig = async () => {
    if (!squadStakingQueryClient) return;

    const config: GetConfigResponse = await squadStakingQueryClient.getConfig();
    setSquadStakingConfig(config);
  };

  const squadStake = async (selectedRippers: NSRiotGame.RipperDetail[]) => {
    if (selectedRippers.length === 0) return;
    const tokenIds = selectedRippers.map((r) => r.tokenId);

    const client = await getSigningCosmWasmClient();
    const sender = selectedWallet?.address || "";

    const approveMsgs = tokenIds.map((tokenId) =>
      buildApproveMsg(sender, tokenId)
    );

    const stakeMsg = buildStakingMsg(sender, tokenIds);
    const msgs = [...approveMsgs, stakeMsg];

    const estimate = await client.simulate(sender, msgs, "");
    const tx = await client.signAndBroadcast(
      sender,
      msgs,
      calculateFee(Math.floor(estimate * 1.3), teritoriGasPrice),
      defaultMemo
    );
    return tx;
  };

  const fetchSquadStaking = async () => {
    if (!squadStakingQueryClient) return;

    const squad: GetSquadResponse = await squadStakingQueryClient.getSquad({
      owner: selectedWallet?.address || "",
    });
    setCurrentSquad(squad);
  };

  const squadWithdraw = async () => {
    if (!squadStakingClient) return;

    const res = await squadStakingClient.withdraw(
      defaultExecuteFee,
      defaultMemo
    );

    return res;
  };

  useEffect(() => {
    fetchSquadStakingConfig();
    fetchSquadStaking();
  }, [squadStakingQueryClient, selectedWallet]);

  return {
    squadStakingClient,
    squadStakingQueryClient,
    squadStakingConfig,
    currentSquad,
    squadStake,
    squadWithdraw,
  };
};
