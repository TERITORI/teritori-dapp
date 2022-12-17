import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { ButtonOutline } from "../../../components/buttons/ButtonOutline";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import {
  TeritoriDistributorClient,
  TeritoriDistributorQueryClient,
} from "../../../contracts-clients/teritori-distributor/TeritoriDistributor.client";
import { useContractClients } from "../../../hooks/useContractClients";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { p2eBackendClient } from "../../../utils/backend";
import { decimalFromAtomics } from "../../../utils/coins";
import { yellowDefault } from "../../../utils/style/colors";
import { spacing } from "../../../utils/style/spacing";
import {
  PRIZE_POOL,
  TERITORI_DISTRIBUTOR_CONTRACT_ADDRESS,
  THE_RIOT_COLLECTION_ID,
} from "../settings";
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

  const {
    queryClient: distributorQueryClient,
    client: distributorClient,
    isReady: isContractClientReady,
  }: {
    queryClient: TeritoriDistributorQueryClient;
    client: TeritoriDistributorClient;
    isReady: boolean;
  } = useContractClients(
    TERITORI_DISTRIBUTOR_CONTRACT_ADDRESS,
    "teritori-distributor"
  );

  const claimRewards = async () => {
    setIsClaiming(true);

    try {
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

  const prizePool = useMemo(() => {
    const month: string = moment.utc().format("YYYY-MM");
    return PRIZE_POOL[month];
  }, []);

  const fetchTotalFighters = async () => {
    const { count } = await p2eBackendClient.FightersCount({
      collectionId: THE_RIOT_COLLECTION_ID,
    });

    setTotalFighters(count);
  };

  const fetchRank = async (address: string | undefined) => {
    if (!address) return setUserRank(0);

    try {
      const { userScore } = await p2eBackendClient.FighterScore({
        collectionId: THE_RIOT_COLLECTION_ID,
        userId: address,
      });

      setUserRank(userScore?.rank || 0);
    } catch (e) {
      console.log("Unable to fetch rank:", e);
    }
  };

  const fetchClaimableAmount = async () => {
    const claimableAmount = await distributorQueryClient.userClaimable({
      addr: selectedWallet?.address || "",
    });

    setClaimableAmount(+claimableAmount);
  };

  useEffect(() => {
    fetchRank(selectedWallet?.address);
  }, [selectedWallet?.address]);

  useEffect(() => {
    fetchTotalFighters();
  }, []);

  useEffect(() => {
    if (!isContractClientReady) return;
    fetchClaimableAmount();
  }, [isContractClientReady]);

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
        content={`${prizePool} TORI`}
        width={150}
      />
      <InfoBox
        size="SM"
        title="Rank"
        content={`${userRank}/${totalFighters}`}
        width={120}
      />

      {claimableAmount !== 0 && (
        <ButtonOutline
          disabled={claimableAmount === 0 || isClaiming}
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
          style={spacing.ml_1}
          onPress={claimRewards}
          noBrokenCorners
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: 10,
    alignItems: "center",
  },
});
