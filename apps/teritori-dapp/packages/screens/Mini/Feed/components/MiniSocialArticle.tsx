import React, { useEffect, useMemo, useState } from "react";
import { StyleProp, useWindowDimensions, ViewStyle } from "react-native";

import { PostActions } from "./PostActions";
import { PostHeader } from "./PostHeader";
import defaultThumbnailImage from "@/assets/default-images/default-article-thumbnail.png";

import { Post } from "@/api/feed/v1/feed";
import { BrandText } from "@/components/BrandText";
import { OptimizedImage } from "@/components/OptimizedImage";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import {
  createStateFromHTML,
  getTruncatedArticleHTML,
  isArticleHTMLNeedsTruncate,
} from "@/components/socialFeed/RichText";
import { SpacerColumn } from "@/components/spacer";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { zodTryParseJSON } from "@/utils/sanitize";
import { neutralA3 } from "@/utils/style/colors";
import { fontSemibold14, fontSemibold16 } from "@/utils/style/fonts";
import {
  ZodSocialFeedArticleMetadata,
  ZodSocialFeedPostMetadata,
} from "@/utils/types/feed";

type Props = {
  post: Post;
  refetchFeed?: () => Promise<any>;
  style?: StyleProp<ViewStyle>;
};

export const MiniSocialArticle = ({ post, refetchFeed, style }: Props) => {
  const { width: windowWidth } = useWindowDimensions();
  const navigation = useAppNavigation();
  const [localPost, setLocalPost] = useState<Post>(post);
  const metadata = zodTryParseJSON(
    ZodSocialFeedArticleMetadata,
    localPost.metadata,
  );
  const oldMetadata = zodTryParseJSON(
    ZodSocialFeedPostMetadata,
    localPost.metadata,
  );

  const thumbnailImage =
    metadata?.thumbnailImage ||
    oldMetadata?.files?.find((file) => file.isCoverImage);
  const simplePostMetadata = metadata || oldMetadata;
  const message = simplePostMetadata?.message;

  const shortDescription = useMemo(() => {
    if (metadata?.shortDescription) {
      return metadata.shortDescription;
    }
    if (!message) return "";
    if (isArticleHTMLNeedsTruncate(message, true)) {
      const { truncatedHtml } = getTruncatedArticleHTML(message);
      const contentState =
        createStateFromHTML(truncatedHtml).getCurrentContent();
      return (
        metadata?.shortDescription ||
        // Old articles doesn't have shortDescription, so we use the start of the html content
        contentState.getPlainText()
      );
    }
    return "";
  }, [message, metadata?.shortDescription]);
  useEffect(() => {
    setLocalPost(post);
  }, [post]);

  const onPressPost = () => {
    navigation.navigate("FeedPostView", { id: localPost.id });
  };

  const thumbnailURI = thumbnailImage?.url
    ? thumbnailImage.url.includes("://")
      ? thumbnailImage.url
      : "ipfs://" + thumbnailImage.url
    : defaultThumbnailImage;

  const title = simplePostMetadata?.title;

  return (
    <CustomPressable onPress={onPressPost}>
      <PostHeader authorId={post.authorId} postedAt={post.createdAt} />
      <SpacerColumn size={1.5} />
      <BrandText numberOfLines={2} style={[fontSemibold16]}>
        {title?.trim().replace("\n", " ")}
      </BrandText>
      <SpacerColumn size={1} />
      <BrandText
        style={[fontSemibold14, { color: neutralA3 }]}
        numberOfLines={3}
      >
        {shortDescription.trim().replace("\n", " ")}
      </BrandText>
      {thumbnailImage && (
        <OptimizedImage
          width={windowWidth}
          height={200}
          sourceURI={thumbnailURI}
          fallbackURI={defaultThumbnailImage}
          style={{
            zIndex: -1,
            width: windowWidth,
            height: 200 - 2,
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
          }}
        />
      )}
      <SpacerColumn size={1} />
      <PostActions post={localPost} setPost={setLocalPost} />
    </CustomPressable>
  );
};
