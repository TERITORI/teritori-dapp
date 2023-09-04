import React, { useState } from "react";
import { View, ViewStyle, TextStyle, StyleProp } from "react-native";

import AddLibrary from "../../../../../assets/icons/music-player/add-library.svg";
import Link from "../../../../../assets/icons/music-player/link.svg";
import RemoveLibrary from "../../../../../assets/icons/music-player/remove-library.svg";
import Tip from "../../../../../assets/icons/music-player/tip-other.svg";
import Trash from "../../../../../assets/icons/music-player/trash.svg";
import { signingMusicPlayerClient } from "../../../../client-creators/musicplayerClient";
import { BrandText } from "../../../../components/BrandText";
import { useCopyToClipboard } from "../../../../components/CopyToClipboard";
import { SVG } from "../../../../components/SVG";
import { TipModal } from "../../../../components/socialFeed/SocialActions/TipModal";
import { SpacerColumn, SpacerRow } from "../../../../components/spacer";
import { useFeedbacks } from "../../../../context/FeedbacksProvider";
import { useSelectedNetworkId } from "../../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../../hooks/useSelectedWallet";
import { getUserId } from "../../../../networks";
import {
  neutralA3,
  neutral33,
  secondaryColor,
  neutral22,
  errorColor,
} from "../../../../utils/style/colors";
import { fontSemibold13 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { AlbumInfo } from "../../../../utils/types/mediaPlayer";
import { HoverView } from "../HoverView";

interface TrackHoverMenuProps {
  album: AlbumInfo;
  owner: string;
  isInLibrary?: boolean;
  isAlbumScreen?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const AlbumHoverMenu: React.FC<TrackHoverMenuProps> = ({
  album,
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
    if (!selectedWallet?.connected || !selectedWallet.address || !album.id) {
      return;
    }
    const client = await signingMusicPlayerClient({
      networkId: selectedNetworkId,
      walletAddress: selectedWallet.address,
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
    if (!selectedWallet?.connected || !selectedWallet.address || !album.id) {
      return;
    }
    const client = await signingMusicPlayerClient({
      networkId: selectedNetworkId,
      walletAddress: selectedWallet.address,
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

  const deleteMusicAlbum = async () => {
    if (!selectedWallet?.connected || !selectedWallet.address) {
      return;
    }
    const client = await signingMusicPlayerClient({
      networkId: selectedNetworkId,
      walletAddress: selectedWallet.address,
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

  const handleTip = () => {
    setTipModalVisible(true);
  };

  return (
    <View style={[menuContainerStyle, style]}>
      {selectedWallet && userId === album.createdBy && (
        <>
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
        </>
      )}
      {selectedWallet &&
        userId !== album.createdBy &&
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
        userId !== album.createdBy &&
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
      {selectedWallet && userId !== album.createdBy && !isAlbumScreen && (
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
              <BrandText style={textStyle}>Tip this album</BrandText>
            </View>
          </HoverView>
        </>
      )}
      <HoverView
        normalStyle={unitBoxNormalStyle}
        hoverStyle={unitBoxHoveredStyle}
        onPress={() => {
          copyToClipboard(`${window.location.origin}/music/album/${album.id}`);
        }}
      >
        <View style={oneLineStyle}>
          <SVG
            source={Link}
            width={layout.spacing_x2}
            height={layout.spacing_x2}
          />
          <SpacerRow size={1} />
          <BrandText style={textStyle}>Copy album's URL</BrandText>
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
  // width: 170,
  borderRadius: layout.spacing_x1_5,
  position: "absolute",
  right: layout.spacing_x1_5,
  bottom: 44,
  backgroundColor: neutral22,
  padding: layout.spacing_x0_75,
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
  marginHorizontal: layout.spacing_x0_75,
};
