import React from "react";
import { TouchableOpacity, View, useWindowDimensions } from "react-native";

import { CarousleHero } from "./CarousleHero";
import penSVG from "../../../../assets/icons/pen.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { PrimaryBox } from "../../../components/boxes/PrimaryBox";
import { SecondaryBox } from "../../../components/boxes/SecondaryBox";
import { GradientText } from "../../../components/gradientText";
import { useAppNavigation } from "../../../utils/navigation";
import { neutral17, primaryColor } from "../../../utils/style/colors";
import {
  fontSemibold12,
  fontSemibold13,
  fontSemibold14,
  fontSemibold24,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

const MD_BREAKPOINT = 820;
const LG_BREAKPOINT = 1200;
type Props = { setIsEditHighlighted: (val: boolean) => void };

export const GenesisExplore = ({ setIsEditHighlighted }: Props) => {
  const navigation = useAppNavigation();
  const { width } = useWindowDimensions();
  const isBreakPoint = width >= MD_BREAKPOINT;

  return (
    <View
      style={{
        marginVertical: 32,
        flexDirection: isBreakPoint ? "row" : "column",
        justifyContent: "space-between",
      }}
    >
      <View style={{ width: isBreakPoint ? "15%" : "100%", marginBottom: 16 }}>
        <TouchableOpacity
          onPress={() => setIsEditHighlighted(true)}
          style={{ alignSelf: "flex-start" }}
        >
          <PrimaryBox
            style={{
              paddingRight: layout.spacing_x1_5,
              paddingLeft: layout.spacing_x1,
              paddingVertical: layout.spacing_x1,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <View style={{ marginBottom: layout.spacing_x0_5 }}>
              <SVG width={20} height={20} source={penSVG} color="white" />
            </View>
            <BrandText style={[fontSemibold12, { marginLeft: 5 }]}>
              Edit Hero
            </BrandText>
          </PrimaryBox>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: isBreakPoint ? "row" : "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={[isBreakPoint ? { flex: 1.5 } : { marginVertical: 16 }]}>
          <BrandText style={fontSemibold24}>Genesis Guardians</BrandText>
          <GradientText
            gradientType="blueExtended"
            style={[fontSemibold14, { marginTop: 10 }]}
          >
            EXCLUSIVE GENESIS TERITORI COLLECTION
          </GradientText>
          <TouchableOpacity
            onPress={() => navigation.navigate("AllProjectAdministrationDash")}
          >
            <SecondaryBox
              style={{
                alignSelf: "flex-start",
                borderRadius: 6,
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
                backgroundColor: primaryColor,
                marginTop: 24,
              }}
            >
              <BrandText style={[fontSemibold13, { color: neutral17 }]}>
                Explore collection
              </BrandText>
            </SecondaryBox>
          </TouchableOpacity>
        </View>
        <CarousleHero />
        {width >= LG_BREAKPOINT && <View style={{ flex: 1 }} />}
      </View>
    </View>
  );
};
