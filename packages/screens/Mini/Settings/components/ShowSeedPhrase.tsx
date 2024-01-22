import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import { View } from "react-native";

import { RedAlert } from "./RedAlert";
import { BrandText } from "../../../../components/BrandText";
import { SpacerColumn } from "../../../../components/spacer";
import { fontSemibold14 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import BlurViewWrapper from "../../components/BlurViewWrapper";
import { CustomButton } from "../../components/Button/CustomButton";

const SEEDS = [
  "tiger",
  "current",
  "very",
  "power",
  "light",
  "choose",
  "store",
  "cover",
  "paint",
  "speed",
  "first",
  "snow",
];

export const ShowSeedPhrase = () => {
  const [revealSeeds, setRevealSeeds] = useState(false);

  const onCopySeedPhrasesPress = async () => {
    await Clipboard.setStringAsync(JSON.stringify(SEEDS));
    alert("Copied");
  };

  const onToggleSeedPhrasesPress = async () => {
    setRevealSeeds((prev) => !prev);
  };

  return (
    <View
      style={{
        paddingHorizontal: layout.spacing_x2,
        position: "relative",
        justifyContent: "space-between",
        flex: 1,
      }}
    >
      <View>
        <SpacerColumn size={2} />
        <RedAlert description="Your seed phrase is the only way to recover your wallet. Keep it somewhere safe and secret." />
        <SpacerColumn size={1.5} />

        <BlurViewWrapper
          show={revealSeeds}
          wrapperStyle={{ flexDirection: "row", rowGap: 12, flexWrap: "wrap" }}
        >
          {Array.isArray(SEEDS) &&
            SEEDS.map((seed) => (
              <BrandText
                key={seed}
                style={[fontSemibold14, { textAlign: "center", width: "25%" }]}
              >
                {seed}
              </BrandText>
            ))}
        </BlurViewWrapper>

        <SpacerColumn size={1.5} />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: layout.spacing_x2,
          }}
        >
          <CustomButton
            title={revealSeeds ? "Hide" : "View"}
            onPress={onToggleSeedPhrasesPress}
            type="gray"
            size="small"
            width={75}
          />
          <CustomButton
            title="Copy"
            onPress={onCopySeedPhrasesPress}
            type="gray"
            size="small"
            width={75}
          />
        </View>
      </View>
    </View>
  );
};
