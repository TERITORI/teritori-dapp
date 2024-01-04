import React from "react";
import {
  Image,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import guardianPng from "../../../../assets/default-images/guardian_1.png";
import penSVG from "../../../../assets/icons/pen.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { Box } from "../../../components/boxes/Box";
import { GradientText } from "../../../components/gradientText";
import { useAppNavigation } from "../../../utils/navigation";
import {
  gradientColorBlue,
  gradientColorPurple,
  neutral17,
  primaryColor,
} from "../../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold24,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

const MD_BREAKPOINT = 820;

type Props = {
  setIsEditHighlighted: (val: boolean) => void;
};

export const GenesisExplore = ({ setIsEditHighlighted }: Props) => {
  const navigation = useAppNavigation();
  const { width } = useWindowDimensions();

  return (
    <View
      style={{
        marginVertical: 32,
        flexDirection: width >= MD_BREAKPOINT ? "row" : "column",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={() => setIsEditHighlighted(true)}
          style={{ alignSelf: "flex-start" }}
        >
          <Box
            borderGradient={{
              colors: [gradientColorBlue, gradientColorPurple],
            }}
            style={{
              borderWidth: 1,
              padding: 16,
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <SVG width={20} height={20} source={penSVG} color="white" />
              <BrandText style={[fontSemibold13, { marginLeft: 5 }]}>
                Edit Hero
              </BrandText>
            </View>
          </Box>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 5,
          flexDirection: width >= MD_BREAKPOINT ? "row" : "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1 }}>
          <BrandText style={fontSemibold24}>Genesis Guardians</BrandText>
          <GradientText
            gradientType="blueExtended"
            style={[
              fontSemibold14,
              {
                marginTop: 10,
              },
            ]}
          >
            EXCLUSIVE GENESIS TERITORI COLLECTION
          </GradientText>
          <TouchableOpacity
            onPress={() => navigation.navigate("AllProjectAdministrationDash")}
          >
            <Box
              notched
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
            </Box>
          </TouchableOpacity>
        </View>
        <View style={{ marginRight: layout.spacing_x4, flex: 2 }}>
          <Image
            style={{
              width: 524,
              height: 524,
              borderRadius: 12,
            }}
            source={guardianPng}
          />
        </View>
      </View>
    </View>
  );
};
