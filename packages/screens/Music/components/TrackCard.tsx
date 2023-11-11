import { FC } from "react";
import { View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { SpacerColumn } from "../../../components/spacer";
import { Track } from "../../../utils/types/music";

export const TRACK_CARD_WIDTH = 242;
export const TrackCard: FC<{ track: Track }> = ({ track }) => {
  return (
    <View>
      <BrandText>{track.title}</BrandText>
      <SpacerColumn size={1} />
      <BrandText>{track.description}</BrandText>
      <SpacerColumn size={1} />
      <BrandText>{track.imageURI}</BrandText>
      <SpacerColumn size={1} />
      <BrandText>{track.audioURI}</BrandText>
      <SpacerColumn size={1} />
    </View>
  );
};
