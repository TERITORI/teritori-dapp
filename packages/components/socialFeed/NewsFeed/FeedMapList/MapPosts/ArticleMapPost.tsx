import React, { FC } from "react";
import { View } from "react-native";

import { Post } from "@/api/feed/v1/feed";
import { BrandText } from "@/components/BrandText";
import { Separator } from "@/components/separators/Separator";
import { MapPostWrapper } from "@/components/socialFeed/NewsFeed/FeedMapList/MapPosts/MapPostWrapper";
import {
  createStateFromHTML,
  getTruncatedArticleHTML,
  isArticleHTMLNeedsTruncate,
} from "@/components/socialFeed/RichText";
import { SpacerColumn } from "@/components/spacer";
import { zodTryParseJSON } from "@/utils/sanitize";
import { fontSemibold10 } from "@/utils/style/fonts";
import {
  ZodSocialFeedArticleMetadata,
  ZodSocialFeedPostMetadata,
} from "@/utils/types/feed";
export const ArticleMapPost: FC<{
  post: Post;
}> = ({ post }) => {
  const metadata = zodTryParseJSON(ZodSocialFeedArticleMetadata, post.metadata);
  const oldMetadata = zodTryParseJSON(ZodSocialFeedPostMetadata, post.metadata);
  const metadataToUse = metadata || oldMetadata;
  const title = metadataToUse?.title || "Article from Social Feed";

  const shortDescription = () => {
    const message = metadataToUse?.message;
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
  };

  return (
    <MapPostWrapper post={post} style={{ minWidth: 185 }}>
      <View>
        <BrandText style={fontSemibold10}>{title}</BrandText>
        <SpacerColumn size={0.5} />

        <Separator />
        <SpacerColumn size={0.5} />

        <BrandText style={fontSemibold10} numberOfLines={3}>
          {shortDescription().trim().replace("\n", " ")}
        </BrandText>
      </View>
    </MapPostWrapper>
  );
};
