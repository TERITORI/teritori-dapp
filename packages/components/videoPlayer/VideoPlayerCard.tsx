import React, { useState } from "react";
import { View, Image, ViewStyle, TextStyle, ImageStyle } from "react-native";
import { Pressable } from "react-native-hoverable";

import { TrackImageHover } from "./TrackImageHover";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { parseUserId } from "../../networks";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { primaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { VideoInfoWithMeta } from "../../utils/types/video";
import { BrandText } from "../BrandText";
import { OmniLink } from "../OmniLink";
import { UserAvatarWithFrame } from "../images/AvatarWithFrame";

const unitWidth = 300;
export const VideoPlayerCard: React.FC<{
  item: VideoInfoWithMeta;
  hasLibrary: boolean;
}> = ({ item, hasLibrary }) => {
  const authorNSInfo = useNSUserInfo(item.createdBy);
  const [, userAddress] = parseUserId(item.createdBy);
  const [selectedIndex, setSelectedIndex] = useState<string>(item.identifier);

  const username = authorNSInfo?.metadata?.tokenId
    ? authorNSInfo?.metadata?.tokenId
    : userAddress;

  return (
    <View style={unitCardStyle}>
      <View
        style={imgBoxStyle}
        // @ts-ignore
        onMouseEnter={() => setSelectedIndex(item.id)}
        onMouseLeave={() => setSelectedIndex("")}
      >
        <Image
          // @ts-ignore
          source={ipfsURLToHTTPURL(item.videoMetaInfo.coverImage)}
          style={contentImgStyle}
        />
        {selectedIndex === item.identifier && (
          <TrackImageHover
            videoInfo={item}
            hasLibrary={hasLibrary}
            userName={username}
          />
        )}
      </View>
      <BrandText style={contentTitleStyle}>
        {item.videoMetaInfo.title}
      </BrandText>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <OmniLink
          to={{
            screen: "UserPublicProfile",
            params: { id: item.createdBy },
          }}
        >
          {/*---- User image */}
          <UserAvatarWithFrame
            style={{
              marginRight: layout.spacing_x2,
            }}
            userId={item.createdBy}
            size="S"
          />
        </OmniLink>
        <Pressable>
          <BrandText style={contentNameStyle}>@{username}</BrandText>
        </Pressable>
      </View>
    </View>
  );
};

const unitCardStyle: ViewStyle = {
  width: unitWidth,
};
const contentTitleStyle: TextStyle = {
  ...fontSemibold14,
  marginVertical: layout.spacing_x0_5,
};
const imgBoxStyle: ViewStyle = {
  position: "relative",
};
const contentNameStyle: TextStyle = {
  ...fontSemibold14,
  color: primaryColor,
};
const contentImgStyle: ImageStyle = {
  width: "100%",
  borderRadius: layout.spacing_x1,
  aspectRatio: 1.7,
};
