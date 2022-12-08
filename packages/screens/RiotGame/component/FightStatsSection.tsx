import { useEffect, useState } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { p2eBackendClient } from "../../../utils/backend";
import { THE_RIOT_COLLECTION_ID } from "../settings";
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

  const fetchTotalFighters = async () => {
    const { count } = await p2eBackendClient.FightersCount({
      collectionId: THE_RIOT_COLLECTION_ID,
    });

    setTotalFighters(count);
  };

  const fetchRank = async (address: string | undefined) => {
    if (!address) return 0;

    const { userScore } = await p2eBackendClient.FighterScore({
      collectionId: THE_RIOT_COLLECTION_ID,
      userId: address,
    });

    setUserRank(userScore?.rank || 0);
  };

  useEffect(() => {
    fetchRank(selectedWallet?.address);
  }, [selectedWallet?.address]);

  useEffect(() => {
    fetchTotalFighters();
  }, []);

  return (
    <View style={[containerStyle, styles.container]}>
      <InfoBox
        size="SM"
        title="Number of Fighters"
        content={`${totalFighters} Rippers`}
        width={120}
      />
      <InfoBox size="SM" title="Prize Pool" content="1337 TORI" width={120} />
      <InfoBox
        size="SM"
        title="Rank"
        content={`${userRank}/${totalFighters}`}
        width={120}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: 10,
  },
});
