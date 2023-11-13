import { View, ViewStyle } from "react-native";

import { InfoBox } from "./InfoBox";
import { PrimaryButtonOutline } from "../../../components/buttons/PrimaryButtonOutline";
import { useGameRewards } from "../../../hooks/riotGame/useGameRewards";
import { useSeasonRank } from "../../../hooks/riotGame/useSeasonRank";
import { useIsMobile } from "../../../hooks/useIsMobile";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { decimalFromAtomics } from "../../../utils/coins";
import { yellowDefault } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";

type FightStatsSectionProps = {
  containerStyle?: ViewStyle;
};

export const FightStatsSection: React.FC<FightStatsSectionProps> = ({
  containerStyle,
}) => {
  const isMobile = useIsMobile();
  const selectedWallet = useSelectedWallet();
  const { userRank, prettyUserRank, currentSeason } = useSeasonRank();
  const { isClaiming, claimableAmount, claimRewards } = useGameRewards();

  return (
    <View
      style={[
        containerStyle,
        {
          flexDirection: isMobile ? "column" : "row",
          margin: layout.spacing_x1_5,
          alignItems: "center",
          height: isMobile ? 200 : "auto",
          justifyContent: isMobile ? "space-between" : undefined,
        },
      ]}
    >
      <InfoBox
        size="SM"
        title="Number of Fighters"
        content={`${userRank?.totalUsers || 0} Rippers`}
        width={isMobile ? 150 : 120}
      />
      <InfoBox
        size="SM"
        title="Prize Pool"
        content={`${currentSeason?.isPre ? 0 : currentSeason?.totalPrize} ${
          currentSeason?.denom.toUpperCase() || ""
        }`}
        width={150}
      />
      <InfoBox
        size="SM"
        title="Rank"
        content={prettyUserRank}
        width={isMobile ? 150 : 120}
      />

      {+claimableAmount !== 0 && selectedWallet?.address && (
        <PrimaryButtonOutline
          disabled={isClaiming}
          color={yellowDefault}
          size="M"
          text={
            isClaiming
              ? "Claiming..."
              : `Claim available rewards: ${decimalFromAtomics(
                  selectedWallet?.networkId,
                  "" + claimableAmount,
                  "utori", // FIXME: don't hardcode denom and use prettyPrice
                )} TORI`
          }
          touchableStyle={{ marginLeft: layout.spacing_x1 }}
          onPress={claimRewards}
          noBrokenCorners
        />
      )}
    </View>
  );
};
