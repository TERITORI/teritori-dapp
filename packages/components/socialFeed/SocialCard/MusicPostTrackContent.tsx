import React, { FC } from "react";

import defaultThumbnailImage from "../../../../assets/default-images/default-track-thumbnail.png";
import { neutralA3 } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText";
import { AudioView } from "../../FilePreview/AudioView";
import { SpacerColumn } from "../../spacer";
import { SocialFeedTrackMetadata } from "../NewsFeed/NewsFeed.type";

export const MusicPostTrackContent: FC<{
  track?: SocialFeedTrackMetadata;
  postId: string;
}> = ({ track, postId }) => {
  if (!track) return null;
  return (
    <>
      <BrandText>{track.title}</BrandText>
      <SpacerColumn size={1} />
      <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
        {track.description}
      </BrandText>
      <SpacerColumn size={2} />
      <AudioView
        duration={track.audioFile.audioMetadata?.duration || 0}
        fileUrl={track.audioFile.url}
        waveform={track.audioFile.audioMetadata?.waveform || []}
        fallbackImageSource={defaultThumbnailImage}
        thumbnailUrl={track.audioFile.thumbnailFileData?.url}
        authorId={track.authorId}
        postId={postId}
      />
    </>
  );
};
