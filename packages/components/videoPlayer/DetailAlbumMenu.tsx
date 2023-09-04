import React from "react";
import { View, StyleSheet } from "react-native";

import { HoverView } from "./HoverView";
import Link from "../../../assets/player/link.svg";
import { neutralA3, neutral33, secondaryColor } from "../../utils/style/colors";
import { fontSemibold13 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";

interface DetailAlbumMenuProps {
  id: string;
}

export const DetailAlbumMenu: React.FC<DetailAlbumMenuProps> = ({ id }) => {
  const shareMenuWidth = 188;
  const lineHeight = 18;
  const buttonHeight = 36;

  const handleCopyLinkTrack = () => {
    window.navigator.clipboard.writeText(
      `${window.location.origin}/music-player/album/${id}`
    );
  };

  const styles = StyleSheet.create({
    menuContainer: {
      borderRadius: layout.spacing_x1_5,
      position: "absolute",
      right: 0,
      bottom: buttonHeight + layout.spacing_x0_5,
      backgroundColor: "rgba(41, 41, 41, 1)",
      padding: layout.spacing_x1_5,
      flexDirection: "column",
      gap: layout.spacing_x0_75,
      zIndex: 999,
    },
    unitBoxNormal: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: layout.spacing_x0_75,
      borderRadius: layout.spacing_x0_75,
    },
    unitBoxHovered: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: layout.spacing_x0_75,
      backgroundColor: neutral33,
      borderRadius: layout.spacing_x0_75,
    },
    oneLine: {
      flexDirection: "row",
      alignItems: "center",
      gap: layout.spacing_x1,
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
      borderRadius: layout.spacing_x1_5,
      position: "absolute",
      left: -(layout.spacing_x1_5 + shareMenuWidth),
      bottom: -(
        layout.spacing_x1_5 +
        lineHeight +
        layout.spacing_x1_5 +
        1 * layout.spacing_x0_75
      ),
      backgroundColor: "rgba(41, 41, 41, 1)",
      padding: layout.spacing_x1_5,
      flexDirection: "column",
      gap: layout.spacing_x0_75,
      width: shareMenuWidth,
    },
  });

  return (
    <View style={styles.menuContainer}>
      <HoverView
        normalStyle={styles.unitBoxNormal}
        hoverStyle={styles.unitBoxHovered}
        onPress={() => handleCopyLinkTrack()}
      >
        <View style={styles.oneLine}>
          <SVG
            source={Link}
            width={layout.spacing_x2}
            height={layout.spacing_x2}
          />
          <BrandText style={styles.text}>Copy link to the track</BrandText>
        </View>
      </HoverView>
    </View>
  );
};
