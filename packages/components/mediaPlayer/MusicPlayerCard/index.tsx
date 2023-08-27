import React, { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";

import { TrackHoverMenu } from "./TrackHoverMenu";
import HoveredMenu from "../../../../assets/music-player/hovered-menu.svg";
import NormalPlay from "../../../../assets/music-player/normal-play.svg";
import { useMediaPlayer } from "../../../context/MediaPlayerProvider";
import { useNSUserInfo } from "../../../hooks/useNSUserInfo";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { getUserId, parseUserId } from "../../../networks";
import { ipfsURLToHTTPURL } from "../../../utils/ipfs";
import { useAppNavigation } from "../../../utils/navigation";
import {
  neutral17,
  neutral77,
  primaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14, fontMedium14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { tinyAddress } from "../../../utils/text";
import { AlbumInfo } from "../../../utils/types/mediaPlayer";
import { BrandText } from "../../BrandText";
import { OmniLink } from "../../OmniLink";
import { SVG } from "../../SVG";
import { CustomPressable } from "../../buttons/CustomPressable";
import { MyAlbumMenu } from "../MyAlbumMenu";

export const MusicPlayerCard: React.FC<{
  album: AlbumInfo;
  hasLibrary: boolean;
}> = ({ album, hasLibrary }) => {
  const selectedNetworkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();
  const authorNSInfo = useNSUserInfo(album.createdBy);
  const [, userAddress] = parseUserId(album.createdBy);
  const [isHovered, setIsHovered] = useState(false);
  const navigation = useAppNavigation();
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const userId = getUserId(selectedNetworkId, wallet?.address);
  const { loadAndPlayQueue } = useMediaPlayer();
  const username = authorNSInfo?.metadata?.tokenId
    ? authorNSInfo?.metadata?.tokenId
    : tinyAddress(userAddress);

  const onPressPlayAlbum = async () => {
    await loadAndPlayQueue(album.audios);
  };

  return (
    <View style={styles.unitCard}>
      <CustomPressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        style={styles.imgBox}
        onPress={() => {
          navigation.navigate("MusicPlayerAlbum", { id: album.id || "" });
        }}
      >
        <Image
          source={{ uri: ipfsURLToHTTPURL(album.image) }}
          style={[isHovered && { opacity: 0.5 }, styles.contentImg]}
        />

        <View style={styles.imgButtonsBox}>
          <TouchableOpacity onPress={onPressPlayAlbum}>
            <SVG source={NormalPlay} width={28} height={28} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setOpenMenu((value: boolean) => !value)}
          >
            <SVG source={HoveredMenu} width={28} height={28} />
          </TouchableOpacity>

          {openMenu && userId !== album.createdBy && (
            <TrackHoverMenu
              album={album}
              hasLibrary={hasLibrary}
              owner={username}
            />
          )}
          {openMenu && userId === album.createdBy && (
            <MyAlbumMenu album={album} />
          )}
        </View>
      </CustomPressable>
      <BrandText style={styles.contentTitle}>{album.name}</BrandText>
      <BrandText style={styles.contentDescription}>
        {album.description}
      </BrandText>
      <OmniLink
        to={{ screen: "UserPublicProfile", params: { id: album.createdBy } }}
      >
        <BrandText style={styles.contentName}>@{username}</BrandText>
      </OmniLink>
    </View>
  );
};

const styles = StyleSheet.create({
  unitCard: {
    width: 240,
    padding: layout.padding_x1_5,
    backgroundColor: neutral17,
    borderRadius: layout.padding_x1_5,
  },
  imgBox: {
    position: "relative",
  },
  imgButtonsBox: {
    position: "absolute",
    paddingHorizontal: layout.padding_x1_5,
    paddingBottom: layout.padding_x1_5,
    flexDirection: "row",
    width: "100%",
    bottom: 0,
    right: 0,
    justifyContent: "space-between",
  },
  contentTitle: StyleSheet.flatten([
    fontSemibold14,
    {
      marginVertical: layout.padding_x1_5,
    },
  ]),
  contentDescription: StyleSheet.flatten([
    fontMedium14,
    {
      color: neutral77,
    },
  ]),
  contentImg: {
    width: "100%",
    borderRadius: layout.padding_x1,
    aspectRatio: 1,
  },
  contentName: StyleSheet.flatten([
    fontSemibold14,
    {
      color: primaryColor,
      marginTop: layout.padding_x1,
    },
  ]),
});
