import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";

import { TrackHoverMenu } from "./TrackHoverMenu";
import NormalPlay from "../../../../../assets/music-player/normal-play.svg";
import ThreeDotsCircleWhite from "../../../../../assets/music-player/three-dot-circle-white.svg";
import { BrandText } from "../../../../components/BrandText";
import { OmniLink } from "../../../../components/OmniLink";
import { SVG } from "../../../../components/SVG";
import { CustomPressable } from "../../../../components/buttons/CustomPressable";
import { SpacerColumn } from "../../../../components/spacer";
import { useMediaPlayer } from "../../../../context/MediaPlayerProvider";
import { useNSUserInfo } from "../../../../hooks/useNSUserInfo";
import { useSelectedNetworkId } from "../../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../../hooks/useSelectedWallet";
import { getUserId, parseUserId } from "../../../../networks";
import { ipfsURLToHTTPURL } from "../../../../utils/ipfs";
import { useAppNavigation } from "../../../../utils/navigation";
import {
  neutral17,
  neutral77,
  primaryColor,
} from "../../../../utils/style/colors";
import { fontSemibold14, fontMedium13 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { tinyAddress } from "../../../../utils/text";
import { AlbumInfo } from "../../../../utils/types/mediaPlayer";
import { MyAlbumMenu } from "../MyAlbumMenu";

const imageHeight = 218;
const buttonsHeight = 28;
export const musicPlayerCardWidth = 242;
export const AlbumCard: React.FC<{
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
    : tinyAddress(userAddress, 16);

  const onPressPlayAlbum = async () => {
    await loadAndPlayQueue(album.audios);
  };

  return (
    <View style={unitCardStyle}>
      <View>
        <CustomPressable
          onHoverIn={() => setIsHovered(true)}
          onHoverOut={() => setIsHovered(false)}
          style={imgBoxStyle}
          onPress={() => {
            navigation.navigate("MusicAlbum", { id: album.id });
          }}
        >
          <Image
            source={{ uri: ipfsURLToHTTPURL(album.image) }}
            style={[isHovered && { opacity: 0.5 }, contentImgStyle]}
          />
          <SpacerColumn size={1.5} />

          <View style={imgButtonsBoxStyle}>
            <TouchableOpacity onPress={onPressPlayAlbum}>
              <SVG
                source={NormalPlay}
                width={buttonsHeight}
                height={buttonsHeight}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setOpenMenu((value: boolean) => !value)}
            >
              <SVG
                source={ThreeDotsCircleWhite}
                width={buttonsHeight}
                height={buttonsHeight}
              />
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
        <BrandText style={contentTitleStyle}>{album.name}</BrandText>
        <SpacerColumn size={0.5} />
        <BrandText style={contentDescriptionStyle} numberOfLines={2}>
          {album.description}
        </BrandText>
      </View>
      <OmniLink
        to={{ screen: "UserPublicProfile", params: { id: album.createdBy } }}
      >
        <BrandText style={contentNameStyle}>@{username}</BrandText>
      </OmniLink>
    </View>
  );
};

const unitCardStyle: ViewStyle = {
  width: musicPlayerCardWidth,
  height: 338,
  padding: layout.spacing_x1_5,
  backgroundColor: neutral17,
  borderRadius: 12,
  justifyContent: "space-between",
};
const imgBoxStyle: ViewStyle = {
  position: "relative",
};
const imgButtonsBoxStyle: ViewStyle = {
  position: "absolute",
  paddingHorizontal: layout.spacing_x1_5,
  flexDirection: "row",
  width: "100%",
  top: imageHeight - buttonsHeight - layout.spacing_x1_5,
  right: 0,
  justifyContent: "space-between",
};
const contentTitleStyle: TextStyle = { ...fontSemibold14 };
const contentDescriptionStyle: TextStyle = {
  ...fontMedium13,

  color: neutral77,
};
const contentImgStyle: ImageStyle = {
  width: "100%",
  borderRadius: 8,
  aspectRatio: 1,
  height: imageHeight,
};
const contentNameStyle: TextStyle = {
  ...fontSemibold14,

  color: primaryColor,
};
