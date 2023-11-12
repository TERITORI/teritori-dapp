import React, { FC } from "react";

import { neutralA3 } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { Track } from "../../../utils/types/music";
import { BrandText } from "../../BrandText";
import { AudioView } from "../../FilePreview/AudioView";
import { SpacerColumn } from "../../spacer";

export const MusicPostTrackContent: FC<{ track?: Track }> = ({ track }) => {
  if (!track) return null;
  return (
    <>
      <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
        {track.title}
      </BrandText>
      <SpacerColumn size={2} />
      <AudioView
        duration={track.duration}
        fileUrl={track.audioURI}
        waveform={track.waveform}
        thumbnailUrl={track.imageURI}
      />
    </>
  );
};
