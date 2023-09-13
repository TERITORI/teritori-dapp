import React, { useState } from "react";
import { View, ViewStyle, TextStyle } from "react-native";

import { HoverView } from "./HoverView";
import AddLibrary from "../../../assets/icons/player/add-library.svg";
import Tip from "../../../assets/icons/player/tip-other.svg";
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
import { TipModal } from "../socialFeed/SocialActions/TipModal";
import { SpacerColumn, SpacerRow } from "../spacer";

interface TrackHoverMenuProps {
  videoInfo: VideoInfoWithMeta;
  hasLibrary: boolean;
  userName: string;
}
export const TrackHoverMenu: React.FC<TrackHoverMenuProps> = ({
  videoInfo,
  hasLibrary,
  userName,
}) => {
  const selectedNetworkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();

  const [tipModalVisible, setTipModalVisible] = useState<boolean>(false);
  const { setToastError, setToastSuccess } = useFeedbacks();

  const addToLibrary = async () => {
    if (!wallet?.connected || !wallet.address) {
      return;
    }
    const client = await signingVideoPlayerClient({
      networkId: selectedNetworkId,
      walletAddress: wallet.address,
    });
    try {
      const res = await client.addToLibrary({
        identifier: videoInfo.identifier,
      });
      if (res.transactionHash) {
        setToastSuccess({
          title: "Add video to my library",
          message: `tx_hash: ${res.transactionHash}`,
        });
      }
    } catch (err) {
      setToastError({
        title: "Failed to add video to my library",
        message: `Error: ${err}`,
      });
    }
  };

  const removeFromLibrary = async () => {
    if (!wallet?.connected || !wallet.address) {
      return;
    }
    const client = await signingVideoPlayerClient({
      networkId: selectedNetworkId,
      walletAddress: wallet.address,
    });
    try {
      const res = await client.removeFromLibrary({
        identifier: videoInfo.identifier,
      });
      if (res.transactionHash) {
        setToastSuccess({
          title: "remove video from my library",
          message: `tx_hash: ${res.transactionHash}`,
        });
      }
    } catch (err) {
      setToastError({
        title: "Failed to remove video from my library",
        message: `Error: ${err}`,
      });
    }
  };

  const copyLinkTrack = () => {
    window.navigator.clipboard.writeText(
      `${window.location.origin}/video-player/show/${videoInfo.identifier}`
    );
  };
  const handleTip = () => {
    setTipModalVisible(true);
  };

  return (
    <View style={menuContainerStyle}>
      {wallet && wallet.address !== videoInfo.createdBy && !hasLibrary && (
        <HoverView
          normalStyle={unitBoxNormalStyle}
          hoverStyle={unitBoxHoveredStyle}
          onPress={() => {
            addToLibrary();
          }}
        >
          <View style={oneLineStyle}>
            <SVG
              source={AddLibrary}
              width={layout.spacing_x2}
              height={layout.spacing_x2}
            />
            <SpacerRow size={1} />
            <BrandText style={textStyle}>Add to library</BrandText>
          </View>
        </HoverView>
      )}
      {wallet && wallet.address !== videoInfo.createdBy && hasLibrary && (
        <HoverView
          normalStyle={unitBoxNormalStyle}
          hoverStyle={unitBoxHoveredStyle}
          onPress={() => {
            removeFromLibrary();
          }}
        >
          <View style={oneLineStyle}>
            <SVG
              source={AddLibrary}
              width={layout.spacing_x2}
              height={layout.spacing_x2}
            />
            <SpacerRow size={1} />
            <BrandText style={textStyle}>Remove From library</BrandText>
          </View>
        </HoverView>
      )}
      <SpacerColumn size={0.75} />
      <View style={divideLineStyle} />
      <SpacerColumn size={0.75} />
      <HoverView
        normalStyle={unitBoxNormalStyle}
        hoverStyle={unitBoxHoveredStyle}
        onPress={() => {
          handleTip();
        }}
      >
        <View style={oneLineStyle}>
          <SVG
            source={Tip}
            width={layout.spacing_x2}
            height={layout.spacing_x2}
          />
          <SpacerRow size={1} />
          <BrandText style={textStyle}>Tip this track</BrandText>
        </View>
      </HoverView>
      <SpacerColumn size={0.75} />
      <View style={divideLineStyle} />
      <SpacerColumn size={0.75} />
      <HoverView
        normalStyle={unitBoxNormalStyle}
        hoverStyle={unitBoxHoveredStyle}
        onPress={() => {
          copyLinkTrack();
        }}
      >
        <View style={oneLineStyle}>
          <SVG
            source={Tip}
            width={layout.spacing_x2}
            height={layout.spacing_x2}
          />
          <SpacerRow size={1} />
          <BrandText style={textStyle}>Copy link to the track</BrandText>
        </View>
      </HoverView>
      <TipModal
        author={userName}
        postId={videoInfo.identifier}
        onClose={() => setTipModalVisible(false)}
        isVisible={tipModalVisible}
      />
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
const textStyle: TextStyle = {
  ...fontSemibold13,
  color: neutralA3,
};
const divideLineStyle: ViewStyle = {
  height: 1,
  opacity: 0.12,
  backgroundColor: secondaryColor,
};
