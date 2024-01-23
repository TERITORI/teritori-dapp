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
import useFetch from "../hooks/useFetch";
import { getMnemonic } from "../hooks/useNativeWallet";

export default function NewWalletScreen() {
  const { width } = useWindowDimensions();
  const phrase = useFetch<string>(getMnemonic);

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
          <SpacerColumn size={1} />
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <BrandText style={fontSemibold30}>Seed Phrase</BrandText>

            <SpacerColumn size={1} />
            <BrandText style={[fontMedium16, { color: dangerColor }]}>
              This phrase is the only way to recover the wallet.
            </BrandText>

            <SpacerColumn size={0.5} />
            <BrandText style={[fontMedium16, { color: dangerColor }]}>
              DO NOT share it with anyone
            </BrandText>
          </View>

          <SpacerColumn size={4} />

          <BlurViewWrapper
            hideButton
            copy={phrase}
            wrapperStyle={{
              height: 324,
              width: "100%",
              position: "relative",
              flexDirection: "row",
              flexWrap: "wrap",
              rowGap: 12,
            }}
            blurContainerStyle={{ justifyContent: "flex-end" }}
          >
            {phrase?.split(" ").map((seed) => (
              <BrandText
                key={seed}
                style={[fontSemibold14, { textAlign: "center", width: "25%" }]}
              >
                {seed}
              </BrandText>
            ))}
          </BlurViewWrapper>
        </View>

        <SpacerColumn size={2} />
        <CustomButton
          onPress={(_, navigation) => navigation.navigate("CreatePassword")}
          textStyle={{ textTransform: "uppercase" }}
          title="Next"
        />
      </View>
    </ScreenContainer>
  );
}
