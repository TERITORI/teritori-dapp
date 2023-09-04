import React from "react";
import { View, StyleSheet } from "react-native";

import { HoverView } from "./HoverView";
import Link from "../../../../assets/music-player/link.svg";
import { BrandText } from "../../../components/BrandText";
import {
  CopyToClipboard,
  useCopyToClipboard,
} from "../../../components/CopyToClipboard";
import { SVG } from "../../../components/SVG";
import {
  neutralA3,
  neutral33,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

interface DetailAlbumMenuProps {
  id: string;
}
const shareMenuWidth = 188;
const lineHeight = 18;
const buttonHeight = 36;
export const DetailAlbumMenu: React.FC<DetailAlbumMenuProps> = ({ id }) => {
  const { copyToClipboard } = useCopyToClipboard();

  return (
    <View style={styles.menuContainer}>
      <CopyToClipboard
        text={`${window.location.origin}/music-player/album/${id}`}
      >
        <HoverView
          normalStyle={styles.unitBoxNormal}
          hoverStyle={styles.unitBoxHovered}
          onPress={() =>
            copyToClipboard(
              `${window.location.origin}/music-player/album/${id}`
            )
          }
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
      </CopyToClipboard>

      {/* {!mine && (
        <HoverView
          normalStyle={styles.unitBoxNormal}
          hoverStyle={styles.unitBoxHovered}
        >
          <View style={styles.oneLine}>
            <SVG
              source={Flag}
              width={layout.spacing_x2}
              height={layout.spacing_x2}
            />
            <BrandText style={styles.text}>Flag this Album</BrandText>
          </View>
        </HoverView>
      )} */}

      {/* {!mine && <View style={styles.divideLine} />} */}

      {/* <HoverView
        normalStyle={styles.unitBoxNormal}
        onPress={() => setOpenShareMenu((value) => !value)}
        hoverStyle={styles.unitBoxHovered}
      >
        <View style={[styles.oneLine, { paddingRight: mine ? 40 : 0 }]}>
          <SVG
            source={Share}
            width={layout.spacing_x2}
            height={layout.spacing_x2}
          />
          <BrandText style={styles.text}>Share</BrandText>
        </View>
        <SVG
          source={Enter}
          width={layout.spacing_x2}
          height={layout.spacing_x2}
        />

        {openShareMenu && (
          <View style={styles.shareMenuContainer}>
            <HoverView
              normalStyle={styles.unitBoxNormal}
              hoverStyle={styles.unitBoxHovered}
            >
              <View style={styles.oneLine}>
                <SVG
                  source={Link}
                  width={layout.spacing_x2}
                  height={layout.spacing_x2}
                />
                <BrandText style={styles.text}>
                  Copy link to the track
                </BrandText>
              </View>
            </HoverView>
            <HoverView
              normalStyle={styles.unitBoxNormal}
              hoverStyle={styles.unitBoxHovered}
            >
              <View style={styles.oneLine}>
                <SVG
                  source={Code}
                  width={layout.spacing_x2}
                  height={layout.spacing_x2}
                />
                <BrandText style={styles.text}>Copy widget code</BrandText>
              </View>
            </HoverView>
          </View>
        )}
      </HoverView> */}
    </View>
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
