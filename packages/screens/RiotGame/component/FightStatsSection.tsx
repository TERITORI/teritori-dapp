import { useEffect, useState } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { CurrentSeasonResponse } from "../../../api/p2e/v1/p2e";
import { PrimaryButtonOutline } from "../../../components/buttons/PrimaryButtonOutline";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import {
  TeritoriDistributorQueryClient,
  TeritoriDistributorClient,
} from "../../../contracts-clients/teritori-distributor/TeritoriDistributor.client";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { p2eBackendClient } from "../../../utils/backend";
import { decimalFromAtomics } from "../../../utils/coins";
import {
  getNonSigningCosmWasmClient,
  getSigningCosmWasmClient,
} from "../../../utils/keplr";
import { yellowDefault } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { TERITORI_DISTRIBUTOR_CONTRACT_ADDRESS } from "../settings";
import { InfoBox } from "./InfoBox";

type FightStatsSectionProps = {
  containerStyle?: ViewStyle;
};

export const FightStatsSection: React.FC<FightStatsSectionProps> = ({
  containerStyle,
}) => {
  const selectedWallet = useSelectedWallet();
  const [totalFighters, setTotalFighters] = useState(0);
  const [userRank, setUserRank] = useState(0);
  const [claimableAmount, setClaimableAmount] = useState(0);
  const { setToastError, setToastSuccess } = useFeedbacks();
  const [isClaiming, setIsClaiming] = useState(false);
  const [currentSeason, setCurrentSeason] = useState<CurrentSeasonResponse>();

  const claimRewards = async (user: string) => {
    setIsClaiming(true);

    try {
      const signingClient = await getSigningCosmWasmClient();
      const distributorClient = new TeritoriDistributorClient(
        signingClient,
        user,
        TERITORI_DISTRIBUTOR_CONTRACT_ADDRESS
      );

      await distributorClient.claim();
      setToastSuccess({
        title: "Success",
        message: "Your rewards have been sent to your wallet",
      });
      setClaimableAmount(0);
    } catch (e: any) {
      setToastError({ title: "Error", message: e.message });
    } finally {
      setIsClaiming(false);
    }
  };

  const fetchCurrentSeason = async () => {
    const currentSeason = await p2eBackendClient.CurrentSeason({});
    setCurrentSeason(currentSeason);
  };

  const fetchTotalFighters = async (seasonId: string) => {
    const { count } = await p2eBackendClient.UsersCount({
      seasonId,
    });

    setTotalFighters(count);
  };

  const fetchRank = async (userId: string, seasonId: string) => {
    if (!userId) return setUserRank(0);

    try {
      const { userScore } = await p2eBackendClient.UserScore({
        seasonId,
        userId,
      });

      setUserRank(userScore?.rank || 0);
    } catch (e) {
      console.log("Unable to fetch rank:", e);
    }
  };

  const fetchClaimableAmount = async () => {
    const nonSigningClient = await getNonSigningCosmWasmClient();
    const distributorQueryClient = new TeritoriDistributorQueryClient(
      nonSigningClient,
      TERITORI_DISTRIBUTOR_CONTRACT_ADDRESS
    );

    const claimableAmount = await distributorQueryClient.userClaimable({
      addr: selectedWallet?.address || "",
    });

    setClaimableAmount(+claimableAmount);
  };

  useEffect(() => {
    if (!currentSeason?.id || !selectedWallet?.address) return;

    fetchRank(selectedWallet?.address, currentSeason.id);
    fetchTotalFighters(currentSeason.id);
  }, [selectedWallet?.address, currentSeason?.id]);

  useEffect(() => {
    fetchCurrentSeason();
    fetchClaimableAmount();
  }, []);

  return (
    <View style={[containerStyle, styles.container]}>
      <InfoBox
        size="SM"
        title="Number of Fighters"
        content={`${totalFighters} Rippers`}
        width={120}
      />
      <InfoBox
        size="SM"
        title="Prize Pool"
        content={`${currentSeason?.totalPrize || 0} ${
          currentSeason?.denom.toUpperCase() || ""
        }`}
        width={150}
      />
      <InfoBox
        size="SM"
        title="Rank"
        content={`${userRank}/${totalFighters}`}
        width={120}
      />

      {claimableAmount !== 0 && selectedWallet?.address && (
        <PrimaryButtonOutline
          disabled={isClaiming}
          color={yellowDefault}
          size="M"
          text={
            isClaiming
              ? "Claiming..."
              : `Claim available rewards: ${decimalFromAtomics(
                  "" + claimableAmount,
                  "utori"
                )} TORI`
          }
          style={{ marginLeft: layout.padding_x1 }}
          onPress={() => claimRewards(selectedWallet.address)}
          noBrokenCorners
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: layout.padding_x1_5,
    alignItems: "center",
  },
});
