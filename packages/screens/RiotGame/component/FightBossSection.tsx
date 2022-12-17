import React from "react";
import { Image, StyleSheet } from "react-native";

import defaultEnemyPNG from "../../../../assets/game/default-enemy.png";
import { BrandText } from "../../../components/BrandText";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { gameHighlight } from "../../../utils/style/colors";
import { fontMedium24, fontBold9 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { FightProgressBar } from "../component/FightProgressBar";

type FightBossSectionProps = {
  remainingPercentage: number;
};

export const FightBossSection: React.FC<FightBossSectionProps> = ({
  remainingPercentage,
}) => {
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

      <BrandText style={fontMedium24}>Philipp Rustov</BrandText>

      <FightProgressBar
        containerStyle={{ marginVertical: layout.padding_x1_5 }}
        width={170}
        height={10}
        value={100 - remainingPercentage}
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
