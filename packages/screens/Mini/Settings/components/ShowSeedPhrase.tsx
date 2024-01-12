import { BlurView } from "expo-blur";
import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import { View } from "react-native";

import { RedAlert } from "./RedAlert";
import eyeClosedSVG from "../../../../../assets/icons/eye-closed.svg";
import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { SpacerColumn } from "../../../../components/spacer";
import { neutral09 } from "../../../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { CustomButton } from "../../components/CustomButton";

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
        marginTop: layout.spacing_x4,
        paddingHorizontal: layout.spacing_x2,
        position: "relative",
        justifyContent: "space-between",
      }}
    >
      <View>
        <RedAlert description="Your seed phrase is the only way to recover your wallet. Keep it somewhere safe and secret." />
        <SpacerColumn size={1.5} />
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            rowGap: 12,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: layout.borderRadius,
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.20)",
            paddingHorizontal: layout.spacing_x5,
            paddingVertical: layout.spacing_x4,
            position: "relative",
            marginBottom: layout.spacing_x1_5,
            backgroundColor: neutral09,
          }}
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
          {!revealSeeds && (
            <BlurView
              intensity={20}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: layout.borderRadius,
              }}
            >
              <SVG
                source={eyeClosedSVG}
                height={20}
                width={20}
                style={{ marginBottom: layout.spacing_x1_5 }}
              />
              <BrandText style={[fontSemibold13, {}]}>
                Make sure no one is watching your screen
              </BrandText>
            </BlurView>
          )}
        </View>
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
