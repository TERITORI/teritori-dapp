import {
  AVPlaybackStatus,
  AVPlaybackStatusSuccess,
  ResizeMode,
  Video,
} from "expo-av";
import React, { FC, useRef, useState } from "react";
import { View } from "react-native";
import { v4 as uuidv4 } from "uuid";

import { Post } from "@/api/feed/v1/feed";
import defaultThumbnailImage from "@/assets/default-images/default-track-thumbnail.png";
import { BrandText } from "@/components/BrandText";
import { MediaPlayerBarRefined } from "@/components/mediaPlayer/MediaPlayerBarRefined";
import { Separator } from "@/components/separators/Separator";
import { MapPostWrapper } from "@/components/socialFeed/Map/MapPosts/MapPostWrapper";
import { SpacerColumn } from "@/components/spacer";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useMediaPlayer } from "@/context/MediaPlayerProvider";
import { web3ToWeb2URI } from "@/utils/ipfs";
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
  const { current: id } = useRef(uuidv4());
  const videoRef = useRef<Video>(null);
  const {
    onVideoStatusUpdate,
    onLayoutPlayerVideo,
    handlePlayPause,
    playbackStatus,
    firstPlayVideo,
    media,
  } = useMediaPlayer();
  const { setToast } = useFeedbacks();
  const [localStatus, setLocalStatus] = useState<AVPlaybackStatusSuccess>();
  const isInMediaPlayer =
    !!media && (post.id === media.postId || media.id === id);
  const statusToUse = isInMediaPlayer ? playbackStatus : localStatus;

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
        isVideo: true,
        thumbnailURI:
          videoPostMetadata.videoFile.thumbnailFileData?.url ||
          defaultThumbnailImage,
      }
    : videoNotePostMetadata?.files
      ? {
          id,
          fileUrl: videoNotePostMetadata.files[0].url,
          duration: videoNotePostMetadata.files[0].videoMetadata?.duration,
          postId: post.id,
          isVideo: true,
          thumbnailURI:
            videoNotePostMetadata.files[0].thumbnailFileData?.url ||
            defaultThumbnailImage,
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

  const onLocalPlaybackStatusUpdate = async (status: AVPlaybackStatus) => {
    if ("uri" in status && status.isLoaded) {
      setLocalStatus(status);
      if (isInMediaPlayer && status.positionMillis > 0) {
        onVideoStatusUpdate(status);
      }
    }
    if ("error" in status) {
      console.error("Error while playbackStatus update: ", status.error);
      setToast({
        mode: "normal",
        type: "error",
        title: `Error while playbackStatus update : ${status.error}`,
      });
    }
  };

  const onPressPlayPause = async () => {
    if (isInMediaPlayer) await handlePlayPause();
    else if (mediaToPlay && videoRef.current)
      firstPlayVideo(videoRef.current, mediaToPlay);
  };

  return (
    <MapPostWrapper post={post} style={{ width: 185 }}>
      <View>
        <BrandText style={fontSemibold10}>{title}</BrandText>
        <SpacerColumn size={0.5} />

        <Separator color={withAlpha(neutralFF, 0.24)} />
        <SpacerColumn size={0.5} />

        {mediaToPlay && videoMetadata ? (
          <View
            onLayout={() => {
              if (isInMediaPlayer && videoRef.current) {
                onLayoutPlayerVideo(videoRef.current);
              }
            }}
          >
            <MediaPlayerBarRefined
              playbackStatus={statusToUse}
              onPressPlayPause={onPressPlayPause}
              isInMediaPlayer={isInMediaPlayer}
            />
            <SpacerColumn size={0.5} />

            <Video
              ref={videoRef}
              status={statusToUse}
              onPlaybackStatusUpdate={onLocalPlaybackStatusUpdate}
              source={{
                uri: web3ToWeb2URI(videoMetadata.videoFile.url),
              }}
              style={{ width: "100%", height: 100 }}
              posterStyle={{ width: "100%", height: 100 }}
              videoStyle={{
                width: "100%",
                height: 100,
                borderRadius: 4,
              }}
              resizeMode={ResizeMode.CONTAIN}
            />
          </View>
        ) : (
          <BrandText style={[fontSemibold10, { color: errorColor }]}>
            No media to play
          </BrandText>
        )}
      </View>
    </MapPostWrapper>
  );
};
