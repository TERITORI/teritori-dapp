import React from "react";
import { View } from "react-native";

import { layout } from "../../utils/style/layout";
import { AudioPreview } from "../FilePreview/AudioPreview";
import { ImagePreview } from "../FilePreview/UploadedFilePreview/ImagePreview";
import { VideoPreview } from "../FilePreview/UploadedFilePreview/VideoPreview";
import { SocialFeedMetadata, PostCategory } from "../NewsFeed/NewsFeed.type";
import { ArticlePreview } from "./ArticlePreview";
import { TextContent } from "./TextContent";
interface Props {
  metadata: SocialFeedMetadata;
  type: PostCategory;
}

export const SocialThreadContent: React.FC<Props> = ({ metadata, type }) => {
  if (type === PostCategory.Article || metadata?.message.length > 1000) {
    return (
      <View>
        <ArticlePreview metadata={metadata} />
      </View>
    );
  } else {
    return (
      <View
        style={{
          paddingBottom: layout.padding_x1,
        }}
      >
        <TextContent metadata={metadata} />
        {metadata.files?.[0]?.fileType === "video" && (
          <VideoPreview file={metadata.files[0]} onDelete={() => null} />
        )}

        {metadata.files?.[0]?.fileType === "image" && (
          <ImagePreview
            files={metadata.files || []}
            isEditable={false}
            onDelete={() => null}
          />
        )}
        {metadata.files?.[0]?.fileType === "audio" && (
          <AudioPreview file={metadata.files?.[0]} />
        )}
      </View>
    );
  }
};
