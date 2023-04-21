import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import Enter from "../../../assets/music-player/enter.svg";
import Share from "../../../assets/music-player/share.svg";
import { SVG } from "../SVG";
import { neutralA3, neutral33, secondaryColor } from "../../utils/style/colors";
import { fontSemibold13 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import Code from "../../../assets/music-player/code.svg";
import Link from "../../../assets/music-player/link.svg";
import { HoverView } from "./HoverView";
import Flag from "../../../assets/music-player/flag.svg";


export const DetailAlbumMenu: React.FC<{ mine?: boolean }> = ({ mine = false }) => {

  const shareMenuWidth = 188;
  const lineHeight = 18;
  const buttonHeight = 36;

  const [openShareMenu, setOpenShareMenu] = useState<boolean>(false);

  const styles = StyleSheet.create({
    menuContainer: {
      borderRadius: layout.padding_x1_5,
      position: "absolute",
      right: 0,
      bottom: buttonHeight + layout.padding_x0_5,
      backgroundColor: "rgba(41, 41, 41, 1)",
      padding: layout.padding_x1_5,
      flexDirection: "column",
      gap: layout.padding_x0_75,
      zIndex: 999
    },
    unitBoxNormal: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: layout.padding_x0_75,
      borderRadius: layout.padding_x0_75
    },
    unitBoxHovered: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: layout.padding_x0_75,
      backgroundColor: neutral33,
      borderRadius: layout.padding_x0_75,
    },
    oneLine: {
      flexDirection: "row",
      alignItems: "center",
      gap: layout.padding_x1,
    },
    text: StyleSheet.flatten([
      fontSemibold13,
      {
        color: neutralA3,
      },
    ]),
    divideLine: {
      height: 1,
      opacity: 0.12,
      backgroundColor: secondaryColor,
    },
    shareMenuContainer: {
      borderRadius: layout.padding_x1_5,
      position: "absolute",
      left: -(layout.padding_x1_5 + shareMenuWidth),
      bottom: -(layout.padding_x1_5 + lineHeight + layout.padding_x1_5 + 1 * layout.padding_x0_75),
      backgroundColor: "rgba(41, 41, 41, 1)",
      padding: layout.padding_x1_5,
      flexDirection: "column",
      gap: layout.padding_x0_75,
      width: shareMenuWidth
    }
  });

  return (
    <View style={styles.menuContainer}>

      {!mine && <HoverView normalStyle={styles.unitBoxNormal} hoverStyle={styles.unitBoxHovered}>
        <View style={styles.oneLine}>
          <SVG
            source={Flag}
            width={layout.padding_x2}
            height={layout.padding_x2}
          />
          <BrandText style={styles.text}>Flag this Album</BrandText>
        </View>
      </HoverView>}

      {!mine && <View style={styles.divideLine} />}

      <HoverView normalStyle={styles.unitBoxNormal} onPress={() => setOpenShareMenu((value) => !value)} hoverStyle={styles.unitBoxHovered}>
        <View style={[styles.oneLine, { paddingRight: mine ? 40 : 0 }]}>
          <SVG
            source={Share}
            width={layout.padding_x2}
            height={layout.padding_x2}
          />
          <BrandText style={styles.text}>Share</BrandText>
        </View>
        <SVG
          source={Enter}
          width={layout.padding_x2}
          height={layout.padding_x2}
        />

        {
          openShareMenu &&
          <View style={styles.shareMenuContainer}>
            <HoverView normalStyle={styles.unitBoxNormal} hoverStyle={styles.unitBoxHovered}>
              <View style={styles.oneLine}>
                <SVG
                  source={Link}
                  width={layout.padding_x2}
                  height={layout.padding_x2}
                />
                <BrandText style={styles.text}>Copy link to the track</BrandText>
              </View>
            </HoverView>
            <HoverView normalStyle={styles.unitBoxNormal} hoverStyle={styles.unitBoxHovered}>
              <View style={styles.oneLine}>
                <SVG
                  source={Code}
                  width={layout.padding_x2}
                  height={layout.padding_x2}
                />
                <BrandText style={styles.text}>Copy widget code</BrandText>
              </View>
            </HoverView>
          </View>
        }

      </HoverView>
    </View >
  );
};
