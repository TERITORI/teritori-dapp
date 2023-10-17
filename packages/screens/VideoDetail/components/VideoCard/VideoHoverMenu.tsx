import React, { useState } from "react";
import { View, ViewStyle, TextStyle, StyleProp } from "react-native";

import AddLibrary from "../../../../../assets/icons/video-player/add-library.svg";
import Link from "../../../../../assets/icons/video-player/link.svg";
import RemoveLibrary from "../../../../../assets/icons/video-player/remove-library.svg";
import Tip from "../../../../../assets/icons/video-player/tip-other.svg";
import Trash from "../../../../../assets/icons/video-player/trash.svg";
import { signingVideoPlayerClient } from "../../../../client-creators/videoplayerClient";
import { BrandText } from "../../../../components/BrandText";
import { useCopyToClipboard } from "../../../../components/CopyToClipboard";
import { SVG } from "../../../../components/SVG";
import { TipModal } from "../../../../components/socialFeed/SocialActions/TipModal";
import { SpacerColumn, SpacerRow } from "../../../../components/spacer";
import { HoverView } from "../../../../components/videoPlayer/HoverView";
import { useFeedbacks } from "../../../../context/FeedbacksProvider";
import { useSelectedNetworkId } from "../../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../../hooks/useSelectedWallet";
import { getUserId } from "../../../../networks";
import {
  neutralA3,
  neutral33,
  secondaryColor,
  errorColor,
} from "../../../../utils/style/colors";
import { fontSemibold13 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { VideoInfoWithMeta } from "../../../../utils/types/video";

interface Props {
  video: VideoInfoWithMeta;
  owner: string;
  isInLibrary?: boolean;
  isAlbumScreen?: boolean;
  style?: StyleProp<ViewStyle>;
}
export const VideoHoverMenu: React.FC<Props> = ({
  video,
  isInLibrary,
  isAlbumScreen,
  owner,
  style,
}) => {
  const selectedNetworkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const userId = getUserId(selectedNetworkId, selectedWallet?.address);
  const [tipModalVisible, setTipModalVisible] = useState<boolean>(false);
  const { setToastError, setToastSuccess } = useFeedbacks();
  const { copyToClipboard } = useCopyToClipboard();

  const addToLibrary = async () => {
    if (!selectedWallet?.connected || !selectedWallet.address || !video.id) {
      return;
    }
    const client = await signingVideoPlayerClient({
      networkId: selectedNetworkId,
      walletAddress: selectedWallet.address,
    });
    try {
      const res = await client.addToLibrary({
        identifier: video.id,
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
    if (!selectedWallet?.connected || !selectedWallet.address || !video.id) {
      return;
    }
    const client = await signingVideoPlayerClient({
      networkId: selectedNetworkId,
      walletAddress: selectedWallet.address,
    });
    try {
      const res = await client.removeFromLibrary({
        identifier: video.id,
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

  const deleteVideo = async () => {
    if (!selectedWallet?.connected || !selectedWallet.address || !video.id) {
      return;
    }
    const client = await signingVideoPlayerClient({
      networkId: selectedNetworkId,
      walletAddress: selectedWallet.address,
    });
    try {
      const res = await client.deleteVideo({ identifier: video.id });
      if (res.transactionHash) {
        setToastSuccess({
          title: "Delete music",
          message: `tx_hash: ${res.transactionHash}`,
        });
      }
    } catch (err) {
      setToastError({
        title: "Failed to delete music",
        message: `Error: ${err}`,
      });
    }
  };

  const handleTip = () => {
    setTipModalVisible(true);
  };

  return (
    <View style={[menuContainerStyle, style]}>
      {selectedWallet && userId === video.createdBy && (
        <>
          <HoverView
            normalStyle={unitBoxNormalStyle}
            hoverStyle={unitBoxHoveredStyle}
            onPress={deleteVideo}
          >
            <View style={oneLineStyle}>
              <SVG source={Trash} width={16} height={16} />
              <SpacerRow size={1} />
              <BrandText style={deleteTextStyle}>Delete video</BrandText>
            </View>
          </HoverView>
          <SpacerColumn size={0.75} />
          <View style={divideLineStyle} />
          <SpacerColumn size={0.75} />
        </>
      )}
      {selectedWallet &&
        userId !== video.createdBy &&
        isInLibrary &&
        !isAlbumScreen && (
          <>
            <HoverView
              normalStyle={unitBoxNormalStyle}
              hoverStyle={unitBoxHoveredStyle}
              onPress={removeFromLibrary}
            >
              <View style={oneLineStyle}>
                <SVG source={RemoveLibrary} width={16} height={16} />
                <SpacerRow size={1} />
                <BrandText style={textStyle}>Remove from library</BrandText>
              </View>
            </HoverView>
            <SpacerColumn size={0.75} />
            <View style={divideLineStyle} />
            <SpacerColumn size={0.75} />
          </>
        )}
      {selectedWallet &&
        userId !== video.createdBy &&
        !isInLibrary &&
        !isAlbumScreen && (
          <>
            <HoverView
              normalStyle={unitBoxNormalStyle}
              hoverStyle={unitBoxHoveredStyle}
              onPress={addToLibrary}
            >
              <View style={oneLineStyle}>
                <SVG source={AddLibrary} width={16} height={16} />
                <SpacerRow size={1} />
                <BrandText style={textStyle}>Add to library</BrandText>
              </View>
            </HoverView>
            <SpacerColumn size={0.75} />
            <View style={divideLineStyle} />
            <SpacerColumn size={0.75} />
          </>
        )}
      {selectedWallet && userId !== video.createdBy && !isAlbumScreen && (
        <>
          <HoverView
            normalStyle={unitBoxNormalStyle}
            hoverStyle={unitBoxHoveredStyle}
            onPress={handleTip}
          >
            <View style={oneLineStyle}>
              <SVG
                source={Tip}
                width={layout.spacing_x2}
                height={layout.spacing_x2}
              />
              <SpacerRow size={1} />
              <BrandText style={textStyle}>Tip this video</BrandText>
            </View>
          </HoverView>
        </>
      )}
      <HoverView
        normalStyle={unitBoxNormalStyle}
        hoverStyle={unitBoxHoveredStyle}
        onPress={() => {
          copyToClipboard(`${window.location.origin}/video/${video.id}`);
        }}
      >
        <View style={oneLineStyle}>
          <SVG
            source={Link}
            width={layout.spacing_x2}
            height={layout.spacing_x2}
          />
          <SpacerRow size={1} />
          <BrandText style={textStyle}>Copy video's URL</BrandText>
        </View>
      </HoverView>

      <TipModal
        author={owner}
        postId={video.id || ""}
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
const deleteTextStyle: TextStyle = {
  ...fontSemibold13,
  color: errorColor,
};
const divideLineStyle: ViewStyle = {
  height: 1,
  opacity: 0.12,
  backgroundColor: secondaryColor,
};
