import React, { useRef, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";

import { AlbumHoverMenu } from "./AlbumHoverMenu";
import NormalPlay from "../../../../../assets/icons/music-player/normal-play.svg";
import ThreeDotsCircleWhite from "../../../../../assets/icons/music-player/three-dot-circle-white.svg";
import { BrandText } from "../../../../components/BrandText";
import { OmniLink } from "../../../../components/OmniLink";
import { SVG } from "../../../../components/SVG";
import { CustomPressable } from "../../../../components/buttons/CustomPressable";
import { SpacerColumn } from "../../../../components/spacer";
import { useDropdowns } from "../../../../context/DropdownsProvider";
import { useMediaPlayer } from "../../../../context/MediaPlayerProvider";
import { useFetchLibraryIds } from "../../../../hooks/musicplayer/useFetchLibraryIds";
import { useNSUserInfo } from "../../../../hooks/useNSUserInfo";
import { parseUserId } from "../../../../networks";
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

const IMAGE_HEIGHT = 218;
const BUTTONS_HEIGHT = 28;
export const ALBUM_CARD_WIDTH = 242;
export const AlbumCard: React.FC<{
  album: AlbumInfo;
  hideAuthor?: boolean;
}> = ({ album, hideAuthor }) => {
  const authorNSInfo = useNSUserInfo(album.createdBy);
  const [, userAddress] = parseUserId(album.createdBy);
  const [isHovered, setIsHovered] = useState(false);
  const navigation = useAppNavigation();
  const { data: idForLibraryList } = useFetchLibraryIds();
  const isInLibrary =
    idForLibraryList &&
    idForLibraryList.findIndex((item) => item === album.id) !== -1;

  const { onPressDropdownButton, isDropdownOpen } = useDropdowns();
  const albumMenuRef = useRef<View>(null);

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
                width={BUTTONS_HEIGHT}
                height={BUTTONS_HEIGHT}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onPressDropdownButton(albumMenuRef)}
            >
              <SVG
                source={ThreeDotsCircleWhite}
                width={BUTTONS_HEIGHT}
                height={BUTTONS_HEIGHT}
              />
            </TouchableOpacity>

            {isDropdownOpen(albumMenuRef) && (
              <AlbumHoverMenu
                album={album}
                isInLibrary={isInLibrary}
                owner={username}
              />
            )}
          </View>
        </CustomPressable>
        <BrandText style={contentTitleStyle}>{album.name}</BrandText>
        <SpacerColumn size={0.5} />
        <BrandText style={contentDescriptionStyle} numberOfLines={2}>
          {album.description}
        </BrandText>
      </View>
      {!hideAuthor && (
        <>
          <SpacerColumn size={1} />
          <OmniLink
            to={{
              screen: "UserPublicProfile",
              params: { id: album.createdBy },
            }}
          >
            <BrandText style={contentNameStyle}>@{username}</BrandText>
          </OmniLink>
        </>
      )}
    </View>
  );
};

const unitCardStyle: ViewStyle = {
  width: ALBUM_CARD_WIDTH,
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
  top: IMAGE_HEIGHT - BUTTONS_HEIGHT - layout.spacing_x1_5,
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
  height: IMAGE_HEIGHT,
};
const contentNameStyle: TextStyle = {
  ...fontSemibold14,

  color: primaryColor,
};
