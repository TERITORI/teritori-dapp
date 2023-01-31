import { isDeliverTxFailure } from "@cosmjs/stargate";
import { useCallback, useEffect, useState } from "react";

import { NFT } from "../../api/marketplace/v1/marketplace";
import {
  TeritoriSquadStakingClient,
  TeritoriSquadStakingQueryClient,
} from "../../contracts-clients/teritori-squad-staking/TeritoriSquadStaking.client";
import {
  SQUAD_STAKE_COEF,
  THE_RIOT_SQUAD_STAKING_CONTRACT_ADDRESS,
} from "../../screens/RiotGame/settings";
import { defaultExecuteFee } from "../../utils/fee";
import {
  buildApproveNFTMsg,
  buildStakingMsg,
  getRipperTraitValue,
  getRipperTokenId,
} from "../../utils/game";
import {
  getNonSigningCosmWasmClient,
  getSigningCosmWasmClient,
} from "../../utils/keplr";
import { defaultMemo } from "../../utils/memo";
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
  const [isSquadsLoaded, setIsSquadsLoaded] = useState<boolean>(false);
  const selectedWallet = useSelectedWallet();

  const getSquadStakingQueryClient = useCallback(async () => {
    const nonSigningClient = await getNonSigningCosmWasmClient();
    return new TeritoriSquadStakingQueryClient(
      nonSigningClient,
      THE_RIOT_SQUAD_STAKING_CONTRACT_ADDRESS
    );
  }, []);

  const getSquadStakingClient = useCallback(async (sender: string) => {
    const signingClient = await getSigningCosmWasmClient();
    return new TeritoriSquadStakingClient(
      signingClient,
      sender,
      THE_RIOT_SQUAD_STAKING_CONTRACT_ADDRESS
    );
  }, []);

  const squadStake = async (selectedRippers: NFT[]) => {
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

    const tx = await client.signAndBroadcast(sender, msgs, "auto", defaultMemo);

    if (isDeliverTxFailure(tx)) {
      throw Error(tx.transactionHash);
    }

    return tx;
  };

  const fetchSquadStakingConfig = async () => {
    const squadStakingQueryClient = await getSquadStakingQueryClient();
    const config: GetConfigResponse = await squadStakingQueryClient.getConfig();
    setSquadStakingConfig(config);
  };

  const fetchSquads = async (user: string) => {
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
  };

  const squadWithdraw = async (user: string) => {
    const squadStakingClient = await getSquadStakingClient(user);
    return await squadStakingClient.withdraw(defaultExecuteFee, defaultMemo);
  };

  const estimateStakingDuration = (
    rippers: NFT[],
    squadStakingConfig: GetConfigResponse
  ) => {
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
  };

  useEffect(() => {
    if (!selectedWallet?.address) return;

    fetchSquadStakingConfig();
    fetchSquads(selectedWallet.address);
  }, [selectedWallet?.address]); // Use attributes as dependencies to avoid deep compare

  return {
    currentUser: selectedWallet?.address,
    squadStakingConfig,
    squads,
    squadStake,
    squadWithdraw,
    estimateStakingDuration,
    isSquadsLoaded,
    setSquads,
    fetchSquads,
  };
};
