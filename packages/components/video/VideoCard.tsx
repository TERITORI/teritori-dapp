import { isEqual } from "lodash";
import React, { memo, useState } from "react";
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
}> = memo(({ post, hideAuthor, hideDescription, style }) => {
  const { width: windowWidth } = useWindowDimensions();
  const selectedNetworkId = useSelectedNetworkId();
  const navigation = useAppNavigation();
  const video = zodTryParseJSON(ZodSocialFeedVideoMetadata, post.metadata);
  const authorNSInfo = useNSUserInfo(post.authorId);
  const [, userAddress] = parseUserId(post.authorId);
  const [isHovered, setIsHovered] = useState(false);

  let cardWidth = StyleSheet.flatten(style)?.width;
  if (typeof cardWidth !== "number") {
    cardWidth = VIDEO_CARD_WIDTH;
  }

  const username = authorNSInfo?.metadata?.tokenId
    ? authorNSInfo?.metadata?.tokenId
    : tinyAddress(userAddress, 16);

  const thumbnailURI = video?.videoFile.thumbnailFileData?.url
    ? video.videoFile.thumbnailFileData.url.includes("://")
      ? video.videoFile.thumbnailFileData.url
      : "ipfs://" + video.videoFile.thumbnailFileData?.url // we need this hack because ipfs "urls" in feed are raw CIDs
    : defaultThumbnailImage;

  if (post.identifier.startsWith("padded-")) {
    return (
      <View
        style={{
          width: cardWidth,
        }}
      />
    );
  }

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
          borderRadius: 12,
          justifyContent: "space-between",
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
        <BrandText style={[fontSemibold14, { height: 40 }]} numberOfLines={2}>
          {video?.title.trim()}
        </BrandText>

        {!hideDescription && video?.description && (
          <>
            <SpacerColumn size={0.5} />
            <BrandText
              style={[
                fontMedium13,
                {
                  color: neutral77,
                  height: 36,
                },
              ]}
              numberOfLines={2}
            >
              {video?.description?.trim()}
            </BrandText>
          </>
        )}
      </View>

      <View>
        {!hideAuthor && (
          <OmniLink
            to={{
              screen: "UserPublicProfile",
              params: { id: post.authorId },
            }}
            style={{
              marginTop: layout.spacing_x1,
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
        )}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: layout.spacing_x1,
          }}
        >
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
}, isEqual);

const imgBoxStyle: ViewStyle = {
  position: "relative",
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
