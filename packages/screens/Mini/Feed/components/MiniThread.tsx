import React, { useEffect, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { PostFooter } from "./PostFooter";
import { PostHeader } from "./PostHeader";
import { Post } from "../../../../api/feed/v1/feed";
import {
  PostCategory,
  ZodSocialFeedPostMetadata,
} from "../../../../components/socialFeed/NewsFeed/NewsFeed.type";
import { MusicPostTrackContent } from "../../../../components/socialFeed/SocialCard/MusicPostTrackContent";
import { SocialMessageContent } from "../../../../components/socialFeed/SocialCard/SocialMessageContent";
import { SpacerColumn } from "../../../../components/spacer";
import { useNSUserInfo } from "../../../../hooks/useNSUserInfo";
import { parseUserId } from "../../../../networks";
import { zodTryParseJSON } from "../../../../utils/sanitize";
import { tinyAddress } from "../../../../utils/text";

type Props = {
  post: Post;
  refetchFeed?: () => Promise<any>;
  style?: StyleProp<ViewStyle>;
  isPreview?: boolean;
};
export const DEFAULT_NAME = "Anon";

export const MiniThread = ({ post, refetchFeed, style, isPreview }: Props) => {
  const [localPost, setLocalPost] = useState<Post>(post);
  const [, authorAddress] = parseUserId(localPost.authorId);
  const authorNSInfo = useNSUserInfo(localPost.authorId);

  const postMetadata = zodTryParseJSON(
    ZodSocialFeedPostMetadata,
    localPost.metadata,
  );

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
      {post.category === PostCategory.MusicAudio ? (
        <MusicPostTrackContent post={localPost} />
      ) : postMetadata ? (
        <>
          <SocialMessageContent
            authorId={localPost.authorId}
            postId={localPost.identifier}
            metadata={postMetadata}
            postCategory={localPost.category}
            isPreview={isPreview}
          />
        </>
      ) : null}
      <SpacerColumn size={1} />
      <PostFooter comments={1} reaction={0} transfer={0} />
    </View>
  );
};
