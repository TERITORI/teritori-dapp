import React, { FC } from "react";
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";

import Add from "../../../../assets/icons/music-player/add.svg";
import Remove from "../../../../assets/icons/music-player/remove.svg";
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

  const isInLibrary =
    idForLibraryList &&
    idForLibraryList.findIndex((item) => item === albumInfo.id) !== -1;

  if (userId && userId === albumInfo.createdBy) return null;
  return (
    <View style={containerStyle}>
      <TouchableOpacity
        style={[
          buttonStyle,
          isMobile && {
            padding: layout.spacing_x0_75,
            paddingRight: layout.spacing_x0_75,
          },
        ]}
        onPress={isInLibrary ? removeFromLibrary : addToLibrary}
      >
        <SVG height={20} width={20} source={isInLibrary ? Remove : Add} />
        {!isMobile && (
          <BrandText style={buttonTextStyle}>
            {isInLibrary ? "Remove from library" : "Add to library"}
          </BrandText>
        )}
      </TouchableOpacity>
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
