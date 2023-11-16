import React, { useMemo, useState } from "react";
import { View, Image, ViewStyle, TextStyle, ImageStyle } from "react-native";

import { Post } from "../../../api/feed/v1/feed";
import { BrandText } from "../../../components/BrandText";
import { AudioView } from "../../../components/FilePreview/AudioView";
import { OmniLink } from "../../../components/OmniLink";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { DotSeparator } from "../../../components/separators/DotSeparator";
import { getMusicAudioPostTrack } from "../../../components/socialFeed/NewsFeed/NewsFeedQueries";
import { DateTime } from "../../../components/socialFeed/SocialThread/DateTime";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useNSUserInfo } from "../../../hooks/useNSUserInfo";
import { useSelectedNetworkInfo } from "../../../hooks/useSelectedNetwork";
import { getNetworkObjectId, parseUserId } from "../../../networks";
import { ipfsURLToHTTPURL } from "../../../utils/ipfs";
import { useAppNavigation } from "../../../utils/navigation";
import {
  neutral17,
  neutral77,
  primaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14, fontMedium13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { tinyAddress } from "../../../utils/text";
import { Track } from "../../../utils/types/music";

const IMAGE_HEIGHT = 116;
export const TRACK_CARD_WIDTH = 666;
export const TrackCard: React.FC<{
  post: Post;
  hideAuthor?: boolean;
}> = ({ post, hideAuthor }) => {
  const track: Track | undefined = useMemo(
    () => getMusicAudioPostTrack(post),
    [post],
  );
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const authorNSInfo = useNSUserInfo(post.authorId);
  const [, userAddress] = parseUserId(post.authorId);
  const [isHovered, setIsHovered] = useState(false);
  const navigation = useAppNavigation();

  const username = authorNSInfo?.metadata?.tokenId
    ? authorNSInfo?.metadata?.tokenId
    : tinyAddress(userAddress, 16);

  if (!track) return null;
  return (
    <View style={unitCardStyle}>
      <CustomPressable
        onHoverOut={() => setIsHovered(false)}
        onHoverIn={() => setIsHovered(true)}
        onPress={() =>
          navigation.navigate("FeedPostView", {
            id: getNetworkObjectId(
              selectedNetworkInfo?.id || "",
              post.identifier,
            ),
          })
        }
      >
        <Image
          source={{ uri: ipfsURLToHTTPURL(track.imageURI) }}
          style={[isHovered && { opacity: 0.5 }, contentImgStyle]}
        />
      </CustomPressable>
      <SpacerRow size={1.5} />

      <View style={{ justifyContent: "space-between", width: "100%", flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <BrandText style={contentTitleStyle} numberOfLines={1}>
              {track.title}
            </BrandText>
            <SpacerRow size={1.5} />
            {/*Author and date*/}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {!hideAuthor && (
                <>
                  <SpacerColumn size={1} />
                  <OmniLink
                    to={{
                      screen: "UserPublicProfile",
                      params: { id: post.authorId },
                    }}
                  >
                    <BrandText style={contentNameStyle}>@{username}</BrandText>
                  </OmniLink>
                </>
              )}
              <DotSeparator />
              <DateTime
                date={track.createdAt}
                textStyle={{ color: neutral77 }}
              />
            </View>
          </View>
          <SpacerColumn size={0.5} />

          <BrandText style={contentDescriptionStyle} numberOfLines={2}>
            {track.description.trim()}
          </BrandText>
        </View>

        <AudioView
          duration={track.duration}
          fileUrl={track.audioURI}
          waveform={track.waveform}
          authorId={post.authorId}
          postId={post.identifier}
        />
      </View>

      {/*TODO: Nb COMMENTS=> click redirects to post view*/}

      {/*TODO: REACTIONS*/}
      {/*<Reactions*/}
      {/*  nbShown={nbReactionsShown(viewWidth)}*/}
      {/*  reactions={localPost.reactions}*/}
      {/*  onPressReaction={handleReaction}*/}
      {/*  isLoading={isPostMutationLoading}*/}
      {/*/>*/}
    </View>
  );
};

const unitCardStyle: ViewStyle = {
  width: TRACK_CARD_WIDTH,
  padding: layout.spacing_x1_5,
  backgroundColor: neutral17,
  borderRadius: 12,
  flexDirection: "row",
};
const contentTitleStyle: TextStyle = { ...fontSemibold14 };
const contentDescriptionStyle: TextStyle = {
  ...fontMedium13,

  color: neutral77,
};
const contentImgStyle: ImageStyle = {
  borderRadius: 8,
  aspectRatio: 1,
  height: IMAGE_HEIGHT,
};
const contentNameStyle: TextStyle = {
  ...fontSemibold14,

  color: primaryColor,
};
