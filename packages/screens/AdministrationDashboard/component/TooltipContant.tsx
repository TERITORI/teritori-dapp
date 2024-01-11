import React from "react";
import { Image, View, ViewStyle } from "react-native";

import avaPNG from "../../../../assets/default-images/ava.png";
import checkBadgeSVG from "../../../../assets/icons/check-badge.svg";
import SolanaCircleSVG from "../../../../assets/icons/networks/solana-circle.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { neutral77 } from "../../../utils/style/colors";
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
              <SVG source={checkBadgeSVG} />
            </View>
          </View>
          <View style={{ marginTop: layout.spacing_x2_5 }}>
            <BrandText style={[fontSemibold15, { color: neutral77 }]}>
              Project Readiness for Mint
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
              <SVG source={checkBadgeSVG} />
            </View>
          </View>
        </View>
        <View>
          <View>
            <BrandText style={[fontSemibold15, { color: neutral77 }]}>
              Basic marketing package
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
