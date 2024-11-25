import { ResizeMode } from "expo-av";
import React, { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";

import { PostActions } from "./PostActions";
import { PostHeader } from "./PostHeader";

import { Post } from "@/api/feed/v1/feed";
import { BrandText } from "@/components/BrandText";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { MediaPlayerVideo } from "@/components/mediaPlayer/MediaPlayerVideo";
import { SpacerColumn } from "@/components/spacer";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { zodTryParseJSON } from "@/utils/sanitize";
import { errorColor, neutralA3 } from "@/utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold16,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import {
  ZodSocialFeedPostMetadata,
  ZodSocialFeedVideoMetadata,
} from "@/utils/types/feed";

type Props = {
  post: Post;
  isFlagged?: boolean;
};

export const MiniVideo = ({ post }: Props) => {
  const navigation = useAppNavigation();
  const [localPost, setLocalPost] = useState<Post>(post);
  const { width: windowWidth } = useWindowDimensions();

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

  return (
    <CustomPressable
      onPress={() => {
        navigation.navigate("FeedPostView", {
          id: localPost.id,
        });
      }}
    >
      <PostHeader authorId={post.authorId} postedAt={post.createdAt} />
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
          postId={localPost.id}
        />
      )}

      <SpacerColumn size={1.5} />
      <PostActions post={localPost} setPost={setLocalPost} />
    </CustomPressable>
  );
};
