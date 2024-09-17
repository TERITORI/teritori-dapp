import React, { FC, useRef } from "react";
import { View } from "react-native";
import { v4 as uuidv4 } from "uuid";

import { Post } from "@/api/feed/v1/feed";
import { BrandText } from "@/components/BrandText";
import { MediaPlayerBarRefined } from "@/components/mediaPlayer/MediaPlayerBarRefined";
import { Separator } from "@/components/separators/Separator";
import { MapPostWrapper } from "@/components/socialFeed/Map/MapPosts/MapPostWrapper";
import { SpacerColumn } from "@/components/spacer";
import { zodTryParseJSON } from "@/utils/sanitize";
import { errorColor, neutralFF, withAlpha } from "@/utils/style/colors";
import { fontSemibold10 } from "@/utils/style/fonts";
import {
  zodSocialFeedCommonMetadata,
  ZodSocialFeedPostMetadata,
  ZodSocialFeedTrackMetadata,
} from "@/utils/types/feed";
import { Media } from "@/utils/types/mediaPlayer";

export const MusicMapPost: FC<{
  post: Post;
}> = ({ post }) => {
  const { current: id } = useRef(uuidv4());
  const musicAudioNotePostMetadata = zodTryParseJSON(
    ZodSocialFeedTrackMetadata,
    post.metadata,
  );
  const musicPostMetadata = zodTryParseJSON(
    ZodSocialFeedPostMetadata,
    post.metadata,
  );
  const baseMetadata = zodTryParseJSON(
    zodSocialFeedCommonMetadata,
    post.metadata,
  );
  const title = baseMetadata?.title || "Music from Social Feed";

  // MusicAudio and Music have different metadata but have the same render on the map, so we handle these 2 cases
  const mediaToPlay: Media | undefined = musicAudioNotePostMetadata
    ? {
        id,
        fileUrl: musicAudioNotePostMetadata.audioFile.url,
        duration: musicAudioNotePostMetadata.audioFile.audioMetadata?.duration,
        postId: post.id,
      }
    : musicPostMetadata?.files
      ? {
          id,
          fileUrl: musicPostMetadata.files[0].url,
          duration: musicPostMetadata.files[0].audioMetadata?.duration,
          postId: post.id,
        }
      : undefined;

  return (
    <MapPostWrapper post={post} style={{ width: 185 }}>
      <View style={{ width: "100%" }}>
        <BrandText style={fontSemibold10}>{title}</BrandText>
        <SpacerColumn size={0.5} />

        <Separator color={withAlpha(neutralFF, 0.24)} />
        <SpacerColumn size={0.5} />

        {mediaToPlay ? (
          <MediaPlayerBarRefined mediaToPlay={mediaToPlay} />
        ) : (
          <BrandText style={[fontSemibold10, { color: errorColor }]}>
            No media to play
          </BrandText>
        )}
      </View>
    </MapPostWrapper>
  );
};
