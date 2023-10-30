import React, { useRef, useState } from "react";
import {
  View,
  Image,
  ViewStyle,
  TextStyle,
  ImageStyle,
  TouchableOpacity,
} from "react-native";

import { VideoHoverMenu } from "./VideoHoverMenu";
import ThreeDotsCircleWhite from "../../../../../assets/icons/video-player/three-dot-circle-white.svg";
import { BrandText } from "../../../../components/BrandText";
import { OmniLink } from "../../../../components/OmniLink";
import { SVG } from "../../../../components/SVG";
import { CustomPressable } from "../../../../components/buttons/CustomPressable";
import { UserAvatarWithFrame } from "../../../../components/images/AvatarWithFrame";
import { DotSeparator } from "../../../../components/separators/DotSeparator";
import { DateTime } from "../../../../components/socialFeed/SocialThread/DateTime";
import { SpacerColumn, SpacerRow } from "../../../../components/spacer";
import { useDropdowns } from "../../../../context/DropdownsProvider";
import { useNSUserInfo } from "../../../../hooks/useNSUserInfo";
import { useFetchLibraryIds } from "../../../../hooks/videoplayer/useFetchLibraryIds";
import { parseUserId } from "../../../../networks";
import { ipfsURLToHTTPURL } from "../../../../utils/ipfs";
import { prettyMediaDuration } from "../../../../utils/mediaPlayer";
import { useAppNavigation } from "../../../../utils/navigation";
import {
  neutral22,
  neutral77,
  withAlpha,
} from "../../../../utils/style/colors";
import {
  fontMedium13,
  fontSemibold13,
  fontSemibold14,
} from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { tinyAddress } from "../../../../utils/text";
import { VideoInfoWithMeta } from "../../../../utils/types/video";

const IMAGE_HEIGHT = 173;
const BUTTONS_HEIGHT = 28;
export const VIDEO_CARD_WIDTH = 308;
export const VideoCard: React.FC<{
  video: VideoInfoWithMeta;
  hideAuthor?: boolean;
}> = ({ video, hideAuthor }) => {
  const authorNSInfo = useNSUserInfo(video.createdBy);
  const [, userAddress] = parseUserId(video.createdBy);
  const [isHovered, setIsHovered] = useState(false);
  const navigation = useAppNavigation();
  const { data: idForLibraryList } = useFetchLibraryIds();
  const isInLibrary =
    idForLibraryList &&
    idForLibraryList.findIndex((item) => item === video.id) !== -1;

  const { onPressDropdownButton, isDropdownOpen } = useDropdowns();
  const videoMenuRef = useRef<View>(null);

  const username = authorNSInfo?.metadata?.tokenId
    ? authorNSInfo?.metadata?.tokenId
    : tinyAddress(userAddress, 16);

  return (
    <View style={unitCardStyle}>
      <CustomPressable
        style={imgBoxStyle}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        onPress={() => {
          navigation.navigate("VideoDetail", { id: video.id });
        }}
      >
        <Image
          source={{ uri: ipfsURLToHTTPURL(video.videoMetaInfo.image) }}
          style={[isHovered && { opacity: 0.5 }, contentImgStyle]}
        />

        <View style={imgDurationBoxStyle}>
          <BrandText style={fontSemibold13}>
            {prettyMediaDuration(video.videoMetaInfo.duration)}
          </BrandText>
        </View>

        <View style={imgButtonsBoxStyle}>
          <View />
          <TouchableOpacity onPress={() => onPressDropdownButton(videoMenuRef)}>
            <SVG
              source={ThreeDotsCircleWhite}
              width={BUTTONS_HEIGHT}
              height={BUTTONS_HEIGHT}
            />
          </TouchableOpacity>

          {isDropdownOpen(videoMenuRef) && (
            <VideoHoverMenu
              isInLibrary={isInLibrary}
              owner={username}
              video={video}
            />
          )}
        </View>
      </CustomPressable>

      <SpacerColumn size={1.5} />
      <BrandText style={contentTitleStyle}>
        {video.videoMetaInfo.title}
      </BrandText>

      {!hideAuthor && (
        <>
          <SpacerColumn size={1} />
          <OmniLink
            to={{
              screen: "UserPublicProfile",
              params: { id: video.createdBy },
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {/*---- User image */}
            <UserAvatarWithFrame userId={video.createdBy} size="XXS" noFrame />
            <SpacerRow size={1} />
            <BrandText style={contentNameStyle}>@{username}</BrandText>
          </OmniLink>
        </>
      )}

      <SpacerColumn size={1} />
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <BrandText
          style={videoStatsTextStyle}
        >{`${video.viewCount} views`}</BrandText>
        <DotSeparator style={{ marginHorizontal: layout.spacing_x0_75 }} />
        <DateTime
          date={new Date(video.createdAt * 1000).toDateString()}
          textStyle={{ color: neutral77 }}
        />
      </View>
    </View>
  );
};

const unitCardStyle: ViewStyle = {
  width: VIDEO_CARD_WIDTH,
  borderRadius: 8,
};
const contentTitleStyle: TextStyle = {
  ...fontSemibold14,
  lineHeight: 16,
};
const imgBoxStyle: ViewStyle = {
  position: "relative",
};
const imgDurationBoxStyle: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: layout.spacing_x0_75,
  height: 26,
  borderRadius: 4,
  backgroundColor: withAlpha(neutral22, 0.6),
  position: "absolute",
  top: layout.spacing_x1,
  left: layout.spacing_x1,
};
const imgButtonsBoxStyle: ViewStyle = {
  position: "absolute",
  paddingHorizontal: layout.spacing_x1_5,
  flexDirection: "row",
  width: "100%",
  top: IMAGE_HEIGHT - BUTTONS_HEIGHT - layout.spacing_x1_5,
  right: 0,
  justifyContent: "space-between",
};
const contentNameStyle: TextStyle = {
  ...fontSemibold14,
};
const contentImgStyle: ImageStyle = {
  height: IMAGE_HEIGHT,
  width: "100%",
  borderRadius: 12,
  aspectRatio: 1.7,
};
const videoStatsTextStyle: TextStyle = {
  ...fontMedium13,
  color: neutral77,
};
