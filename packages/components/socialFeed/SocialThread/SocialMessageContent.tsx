import React, { useMemo } from "react";
import { View } from "react-native";
import { v4 as uuidv4 } from "uuid";

import { SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT } from "../../../utils/social-feed";
import { AudioPreview } from "../../FilePreview/AudioPreview";
import { convertGIFToLocalFileType } from "../../FilePreview/FilesPreviewsContainer";
import { ImagesPreviews } from "../../FilePreview/ImagesPreviews";
import { VideoPreview } from "../../FilePreview/VideoPreview";
import { SocialFeedMetadata, PostCategory } from "../NewsFeed/NewsFeed.type";
import { ArticlePreview } from "./ArticlePreview";
import { TextContent } from "./TextContent";
interface Props {
  metadata: SocialFeedMetadata;
  postCategory: PostCategory;
}
export const THUMBNAIL_WIDTH = 140;

export const SocialMessageContent: React.FC<Props> = ({
  metadata,
  postCategory,
}) => {
  const audioFiles = useMemo(
    () => metadata.files?.filter((file) => file.fileType === "audio"),
    [metadata.files]
  );
  const imageFiles = useMemo(
    () =>
      metadata.files?.filter(
        (file) => file.fileType === "image" || file.fileType === "base64"
      ),
    [metadata.files]
  );
  const videoFiles = useMemo(
    () => metadata.files?.filter((file) => file.fileType === "video"),
    [metadata.files]
  );
  const gifsFiles = useMemo(() => {
    const fileName = "GIF-" + uuidv4();
    return metadata.gifs?.map((gif) =>
      convertGIFToLocalFileType(gif, fileName)
    );
  }, [metadata.gifs]);

  if (
    postCategory === PostCategory.Article ||
    metadata?.message.length > SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT
  ) {
    return (
      <View>
        <ArticlePreview metadata={metadata} audioFiles={audioFiles} />
      </View>
    );
  } else {
    return (
      <>
        <TextContent metadata={metadata} />

        {gifsFiles?.length || imageFiles?.length ? (
          <ImagesPreviews
            files={[...(gifsFiles || []), ...(imageFiles || [])]}
          />
        ) : null}

        {videoFiles?.map((file, index) => (
          <VideoPreview key={index} file={file} />
        ))}

        {audioFiles?.map((file, index) => (
          <AudioPreview key={index} file={file} />
        ))}
      </>
    );
  }
};
