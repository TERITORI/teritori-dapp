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
import { errorColor, neutralFF, withAlpha } from "@/utils/style/colors";
import { fontSemibold10 } from "@/utils/style/fonts";
import {
  SocialFeedVideoMetadata,
  zodSocialFeedCommonMetadata,
  ZodSocialFeedPostMetadata,
  ZodSocialFeedVideoMetadata,
} from "@/utils/types/feed";
import { Media } from "@/utils/types/mediaPlayer";

export const VideoMapPost: FC<{
  post: Post;
}> = ({ post }) => {
  const { media } = useMediaPlayer();
  const { current: id } = useRef(uuidv4());
  const videoPostMetadata = zodTryParseJSON(
    ZodSocialFeedVideoMetadata,
    post.metadata,
  );
  const videoNotePostMetadata = zodTryParseJSON(
    ZodSocialFeedPostMetadata,
    post.metadata,
  );
  const baseMetadata = zodTryParseJSON(
    zodSocialFeedCommonMetadata,
    post.metadata,
  );
  const title = baseMetadata?.title || "Music from Social Feed";

  // Video and VideoNote have different metadata but have the same render on the map, so we handle these 2 cases
  const mediaToPlay: Media | undefined = videoPostMetadata
    ? {
        id,
        fileUrl: videoPostMetadata.videoFile.url,
        duration: videoPostMetadata.videoFile.videoMetadata?.duration, // FIXME: Known issue: Always 0. So, for videos, duration is set by playbackStatus, so it's 0 on the timer since the video is not started once
        postId: post.id,
      }
    : videoNotePostMetadata?.files
      ? {
          id,
          fileUrl: videoNotePostMetadata.files[0].url,
          duration: videoNotePostMetadata.files[0].videoMetadata?.duration,
          postId: post.id,
        }
      : undefined;
  const videoMetadata: SocialFeedVideoMetadata | undefined = videoPostMetadata
    ? {
        title: "Video from Social Feed",
        videoFile: videoPostMetadata.videoFile,
      }
    : videoNotePostMetadata?.files
      ? {
          title: "Video from Social Feed",
          videoFile: videoNotePostMetadata.files[0],
        }
      : undefined;

  return (
    <MapPostWrapper post={post} style={{ width: 185 }}>
      <View>
        <BrandText style={fontSemibold10}>{title}</BrandText>
        <SpacerColumn size={0.5} />

        <Separator color={withAlpha(neutralFF, 0.24)} />
        <SpacerColumn size={0.5} />

        {mediaToPlay && videoMetadata ? (
          <>
            <MediaPlayerBarRefined mediaToPlay={mediaToPlay} />
            <SpacerColumn size={0.5} />
            <MediaPlayerVideo
              videoMetadata={videoMetadata}
              style={{
                height: 100,
                borderRadius: 4,
              }}
              resizeMode={ResizeMode.CONTAIN}
              postId={post.id}
              hideControls
              isThumbnailShown={
                !media && !!videoMetadata.videoFile.thumbnailFileData?.url
              }
            />
          </>
        ) : (
          <BrandText style={[fontSemibold10, { color: errorColor }]}>
            No media to play
          </BrandText>
        )}
      </View>
    </MapPostWrapper>
  );
};
