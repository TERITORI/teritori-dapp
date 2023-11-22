import React, { FC } from "react";

import defaultThumbnailImage from "../../../../assets/default-images/default-track-thumbnail.png";
import { Post } from "../../../api/feed/v1/feed";
import { zodTryParseJSON } from "../../../utils/sanitize";
import { neutralA3 } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText";
import { AudioView } from "../../FilePreview/AudioView";
import { SpacerColumn } from "../../spacer";
import { ZodSocialFeedTrackMetadata } from "../NewsFeed/NewsFeed.type";

export const MusicPostTrackContent: FC<{
  post: Post;
}> = ({ post }) => {
  const track = zodTryParseJSON(ZodSocialFeedTrackMetadata, post.metadata);
  if (!track) return null;
  return (
    <>
      <BrandText>{track.title}</BrandText>

      {track.description && (
        <>
          <SpacerColumn size={1} />
          <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
            {track.description}
          </BrandText>
        </>
      )}

      <SpacerColumn size={2} />
      <AudioView
        duration={track.audioFile.audioMetadata?.duration || 0}
        fileUrl={track.audioFile.url}
        waveform={track.audioFile.audioMetadata?.waveform || []}
        fallbackImageURI={defaultThumbnailImage}
        imageURI={track.audioFile.thumbnailFileData?.url}
        authorId={post.authorId}
        postId={post.identifier}
      />
    </>
  );
};
