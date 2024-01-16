import React from "react";
import { Image, View, ViewStyle } from "react-native";

import avaPNG from "../../../../assets/default-images/ava.png";
import checkBadgeSVG from "../../../../assets/icons/certified.svg";
import SolanaCircleSVG from "../../../../assets/icons/networks/solana-circle.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { InnerCellText } from "../../../components/applicationTable/InnerCellText";
import { lightblue, neutral00, neutral77 } from "../../../utils/style/colors";
import { fontSemibold15, fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const TooltipContant = () => {
  return (
    <>
      <View style={flexRowCenter}>
        <View>
          <View>
            <BrandText style={[fontSemibold15, { color: neutral77 }]}>
              Collection Name
            </BrandText>
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
          </View>
          <View style={{ marginTop: layout.spacing_x2_5 }}>
            <BrandText style={[fontSemibold15, { color: neutral77 }]}>
              Project Readiness for Mint
            </BrandText>
            <InnerCellText
              style={{
                backgroundColor: lightblue,
                borderRadius: 100,
                paddingHorizontal: 10,
                paddingVertical: 5,
                alignSelf: "flex-start",
                marginTop: layout.spacing_x1_5,
              }}
              textStyle={{ color: neutral00 }}
            >
              Complete and ready to mint
            </InnerCellText>
          </View>
        </View>
        <View>
          <View>
            <BrandText style={[fontSemibold15, { color: neutral77 }]}>
              Collection network
            </BrandText>
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
          </View>
          <View style={{ marginTop: layout.spacing_x2_5 }}>
            <BrandText style={[fontSemibold15, { color: neutral77 }]}>
              Basic marketing package
            </BrandText>
            <InnerCellText
              style={{
                backgroundColor: lightblue,
                borderRadius: 100,
                paddingHorizontal: 10,
                paddingVertical: 5,
                alignSelf: "flex-start",
                marginTop: layout.spacing_x1_5,
              }}
              textStyle={{ color: neutral00 }}
            >
              Yes
            </InnerCellText>
          </View>
        </View>
      </View>
    </>
  );
};

const listToggle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginTop: layout.spacing_x1_5,
};

const flexRowCenter: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
};
