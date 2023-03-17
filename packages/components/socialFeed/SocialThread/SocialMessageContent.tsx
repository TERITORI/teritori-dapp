import React from "react";
import { View } from "react-native";

import { SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT } from "../../../utils/social-feed";
import { AudioPreview } from "../../FilePreview/AudioPreview";
import { convertGIFToLocalFileType } from "../../FilePreview/UploadedFilePreview/FilePreviewContainer";
import { ImagePreview } from "../../FilePreview/UploadedFilePreview/ImagePreview";
import { VideoPreview } from "../../FilePreview/UploadedFilePreview/VideoPreview";
import { SocialFeedMetadata, PostCategory } from "../NewsFeed/NewsFeed.type";
import { ArticlePreview } from "./ArticlePreview";
import { TextContent } from "./TextContent";
interface Props {
  metadata: SocialFeedMetadata;
  postCategory: PostCategory;
  isPostConsultation?: boolean;
}
export const THUMBNAIL_WIDTH = 140;

export const SocialMessageContent: React.FC<Props> = ({
  metadata,
  isPostConsultation,
  postCategory,
}) => {
  if (
    postCategory === PostCategory.Article ||
    metadata?.message.length > SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT
  ) {
    return (
      <View>
        <ArticlePreview
          metadata={metadata}
          isPostConsultation={isPostConsultation}
        />
      </View>
    );
  } else {
    return (
      <>
        <TextContent metadata={metadata} />

        {metadata.files?.[0]?.fileType === "video" && (
          <VideoPreview file={metadata.files[0]} onDelete={() => null} />
        )}

        {metadata.files?.[0]?.fileType === "image" || metadata.gifs?.length ? (
          <ImagePreview
            files={[
              ...(metadata.files || []),
              ...(metadata.gifs || []).map(convertGIFToLocalFileType),
            ]}
            isEditable={false}
            onDelete={() => null}
          />
        ) : null}

        {metadata.files?.[0]?.fileType === "audio" && (
          <AudioPreview file={metadata.files?.[0]} />
        )}
      </>
    );
  }
};
