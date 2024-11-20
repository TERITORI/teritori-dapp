import { ResizeMode } from "expo-av";
import { FC } from "react";
import { ImageStyle, StyleProp, View, ViewStyle } from "react-native";

import { BrandText } from "../BrandText";
import { OmniLink } from "../OmniLink";
import { OptimizedImage } from "../OptimizedImage";
import { SpacerRow } from "../spacer";
import { Username } from "../user/Username";

import { usePost } from "@/hooks/feed/usePost";
import { zodTryParseJSON } from "@/utils/sanitize";
import { neutral77 } from "@/utils/style/colors";
import { fontSemibold12 } from "@/utils/style/fonts";
import { zodSocialFeedCommonMetadata } from "@/utils/types/feed";
import { Media } from "@/utils/types/mediaPlayer";

const IMAGE_SIZE = 32;

export const MediaNameImage: FC<{
  media: Media | undefined;
  style?: StyleProp<ViewStyle>;
}> = ({ media, style }) => {
  const { post } = usePost(media?.postId);
  if (!media || !post) return <View />;
  const baseMetadata = zodTryParseJSON(
    zodSocialFeedCommonMetadata,
    post.metadata,
  );
  const title =
    baseMetadata?.title ||
    `${media.isVideo ? "Video" : "Audio"} from Social Feed`;

  return (
    <OmniLink
      style={[{ alignSelf: "flex-start" }, style]}
      to={{
        screen: "FeedPostView",
        params: {
          id: media.postId,
        },
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <OptimizedImage
          sourceURI={media.thumbnailURI}
          style={imageCStyle}
          height={IMAGE_SIZE}
          width={IMAGE_SIZE}
          resizeMode={ResizeMode.COVER}
        />
        <SpacerRow size={1.5} />
        <View
          style={{
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <BrandText style={fontSemibold12} isTicker numberOfLines={1}>
            {title}
          </BrandText>
          <Username
            userId={post?.authorId}
            textStyle={fontSemibold12}
            anonColor={neutral77}
            namedColor={neutral77}
          />
        </View>
      </View>
    </OmniLink>
  );
};

const imageCStyle: ImageStyle = {
  height: IMAGE_SIZE,
  width: IMAGE_SIZE,
  borderRadius: 8,
};
