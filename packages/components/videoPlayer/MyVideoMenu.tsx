import React, { useState } from "react";
import { View, ViewStyle, TextStyle } from "react-native";

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
import { SpacerColumn, SpacerRow } from "../spacer";

interface MyVideoMenuProps {
  videoInfo: VideoInfoWithMeta;
}
const shareMenuWidth = 188;
const lineHeight = 18;
export const MyVideoMenu: React.FC<MyVideoMenuProps> = ({ videoInfo }) => {
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

  return (
    <View style={menuContainerStyle}>
      <HoverView
        normalStyle={unitBoxNormalStyle}
        hoverStyle={unitBoxHoveredStyle}
        onPress={() => {
          deleteMusicAlbum();
        }}
      >
        <View style={oneLineStyle}>
          <SVG
            source={Delete}
            width={layout.spacing_x2}
            height={layout.spacing_x2}
          />
          <SpacerRow size={1} />
          <BrandText style={deleteTextStyle}>Delete album</BrandText>
        </View>
      </HoverView>
      <SpacerColumn size={0.75} />
      <View style={divideLineStyle} />
      <SpacerColumn size={0.75} />
      <HoverView
        normalStyle={unitBoxNormalStyle}
        onPress={() => setOpenShareMenu((value) => !value)}
        hoverStyle={unitBoxHoveredStyle}
      >
        <View style={oneLineStyle}>
          <SVG
            source={Share}
            width={layout.spacing_x2}
            height={layout.spacing_x2}
          />
          <SpacerRow size={1} />
          <BrandText style={normalTextStyle}>Share</BrandText>
        </View>
        <SVG
          source={Enter}
          width={layout.spacing_x2}
          height={layout.spacing_x2}
        />

        {openShareMenu && (
          <View style={shareMenuContainerStyle}>
            <HoverView
              normalStyle={unitBoxNormalStyle}
              hoverStyle={unitBoxHoveredStyle}
            >
              <View style={oneLineStyle}>
                <SVG
                  source={Link}
                  width={layout.spacing_x2}
                  height={layout.spacing_x2}
                />
                <SpacerRow size={1} />
                <BrandText style={normalTextStyle}>
                  Copy link to the track
                </BrandText>
              </View>
            </HoverView>
            <SpacerColumn size={0.75} />
            <HoverView
              normalStyle={unitBoxNormalStyle}
              hoverStyle={unitBoxHoveredStyle}
            >
              <View style={oneLineStyle}>
                <SVG
                  source={Code}
                  width={layout.spacing_x2}
                  height={layout.spacing_x2}
                />
                <SpacerRow size={1} />
                <BrandText style={normalTextStyle}>Copy widget code</BrandText>
              </View>
            </HoverView>
          </View>
        )}
      </HoverView>
    </View>
  );
};

const menuContainerStyle: ViewStyle = {
  borderRadius: layout.spacing_x1_5,
  position: "absolute",
  right: layout.spacing_x1_5,
  bottom: 44,
  backgroundColor: "rgba(41, 41, 41, 1)",
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

  color: "#F46F76",
};
const divideLineStyle: ViewStyle = {
  height: 1,
  opacity: 0.12,
  backgroundColor: secondaryColor,
};
const shareMenuContainerStyle: ViewStyle = {
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
  width: shareMenuWidth,
};
