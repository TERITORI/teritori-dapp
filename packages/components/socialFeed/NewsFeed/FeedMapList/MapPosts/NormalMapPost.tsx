import { FC } from "react";

import { Post } from "@/api/feed/v1/feed";
import { BrandText } from "@/components/BrandText";
import { MapPostWrapper } from "@/components/socialFeed/NewsFeed/FeedMapList/MapPosts/MapPostWrapper";
import { TextRenderer } from "@/components/socialFeed/NewsFeed/TextRenderer/TextRenderer";
import { HTML_TAG_REGEXP } from "@/utils/regex";
import { zodTryParseJSON } from "@/utils/sanitize";
import { errorColor, neutralFF } from "@/utils/style/colors";
import { fontSemibold10 } from "@/utils/style/fonts";
import { ZodSocialFeedPostMetadata } from "@/utils/types/feed";

export const NormalMapPost: FC<{
  post: Post;
}> = ({ post }) => {
  const postMetadata = zodTryParseJSON(
    ZodSocialFeedPostMetadata,
    post.metadata,
  );

  return (
    <MapPostWrapper post={post} style={{ minWidth: 185 }}>
      {postMetadata ? (
        <TextRenderer
          style={[fontSemibold10, { color: neutralFF }]}
          isPreview
          text={postMetadata.message.replace(HTML_TAG_REGEXP, "")}
        />
      ) : (
        <BrandText style={[fontSemibold10, { color: errorColor }]}>
          Wrong post format
        </BrandText>
      )}
    </MapPostWrapper>
  );
};
