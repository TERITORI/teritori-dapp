import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import addThreadSVG from "../../../assets/icons/social-threads/add-thread.svg";
import chatSVG from "../../../assets/icons/social-threads/chat.svg";
import logoSVG from "../../../assets/logos/logo-hexagon.svg";
import {
  neutral17,
  neutral22,
  neutral77,
  neutralA3,
} from "../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold16,
} from "../../utils/style/fonts";
import { layout, screenContentMaxWidthLarge } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { DotBadge } from "../badges/DotBadge";
import { TertiaryBox } from "../boxes/TertiaryBox";

const socialActionsHeight = 64;

const SocialStat: React.FC<{
  label: string;
  emoji: string;
  style?: StyleProp<ViewStyle>;
}> = ({ label, emoji, style }) => {
  return (
    <View
      style={[
        {
          paddingRight: layout.padding_x1,
          paddingTop: layout.padding_x0_5,
          paddingHorizontal: layout.padding_x0_5,
          height: 28,
          backgroundColor: neutral22,
          borderRadius: 6,
          flexDirection: "row",
          alignItems: "center",
        },
        style,
      ]}
    >
      <BrandText style={[fontSemibold13, { marginRight: layout.padding_x0_5 }]}>
        {emoji}
      </BrandText>
      <BrandText style={fontSemibold13}>{label}</BrandText>
    </View>
  );
};

const SocialActions: React.FC<{
  style?: StyleProp<ViewStyle>;
}> = ({ style }) => {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: 840,
          height: socialActionsHeight,
          backgroundColor: neutral17,
          paddingHorizontal: 14,
          borderRadius: 12,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <SVG
          source={chatSVG}
          height={20}
          width={20}
          style={{ marginRight: layout.padding_x1_5 }}
        />
        <BrandText style={fontSemibold14}>124</BrandText>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <SVG
          source={addThreadSVG}
          height={20}
          width={20}
          style={{ marginRight: layout.padding_x1_5 }}
        />
        <BrandText style={fontSemibold14}>Open the threads</BrandText>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <SocialStat
          label="4,2k"
          emoji="👍"
          style={{ marginRight: layout.padding_x1 }}
        />
        <SocialStat
          label="4,2k"
          emoji="🔥"
          style={{ marginRight: layout.padding_x1 }}
        />
        <SocialStat label="4,2k" emoji="👎" />
      </View>
    </View>
  );
};

export const SocialThreadCard: React.FC<{
  thread: object;
  style?: StyleProp<ViewStyle>;
}> = ({ thread, style }) => {
  const imageWidth = 68;
  const imageMarginRight = layout.padding_x3_5;
  const tertiaryBoxPaddingHorizontal = layout.padding_x3;

  return (
    <TertiaryBox
      fullWidth
      style={style}
      mainContainerStyle={{
        flexDirection: "row",
        paddingTop: layout.padding_x3,
        paddingHorizontal: tertiaryBoxPaddingHorizontal,
        paddingBottom: 52,
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", width: "100%" }}
      >
        {/* ---- Image */}
        <SVG
          height={imageWidth}
          width={imageWidth}
          source={logoSVG}
          style={{ marginRight: imageMarginRight }}
        />

        {/* ---- Texts and badge */}
        <View
          style={{
            width: "100%",
            maxWidth:
              screenContentMaxWidthLarge -
              (imageWidth +
                imageMarginRight +
                tertiaryBoxPaddingHorizontal * 2),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <BrandText style={fontSemibold16}>GNOPUNKS</BrandText>
              <BrandText
                style={[
                  fontSemibold14,
                  {
                    marginLeft: layout.padding_x1_5,
                    color: neutral77,
                  },
                ]}
              >
                @gnopunks.teritori
              </BrandText>
            </View>

            <DotBadge label="Gnolang" />
          </View>

          <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
            {"Hey guys! 🔥\n" +
              "We just launched our own TERITORI ! Welcome on board to all friends & thanks to all amazing ecosystem builders that joined forces from all networks to build this amazing inter-tribes home! So proud to be the first allowed to post this censorship resistant message!\n" +
              "So excited to go forward all together, let’s build together! Feel free to check our Bounty Program in our header! 🔥\n\n" +
              "#first #post #helloworld "}
          </BrandText>

          <View
            style={{
              backgroundColor: neutral22,
              width: "100%",
              height: 1,
              marginVertical: layout.padding_x2_5 / 2,
            }}
          />

          <BrandText style={[fontSemibold13, { color: neutral77 }]}>
            g1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf5
          </BrandText>
        </View>
      </View>

      <SocialActions
        style={{ position: "absolute", bottom: -socialActionsHeight / 2 }}
      />
    </TertiaryBox>
  );
};
