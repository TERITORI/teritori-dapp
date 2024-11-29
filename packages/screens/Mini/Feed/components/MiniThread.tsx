import React, { useEffect, useState } from "react";

import { PostActions } from "./PostActions";
import { PostHeader } from "./PostHeader";

import { Post } from "@/api/feed/v1/feed";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { MusicPostTrackContent } from "@/components/socialFeed/SocialCard/MusicPostTrackContent";
import { SocialCardWrapper } from "@/components/socialFeed/SocialCard/SocialCardWrapper";
import { SocialMessageContent } from "@/components/socialFeed/SocialCard/SocialMessageContent";
import { SpacerColumn } from "@/components/spacer";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { zodTryParseJSON } from "@/utils/sanitize";
import { PostCategory, ZodSocialFeedPostMetadata } from "@/utils/types/feed";

type Props = {
  post: Post;
  refetchFeed?: () => Promise<any>;
  isPreview?: boolean;
  isFlagged?: boolean;
};
export const DEFAULT_NAME = "Anon";

export const MiniThread = ({
  post,
  refetchFeed,
  isPreview,
  isFlagged,
}: Props) => {
  const navigation = useAppNavigation();
  const [localPost, setLocalPost] = useState<Post>(post);

  const postMetadata = zodTryParseJSON(
    ZodSocialFeedPostMetadata,
    localPost.metadata,
  );

  useEffect(() => {
    setLocalPost(post);
  }, [post]);

  return (
    <SocialCardWrapper
      post={post}
      refetchFeed={refetchFeed}
      isFlagged={isFlagged}
    >
      <CustomPressable
        onPress={() => {
          navigation.navigate("FeedPostView", {
            id: localPost.id,
          });
        }}
      >
        <PostHeader
          authorId={localPost.authorId}
          postedAt={localPost.createdAt}
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
