import React from "react";
import { View, ViewStyle, TextStyle } from "react-native";

import { HoverView } from "./HoverView";
import Link from "../../../../assets/music-player/link.svg";
import Trash from "../../../../assets/music-player/trash.svg";
import { signingMusicPlayerClient } from "../../../client-creators/musicplayerClient";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import {
  neutralA3,
  neutral33,
  secondaryColor,
  neutral22,
  errorColor,
} from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { AlbumInfo } from "../../../utils/types/mediaPlayer";

interface MyAlbumMenuProps {
  album: AlbumInfo;
}

export const MyAlbumMenu: React.FC<MyAlbumMenuProps> = ({ album }) => {
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

  return (
    <View style={menuContainerStyle}>
      <HoverView
        normalStyle={unitBoxNormalStyle}
        hoverStyle={unitBoxHoveredStyle}
        onPress={deleteMusicAlbum}
      >
        <View style={oneLineStyle}>
          <SVG source={Trash} width={16} height={16} />
          <SpacerRow size={1} />
          <BrandText style={deleteTextStyle}>Delete album</BrandText>
        </View>
      </HoverView>
      <SpacerColumn size={0.75} />

      <View style={divideLineStyle} />
      <SpacerColumn size={0.75} />

      <HoverView
        normalStyle={unitBoxNormalStyle}
        hoverStyle={unitBoxHoveredStyle}
        onPress={copyLinkTrack}
      >
        <View style={oneLineStyle}>
          <SVG source={Link} width={16} height={16} />
          <BrandText style={normalTextStyle}>Copy track's URL</BrandText>
        </View>
      </HoverView>
    </View>
  );
};

const menuContainerStyle: ViewStyle = {
  borderRadius: layout.spacing_x1_5,
  position: "absolute",
  right: layout.spacing_x1_5,
  bottom: 44,
  backgroundColor: neutral22,
  padding: layout.spacing_x1_5,
};
const unitBoxNormalStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  padding: layout.spacing_x0_75,
  borderRadius: layout.spacing_x0_75,
};
const unitBoxHoveredStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  padding: layout.spacing_x0_75,
  backgroundColor: neutral33,
  borderRadius: layout.spacing_x0_75,
};
const oneLineStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};
const normalTextStyle: TextStyle = {
  ...fontSemibold13,
  color: neutralA3,
};
const deleteTextStyle: TextStyle = {
  ...fontSemibold13,
  color: errorColor,
};
const divideLineStyle: ViewStyle = {
  height: 1,
  opacity: 0.12,
  backgroundColor: secondaryColor,
};
