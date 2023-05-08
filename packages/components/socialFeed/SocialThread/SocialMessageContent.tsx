import React, { useMemo } from "react";
import { View } from "react-native";
import { v4 as uuidv4 } from "uuid";

import { ArticleRenderer } from "./ArticleRenderer";
import { HTML_TAG_REGEXP } from "../../../utils/regex";
import {
  convertGIFToLocalFileType,
  SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT,
} from "../../../utils/social-feed";
import { AudioView } from "../../FilePreview/AudioView";
import { ImagesViews } from "../../FilePreview/ImagesViews";
import { VideoView } from "../../FilePreview/VideoView";
import { SocialFeedMetadata, PostCategory } from "../NewsFeed/NewsFeed.type";
import { TextRenderer } from "../NewsFeed/TextRenderer/TextRenderer";
interface Props {
  metadata: SocialFeedMetadata;
  postCategory: PostCategory;
  isPreview?: boolean;
}
export const THUMBNAIL_WIDTH = 140;

export const SocialMessageContent: React.FC<Props> = ({
  metadata,
  postCategory,
  isPreview,
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
        <ArticleRenderer
          metadata={metadata}
          audioFiles={audioFiles}
          isPreview={isPreview}
        />
      </View>
    );
  } else {
    return (
      <>
        <TextRenderer
          isPreview={isPreview}
          text={metadata.message.replace(HTML_TAG_REGEXP, "")}
        />

        {gifsFiles?.length || imageFiles?.length ? (
          <ImagesViews files={[...(gifsFiles || []), ...(imageFiles || [])]} />
        ) : null}

        {videoFiles?.map((file, index) => (
          <VideoView key={index} file={file} />
        ))}

        {audioFiles?.map((file, index) => (
          <AudioView key={index} file={file} />
        ))}
      </>
    );
  }
};
