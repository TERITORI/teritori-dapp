import React, { useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";

import defaultThumbnailImage from "../../../assets/default-images/default-video-thumbnail.jpg";
import { Post } from "../../api/feed/v1/feed";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { getNetworkObjectId, parseUserId } from "../../networks";
import { prettyMediaDuration } from "../../utils/mediaPlayer";
import { useAppNavigation } from "../../utils/navigation";
import { zodTryParseJSON } from "../../utils/sanitize";
import {
  errorColor,
  neutral00,
  neutral22,
  neutral77,
  withAlpha,
} from "../../utils/style/colors";
import {
  fontMedium13,
  fontSemibold13,
  fontSemibold14,
} from "../../utils/style/fonts";
import { layout, RESPONSIVE_BREAKPOINT_S } from "../../utils/style/layout";
import { tinyAddress } from "../../utils/text";
import { BrandText } from "../BrandText";
import { OmniLink } from "../OmniLink";
import { OptimizedImage } from "../OptimizedImage";
import { CustomPressable } from "../buttons/CustomPressable";
import { UserAvatarWithFrame } from "../images/AvatarWithFrame";
import { ZodSocialFeedVideoMetadata } from "../socialFeed/NewsFeed/NewsFeed.type";
import { DateTime } from "../socialFeed/SocialCard/DateTime";
import { SpacerColumn, SpacerRow } from "../spacer";

const IMAGE_HEIGHT = 173;
const VIDEO_CARD_WIDTH = 261;
export const VideoCard: React.FC<{
  post: Post;
  hideAuthor?: boolean;
  hideDescription?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ post, hideAuthor, hideDescription, style }) => {
  const { width: windowWidth } = useWindowDimensions();
  const selectedNetworkId = useSelectedNetworkId();
  const navigation = useAppNavigation();
  const video = zodTryParseJSON(ZodSocialFeedVideoMetadata, post.metadata);
  const authorNSInfo = useNSUserInfo(post.authorId);
  const [, userAddress] = parseUserId(post.authorId);
  const [isHovered, setIsHovered] = useState(false);
  const noDescription = hideDescription || !video?.description;
  const videoCardHeight =
    hideAuthor && noDescription ? 249 : hideAuthor || noDescription ? 289 : 329;

  let cardWidth = StyleSheet.flatten(style)?.width;
  if (typeof cardWidth !== "number") {
    cardWidth = VIDEO_CARD_WIDTH;
  }

  const username = authorNSInfo?.metadata?.tokenId
    ? authorNSInfo?.metadata?.tokenId
    : tinyAddress(userAddress, 16);

  if (post.identifier.startsWith("padded-")) {
    return (
      <View
        style={{
          width: cardWidth,
          height: videoCardHeight,
        }}
      />
    );
  }

  const thumbnailURI = video?.videoFile.thumbnailFileData?.url
    ? video.videoFile.thumbnailFileData.url.includes("://")
      ? video.videoFile.thumbnailFileData.url
      : "ipfs://" + video.videoFile.thumbnailFileData?.url // we need this hack because ipfs "urls" in feed are raw CIDs
    : defaultThumbnailImage;

  if (!video)
    return (
      <BrandText style={[fontSemibold13, { color: errorColor }]}>
        Video not found
      </BrandText>
    );
  return (
    <View
      style={[
        {
          width: VIDEO_CARD_WIDTH,
          backgroundColor: neutral00,
          height: videoCardHeight,
          borderRadius: 12,
        },
        style,
      ]}
    >
      <View>
        <CustomPressable
          style={imgBoxStyle}
          onHoverIn={() => setIsHovered(true)}
          onHoverOut={() => setIsHovered(false)}
          onPress={() =>
            navigation.navigate("FeedPostView", {
              id: getNetworkObjectId(selectedNetworkId, post.identifier),
            })
          }
        >
          <OptimizedImage
            sourceURI={thumbnailURI}
            fallbackURI={defaultThumbnailImage}
            width={cardWidth}
            height={IMAGE_HEIGHT}
            style={[
              isHovered && { opacity: 0.5 },
              {
                height: IMAGE_HEIGHT,
                width: cardWidth,
                borderRadius: 12,
              },
            ]}
          />

          <View style={imgDurationBoxStyle}>
            <BrandText style={fontSemibold13}>
              {prettyMediaDuration(video.videoFile.videoMetadata?.duration)}
            </BrandText>
          </View>
        </CustomPressable>

        <SpacerColumn size={1.5} />
        <BrandText style={[fontSemibold14]} numberOfLines={2}>
          {video?.title.trim()}
        </BrandText>
        {!hideDescription && video?.description && (
          <>
            <SpacerColumn size={0.5} />
            <BrandText style={contentDescriptionStyle} numberOfLines={2}>
              {video?.description?.trim()}
            </BrandText>
          </>
        )}
      </View>

      <View>
        {!hideAuthor && (
          <>
            <SpacerColumn size={1} />
            <OmniLink
              to={{
                screen: "UserPublicProfile",
                params: { id: post.authorId },
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {/*---- User image */}
              <UserAvatarWithFrame
                userId={post.authorId}
                size={windowWidth < RESPONSIVE_BREAKPOINT_S ? "XS" : "S"}
              />
              <SpacerRow size={1} />
              <BrandText style={contentNameStyle}>@{username}</BrandText>
            </OmniLink>
          </>
        )}

        <SpacerColumn size={1} />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/*TODO: viewCount*/}
          {/*  <BrandText*/}
          {/*    style={videoStatsTextStyle}*/}
          {/*  >{`${video.viewCount} views`}</BrandText>*/}
          {/*  <DotSeparator style={{ marginHorizontal: layout.spacing_x0_75 }} />*/}
          <DateTime
            date={post.createdAt * 1000}
            textStyle={{ color: neutral77 }}
          />
        </View>
      </View>
    </View>
  );
};

const imgBoxStyle: ViewStyle = {
  position: "relative",
};
const imgBoxStyle: ViewStyle = {
  position: "relative",
};
const contentDescriptionStyle: TextStyle = {
  ...fontMedium13,
  color: neutral77,
};
const imgDurationBoxStyle: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: layout.spacing_x0_75,
  height: 26,
  borderRadius: 4,
  backgroundColor: withAlpha(neutral22, 0.6),
  position: "absolute",
  top: layout.spacing_x1,
  left: layout.spacing_x1,
};
const contentNameStyle: TextStyle = {
  ...fontSemibold14,
};
