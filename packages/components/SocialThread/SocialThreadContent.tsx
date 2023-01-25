import React from "react";
import { View } from "react-native";

import { SocialFeedMetadata, PostCategory } from "../NewsFeed/NewsFeed.type";
import { ArticlePreview } from "./ArticlePreview";
import { AudioPreviewThread } from "./AudioPreview";
import { ImageThread } from "./ImageThread";

interface Props {
  metadata: SocialFeedMetadata;
  type: PostCategory;
}

export const SocialThreadContent: React.FC<Props> = ({ metadata, type }) => {
  if (metadata.files?.[0]?.fileType === "image") {
    return <ImageThread metadata={metadata} />;
  }
  if (metadata.files?.[0]?.fileType === "audio") {
    return <AudioPreviewThread metadata={metadata} />;
  }

  return (
    <View>
      {type === PostCategory.Article ||
        (metadata?.message.length > 2500 && (
          <ArticlePreview metadata={metadata} />
        ))}
    </View>
  );
};
