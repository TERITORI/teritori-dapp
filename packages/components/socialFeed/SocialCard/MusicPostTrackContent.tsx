import React, { FC } from "react";

import { neutralA3 } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { Track } from "../../../utils/types/music";
import { BrandText } from "../../BrandText";
import { AudioView } from "../../FilePreview/AudioView";
import { SpacerColumn } from "../../spacer";

export const MusicPostTrackContent: FC<{ track?: Track; postId: string }> = ({
  track,
  postId,
}) => {
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
        duration={track.duration}
        fileUrl={track.audioURI}
        waveform={track.waveform}
        thumbnailUrl={track.imageURI}
        authorId={track.authorId}
        postId={postId}
      />
    </>
  );
};
