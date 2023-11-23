import React, { useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import DefaultVideoImage from "../../../assets/default-images/default-video-thumbnail.jpg";
import { Post } from "../../api/feed/v1/feed";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { parseUserId } from "../../networks";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { prettyMediaDuration } from "../../utils/mediaPlayer";
import { zodTryParseJSON } from "../../utils/sanitize";
import {
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
import { layout } from "../../utils/style/layout";
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
export const VIDEO_CARD_WIDTH = 261;
export const VIDEO_CARD_HEIGHT = 329;
export const VideoCard: React.FC<{
  post: Post;
  hideAuthor?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ post, hideAuthor, style }) => {
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

  if (post.identifier.startsWith("padded-")) {
    return <View style={{ width: cardWidth, height: VIDEO_CARD_HEIGHT }} />;
  }

  if (!video) return null;
  return (
    <View style={unitCardStyle}>
      <View>
        <CustomPressable
          style={imgBoxStyle}
          onHoverIn={() => setIsHovered(true)}
          onHoverOut={() => setIsHovered(false)}
          // TODO:
          // onPress={() => {
          //   navigation.navigate("FeedVideoView", {
          //     id: getNetworkObjectId(selectedNetworkId, post.identifier),
          //   });
          // }}
        >
          <OptimizedImage
            // TODO: Generate thumbnail from video
            sourceURI={ipfsURLToHTTPURL(video.videoFile.thumbnailFileData?.url)}
            fallbackURI={DefaultVideoImage}
            width={VIDEO_CARD_WIDTH}
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
        <SpacerColumn size={0.5} />
        <BrandText style={contentDescriptionStyle} numberOfLines={2}>
          {video?.description?.trim() || "No description"}
        </BrandText>
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
              <UserAvatarWithFrame userId={post.authorId} size="XXS" noFrame />
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

const unitCardStyle: ViewStyle = {
  width: VIDEO_CARD_WIDTH,
  backgroundColor: neutral00,
  height: VIDEO_CARD_HEIGHT,
  justifyContent: "space-between",
  borderRadius: 12,
};
const contentDescriptionStyle: TextStyle = {
  ...fontMedium13,
  color: neutral77,
};
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
