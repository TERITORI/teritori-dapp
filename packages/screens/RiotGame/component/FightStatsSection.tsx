import { useMemo } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { InfoBox } from "./InfoBox";
import { PrimaryButtonOutline } from "../../../components/buttons/PrimaryButtonOutline";
import { useGameRewards } from "../../../hooks/riotGame/useGameRewards";
import { useSeasonRank } from "../../../hooks/riotGame/useSeasonRank";
import { useSelectedNetworkInfo } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { NetworkKind, WEI_TOKEN_ADDRESS } from "../../../networks";
import { teritoriCurrencies } from "../../../networks/teritori/currencies";
import { decimalFromAtomics } from "../../../utils/coins";
import { yellowDefault } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";

type FightStatsSectionProps = {
  containerStyle?: ViewStyle;
};

export const FightStatsSection: React.FC<FightStatsSectionProps> = ({
  containerStyle,
}) => {
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
      selectedWallet.networkId,
      "" + claimableAmount,
      selectedNetwork.kind === NetworkKind.Ethereum
        ? WEI_TOKEN_ADDRESS
        : teritoriCurrencies[0].denom
    );
    return res;
  }, [claimableAmount, selectedNetwork?.kind, selectedWallet?.networkId]);

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

      {+claimableAmount !== 0 && selectedWallet?.address && (
        <PrimaryButtonOutline
          disabled={isClaiming}
          color={yellowDefault}
          size="M"
          text={
            isClaiming
              ? "Claiming..."
              : `Claim available rewards: ${formattedClaimable} ${
                  selectedNetwork?.kind === NetworkKind.Ethereum
                    ? "WEI"
                    : "TORI"
                }`
          }
          touchableStyle={{ marginLeft: layout.padding_x1 }}
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
