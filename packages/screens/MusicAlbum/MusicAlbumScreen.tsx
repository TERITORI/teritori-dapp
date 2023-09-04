import React, { useState, useEffect, FC, useRef } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  ScrollView,
} from "react-native";

import { AlbumHoverMenu } from "./components/AlbumCard/AlbumHoverMenu";
import { MusicTabs } from "./components/MusicTabs";
import { RemoveAddFromLibraryButton } from "./components/RemoveAddFromLibraryButton";
import RandomIcon from "../../../assets/icons/media-player/random.svg";
import More from "../../../assets/icons/music-player/more.svg";
import PlayOther from "../../../assets/icons/music-player/play-other.svg";
import PlaySecondary from "../../../assets/icons/music-player/play-secondary.svg";
import Time from "../../../assets/icons/music-player/time.svg";
import Tip from "../../../assets/icons/music-player/tip-primary.svg";
import { BrandText } from "../../components/BrandText";
import { OmniLink } from "../../components/OmniLink";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { CustomPressable } from "../../components/buttons/CustomPressable";
import { TipModal } from "../../components/socialFeed/SocialActions/TipModal";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import { useDropdowns } from "../../context/DropdownsProvider";
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
  const { loadAndPlayQueue, setIsRandom, isRandom } = useMediaPlayer();
  const navigation = useAppNavigation();
  const [tipModalVisible, setTipModalVisible] = useState<boolean>(false);
  const { data: fetchedAlbumInfo } = useFetchAlbum({ identifier: id });
  const [_albumInfo, setAlbumInfo] = useState<AlbumInfo>({
    id: "0",
    name: "",
    description: "",
    image: "",
    createdBy: "",
    audios: [],
  });

  const albumInfo: AlbumInfo = {
    id: _albumInfo.id,
    description: "metadata.description",
    image:
      "https://deseret.brightspotcdn.com/dims4/default/b5cad51/2147483647/strip/true/crop/1081x720+60+0/resize/1300x866!/format/webp/quality/90/?url=https%3A%2F%2Fcdn.vox-cdn.com%2Fthumbor%2F0Dfzg4KRslQ4NFETKg0xmuYKxHE%3D%2F0x0%3A1200x720%2F1200x720%2Ffilters%3Afocal%28600x360%3A601x361%29%2Fcdn.vox-cdn.com%2Fuploads%2Fchorus_asset%2Ffile%2F24651468%2Fsolar_flare.en.jpg",
    createdBy: _albumInfo.createdBy,
    name: "metadata.title",
    audios: _albumInfo.audios,
  };

  const authorNSInfo = useNSUserInfo(albumInfo.createdBy);
  const [, authorAddress] = parseUserId(albumInfo.createdBy);
  const authorUsername = authorNSInfo?.metadata?.tokenId
    ? authorNSInfo?.metadata?.tokenId
    : tinyAddress(authorAddress);

  useEffect(() => {
    if (fetchedAlbumInfo) {
      setAlbumInfo(fetchedAlbumInfo);
    }
  }, [fetchedAlbumInfo]);

  const { onPressDropdownButton, isDropdownOpen } = useDropdowns();
  const albumMenuRef = useRef<View>(null);

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
                alignSelf: "center",
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
                  {"@" + authorUsername}
                </BrandText>
              </OmniLink>
              <SpacerColumn size={1} />
              {/*---- Album description */}
              <ScrollView>
                <BrandText
                  style={[
                    descriptionTextStyle,
                    { maxHeight: isMobile ? 72 : 142 },
                  ]}
                >
                  {albumInfo.description}
                </BrandText>
              </ScrollView>

              <SpacerColumn size={isMobile ? 2 : 2.5} />
              <View style={albumButtonsStyle}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {/*---- Play album button */}
                  {/*TODO: Plug play/pause instead of just loadAndPlayQueue for this button*/}
                  <TouchableOpacity
                    style={[
                      playButtonStyle,
                      isMobile && {
                        padding: layout.spacing_x0_75,
                        paddingRight: layout.spacing_x0_75,
                      },
                    ]}
                    onPress={onPressPlayAlbum}
                  >
                    <SVG source={PlayOther} width={20} height={20} />
                    {!isMobile && (
                      <BrandText style={playButtonTextStyle}>Play</BrandText>
                    )}
                  </TouchableOpacity>
                  <SpacerRow size={isMobile ? 1.25 : 2} />
                  {/*---- Toggle random button */}
                  <TouchableOpacity
                    onPress={() => setIsRandom((isRandom) => !isRandom)}
                  >
                    <SVG
                      source={RandomIcon}
                      width={isMobile ? 32 : 36}
                      height={isMobile ? 32 : 36}
                      color={isRandom ? secondaryColor : neutralA3}
                    />
                  </TouchableOpacity>
                </View>
                <SpacerRow size={isMobile ? 1.25 : 2} />

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <RemoveAddFromLibraryButton albumInfo={albumInfo} />
                  <SpacerRow size={isMobile ? 1.25 : 2} />
                  {/*---- Tip album button */}
                  <TouchableOpacity
                    style={[
                      tipButtonStyle,
                      isMobile && {
                        padding: layout.spacing_x0_75,
                        paddingRight: layout.spacing_x0_75,
                      },
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
                  <SpacerRow size={isMobile ? 1.25 : 2} />

                  {/*---- Album actions button */}
                  <TouchableOpacity
                    style={[
                      moreButtonStyle,
                      isMobile && { width: 32, height: 32 },
                    ]}
                    onPress={() => onPressDropdownButton(albumMenuRef)}
                  >
                    <SVG
                      height={20}
                      width={20}
                      color={primaryColor}
                      source={More}
                    />
                  </TouchableOpacity>
                  {isDropdownOpen(albumMenuRef) && (
                    <AlbumHoverMenu
                      style={{ width: 170 }}
                      album={albumInfo}
                      isAlbumScreen
                      owner={authorUsername}
                    />
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>

        {/*---- Tracks */}
        <View
          style={[
            tracksHeaderStyle,
            isMobile && { paddingLeft: layout.spacing_x1_5 },
          ]}
        >
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
        author={authorUsername}
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

        {/*TODO: Delete track, track actions...*/}
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
  paddingVertical: layout.spacing_x1,
  paddingLeft: layout.spacing_x1,
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
