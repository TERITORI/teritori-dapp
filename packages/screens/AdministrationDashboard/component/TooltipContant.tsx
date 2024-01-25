import React from "react";
import { Image, View, ViewStyle } from "react-native";

import avaPNG from "../../../../assets/default-images/ava.png";
import checkBadgeSVG from "../../../../assets/icons/certified.svg";
import SolanaCircleSVG from "../../../../assets/icons/networks/solana-circle.svg";
import { BrandText } from "../../../components/BrandText";
import { HeaderContent } from "../../../components/HeaderContent/HeaderContent";
import { SVG } from "../../../components/SVG";
import { InnerCellText } from "../../../components/applicationTable/InnerCellText";
import { lightblue, neutral00 } from "../../../utils/style/colors";
import { fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const TooltipContant = () => {
  return (
    <>
      <View style={flexRowCenter}>
        <View>
          <HeaderContent header="Collection Name">
            <View style={listToggle}>
              <Image
                style={{
                  width: 28,
                  height: 28,
                }}
                source={avaPNG}
              />
              <BrandText
                style={[
                  fontSemibold16,
                  {
                    marginLeft: layout.spacing_x1_5,
                    marginRight: layout.spacing_x1,
                  },
                ]}
              >
                Meebits
              </BrandText>
              <SVG source={checkBadgeSVG} width={18} height={18} />
            </View>
          </HeaderContent>
          <HeaderContent
            style={{ marginTop: layout.spacing_x1_5 }}
            header="Project Readiness for Mint"
          >
            <InnerCellText
              style={{
                backgroundColor: lightblue,
                borderRadius: 100,
                paddingHorizontal: 10,
                paddingVertical: 5,
                alignSelf: "flex-start",
              }}
              textStyle={{ color: neutral00 }}
            >
              Complete and ready to mint
            </InnerCellText>
          </HeaderContent>
        </View>
        <View>
          <HeaderContent header="Collection network">
            <View style={listToggle}>
              <SVG
                width={28}
                height={28}
                source={SolanaCircleSVG}
                color="white"
              />
              <BrandText
                style={[fontSemibold16, { marginLeft: layout.spacing_x1 }]}
              >
                Solana
              </BrandText>
            </View>
          </HeaderContent>
          <HeaderContent
            style={{ marginTop: layout.spacing_x1_5 }}
            header="Basic marketing package"
          >
            <InnerCellText
              style={{
                backgroundColor: lightblue,
                borderRadius: 100,
                paddingHorizontal: 10,
                paddingVertical: 5,
                alignSelf: "flex-start",
              }}
              textStyle={{ color: neutral00 }}
            >
              Yes
            </InnerCellText>
          </HeaderContent>
        </View>
      </View>
    </>
  );
};

const listToggle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};

const flexRowCenter: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
};
