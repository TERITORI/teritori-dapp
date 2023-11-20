import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";

import defaultThumbnailImage from "../../../../assets/default-images/default-track-thumbnail.png";
import NormalPlay from "../../../../assets/icons/music/normal-play.svg";
import ThreeDotsCircleWhite from "../../../../assets/icons/music/three-dot-circle-white.svg";
import { Post } from "../../../api/feed/v1/feed";
import { BrandText } from "../../../components/BrandText";
import { OmniLink } from "../../../components/OmniLink";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { ZodSocialFeedTrackMetadata } from "../../../components/socialFeed/NewsFeed/NewsFeed.type";
import { SpacerColumn } from "../../../components/spacer";
import { useMediaPlayer } from "../../../context/MediaPlayerProvider";
import { useNSUserInfo } from "../../../hooks/useNSUserInfo";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import { getNetworkObjectId, parseUserId } from "../../../networks";
import { ipfsURLToHTTPURL } from "../../../utils/ipfs";
import { useAppNavigation } from "../../../utils/navigation";
import { zodTryParseJSON } from "../../../utils/sanitize";
import {
  neutral17,
  neutral77,
  primaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14, fontMedium13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { tinyAddress } from "../../../utils/text";
import { Media } from "../../../utils/types/mediaPlayer";

const IMAGE_HEIGHT = 218;
const BUTTONS_HEIGHT = 28;
export const TRACK_CARD_WIDTH = 242;
export const TrackCard: React.FC<{
  post: Post;
  hideAuthor?: boolean;
}> = ({ post, hideAuthor }) => {
  const track = zodTryParseJSON(ZodSocialFeedTrackMetadata, post.metadata);
  const authorNSInfo = useNSUserInfo(track?.authorId);
  const [, userAddress] = parseUserId(track?.authorId);
  const [isHovered, setIsHovered] = useState(false);
  const navigation = useAppNavigation();
  const selectedNetworkId = useSelectedNetworkId();

  const { loadAndPlaySoundsQueue } = useMediaPlayer();
  const username = authorNSInfo?.metadata?.tokenId
    ? authorNSInfo?.metadata?.tokenId
    : tinyAddress(userAddress, 16);

  const onPressPlayTrack = async () => {
    if (!track) return;
    const mediaToPlay: Media = {
      imageUrl: track.audioFile.thumbnailFileData?.url,
      name: track.title,
      createdBy: track.authorId,
      fileUrl: track.audioFile.url,
      duration: track.audioFile.audioMetadata?.duration,
      postId: post.identifier,
    };
    await loadAndPlaySoundsQueue([mediaToPlay]);
  };

  if (!track) return null;
  return (
    <View style={unitCardStyle}>
      <View>
        <CustomPressable
          onHoverIn={() => setIsHovered(true)}
          onHoverOut={() => setIsHovered(false)}
          style={imgBoxStyle}
          onPress={() => {
            navigation.navigate("FeedPostView", {
              id: getNetworkObjectId(selectedNetworkId, post.identifier),
            });
          }}
        >
          <Image
            source={
              track.audioFile.thumbnailFileData?.url
                ? {
                    uri: ipfsURLToHTTPURL(
                      track.audioFile.thumbnailFileData?.url,
                    ),
                  }
                : defaultThumbnailImage
            }
            style={[isHovered && { opacity: 0.5 }, contentImgStyle]}
          />
          <SpacerColumn size={1.5} />

          <View style={imgButtonsBoxStyle}>
            <TouchableOpacity onPress={onPressPlayTrack}>
              <SVG
                source={NormalPlay}
                width={BUTTONS_HEIGHT}
                height={BUTTONS_HEIGHT}
              />
            </TouchableOpacity>

            <TouchableOpacity>
              <SVG
                source={ThreeDotsCircleWhite}
                width={BUTTONS_HEIGHT}
                height={BUTTONS_HEIGHT}
              />
            </TouchableOpacity>
          </View>
        </CustomPressable>
        <BrandText style={contentTitleStyle} numberOfLines={2}>
          {track.title}
        </BrandText>
        <SpacerColumn size={0.5} />
        <BrandText style={contentDescriptionStyle} numberOfLines={2}>
          {track.description}
        </BrandText>
      </View>
      {!hideAuthor && (
        <>
          <SpacerColumn size={1} />
          <OmniLink
            to={{
              screen: "UserPublicProfile",
              params: { id: track.authorId },
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
  width: TRACK_CARD_WIDTH,
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
