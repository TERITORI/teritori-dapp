import { FC, useRef } from "react";
import { View } from "react-native";
import { v4 as uuidv4 } from "uuid";

import { Post } from "@/api/feed/v1/feed";
import { BrandText } from "@/components/BrandText";
import { MediaPlayerBarRefined } from "@/components/mediaPlayer/MediaPlayerBarRefined";
import { Separator } from "@/components/separators/Separator";
import { MapPostWrapper } from "@/components/socialFeed/NewsFeed/FeedMapList/MapPosts/MapPostWrapper";
import { SpacerColumn } from "@/components/spacer";
import { zodTryParseJSON } from "@/utils/sanitize";
import { errorColor } from "@/utils/style/colors";
import { fontSemibold10 } from "@/utils/style/fonts";
import {
  zodSocialFeedCommonMetadata,
  ZodSocialFeedTrackMetadata,
} from "@/utils/types/feed";
import { Media } from "@/utils/types/mediaPlayer";

export const MusicMapPost: FC<{
  post: Post;
}> = ({ post }) => {
  const { current: id } = useRef(uuidv4());
  const track = zodTryParseJSON(ZodSocialFeedTrackMetadata, post.metadata);

  const baseMetadata = zodTryParseJSON(
    zodSocialFeedCommonMetadata,
    post.metadata,
  );
  const title = baseMetadata?.title || "Music from Social Feed";

  const mediaToPlay: Media | undefined = track && {
    id,
    fileUrl: track.audioFile.url,
    duration: track.audioFile.audioMetadata?.duration,
    postId: post.id,
  };

  return (
    <MapPostWrapper post={post} style={{ width: 185 }}>
      <View style={{ width: "100%" }}>
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
      </View>
    </MapPostWrapper>
  );
};
