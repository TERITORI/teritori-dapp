import { FC } from "react";
import { Image, View } from "react-native";

import { useMediaPlayer } from "../../context/MediaPlayerProvider";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { parseUserId } from "../../networks";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { neutral77 } from "../../utils/style/colors";
import { fontSemibold12 } from "../../utils/style/fonts";
import { tinyAddress } from "../../utils/text";
import { BrandText } from "../BrandText";
import { OmniLink } from "../OmniLink";
import { SpacerRow } from "../spacer";

export const MediaNameImage: FC = () => {
  const { media } = useMediaPlayer();
  const authorNSInfo = useNSUserInfo(media?.createdBy);
  const [, userAddress] = parseUserId(media?.createdBy);
  const username = authorNSInfo?.metadata?.tokenId
    ? authorNSInfo?.metadata?.tokenId
    : tinyAddress(userAddress, 20);

  //TODO: Video in MediaPlayer
  const isVideo = false;

  if (!media) return null;
  return (
    <OmniLink
      to={
        media?.albumId
          ? {
              screen: "MusicPlayerAlbum",
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
        <Image
          source={{ uri: ipfsURLToHTTPURL(media.imageUrl) }}
          style={{ height: 32, width: isVideo ? 57 : 32 }}
        />
        <SpacerRow size={1.5} />
        <View
          style={{
            justifyContent: "space-between",
          }}
        >
          <BrandText style={fontSemibold12}>{media.name}</BrandText>
          {media?.createdBy && (
            // <OmniLink
            //   to={{
            //     screen: "UserPublicProfile",
            //     params: { id: media?.createdBy || "" },
            //   }}
            // >
            <BrandText style={[fontSemibold12, { color: neutral77 }]}>
              {"@" + username}
            </BrandText>
            // </OmniLink>
          )}
        </View>
      </View>
    </OmniLink>
  );
};
