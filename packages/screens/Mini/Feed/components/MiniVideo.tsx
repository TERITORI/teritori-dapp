import { ResizeMode } from "expo-av";
import React, { useEffect, useState } from "react";
import { StyleProp, View, ViewStyle, useWindowDimensions } from "react-native";

import { PostFooter } from "./PostFooter";
import { PostHeader } from "./PostHeader";
import { Post } from "../../../../api/feed/v1/feed";
import { BrandText } from "../../../../components/BrandText";
import { MediaPlayerVideo } from "../../../../components/mediaPlayer/MediaPlayerVideo";
import {
  ZodSocialFeedPostMetadata,
  ZodSocialFeedVideoMetadata,
} from "../../../../components/socialFeed/NewsFeed/NewsFeed.type";
import { SpacerColumn } from "../../../../components/spacer";
import { useNSUserInfo } from "../../../../hooks/useNSUserInfo";
import { parseUserId } from "../../../../networks";
import { zodTryParseJSON } from "../../../../utils/sanitize";
import { errorColor, neutralA3 } from "../../../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold16,
} from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { tinyAddress } from "../../../../utils/text";

type Props = {
  post: Post;
  refetchFeed?: () => Promise<any>;
  style?: StyleProp<ViewStyle>;
};
export const DEFAULT_NAME = "Anon";

export const MiniVideo = ({ post, refetchFeed, style }: Props) => {
  const [localPost, setLocalPost] = useState<Post>(post);
  const { width: windowWidth } = useWindowDimensions();
  const [, authorAddress] = parseUserId(localPost.authorId);
  const authorNSInfo = useNSUserInfo(localPost.authorId);

  const metadata = zodTryParseJSON(
    ZodSocialFeedVideoMetadata,
    localPost.metadata,
  );
  const oldMetadata = zodTryParseJSON(
    ZodSocialFeedPostMetadata,
    localPost.metadata,
  );
  const title = oldMetadata?.title || metadata?.title || "";
  const description = oldMetadata?.message || metadata?.description || "";

  useEffect(() => {
    setLocalPost(post);
  }, [post]);

  const authorMetadata = authorNSInfo.metadata;
  const username = authorMetadata?.tokenId
    ? authorMetadata.tokenId
    : tinyAddress(authorAddress, 19);

  return (
    <View>
      <PostHeader
        user={{
          img: authorMetadata.image,
          name:
            authorMetadata?.public_name ||
            (!authorMetadata?.tokenId
              ? DEFAULT_NAME
              : authorMetadata.tokenId.split(".")[0]) ||
            DEFAULT_NAME,
          username,
          postedAt: post.createdAt,
        }}
      />
      <SpacerColumn size={1.5} />
      <BrandText numberOfLines={2} style={[fontSemibold16]}>
        {title?.trim().replace("\n", " ")}
      </BrandText>
      <SpacerColumn size={1} />
      <BrandText
        style={[
          fontSemibold14,
          { color: neutralA3, marginBottom: layout.spacing_x1_5 },
        ]}
        numberOfLines={3}
      >
        {description.trim().replace("\n", " ")}
      </BrandText>
      {!metadata ? (
        <BrandText
          style={[
            fontSemibold13,
            { color: errorColor, marginVertical: layout.spacing_x2 },
          ]}
        >
          Video not found
        </BrandText>
      ) : (
        <MediaPlayerVideo
          videoMetadata={metadata}
          style={{
            height: 250,
            width: windowWidth - 30,
            borderTopRightRadius: 0,
            borderTopLeftRadius: 0,
          }}
          resizeMode={ResizeMode.COVER}
          authorId={localPost.authorId}
          postId={localPost.identifier}
        />
      )}

      <SpacerColumn size={1.5} />
      <PostFooter comments={1} reaction={0} transfer={0} />
    </View>
  );
};
