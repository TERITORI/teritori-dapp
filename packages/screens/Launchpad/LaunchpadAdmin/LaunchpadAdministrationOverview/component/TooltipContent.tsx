import React from "react";
import { Image, View, ViewStyle } from "react-native";

import avaPNG from "@/assets/default-images/ava.png";
import checkBadgeSVG from "@/assets/icons/certified.svg";
import SolanaCircleSVG from "@/assets/icons/networks/solana-circle.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { StateBadge } from "@/components/badges/StateBadge";
import { neutral77 } from "@/utils/style/colors";
import { fontSemibold12, fontSemibold16 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const TooltipContent = () => {
  return (
    <>
      <View style={flexRowCenter}>
        <View>
          <View>
            <BrandText
              style={[
                fontSemibold12,
                { color: neutral77, marginBottom: layout.spacing_x1 },
              ]}
            >
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

          <View style={{ marginTop: layout.spacing_x1_5 }}>
            <BrandText
              style={[
                fontSemibold12,
                { color: neutral77, marginBottom: layout.spacing_x1 },
              ]}
            >
              Project Readiness for Mint
            </BrandText>
            <StateBadge text="Complete and ready to mint" />
          </View>
        </View>

        <View>
          <View>
            <BrandText
              style={[
                fontSemibold12,
                { color: neutral77, marginBottom: layout.spacing_x1 },
              ]}
            >
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

          <View style={{ marginTop: layout.spacing_x1_5 }}>
            <BrandText
              style={[
                fontSemibold12,
                { color: neutral77, marginBottom: layout.spacing_x1 },
              ]}
            >
              Basic marketing package
            </BrandText>
            <StateBadge text="Yes" />
          </View>
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
