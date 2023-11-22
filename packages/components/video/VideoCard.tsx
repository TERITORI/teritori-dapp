import React, { useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import DefaultVideoImage from "../../../assets/default-images/default-video-thumbnail.png";
import { Post } from "../../api/feed/v1/feed";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { parseUserId } from "../../networks";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { prettyMediaDuration } from "../../utils/mediaPlayer";
import { zodTryParseJSON } from "../../utils/sanitize";
import { neutral22, neutral77, withAlpha } from "../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../utils/style/fonts";
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
export const VideoCard: React.FC<{
  post: Post;
  hideAuthor?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ post, hideAuthor, style }) => {
  const video = zodTryParseJSON(ZodSocialFeedVideoMetadata, post.metadata);
  const authorNSInfo = useNSUserInfo(video?.authorId);
  const [, userAddress] = parseUserId(video?.authorId);
  const [isHovered, setIsHovered] = useState(false);

  let cardWidth = StyleSheet.flatten(style)?.width;
  if (typeof cardWidth !== "number") {
    cardWidth = VIDEO_CARD_WIDTH;
  }
  const imageSize = cardWidth - layout.spacing_x1_5 * 2;

  const username = authorNSInfo?.metadata?.tokenId
    ? authorNSInfo?.metadata?.tokenId
    : tinyAddress(userAddress, 16);

  if (post.identifier.startsWith("padded-")) {
    return <View style={{ width: cardWidth, height: 381 }} />;
  }

  if (!video) return null;
  return (
    <View style={unitCardStyle}>
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
              width: imageSize,
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
      <BrandText style={contentTitleStyle} numberOfLines={2}>
        {video?.title}
      </BrandText>

      {!hideAuthor && (
        <>
          <SpacerColumn size={1} />
          <OmniLink
            to={{
              screen: "UserPublicProfile",
              params: { id: video.authorId },
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {/*---- User image */}
            <UserAvatarWithFrame userId={video.authorId} size="XXS" noFrame />
            <SpacerRow size={1} />
            <BrandText style={contentNameStyle}>@{username}</BrandText>
          </OmniLink>
        </>
      )}

      {/*TODO: viewCount*/}
      <SpacerColumn size={1} />
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/*  <BrandText*/}
        {/*    style={videoStatsTextStyle}*/}
        {/*  >{`${video.viewCount} views`}</BrandText>*/}
        {/*  <DotSeparator style={{ marginHorizontal: layout.spacing_x0_75 }} />*/}
        <DateTime date={video.createdAt} textStyle={{ color: neutral77 }} />
      </View>
    </View>
  );
};

const unitCardStyle: ViewStyle = {
  width: VIDEO_CARD_WIDTH,
  borderRadius: 8,
};
const contentTitleStyle: TextStyle = {
  ...fontSemibold14,
  lineHeight: 16,
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
