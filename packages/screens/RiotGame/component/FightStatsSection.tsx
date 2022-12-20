import { useEffect, useState } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { PrimaryButtonOutline } from "../../../components/buttons/PrimaryButtonOutline";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useContractClients } from "../../../hooks/useContractClients";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { p2eBackendClient } from "../../../utils/backend";
import { decimalFromAtomics } from "../../../utils/coins";
import { yellowDefault } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import {
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
  const [prizePool, setPrizePool] = useState(0);
  const [userRank, setUserRank] = useState(0);
  const [claimableAmount, setClaimableAmount] = useState(0);
  const { setToastError, setToastSuccess } = useFeedbacks();
  const [isClaiming, setIsClaiming] = useState(false);

  const {
    queryClient: distributorQueryClient,
    client: distributorClient,
    isReady: isContractClientReady,
  } = useContractClients(
    "teritori-distributor",
    TERITORI_DISTRIBUTOR_CONTRACT_ADDRESS
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

  const fetchPrizePool = async () => {
    const { totalPrize } = await p2eBackendClient.CurrentSeason({});
    setPrizePool(totalPrize);
  };

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
    fetchPrizePool();
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
        <PrimaryButtonOutline
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
          style={{ marginLeft: layout.padding_x1 }}
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
    margin: layout.padding_x1_5,
    alignItems: "center",
  },
});
