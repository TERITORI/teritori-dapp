import React, { useEffect, useMemo, useState } from "react";
import { Image, StyleSheet } from "react-native";

import defaultEnemyPNG from "../../../../assets/game/default-enemy.png";
import { CurrentSeasonResponse } from "../../../api/p2e/v1/p2e";
import { BrandText } from "../../../components/BrandText";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { p2eBackendClient } from "../../../utils/backend";
import { gameHighlight } from "../../../utils/style/colors";
import { fontMedium24, fontBold9 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { FightProgressBar } from "./FightProgressBar";

export const FightBossSection: React.FC = () => {
  const [currentSeason, setCurrentSeason] = useState<CurrentSeasonResponse>();
  const { setToastError } = useFeedbacks();

  const fetchCurrentSeason = async () => {
    try {
      const currentSeason = await p2eBackendClient.CurrentSeason({});
      setCurrentSeason(currentSeason);
    } catch (e) {
      if (e instanceof Error) {
        return setToastError({ title: "Error", message: e.message });
      }
      throw e;
    }
  };

  const remainingPercentage = useMemo(() => {
    if (!currentSeason?.bossHp) return 100;
    return (
      Math.round((10000 * currentSeason?.remainingHp) / currentSeason?.bossHp) /
      100
    );
  }, [currentSeason?.remainingHp]);

  useEffect(() => {
    fetchCurrentSeason();
  }, []);

  return (
    <TertiaryBox
      noBrokenCorners
      width={380}
      height={310}
      mainContainerStyle={{
        padding: layout.padding_x3,
        borderWidth: 3,
      }}
    >
      <Image style={styles.enemyThumb} source={defaultEnemyPNG} />

      <BrandText style={fontMedium24}>{currentSeason?.bossName}</BrandText>

      <FightProgressBar
        containerStyle={{ marginVertical: layout.padding_x1_5 }}
        width={170}
        height={10}
        value={remainingPercentage}
      />

      <BrandText style={[fontBold9, { color: gameHighlight }]}>
        BEFORE THE END OF THE FIGHT...
      </BrandText>
    </TertiaryBox>
  );
};

const styles = StyleSheet.create({
  enemyThumb: {
    width: 150,
    height: 150,
  },
});
