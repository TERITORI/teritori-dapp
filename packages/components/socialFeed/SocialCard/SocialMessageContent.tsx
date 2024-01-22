import React, { Fragment, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

import defaultThumbnailImage from "../../../../assets/default-images/default-track-thumbnail.png";
import { Post } from "../../../api/feed/v1/feed";
import { HTML_TAG_REGEXP } from "../../../utils/regex";
import { zodTryParseJSON } from "../../../utils/sanitize";
import { convertGIFToLocalFileType } from "../../../utils/social-feed";
import { AudioView } from "../../FilePreview/AudioView";
import { ImagesViews } from "../../FilePreview/ImagesViews";
import { VideoView } from "../../FilePreview/VideoView";
import { SpacerColumn } from "../../spacer";
import { ZodSocialFeedPostMetadata } from "../NewsFeed/NewsFeed.type";
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
  const audioFiles = useMemo(
    () => postMetadata?.files?.filter((file) => file.fileType === "audio"),
    [postMetadata?.files],
  );
  const imageFiles = useMemo(
    () =>
      postMetadata?.files?.filter(
        (file) => file.fileType === "image" || file.fileType === "base64",
      ),
    [postMetadata?.files],
  );
  const videoFiles = useMemo(
    () => postMetadata?.files?.filter((file) => file.fileType === "video"),
    [postMetadata?.files],
  );
  const gifsFiles = useMemo(() => {
    const fileName = "GIF-" + uuidv4();
    return postMetadata?.gifs?.map((gif) =>
      convertGIFToLocalFileType(gif, fileName),
    );
  }, [postMetadata?.gifs]);

  try {
    if (!postMetadata) return null;
    return (
      <>
        <TextRenderer
          isPreview={isPreview}
          text={postMetadata.message.replace(HTML_TAG_REGEXP, "")}
        />

        {gifsFiles?.length || imageFiles?.length ? (
          <ImagesViews files={[...(gifsFiles || []), ...(imageFiles || [])]} />
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
              fallbackImageURI={defaultThumbnailImage}
            />
          </Fragment>
        ))}
      </>
    );
  } catch {
    return null;
  }
};
