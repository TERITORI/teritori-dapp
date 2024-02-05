import React from "react";
import { TouchableOpacity, View, useWindowDimensions } from "react-native";

import { CarouselHero } from "./CarouselHero";
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
        marginVertical: layout.spacing_x4,
        flexDirection: isBreakPoint ? "row" : "column",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          width: isBreakPoint ? "15%" : "100%",
          marginBottom: layout.spacing_x2,
        }}
      >
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
            <BrandText
              style={[fontSemibold12, { marginLeft: layout.spacing_x0_75 }]}
            >
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
        <View
          style={[
            isBreakPoint ? { flex: 2 } : { marginVertical: layout.spacing_x2 },
          ]}
        >
          <BrandText style={fontSemibold24}>Genesis Guardians</BrandText>
          <GradientText
            gradientType="blueExtended"
            style={[fontSemibold14, { marginTop: layout.spacing_x1_5 }]}
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
                padding: layout.spacing_x2,
                backgroundColor: primaryColor,
                marginTop: layout.spacing_x3,
              }}
            >
              <BrandText style={[fontSemibold13, { color: neutral17 }]}>
                Explore collection
              </BrandText>
            </SecondaryBox>
          </TouchableOpacity>
        </View>
        <CarouselHero />
        {width >= LG_BREAKPOINT && <View style={{ flex: 1 }} />}
      </View>
    </View>
  );
};
