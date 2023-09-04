import React from "react";
import { View, StyleSheet } from "react-native";

import { HoverView } from "./HoverView";
import Delete from "../../../../assets/music-player/delete.svg";
import Link from "../../../../assets/music-player/link.svg";
import { signingMusicPlayerClient } from "../../../client-creators/musicplayerClient";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import {
  neutralA3,
  neutral33,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { AlbumInfo } from "../../../utils/types/mediaPlayer";

interface MyAlbumMenuProps {
  album: AlbumInfo;
}
export const MyAlbumMenu: React.FC<MyAlbumMenuProps> = ({ album }) => {
  const shareMenuWidth = 188;
  const lineHeight = 18;
  const selectedNetworkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();
  const { setToastError, setToastSuccess } = useFeedbacks();

  const deleteMusicAlbum = async () => {
    if (!wallet?.connected || !wallet.address) {
      return;
    }
    const client = await signingMusicPlayerClient({
      networkId: selectedNetworkId,
      walletAddress: wallet.address,
    });
    try {
      const res = await client.deleteMusicAlbum({ identifier: album.id || "" });
      if (res.transactionHash) {
        setToastSuccess({
          title: "Delete album",
          message: `tx_hash: ${res.transactionHash}`,
        });
      }
    } catch (err) {
      setToastError({
        title: "Failed to delete album",
        message: `Error: ${err}`,
      });
    }
  };
  const copyLinkTrack = () => {
    window.navigator.clipboard.writeText(
      `${window.location.origin}/music-player/album/${album.id}`
    );
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
        onPress={deleteMusicAlbum}
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
        hoverStyle={styles.unitBoxHovered}
        onPress={copyLinkTrack}
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
    </View>
  );
};
