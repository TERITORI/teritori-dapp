import * as Clipboard from "expo-clipboard";
import { useEffect, useState } from "react";
import { View, useWindowDimensions } from "react-native";

import rightArrowSVG from "../../../../assets/icons/arrow-right.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { dangerColor } from "../../../utils/style/colors";
import {
  fontMedium16,
  fontSemibold14,
  fontSemibold15,
  fontSemibold30,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import CustomAppBar from "../../Mini/components/AppBar/CustomAppBar";
import BlurViewWrapper from "../../Mini/components/BlurViewWrapper";
import { CustomButton } from "../../Mini/components/Button/CustomButton";
import { getMnemonic } from "../hooks/useNativeWallet";

export default function NewWalletScreen() {
  const { width } = useWindowDimensions();
  const [phrase, setPhrase] = useState("");
  const [revealSeeds, setRevealSeeds] = useState(false);

  const onCopySeedPhrasesPress = async () => {
    await Clipboard.setStringAsync(JSON.stringify(phrase));
    alert("Copied");
  };

  const onToggleSeedPhrasesPress = async () => {
    setRevealSeeds((prev) => !prev);
  };

  useEffect(() => {
    (async () => {
      const mnemonic = await getMnemonic();
      setPhrase(mnemonic);
    })();
  }, []);

  return (
    <ScreenContainer
      responsive
      fullWidth
      footerChildren={null}
      noScroll
      headerMini={
        <CustomAppBar
          backEnabled
          right={
            <CustomPressable
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => {}}
            >
              <BrandText
                style={[fontSemibold15, { textTransform: "uppercase" }]}
              >
                Skip & Save it later{" "}
              </BrandText>
              <SpacerRow size={0.5} />
              <SVG source={rightArrowSVG} />
            </CustomPressable>
          }
        />
      }
    >
      <View
        style={{
          flex: 1,
          width,
          justifyContent: "space-between",
          paddingHorizontal: layout.spacing_x2,
        }}
      >
        <View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <BrandText style={fontSemibold30}>Seed Phrase</BrandText>

            <SpacerColumn size={1} />
            <BrandText style={[fontMedium16, { color: dangerColor }]}>
              This phrase is the only way to recofer the wallet.
            </BrandText>

            <SpacerColumn size={0.5} />
            <BrandText style={[fontMedium16, { color: dangerColor }]}>
              DO NOT share it with anyone
            </BrandText>
          </View>

          <SpacerColumn size={4} />

          <BlurViewWrapper
            show={revealSeeds}
            wrapperStyle={{
              height: 324,
              width: "100%",
              position: "relative",
            }}
          >
            <View
              style={{
                flex: 1,

                flexDirection: "row",
                flexWrap: "wrap",
                rowGap: 12,
                alignSelf: "flex-end",
              }}
            >
              {phrase.split(" ").map((seed) => (
                <BrandText
                  key={seed}
                  style={[
                    fontSemibold14,
                    { textAlign: "center", width: "25%" },
                  ]}
                >
                  {seed}
                </BrandText>
              ))}
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
          </BlurViewWrapper>
        </View>

        <SpacerColumn size={2} />
        <CustomButton
          onPress={(_, navigation) => navigation.navigate("CreatePassword")}
          title="Next"
        />
      </View>
    </ScreenContainer>
  );
}
