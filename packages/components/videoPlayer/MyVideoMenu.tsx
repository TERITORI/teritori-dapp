import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import { HoverView } from "./HoverView";
import Code from "../../../assets/icons/player/code.svg";
import Delete from "../../../assets/icons/player/delete.svg";
import Enter from "../../../assets/icons/player/enter.svg";
import Link from "../../../assets/icons/player/link.svg";
import Share from "../../../assets/icons/player/share.svg";
import { signingVideoPlayerClient } from "../../client-creators/videoplayerClient";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { neutralA3, neutral33, secondaryColor } from "../../utils/style/colors";
import { fontSemibold13 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { VideoInfoWithMeta } from "../../utils/types/video";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";

interface MyVideoMenuProps {
  videoInfo: VideoInfoWithMeta;
}
export const MyVideoMenu: React.FC<MyVideoMenuProps> = ({ videoInfo }) => {
  const shareMenuWidth = 188;
  const lineHeight = 18;
  const selectedNetworkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();
  const [openShareMenu, setOpenShareMenu] = useState<boolean>(false);
  const { setToastError, setToastSuccess } = useFeedbacks();

  const deleteMusicAlbum = async () => {
    if (!wallet?.connected || !wallet.address) {
      return;
    }
    const client = await signingVideoPlayerClient({
      networkId: selectedNetworkId,
      walletAddress: wallet.address,
    });
    try {
      const res = await client.deleteVideo({
        identifier: videoInfo.identifier,
      });
      if (res.transactionHash) {
        setToastSuccess({
          title: "Delete video",
          message: `tx_hash: ${res.transactionHash}`,
        });
      }
    } catch (err) {
      setToastError({
        title: "Failed to delete video",
        message: `Error: ${err}`,
      });
    }
  };
  const styles = StyleSheet.create({
    hoverBox: {
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      padding: layout.spacing_x1_5,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      zIndex: 999,
    },
    menuContainer: {
      borderRadius: layout.spacing_x1_5,
      position: "absolute",
      right: layout.spacing_x1_5,
      bottom: 44,
      backgroundColor: "rgba(41, 41, 41, 1)",
      padding: layout.spacing_x1_5,
      flexDirection: "column",
      gap: layout.spacing_x0_75,
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
    normalText: StyleSheet.flatten([
      fontSemibold13,
      {
        color: neutralA3,
      },
    ]),
    deleteText: StyleSheet.flatten([
      fontSemibold13,
      {
        color: "#F46F76",
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
        2 * layout.spacing_x0_75
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
        onPress={() => {
          deleteMusicAlbum();
        }}
      >
        <View style={styles.oneLine}>
          <SVG
            source={Delete}
            width={layout.spacing_x2}
            height={layout.spacing_x2}
          />
          <BrandText style={styles.deleteText}>Delete album</BrandText>
        </View>
      </HoverView>

      <View style={styles.divideLine} />

      <HoverView
        normalStyle={styles.unitBoxNormal}
        onPress={() => setOpenShareMenu((value) => !value)}
        hoverStyle={styles.unitBoxHovered}
      >
        <View style={styles.oneLine}>
          <SVG
            source={Share}
            width={layout.spacing_x2}
            height={layout.spacing_x2}
          />
          <BrandText style={styles.normalText}>Share</BrandText>
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
                <BrandText style={styles.normalText}>
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
                <BrandText style={styles.normalText}>
                  Copy widget code
                </BrandText>
              </View>
            </HoverView>
          </View>
        )}
      </HoverView>
    </View>
  );
};
