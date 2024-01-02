import { isEqual } from "lodash";
import React, { memo, useMemo, useState } from "react";
import {
  View,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  StyleProp,
  StyleSheet,
} from "react-native";

import defaultThumbnailImage from "../../../assets/default-images/default-track-thumbnail.png";
import NormalPlay from "../../../assets/icons/music/normal-play.svg";
import ThreeDotsCircleWhite from "../../../assets/icons/music/three-dot-circle-white.svg";
import { Post } from "../../api/feed/v1/feed";
import { useMediaPlayer } from "../../context/MediaPlayerProvider";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { getNetworkObjectId, parseUserId } from "../../networks";
import { useAppNavigation } from "../../utils/navigation";
import { zodTryParseJSON } from "../../utils/sanitize";
import { neutral17, neutral77, primaryColor } from "../../utils/style/colors";
import { fontSemibold14, fontMedium13 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { tinyAddress } from "../../utils/text";
import { Media } from "../../utils/types/mediaPlayer";
import { BrandText } from "../BrandText";
import { OmniLink } from "../OmniLink";
import { OptimizedImage } from "../OptimizedImage";
import { SVG } from "../SVG";
import { CustomPressable } from "../buttons/CustomPressable";
import { ZodSocialFeedTrackMetadata } from "../socialFeed/NewsFeed/NewsFeed.type";
import { SpacerColumn } from "../spacer";

const BUTTONS_HEIGHT = 28;
export const TRACK_CARD_WIDTH = 242;
export const TrackCard: React.FC<{
  post: Post;
  hideAuthor?: boolean;
  style?: StyleProp<ViewStyle>;
}> = memo(({ post, hideAuthor, style }) => {
  const track = zodTryParseJSON(ZodSocialFeedTrackMetadata, post.metadata);
  const authorNSInfo = useNSUserInfo(post.authorId);
  const [, userAddress] = parseUserId(post.authorId);
  const [isHovered, setIsHovered] = useState(false);
  const navigation = useAppNavigation();
  const selectedNetworkId = useSelectedNetworkId();
  let cardWidth = StyleSheet.flatten(style)?.width;
  if (typeof cardWidth !== "number") {
    cardWidth = TRACK_CARD_WIDTH;
  }
  const imageSize = cardWidth - layout.spacing_x1_5 * 2;

  const { loadAndPlaySoundsQueue } = useMediaPlayer();
  const username = authorNSInfo?.metadata?.tokenId
    ? authorNSInfo?.metadata?.tokenId
    : tinyAddress(userAddress, 16);

  const onPressPlayTrack = async () => {
    if (!track) return;
    const mediaToPlay: Media = {
      imageUrl: track.audioFile.thumbnailFileData?.url,
      name: track.title,
      createdBy: post.authorId,
      fileUrl: track.audioFile.url,
      duration: track.audioFile.audioMetadata?.duration,
      postId: post.identifier,
    };
    await loadAndPlaySoundsQueue([mediaToPlay]);
  };

  const imageStyle = useMemo(() => {
    return [isHovered && { opacity: 0.5 }];
  }, [isHovered]);

  return (
    <View style={[unitCardStyle, style]}>
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
          <OptimizedImage
            sourceURI={track?.audioFile.thumbnailFileData?.url}
            fallbackURI={defaultThumbnailImage}
            width={250}
            height={250}
            style={[
              imageStyle,
              { width: imageSize, height: imageSize, borderRadius: 8 },
            ]}
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
        <BrandText style={[fontSemibold14, { height: 40 }]} numberOfLines={2}>
          {track?.title || ""}
        </BrandText>
        <SpacerColumn size={0.5} />
        <BrandText style={contentDescriptionStyle} numberOfLines={2}>
          {track?.description || "No description"}
        </BrandText>
      </View>
      {!hideAuthor && (
        <>
          <SpacerColumn size={1} />
          <OmniLink
            to={{
              screen: "UserPublicProfile",
              params: { id: post.authorId },
            }}
          >
            <BrandText style={contentNameStyle}>@{username}</BrandText>
          </OmniLink>
        </>
      )}
    </View>
  );
}, isEqual);

const unitCardStyle: ViewStyle = {
  width: TRACK_CARD_WIDTH,
  backgroundColor: neutral17,
  padding: layout.spacing_x1_5,
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
  bottom: layout.spacing_x1_5 * 2,
  right: 0,
  justifyContent: "space-between",
};

const contentDescriptionStyle: TextStyle = {
  ...fontMedium13,
  color: neutral77,
};

const contentNameStyle: TextStyle = {
  ...fontSemibold14,
  color: primaryColor,
};
