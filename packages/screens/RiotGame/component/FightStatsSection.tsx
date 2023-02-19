import { StyleSheet, View, ViewStyle } from "react-native";

import { PrimaryButtonOutline } from "../../../components/buttons/PrimaryButtonOutline";
import { useGameRewards } from "../../../hooks/riotGame/useGameRewards";
import { useSeasonRank } from "../../../hooks/riotGame/useSeasonRank";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { decimalFromAtomics } from "../../../utils/coins";
import { yellowDefault } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { InfoBox } from "./InfoBox";

type FightStatsSectionProps = {
  containerStyle?: ViewStyle;
};

export const FightStatsSection: React.FC<FightStatsSectionProps> = ({
  containerStyle,
}) => {
  const selectedWallet = useSelectedWallet();
  const { userRank, prettyUserRank, currentSeason } = useSeasonRank();
  const { isClaiming, claimableAmount, claimRewards } = useGameRewards();

  return (
    <View style={[containerStyle, styles.container]}>
      <InfoBox
        size="SM"
        title="Number of Fighters"
        content={`${userRank?.totalUsers || 0} Rippers`}
        width={120}
      />
      <InfoBox
        size="SM"
        title="Prize Pool"
        content={`${currentSeason?.isPre ? 0 : currentSeason?.totalPrize} ${
          currentSeason?.denom.toUpperCase() || ""
        }`}
        width={150}
      />
      <InfoBox size="SM" title="Rank" content={prettyUserRank} width={120} />

      {claimableAmount !== 0 && selectedWallet?.address && (
        <PrimaryButtonOutline
          disabled={isClaiming}
          color={yellowDefault}
          size="M"
          text={
            isClaiming
              ? "Claiming..."
              : `Claim available rewards: ${decimalFromAtomics(
                  process.env.TERITORI_NETWORK_ID || "",
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
