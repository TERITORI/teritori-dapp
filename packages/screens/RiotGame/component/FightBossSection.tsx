import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Image, ImageBackground, StyleSheet } from "react-native";

import { FightProgressBar } from "./FightProgressBar";
import brokenBoxPNG from "../../../../assets/game/broken-box.png";
import { CurrentSeasonResponse } from "../../../api/p2e/v1/p2e";
import { BrandText } from "../../../components/BrandText";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import { mustGetP2eClient } from "../../../utils/backend";
import { gameHighlight } from "../../../utils/style/colors";
import { fontMedium24, fontBold9 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const FightBossSection: React.FC = () => {
  const [currentSeason, setCurrentSeason] = useState<CurrentSeasonResponse>();
  const { setToastError } = useFeedbacks();
  const networkId = useSelectedNetworkId();

  const fetchCurrentSeason = useCallback(async () => {
    try {
      const p2eClient = mustGetP2eClient(networkId);
      const currentSeason = await p2eClient.CurrentSeason({});
      setCurrentSeason(currentSeason);
    } catch (e) {
      if (e instanceof Error) {
        return setToastError({ title: "Error", message: e.message });
      }
      throw e;
    }
  }, [networkId, setToastError]);

  const remainingPercentage = useMemo(() => {
    if (!currentSeason?.bossHp) return 100;

    return (
      Math.round((10000 * currentSeason.remainingHp) / currentSeason.bossHp) /
      100
    );
  }, [currentSeason?.bossHp, currentSeason?.remainingHp]);

  useEffect(() => {
    fetchCurrentSeason();
  }, [fetchCurrentSeason]);

  return (
    <ImageBackground
      source={brokenBoxPNG}
      resizeMode="stretch"
      style={{
        width: 360,
        height: 300,
        justifyContent: "center",
        alignItems: "center",
        marginTop: layout.spacing_x4,
      }}
    >
      <Image
        style={styles.enemyThumb}
        source={{ uri: currentSeason?.bossImage }}
      />

      <BrandText style={fontMedium24}>{currentSeason?.bossName}</BrandText>

      <FightProgressBar
        containerStyle={{ marginVertical: layout.spacing_x1_5 }}
        width={170}
        height={10}
        value={remainingPercentage}
      />

      <BrandText style={[fontBold9, { color: gameHighlight }]}>
        BEFORE THE END OF THE FIGHT...
      </BrandText>
    </ImageBackground>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  enemyThumb: {
    width: 150,
    height: 150,
  },
});
