import { ResizeMode } from "expo-av";
import { FC } from "react";
import { ImageStyle, StyleProp, View, ViewStyle } from "react-native";

import { useMediaPlayer } from "../../context/MediaPlayerProvider";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { getNetworkObjectId, parseUserId } from "../../networks";
import { neutral77 } from "../../utils/style/colors";
import { fontSemibold12 } from "../../utils/style/fonts";
import { tinyAddress } from "../../utils/text";
import { BrandText } from "../BrandText";
import { OmniLink } from "../OmniLink";
import { OptimizedImage } from "../OptimizedImage";
import { SpacerRow } from "../spacer";

const IMAGE_SIZE = 32;
export const MediaNameImage: FC<{
  style?: StyleProp<ViewStyle>;
}> = ({ style }) => {
  const { media } = useMediaPlayer();
  const authorNSInfo = useNSUserInfo(media?.createdBy);
  const [network, userAddress] = parseUserId(media?.createdBy);
  const username = authorNSInfo?.metadata?.tokenId
    ? authorNSInfo?.metadata?.tokenId
    : tinyAddress(userAddress, 20);

  if (!media) return <View />;
  return (
    <OmniLink
      style={[{ alignSelf: "flex-start" }, style]}
      to={{
        screen: "FeedPostView",
        params: {
          id: getNetworkObjectId(network?.id, media?.postId) || "",
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
          sourceURI={media.imageUrl}
          style={imageCStyle}
          height={IMAGE_SIZE}
          width={IMAGE_SIZE}
          resizeMode={ResizeMode.CONTAIN}
        />
        <SpacerRow size={1.5} />
        <View
          style={{
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <BrandText style={fontSemibold12} isTicker>
            {media.name}
          </BrandText>
          {media?.createdBy && (
            <BrandText
              style={[fontSemibold12, { color: neutral77 }]}
              ellipsizeMode="middle"
              numberOfLines={1}
            >
              {"@" + username}
            </BrandText>
          )}
        </View>
      </View>
    </OmniLink>
  );
};

const imageCStyle: ImageStyle = { height: IMAGE_SIZE, width: IMAGE_SIZE };
