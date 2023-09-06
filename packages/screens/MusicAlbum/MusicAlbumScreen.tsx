import React, { useState, useEffect, FC } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";

import { DetailAlbumMenu } from "./components/DetailAlbumMenu";
import { MusicTabs } from "./components/MusicTabs";
import { RemoveAddFromLibraryButton } from "./components/RemoveAddFromLibraryButton";
import More from "../../../assets/music-player/more.svg";
import PlayOther from "../../../assets/music-player/play-other.svg";
import PlaySecondary from "../../../assets/music-player/play-secondary.svg";
import Time from "../../../assets/music-player/time.svg";
import Tip from "../../../assets/music-player/tip-primary.svg";
import { BrandText } from "../../components/BrandText";
import { OmniLink } from "../../components/OmniLink";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { CustomPressable } from "../../components/buttons/CustomPressable";
import { TipModal } from "../../components/socialFeed/SocialActions/TipModal";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import { useMediaPlayer } from "../../context/MediaPlayerProvider";
import { useFetchAlbum } from "../../hooks/musicplayer/useFetchAlbum";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { parseUserId } from "../../networks";
import { getAudioDuration } from "../../utils/audio";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import {
  neutral77,
  neutral17,
  primaryColor,
  secondaryColor,
  neutral30,
  primaryTextColor,
  neutralA3,
  neutral33,
} from "../../utils/style/colors";
import {
  fontSemibold14,
  fontSemibold13,
  fontSemibold20,
  fontSemibold16,
  fontMedium13,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { tinyAddress } from "../../utils/text";
import { AlbumInfo, Media } from "../../utils/types/mediaPlayer";

export const MusicAlbumScreen: ScreenFC<"MusicAlbum"> = ({
  route: {
    params: { id },
  },
}) => {
  const isMobile = useIsMobile();
  const { loadAndPlayQueue } = useMediaPlayer();
  const navigation = useAppNavigation();
  const [tipModalVisible, setTipModalVisible] = useState<boolean>(false);
  const { data: fetchedAlbumInfo } = useFetchAlbum({ identifier: id });
  const [albumInfo, setAlbumInfo] = useState<AlbumInfo>({
    id: "0",
    name: "",
    description: "",
    image: "",
    createdBy: "",
    audios: [],
  });

  const authorNSInfo = useNSUserInfo(albumInfo.createdBy);
  const [, userAddress] = parseUserId(albumInfo.createdBy);
  const username = authorNSInfo?.metadata?.tokenId
    ? authorNSInfo?.metadata?.tokenId
    : tinyAddress(userAddress);

  useEffect(() => {
    if (fetchedAlbumInfo) {
      setAlbumInfo(fetchedAlbumInfo);
    }
  }, [fetchedAlbumInfo]);

  const [openDetailAlbumMenu, setOpenDetailAlbumMenu] =
    useState<boolean>(false);
  const handleTip = () => {
    setTipModalVisible(true);
  };

  const onPressPlayAlbum = async () => {
    if (!albumInfo.audios.length) return;
    await loadAndPlayQueue(albumInfo.audios);
  };

  const onPressTrack = async (media: Media) => {
    if (!albumInfo.audios.length) return;
    await loadAndPlayQueue(albumInfo.audios, media);
  };

  return (
    <ScreenContainer
      headerChildren={<BrandText>{albumInfo.name}</BrandText>}
      onBackPress={() => navigation.navigate("Music")}
      isLarge
      responsive
    >
      <View style={pageContainerStyle}>
        <MusicTabs
          setTab={() => {
            navigation.navigate("Music");
          }}
        />

        <View style={albumBoxStyle}>
          <View style={infoBoxStyle}>
            {/*---- Album image */}
            <Image
              source={{ uri: ipfsURLToHTTPURL(albumInfo.image) }}
              style={{
                width: isMobile ? 120 : 218,
                height: isMobile ? 120 : 218,
                borderRadius: 8,
              }}
            />
            <SpacerRow size={isMobile ? 2 : 4} />

            <View style={verticalBoxStyle}>
              {/*---- Album name */}
              <BrandText style={isMobile && fontSemibold16}>
                {albumInfo.name}
              </BrandText>
              {/*---- Album artist */}
              <OmniLink
                to={{
                  screen: "UserPublicProfile",
                  params: { id: albumInfo?.createdBy || "" },
                }}
              >
                <BrandText
                  style={[artistTextStyle, isMobile && fontSemibold16]}
                >
                  {"@" + username}
                </BrandText>
              </OmniLink>
              <SpacerColumn size={1} />
              {/*---- Album description */}
              <BrandText
                style={descriptionTextStyle}
                numberOfLines={6}
                ellipsizeMode="tail"
              >
                {albumInfo.description}
              </BrandText>

              <SpacerColumn size={isMobile ? 2 : 2.5} />
              <View style={albumButtonsStyle}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {/*---- Play album button */}
                  <TouchableOpacity
                    style={[
                      playButtonStyle,
                      isMobile && { paddingRight: layout.spacing_x1 },
                    ]}
                    onPress={onPressPlayAlbum}
                  >
                    <SVG source={PlayOther} width={20} height={20} />
                    {!isMobile && (
                      <BrandText style={playButtonTextStyle}>Play</BrandText>
                    )}
                  </TouchableOpacity>
                  <SpacerRow size={2} />

                  {/*---- Tip album button */}
                  <TouchableOpacity
                    style={[
                      tipButtonStyle,
                      isMobile && { paddingRight: layout.spacing_x1 },
                    ]}
                    onPress={handleTip}
                  >
                    <SVG source={Tip} width={20} height={20} />
                    {!isMobile && (
                      <BrandText style={tipButtonTextStyle}>
                        Tip this album
                      </BrandText>
                    )}
                  </TouchableOpacity>
                </View>
                <SpacerRow size={2} />

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <RemoveAddFromLibraryButton albumInfo={albumInfo} />
                  <SpacerRow size={2} />

                  {/*---- Album actions button */}
                  <TouchableOpacity
                    style={moreButtonStyle}
                    onPress={() => {
                      setOpenDetailAlbumMenu((value) => !value);
                    }}
                  >
                    <SVG
                      height={20}
                      width={20}
                      color={primaryColor}
                      source={More}
                    />
                  </TouchableOpacity>
                  {openDetailAlbumMenu && (
                    <DetailAlbumMenu id={albumInfo.id || ""} />
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>

        {/*---- Tracks */}
        <View style={tracksHeaderStyle}>
          <View style={leftBoxStyle}>
            <BrandText style={[menuTextStyle, indexStyle]}>#</BrandText>
            <SpacerRow size={1.5} />
            <BrandText style={menuTextStyle}>Title</BrandText>
          </View>
          <SVG source={Time} width={16} height={16} />
        </View>

        <View style={contentGroupStyle}>
          {albumInfo.audios.map((media: Media, index: number) => (
            <Track
              key={index}
              trackNumber={index + 1}
              mediaToPlay={media}
              onPressTrack={onPressTrack}
            />
          ))}
        </View>
      </View>
      <TipModal
        author={username}
        postId={id}
        onClose={() => setTipModalVisible(false)}
        isVisible={tipModalVisible}
      />
    </ScreenContainer>
  );
};

const Track: FC<{
  onPressTrack: (media: Media) => void;
  mediaToPlay: Media;
  trackNumber: number;
}> = ({ onPressTrack, mediaToPlay, trackNumber }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { media: currentMedia } = useMediaPlayer();
  const isMobile = useIsMobile();

  return (
    <CustomPressable
      onPress={() => onPressTrack(mediaToPlay)}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={[
        trackStyle,
        isMobile && { paddingLeft: layout.spacing_x1_5 },
        isHovered && { backgroundColor: neutral17 },
      ]}
    >
      <View style={leftBoxStyle}>
        {isHovered ||
        (mediaToPlay.fileUrl === currentMedia?.fileUrl &&
          currentMedia.albumId === mediaToPlay.albumId) ? (
          <SVG source={PlaySecondary} width={20} height={20} />
        ) : (
          <BrandText style={[menuTextStyle, indexStyle]}>
            {trackNumber}
          </BrandText>
        )}
        <SpacerRow size={1.5} />
        <BrandText
          style={[fontSemibold14, { flex: 1 }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {mediaToPlay.name}
        </BrandText>
      </View>
      <SpacerRow size={1.5} />

      <View style={rightBoxStyle}>
        <BrandText style={[fontSemibold14]}>
          {getAudioDuration(mediaToPlay.duration || 0)}
        </BrandText>
        <SpacerRow size={2.5} />
        <TouchableOpacity>
          <SVG source={More} color={secondaryColor} width={20} height={20} />
        </TouchableOpacity>
      </View>
    </CustomPressable>
  );
};

const pageContainerStyle: ViewStyle = {
  width: "100%",
};
const tracksHeaderStyle: ViewStyle = {
  paddingTop: layout.spacing_x2_5,
  paddingBottom: layout.spacing_x1_5,
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingLeft: layout.spacing_x2_5,
  paddingRight: layout.spacing_x1_5 + 20 + 20,
  borderBottomWidth: 1,
  borderBottomColor: neutral33,
  marginBottom: layout.spacing_x1,
};
const contentGroupStyle: ViewStyle = {
  flexDirection: "column",
  justifyContent: "space-between",
  zIndex: 999,
};
const trackStyle: ViewStyle = {
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingLeft: layout.spacing_x2_5,
  paddingRight: layout.spacing_x1_5,
  borderRadius: layout.spacing_x1,
  height: 48,
};
const menuTextStyle: TextStyle = {
  ...fontSemibold13,
  color: neutral77,
};
const indexStyle: TextStyle = {
  width: layout.spacing_x2_5,
  textAlign: "center",
};
const leftBoxStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  flex: 1,
};
const rightBoxStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};
const albumBoxStyle: ViewStyle = {
  marginTop: layout.spacing_x2_5,
  flexDirection: "row",
  alignItems: "flex-end",
  justifyContent: "space-between",
  zIndex: 999,
};
const infoBoxStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "flex-end",
  flex: 1,
};
const artistTextStyle: TextStyle = {
  ...fontSemibold20,

  color: primaryColor,
  marginTop: layout.spacing_x0_5,
};
const descriptionTextStyle: TextStyle = {
  ...fontMedium13,
  color: neutralA3,
};
const verticalBoxStyle: ViewStyle = {
  flexDirection: "column",
  alignItems: "flex-start",
  flex: 1,
};
const albumButtonsStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
};
const playButtonStyle: ViewStyle = {
  padding: layout.spacing_x1,
  paddingRight: layout.spacing_x1_5,
  flexDirection: "row",
  alignItems: "center",
  borderRadius: layout.spacing_x1,
  backgroundColor: primaryColor,
};
const tipButtonStyle: ViewStyle = {
  padding: layout.spacing_x1,
  paddingRight: layout.spacing_x1_5,
  flexDirection: "row",
  alignItems: "center",
  borderRadius: layout.spacing_x1,
  backgroundColor: neutral30,
};
const playButtonTextStyle: TextStyle = {
  ...fontSemibold14,

  color: primaryTextColor,
  marginLeft: layout.spacing_x1,
};
const tipButtonTextStyle: TextStyle = {
  ...fontSemibold14,
  color: primaryColor,
  marginLeft: layout.spacing_x1,
};
const moreButtonStyle: ViewStyle = {
  width: 36,
  height: 36,
  borderRadius: 18,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: neutral30,
};
