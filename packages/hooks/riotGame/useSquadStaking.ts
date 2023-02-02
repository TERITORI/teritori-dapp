import { isDeliverTxFailure } from "@cosmjs/stargate";
import { useCallback, useEffect, useState } from "react";

import { NFT } from "../../api/marketplace/v1/marketplace";
import {
  TeritoriSquadStakingClient,
  TeritoriSquadStakingQueryClient,
} from "../../contracts-clients/teritori-squad-staking/TeritoriSquadStaking.client";
import {
  buildApproveNFTMsg,
  buildStakingMsg,
  getRipperTraitValue,
  getRipperTokenId,
  THE_RIOT_SQUAD_STAKING_CONTRACT_ADDRESS,
  SQUAD_STAKE_COEF,
} from "../../utils/game";
import {
  getNonSigningCosmWasmClient,
  getSigningCosmWasmClient,
} from "../../utils/keplr";
import useSelectedWallet from "../useSelectedWallet";
import {
  GetSquadResponse,
  GetConfigResponse,
  Nft as SquadStakeNFT,
  Squad,
} from "./../../contracts-clients/teritori-squad-staking/TeritoriSquadStaking.types";

export const useSquadStaking = () => {
  const [squadStakingConfig, setSquadStakingConfig] =
    useState<GetConfigResponse>();
  const [squads, setSquads] = useState<Squad[]>([]);
  const [squadSeason1, setSquadSeason1] = useState<Squad>();
  const [isSquadsLoaded, setIsSquadsLoaded] = useState<boolean>(false);
  const selectedWallet = useSelectedWallet();

  const squadStake = useCallback(
    async (selectedRippers: NFT[]) => {
      const client = await getSigningCosmWasmClient();
      const sender = selectedWallet?.address || "";

      const selectedNfts: SquadStakeNFT[] = [];
      for (const selectedRipper of selectedRippers) {
        const tokenId = getRipperTokenId(selectedRipper);

        selectedNfts.push({
          contract_addr: selectedRipper.nftContractAddress,
          token_id: tokenId,
        });
      }

      const approveMsgs = [];
      for (const selectedNft of selectedNfts) {
        const msg = buildApproveNFTMsg(
          sender,
          THE_RIOT_SQUAD_STAKING_CONTRACT_ADDRESS,
          selectedNft.token_id,
          selectedNft.contract_addr
        );
        approveMsgs.push(msg);
      }

      const stakeMsg = buildStakingMsg(sender, selectedNfts);
      const msgs = [...approveMsgs, stakeMsg];

      const tx = await client.signAndBroadcast(sender, msgs, "auto");

      if (isDeliverTxFailure(tx)) {
        throw Error(tx.transactionHash);
      }

      return tx;
    },
    [selectedWallet?.address]
  );

  const fetchSquadStakingConfig = useCallback(async () => {
    const squadStakingQueryClient = await getSquadStakingQueryClient();
    const config: GetConfigResponse = await squadStakingQueryClient.getConfig();
    setSquadStakingConfig(config);
  }, []);

  const fetchSquadSeason1 = useCallback(async (user: string) => {
    try {
      const nonSigningClient = await getNonSigningCosmWasmClient();
      const client = new TeritoriSquadStakingQueryClient(
        nonSigningClient,
        process.env.THE_RIOT_SQUAD_STAKING_CONTRACT_ADDRESS_V1 || ""
      );
      const squad = await client.getSquad({
        owner: user,
      });
      // NOTE: contract client V1 is not compatible with V2
      // V1 return Squad and V2 return Squad[] so we have to use any in this case
      setSquadSeason1(squad as any);
    } catch (e: any) {
      if (e.message?.includes("Squad not found")) {
        console.log("Squad Season 1 not found:", e.message);
      } else {
        throw e;
      }
    }
  }, []);

  const fetchSquads = useCallback(async (user: string) => {
    try {
      const queryClient = await getSquadStakingQueryClient();
      const squads: GetSquadResponse = await queryClient.getSquad({
        owner: user,
      });
      setSquads(squads);
    } catch (e: any) {
      if (e.message?.includes("Squad not found")) {
        console.log("Squad not found:", e.message);
      } else {
        throw e;
      }
    } finally {
      setIsSquadsLoaded(true);
    }
  }, []);

  const squadWithdrawSeason1 = useCallback(async (user: string) => {
    const signingClient = await getSigningCosmWasmClient();
    const client = new TeritoriSquadStakingClient(
      signingClient,
      user,
      process.env.THE_RIOT_SQUAD_STAKING_CONTRACT_ADDRESS_V1 || ""
    );
    return await client.withdraw();
  }, []);

  const squadWithdraw = useCallback(async (user: string) => {
    const squadStakingClient = await getSquadStakingClient(user);
    return await squadStakingClient.withdraw();
  }, []);

  const estimateStakingDuration = useCallback(
    (rippers: NFT[], squadStakingConfig: GetConfigResponse) => {
      const bonusMultiplier = squadStakingConfig.bonus_multiplier;

      let duration = 0;

      const ripperCount = rippers.length;
      if (ripperCount > 0) {
        // Get base stamina from Squad leader at slot 0
        const baseStamina = getRipperTraitValue(rippers[0], "Stamina");
        duration =
          baseStamina *
          SQUAD_STAKE_COEF *
          (bonusMultiplier[ripperCount - 1] / 100);
      }

      return duration * 60 * 60 * 1000; // Convert to milliseconds
    },
    []
  );

  useEffect(() => {
    if (!selectedWallet?.address) return;

    fetchSquadStakingConfig();
    fetchSquads(selectedWallet.address);
    fetchSquadSeason1(selectedWallet.address);
  }, [
    fetchSquadSeason1,
    fetchSquadStakingConfig,
    fetchSquads,
    selectedWallet?.address,
  ]); // Use attributes as dependencies to avoid deep compare

  return {
    currentUser: selectedWallet?.address,
    squadStakingConfig,
    squads,
    squadStake,
    squadWithdraw,
    squadWithdrawSeason1,
    setSquadSeason1,
    estimateStakingDuration,
    isSquadsLoaded,
    setSquads,
    fetchSquads,
    squadSeason1,
  };
};

const getSquadStakingClient = async (sender: string) => {
  const signingClient = await getSigningCosmWasmClient();
  return new TeritoriSquadStakingClient(
    signingClient,
    sender,
    THE_RIOT_SQUAD_STAKING_CONTRACT_ADDRESS
  );
};

const getSquadStakingQueryClient = async () => {
  const nonSigningClient = await getNonSigningCosmWasmClient();
  return new TeritoriSquadStakingQueryClient(
    nonSigningClient,
    THE_RIOT_SQUAD_STAKING_CONTRACT_ADDRESS
  );
};
