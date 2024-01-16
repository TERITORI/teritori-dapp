import React, { useEffect, useMemo, useState } from "react";
import { StyleProp, View, ViewStyle, useWindowDimensions } from "react-native";

import { PostFooter } from "./PostFooter";
import { PostHeader } from "./PostHeader";
import defaultThumbnailImage from "../../../../../assets/default-images/default-article-thumbnail.png";
import { Post } from "../../../../api/feed/v1/feed";
import { BrandText } from "../../../../components/BrandText";
import { OptimizedImage } from "../../../../components/OptimizedImage";
import {
  ZodSocialFeedArticleMetadata,
  ZodSocialFeedPostMetadata,
} from "../../../../components/socialFeed/NewsFeed/NewsFeed.type";
import {
  createStateFromHTML,
  getTruncatedArticleHTML,
  isArticleHTMLNeedsTruncate,
} from "../../../../components/socialFeed/RichText";
import { SpacerColumn } from "../../../../components/spacer";
import { useNSUserInfo } from "../../../../hooks/useNSUserInfo";
import { parseUserId } from "../../../../networks";
import { zodTryParseJSON } from "../../../../utils/sanitize";
import { neutralA3 } from "../../../../utils/style/colors";
import { fontSemibold14, fontSemibold16 } from "../../../../utils/style/fonts";
import { tinyAddress } from "../../../../utils/text";

type Props = {
  post: Post;
  refetchFeed?: () => Promise<any>;
  style?: StyleProp<ViewStyle>;
};
export const DEFAULT_NAME = "Anon";

export const MiniSocialArticle = ({ post, refetchFeed, style }: Props) => {
  const { width: windowWidth } = useWindowDimensions();

  const [localPost, setLocalPost] = useState<Post>(post);
  const [, authorAddress] = parseUserId(localPost.authorId);
  const authorNSInfo = useNSUserInfo(localPost.authorId);
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

  const thumbnailURI = thumbnailImage?.url
    ? thumbnailImage.url.includes("://")
      ? thumbnailImage.url
      : "ipfs://" + thumbnailImage.url
    : defaultThumbnailImage;

  const title = simplePostMetadata?.title;

  const authorMetadata = authorNSInfo.metadata;
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
          username: `${
            authorMetadata?.tokenId
              ? authorMetadata.tokenId
              : tinyAddress(authorAddress, 19)
          }`,
          postedAt: post.createdAt,
        }}
      />
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
      <PostFooter comments={1} reaction={0} transfer={0} />
    </View>
  );
};
