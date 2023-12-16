import React, { Fragment, useMemo } from "react";
import { View } from "react-native";
import { v4 as uuidv4 } from "uuid";

import { ArticleRenderer } from "./ArticleRenderer";
import { Post } from "../../../api/feed/v1/feed";
import { HTML_TAG_REGEXP } from "../../../utils/regex";
import { zodTryParseJSON } from "../../../utils/sanitize";
import { convertGIFToLocalFileType } from "../../../utils/social-feed";
import { AudioView } from "../../FilePreview/AudioView";
import { ImagesViews } from "../../FilePreview/ImagesViews";
import { VideoView } from "../../FilePreview/VideoView";
import { SpacerColumn } from "../../spacer";
import {
  PostCategory,
  ZodSocialFeedPostMetadata,
  ZodSocialFeedArticleMetadata,
} from "../NewsFeed/NewsFeed.type";
import { TextRenderer } from "../NewsFeed/TextRenderer/TextRenderer";
interface Props {
  post: Post;
  isPreview?: boolean;
}

export const SocialMessageContent: React.FC<Props> = ({ post, isPreview }) => {
  const postMetadata = zodTryParseJSON(
    ZodSocialFeedPostMetadata,
    post.metadata,
  );
  const articleMetadata = zodTryParseJSON(
    ZodSocialFeedArticleMetadata,
    post.metadata,
  );
  const metadataToUse =
    post.category === PostCategory.Article ? articleMetadata : postMetadata;

  const audioFiles = useMemo(
    () => metadataToUse?.files?.filter((file) => file.fileType === "audio"),
    [metadataToUse?.files],
  );
  const imageFiles = useMemo(
    () =>
      metadataToUse?.files?.filter(
        (file) => file.fileType === "image" || file.fileType === "base64",
      ),
    [metadataToUse?.files],
  );
  const videoFiles = useMemo(
    () => metadataToUse?.files?.filter((file) => file.fileType === "video"),
    [metadataToUse?.files],
  );
  const gifsFiles = useMemo(() => {
    const fileName = "GIF-" + uuidv4();
    return metadataToUse?.gifs?.map((gif) =>
      convertGIFToLocalFileType(gif, fileName),
    );
  }, [metadataToUse?.gifs]);

  try {
    if (post.category === PostCategory.Article && articleMetadata) {
      return (
        <View>
          <ArticleRenderer
            metadata={articleMetadata}
            audioFiles={audioFiles}
            isPreview={isPreview}
            postId={post.identifier || ""}
            authorId={post.authorId || ""}
          />
        </View>
      );
    } else if (postMetadata) {
      return (
        <>
          <TextRenderer
            isPreview={isPreview}
            text={postMetadata.message.replace(HTML_TAG_REGEXP, "")}
          />

          {gifsFiles?.length || imageFiles?.length ? (
            <ImagesViews
              files={[...(gifsFiles || []), ...(imageFiles || [])]}
            />
          ) : null}

          {videoFiles?.map((file, index) => (
            <>
              <SpacerColumn size={2} />
              <VideoView
                key={index}
                file={file}
                authorId={post.authorId || ""}
                postId={post.identifier || ""}
              />
            </>
          ))}

          {audioFiles?.map((file, index) => (
            <Fragment key={index}>
              {postMetadata.message && <SpacerColumn size={2} />}
              <AudioView
                authorId={post.authorId || ""}
                postId={post.identifier || ""}
                duration={file.audioMetadata?.duration || 0}
                fileUrl={file.url}
                waveform={file.audioMetadata?.waveform || []}
                imageURI={file.thumbnailFileData?.url}
              />
            </Fragment>
          ))}
        </>
      );
    } else {
      return null;
    }
  } catch {
    return null;
  }
};
