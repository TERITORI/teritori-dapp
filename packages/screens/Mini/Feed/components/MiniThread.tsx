import React, { useEffect, useState } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { PostActions } from "./PostActions";
import { PostHeader } from "./PostHeader";

import { Post } from "@/api/feed/v1/feed";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { MusicPostTrackContent } from "@/components/socialFeed/SocialCard/MusicPostTrackContent";
import { SocialCardWrapper } from "@/components/socialFeed/SocialCard/SocialCardWrapper";
import { SocialMessageContent } from "@/components/socialFeed/SocialCard/SocialMessageContent";
import { SpacerColumn } from "@/components/spacer";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import { useSelectedNetworkInfo } from "@/hooks/useSelectedNetwork";
import { getNetworkObjectId, parseUserId } from "@/networks";
import { zodTryParseJSON } from "@/utils/sanitize";
import { tinyAddress } from "@/utils/text";
import { PostCategory, ZodSocialFeedPostMetadata } from "@/utils/types/feed";

type Props = {
  post: Post;
  refetchFeed?: () => Promise<any>;
  style?: StyleProp<ViewStyle>;
  isPreview?: boolean;
  isFlagged?: boolean;
};
export const DEFAULT_NAME = "Anon";

export const MiniThread = ({
  post,
  refetchFeed,
  style,
  isPreview,
  isFlagged,
}: Props) => {
  const navigation = useAppNavigation();
  const [localPost, setLocalPost] = useState<Post>(post);
  const [, authorAddress] = parseUserId(localPost.authorId);
  const authorNSInfo = useNSUserInfo(localPost.authorId);
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const selectedNetworkId = selectedNetworkInfo?.id || "";

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

  const name =
    authorMetadata?.public_name ||
    (!authorMetadata?.tokenId
      ? DEFAULT_NAME
      : authorMetadata.tokenId.split(".")[0]) ||
    DEFAULT_NAME;

  return (
    <SocialCardWrapper
      post={post}
      refetchFeed={refetchFeed}
      isFlagged={isFlagged}
    >
      <CustomPressable
        onPress={() => {
          navigation.navigate("FeedPostView", {
            id: getNetworkObjectId(selectedNetworkId, localPost.identifier),
          });
        }}
      >
        <PostHeader
          user={{
            img: authorMetadata.image,
            name,
            username,
            postedAt: post.createdAt,
          }}
        />
        <SpacerColumn size={1.5} />
        {post.category === PostCategory.MusicAudio ? (
          <MusicPostTrackContent post={localPost} />
        ) : postMetadata ? (
          <>
            <SocialMessageContent post={localPost} isPreview={isPreview} />
          </>
        ) : null}
        <SpacerColumn size={1} />
        <PostActions post={localPost} setPost={setLocalPost} />
      </CustomPressable>
    </SocialCardWrapper>
  );
};
