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

import defaultThumbnailImage from "../../../assets/default-images/default-video-thumbnail.webp";
import { Post } from "../../api/feed/v1/feed";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { parseUserId } from "../../networks";
import { prettyMediaDuration } from "../../utils/mediaPlayer";
import { zodTryParseJSON } from "../../utils/sanitize";
import {
  errorColor,
  neutral00,
  neutral22,
  neutral77,
  neutralFF,
  withAlpha,
} from "../../utils/style/colors";
import {
  fontMedium13,
  fontSemibold13,
  fontSemibold14,
} from "../../utils/style/fonts";
import { layout, RESPONSIVE_BREAKPOINT_S } from "../../utils/style/layout";
import { tinyAddress } from "../../utils/text";
import { ZodSocialFeedVideoMetadata } from "../../utils/types/feed";
import { BrandText } from "../BrandText";
import { OmniLink } from "../OmniLink";
import { OptimizedImage } from "../OptimizedImage";
import { CustomPressable } from "../buttons/CustomPressable";
import { UserAvatarWithFrame } from "../images/AvatarWithFrame";
import { DateTime } from "../socialFeed/SocialCard/DateTime";
import { SpacerColumn, SpacerRow } from "../spacer";

import { LocationButton } from "@/components/socialFeed/NewsFeed/LocationButton";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";

const IMAGE_HEIGHT = 173;
const VIDEO_CARD_WIDTH = 261;
export const VideoCard: React.FC<{
  post: Post;
  hideAuthor?: boolean;
  hideDescription?: boolean;
  style?: StyleProp<ViewStyle>;
}> = memo(({ post, hideAuthor, hideDescription, style }) => {
  const { width: windowWidth } = useWindowDimensions();
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
              id: post.id,
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

          {video?.location && (
            <View style={positionButtonBoxStyle}>
              <LocationButton
                onPress={() =>
                  navigation.navigate("Feed", {
                    tab: "map",
                    locationToCenter: video.location,
                  })
                }
                color={neutralFF}
              />
            </View>
          )}
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

const positionButtonBoxStyle: ViewStyle = {
  position: "absolute",
  top: layout.spacing_x1,
  right: layout.spacing_x1,
};

const contentNameStyle: TextStyle = {
  ...fontSemibold14,
};
