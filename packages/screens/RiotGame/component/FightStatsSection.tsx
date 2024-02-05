import { useMemo } from "react";
import { View, ViewStyle } from "react-native";

import { InfoBox } from "./InfoBox";
import { PrimaryButtonOutline } from "../../../components/buttons/PrimaryButtonOutline";
import { useGameRewards } from "../../../hooks/riotGame/useGameRewards";
import { useSeasonRank } from "../../../hooks/riotGame/useSeasonRank";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useSelectedNetworkInfo } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { teritoriCurrencies } from "../../../networks/teritori/currencies";
import { decimalFromAtomics } from "../../../utils/coins";
import { yellowDefault } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";

import { teritoriNetwork } from "@/networks/teritori";

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
  const selectedNetwork = useSelectedNetworkInfo();

  const formattedClaimable = useMemo(() => {
    if (
      !selectedNetwork?.kind ||
      !selectedWallet?.networkId ||
      !claimableAmount
    ) {
      return "0";
    }

    const res = decimalFromAtomics(
      // NOTICE: Force to teritori network becase in bridge case, token is the same as Teritori
      teritoriNetwork.id,
      "" + claimableAmount,
      // NOTICE: In bridged case, we used bridged token from teritori so decimal = 6 instead of selectedNetwork.currencies[0].denom
      teritoriCurrencies[0].denom,
    );

    return res;
  }, [claimableAmount, selectedNetwork?.kind, selectedWallet?.networkId]);

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
              : `Claim available rewards: ${formattedClaimable} TORI`
          }
          touchableStyle={{ marginLeft: layout.spacing_x1 }}
          onPress={claimRewards}
          noBrokenCorners
        />
      )}
    </View>
  );
};
