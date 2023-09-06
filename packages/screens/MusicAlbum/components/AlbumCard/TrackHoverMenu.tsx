import React, { useState } from "react";
import { View, ViewStyle, TextStyle } from "react-native";

import AddLibrary from "../../../../../assets/music-player/add-library.svg";
import RemoveLibrary from "../../../../../assets/music-player/remove-library.svg";
import Tip from "../../../../../assets/music-player/tip-other.svg";
import { signingMusicPlayerClient } from "../../../../client-creators/musicplayerClient";
import { BrandText } from "../../../../components/BrandText";
import { useCopyToClipboard } from "../../../../components/CopyToClipboard";
import { SVG } from "../../../../components/SVG";
import { TipModal } from "../../../../components/socialFeed/SocialActions/TipModal";
import { SpacerColumn, SpacerRow } from "../../../../components/spacer";
import { useFeedbacks } from "../../../../context/FeedbacksProvider";
import { useSelectedNetworkId } from "../../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../../hooks/useSelectedWallet";
import {
  neutralA3,
  neutral33,
  secondaryColor,
  neutral22,
} from "../../../../utils/style/colors";
import { fontSemibold13 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { AlbumInfo } from "../../../../utils/types/mediaPlayer";
import { HoverView } from "../HoverView";

interface TrackHoverMenuProps {
  album: AlbumInfo;
  hasLibrary: boolean;
  owner: string;
}

export const TrackHoverMenu: React.FC<TrackHoverMenuProps> = ({
  album,
  hasLibrary,
  owner,
}) => {
  const selectedNetworkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();
  const [tipModalVisible, setTipModalVisible] = useState<boolean>(false);
  const { setToastError, setToastSuccess } = useFeedbacks();
  const { copyToClipboard } = useCopyToClipboard();

  const addToLibrary = async () => {
    if (!wallet?.connected || !wallet.address || !album.id) {
      return;
    }
    const client = await signingMusicPlayerClient({
      networkId: selectedNetworkId,
      walletAddress: wallet.address,
    });
    try {
      const res = await client.addToLibrary({ identifier: album.id });
      if (res.transactionHash) {
        setToastSuccess({
          title: "Add album to my library",
          message: `tx_hash: ${res.transactionHash}`,
        });
      }
    } catch (err) {
      setToastError({
        title: "Failed to add album to my library",
        message: `Error: ${err}`,
      });
    }
  };

  const removeFromLibrary = async () => {
    if (!wallet?.connected || !wallet.address || !album.id) {
      return;
    }
    const client = await signingMusicPlayerClient({
      networkId: selectedNetworkId,
      walletAddress: wallet.address,
    });
    try {
      const res = await client.removeFromLibrary({ identifier: album.id });
      if (res.transactionHash) {
        setToastSuccess({
          title: "remove album from my library",
          message: `tx_hash: ${res.transactionHash}`,
        });
      }
    } catch (err) {
      setToastError({
        title: "Failed to remove album from my library",
        message: `Error: ${err}`,
      });
    }
  };

  const handleTip = () => {
    setTipModalVisible(true);
  };

  return (
    <View style={menuContainerStyle}>
      {wallet && wallet.address !== album.createdBy && !hasLibrary && (
        <>
          <HoverView
            normalStyle={unitBoxNormalStyle}
            hoverStyle={unitBoxHoveredStyle}
            onPress={addToLibrary}
          >
            <View style={oneLineStyle}>
              <SVG source={AddLibrary} width={16} height={16} />
              <SpacerRow size={1} />
              <BrandText style={text}>Add to library</BrandText>
            </View>
          </HoverView>
          <SpacerColumn size={0.75} />
        </>
      )}
      {wallet && wallet.address !== album.createdBy && hasLibrary && (
        <>
          <HoverView
            normalStyle={unitBoxNormalStyle}
            hoverStyle={unitBoxHoveredStyle}
            onPress={removeFromLibrary}
          >
            <View style={oneLineStyle}>
              <SVG source={RemoveLibrary} width={16} height={16} />
              <BrandText style={text}>Remove from library</BrandText>
            </View>
          </HoverView>
          <SpacerColumn size={0.75} />
        </>
      )}
      <View style={divideLineStyle} />
      <SpacerColumn size={0.75} />
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
          <BrandText style={text}>Tip this track</BrandText>
        </View>
      </HoverView>
      <SpacerColumn size={0.75} />
      <View style={divideLineStyle} />
      <SpacerColumn size={0.75} />
      <HoverView
        normalStyle={unitBoxNormalStyle}
        hoverStyle={unitBoxHoveredStyle}
        onPress={() => {
          copyToClipboard(
            `${window.location.origin}/music-player/album/${album.id}`
          );
        }}
      >
        <View style={oneLineStyle}>
          <SVG
            source={Tip}
            width={layout.spacing_x2}
            height={layout.spacing_x2}
          />
          <BrandText style={text}>Copy track's URL</BrandText>
        </View>
      </HoverView>
      <TipModal
        author={owner}
        postId={album.id || ""}
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
const text: TextStyle = {
  ...fontSemibold13,

  color: neutralA3,
};
const divideLineStyle: ViewStyle = {
  height: 1,
  opacity: 0.12,
  backgroundColor: secondaryColor,
};
