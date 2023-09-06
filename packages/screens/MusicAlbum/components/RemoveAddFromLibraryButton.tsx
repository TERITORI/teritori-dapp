import React, { FC } from "react";
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";

import Add from "../../../../assets/music-player/add.svg";
import Remove from "../../../../assets/music-player/remove.svg";
import { signingMusicPlayerClient } from "../../../client-creators/musicplayerClient";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useFetchLibraryIds } from "../../../hooks/musicplayer/useFetchLibraryIds";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { getUserId } from "../../../networks";
import { neutral30, primaryColor } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { AlbumInfo } from "../../../utils/types/mediaPlayer";

export const RemoveAddFromLibraryButton: FC<{
  albumInfo: AlbumInfo;
}> = ({ albumInfo }) => {
  const selectedNetworkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();
  const userId = getUserId(selectedNetworkId, wallet?.address);
  const { data: idForLibraryList } = useFetchLibraryIds();
  const { setToastError, setToastSuccess } = useFeedbacks();
  const isMobile = useIsMobile();

  const addToLibrary = async () => {
    if (!wallet?.connected || !wallet.address) {
      return;
    }
    const client = await signingMusicPlayerClient({
      networkId: selectedNetworkId,
      walletAddress: wallet.address,
    });
    try {
      const res = await client.addToLibrary({ identifier: albumInfo.id });
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
    if (!wallet?.connected || !wallet.address) {
      return;
    }
    const client = await signingMusicPlayerClient({
      networkId: selectedNetworkId,
      walletAddress: wallet.address,
    });
    try {
      const res = await client.removeFromLibrary({ identifier: albumInfo.id });
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

  return (
    <View style={containerStyle}>
      {userId &&
        userId !== albumInfo.createdBy &&
        idForLibraryList &&
        idForLibraryList.findIndex((item) => item === albumInfo.id) !== -1 && (
          <TouchableOpacity
            style={[
              buttonStyle,
              isMobile && { paddingRight: layout.spacing_x1 },
            ]}
            onPress={removeFromLibrary}
          >
            <SVG height={20} width={20} source={Remove} />
            {!isMobile && (
              <BrandText style={buttonTextStyle}>Remove from library</BrandText>
            )}
          </TouchableOpacity>
        )}
      {userId &&
        userId !== albumInfo.createdBy &&
        idForLibraryList &&
        idForLibraryList.findIndex((item) => item === albumInfo.id) === -1 && (
          <TouchableOpacity
            style={[
              buttonStyle,
              isMobile && { paddingRight: layout.spacing_x1 },
            ]}
            onPress={addToLibrary}
          >
            <SVG height={20} width={20} source={Add} />
            {!isMobile && (
              <BrandText style={buttonTextStyle}>Add to library</BrandText>
            )}
          </TouchableOpacity>
        )}
    </View>
  );
};
const containerStyle: ViewStyle = {
  flexDirection: "row",
  flex: 1,
  justifyContent: "flex-end",
};
const buttonStyle: ViewStyle = {
  padding: layout.spacing_x1,
  paddingRight: layout.spacing_x1_5,
  flexDirection: "row",
  alignItems: "center",
  borderRadius: layout.spacing_x1,
  backgroundColor: neutral30,
};
const buttonTextStyle: TextStyle = {
  ...fontSemibold14,
  color: primaryColor,
  marginLeft: layout.spacing_x1,
};
