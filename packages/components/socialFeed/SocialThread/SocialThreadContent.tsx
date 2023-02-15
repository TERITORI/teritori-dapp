import React from "react";
import { View } from "react-native";

import { SOCIAL_FEED_ARTICLE_MIN_CHAR_LIMIT } from "../../../utils/social-feed";
import { layout } from "../../../utils/style/layout";
import { AudioPreview } from "../../FilePreview/AudioPreview";
import { convertGIFToLocalFileType } from "../../FilePreview/UploadedFilePreview/FilePreviewContainer";
import { ImagePreview } from "../../FilePreview/UploadedFilePreview/ImagePreview";
import { VideoPreview } from "../../FilePreview/UploadedFilePreview/VideoPreview";
import { SocialFeedMetadata, PostCategory } from "../NewsFeed/NewsFeed.type";
import { ArticlePreview } from "./ArticlePreview";
import { TextContent } from "./TextContent";
interface Props {
  metadata: SocialFeedMetadata;
  type: PostCategory;
  singleView?: boolean;
}
export const THUMBNAIL_WIDTH = 140;

export const SocialThreadContent: React.FC<Props> = ({
  metadata,
  singleView,
  type,
}) => {
  if (
    type === PostCategory.Article ||
    metadata?.message.length > SOCIAL_FEED_ARTICLE_MIN_CHAR_LIMIT
  ) {
    return (
      <View>
        <ArticlePreview metadata={metadata} singleView={singleView} />
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

        {(metadata.files?.[0]?.fileType === "image" ||
          metadata.gifs?.length) && (
          <ImagePreview
            files={[
              ...(metadata.files || []),
              ...(metadata.gifs || []).map(convertGIFToLocalFileType),
            ]}
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
