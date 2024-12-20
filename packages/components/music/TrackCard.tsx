import { isEqual } from "lodash";
import React, { memo, useMemo, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { TrackOptionsButton } from "./TrackOptionsButton";
import { BrandText } from "../BrandText";
import { OptimizedImage } from "../OptimizedImage";
import { SVG } from "../SVG";
import { CustomPressable } from "../buttons/CustomPressable";
import { SpacerColumn } from "../spacer";
import { Username } from "../user/Username";

import { Post } from "@/api/feed/v1/feed";
import defaultThumbnailImage from "@/assets/default-images/default-track-thumbnail.png";
import NormalPlay from "@/assets/icons/music/normal-play.svg";
import { LocationButton } from "@/components/socialFeed/NewsFeed/LocationButton";
import { useMediaPlayer } from "@/context/MediaPlayerProvider";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { zodTryParseJSON } from "@/utils/sanitize";
import {
  neutral17,
  neutral77,
  neutralFF,
  primaryColor,
} from "@/utils/style/colors";
import { fontRegular13, fontRegular14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { ZodSocialFeedTrackMetadata } from "@/utils/types/feed";
import { Media } from "@/utils/types/mediaPlayer";

const BUTTONS_HEIGHT = 28;
export const TRACK_CARD_WIDTH = 242;
export const TrackCard: React.FC<{
  post: Post;
  hideAuthor?: boolean;
  style?: StyleProp<ViewStyle>;
}> = memo(({ post, hideAuthor, style }) => {
  const track = zodTryParseJSON(ZodSocialFeedTrackMetadata, post.metadata);
  const [isHovered, setIsHovered] = useState(false);
  const navigation = useAppNavigation();
  let cardWidth = StyleSheet.flatten(style)?.width;
  if (typeof cardWidth !== "number") {
    cardWidth = TRACK_CARD_WIDTH;
  }
  const imageSize = cardWidth - layout.spacing_x1_5 * 2;

  const { loadAndPlaySoundsQueue } = useMediaPlayer();

  const onPressPlayTrack = async () => {
    if (!track) return;
    const mediaToPlay: Media = {
      fileUrl: track.audioFile.url,
      duration: track.audioFile.audioMetadata?.duration,
      postId: post.id,
    };
    await loadAndPlaySoundsQueue([mediaToPlay]);
  };

  const imageStyle = useMemo(() => {
    return [isHovered && { opacity: 0.5 }];
  }, [isHovered]);

  return (
    <View style={[unitCardStyle, style]}>
      <View>
        <CustomPressable
          onHoverIn={() => setIsHovered(true)}
          onHoverOut={() => setIsHovered(false)}
          style={imgBoxStyle}
          onPress={() => {
            navigation.navigate("FeedPostView", {
              id: post.id,
            });
          }}
        >
          <OptimizedImage
            sourceURI={track?.audioFile.thumbnailFileData?.url}
            fallbackURI={defaultThumbnailImage}
            width={250}
            height={250}
            style={[
              imageStyle,
              { width: imageSize, height: imageSize, borderRadius: 8 },
            ]}
          />
          <SpacerColumn size={1.5} />

          <View style={imgButtonsBoxStyle}>
            <TouchableOpacity onPress={onPressPlayTrack}>
              <SVG
                source={NormalPlay}
                width={BUTTONS_HEIGHT}
                height={BUTTONS_HEIGHT}
              />
            </TouchableOpacity>

            <CustomPressable onPress={(e) => e.stopPropagation()}>
              <TrackOptionsButton
                trackName={track?.title || "Track"}
                post={post}
              />
            </CustomPressable>
          </View>

          {track?.location && (
            <View style={positionButtonBoxStyle}>
              <LocationButton
                onPress={() =>
                  track.location &&
                  navigation.navigate("Feed", {
                    tab: "map",
                    post: post.id,
                  })
                }
                stroke={neutralFF}
              />
            </View>
          )}
        </CustomPressable>
        <BrandText style={[fontRegular14, { height: 40 }]} numberOfLines={2}>
          {track?.title || ""}
        </BrandText>
        <SpacerColumn size={0.5} />
        <BrandText style={contentDescriptionStyle} numberOfLines={2}>
          {track?.description || "No description"}
        </BrandText>
      </View>
      {!hideAuthor && (
        <>
          <SpacerColumn size={1} />
          <Username
            userId={post.authorId}
            textStyle={contentNameStyle}
            namedColor={contentNameStyle.color}
            anonColor={contentNameStyle.color}
          />
        </>
      )}
    </View>
  );
}, isEqual);

const unitCardStyle: ViewStyle = {
  width: TRACK_CARD_WIDTH,
  backgroundColor: neutral17,
  padding: layout.spacing_x1_5,
  borderRadius: 12,
  justifyContent: "space-between",
};

const imgBoxStyle: ViewStyle = {
  position: "relative",
};

const imgButtonsBoxStyle: ViewStyle = {
  position: "absolute",
  paddingHorizontal: layout.spacing_x1_5,
  flexDirection: "row",
  width: "100%",
  bottom: layout.spacing_x1_5 * 2,
  right: 0,
  justifyContent: "space-between",
};

const positionButtonBoxStyle: ViewStyle = {
  position: "absolute",
  top: layout.spacing_x1_5,
  right: layout.spacing_x1_5,
};

const contentDescriptionStyle: TextStyle = {
  ...fontRegular13,
  color: neutral77,
};

const contentNameStyle: TextStyle = {
  ...fontRegular14,
  color: primaryColor,
};
