import { ResizeMode } from "expo-av";
import React, { FC, useRef } from "react";
import { View } from "react-native";
import { v4 as uuidv4 } from "uuid";

import { Post } from "@/api/feed/v1/feed";
import { BrandText } from "@/components/BrandText";
import { MediaPlayerBarRefined } from "@/components/mediaPlayer/MediaPlayerBarRefined";
import { MediaPlayerVideo } from "@/components/mediaPlayer/MediaPlayerVideo";
import { Separator } from "@/components/separators/Separator";
import { MapPostWrapper } from "@/components/socialFeed/Map/MapPosts/MapPostWrapper";
import { SpacerColumn } from "@/components/spacer";
import { useMediaPlayer } from "@/context/MediaPlayerProvider";
import { zodTryParseJSON } from "@/utils/sanitize";
import { errorColor } from "@/utils/style/colors";
import { fontSemibold10 } from "@/utils/style/fonts";
import {
  zodSocialFeedCommonMetadata,
  ZodSocialFeedVideoMetadata,
} from "@/utils/types/feed";
import { Media } from "@/utils/types/mediaPlayer";

export const VideoMapPost: FC<{
  post: Post;
}> = ({ post }) => {
  const { media } = useMediaPlayer();
  const { current: id } = useRef(uuidv4());
  const video = zodTryParseJSON(ZodSocialFeedVideoMetadata, post.metadata);
  const baseMetadata = zodTryParseJSON(
    zodSocialFeedCommonMetadata,
    post.metadata,
  );
  const title = baseMetadata?.title || "Music from Social Feed";

  const mediaToPlay: Media | undefined = video && {
    id,
    fileUrl: video.videoFile.url,
    duration: video.videoFile.videoMetadata?.duration, // FIXME: Known issue: Always 0. So, for videos, duration is set by playbackStatus, so it's 0 on the timer since the video is not started once
    postId: post.id,
  };

  return (
    <MapPostWrapper post={post} style={{ width: 185 }}>
      <View>
        <BrandText style={fontSemibold10}>{title}</BrandText>
        <SpacerColumn size={0.5} />

        <Separator />
        <SpacerColumn size={0.5} />

        {mediaToPlay ? (
          <MediaPlayerBarRefined mediaToPlay={mediaToPlay} />
        ) : (
          <BrandText style={[fontSemibold10, { color: errorColor }]}>
            No media to play
          </BrandText>
        )}
        <SpacerColumn size={0.5} />

        {!video?.videoFile ? (
          <BrandText style={[fontSemibold10, { color: errorColor }]}>
            Video not found
          </BrandText>
        ) : (
          <MediaPlayerVideo
            videoMetadata={video}
            style={{
              height: 100,
              borderRadius: 4,
            }}
            resizeMode={ResizeMode.CONTAIN}
            postId={post.id}
            hideControls
            isThumbnailShown={
              !media && !!video.videoFile.thumbnailFileData?.url
            }
          />
        )}
      </View>
    </MapPostWrapper>
  );
};
