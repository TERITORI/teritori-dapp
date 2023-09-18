import { FC } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { useMediaPlayer } from "../../context/MediaPlayerProvider";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { parseUserId } from "../../networks";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { neutral77 } from "../../utils/style/colors";
import { fontSemibold12 } from "../../utils/style/fonts";
import { tinyAddress } from "../../utils/text";
import { BrandText } from "../BrandText";
import { OmniLink } from "../OmniLink";
import { OptimizedImage } from "../OptimizedImage";
import { SpacerRow } from "../spacer";

export const MediaNameImage: FC<{
  style?: StyleProp<ViewStyle>;
}> = ({ style }) => {
  const { media } = useMediaPlayer();
  const authorNSInfo = useNSUserInfo(media?.createdBy);
  const [, userAddress] = parseUserId(media?.createdBy);
  const username = authorNSInfo?.metadata?.tokenId
    ? authorNSInfo?.metadata?.tokenId
    : tinyAddress(userAddress, 20);

  //TODO: Video in MediaPlayer
  const isVideo = false;
  const imageWidth = isVideo ? 57 : 32;
  const imageHeight = 32;

  if (!media) return <View />;
  return (
    <OmniLink
      style={[{ alignSelf: "flex-start" }, style]}
      to={
        media?.albumId
          ? {
              screen: "MusicAlbum",
              params: { id: media?.albumId },
            }
          : {
              screen: "FeedPostView",
              params: { id: media?.postId || "" },
            }
      }
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <OptimizedImage
          sourceURI={ipfsURLToHTTPURL(media.imageUrl)}
          style={{ height: imageHeight, width: imageWidth }}
          height={imageHeight}
          width={imageWidth}
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
