import React from "react";
import { View, Image, ViewStyle, TextStyle, ImageStyle } from "react-native";
import { Pressable } from "react-native-hoverable";

import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { getMediaDuration } from "../../utils/mediaPlayer";
import { useAppNavigation } from "../../utils/navigation";
import { neutral77 } from "../../utils/style/colors";
import { fontSemibold14, fontMedium14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { VideoInfoWithMeta } from "../../utils/types/video";
import { BrandText } from "../BrandText";
import { DateTime } from "../socialFeed/SocialThread/DateTime";

const unitWidth = 300;
export const MoreVideoPlayerCard: React.FC<{
  item: VideoInfoWithMeta;
}> = ({ item }) => {
  const navigation = useAppNavigation();

  return (
    <View style={unitCardStyle}>
      <View style={imgBoxStyle}>
        <Pressable
          onPress={() => {
            navigation.navigate("VideoShow", { id: item.identifier });
          }}
        >
          <Image
            // @ts-ignore
            source={ipfsURLToHTTPURL(item.videoMetaInfo.coverImage)}
            style={contentImgStyle}
          />
          <View style={videoDurationStyle}>
            <BrandText style={contentDurationStyle}>
              {getMediaDuration(item.videoMetaInfo.duration)}
            </BrandText>
          </View>
        </Pressable>
      </View>
      <BrandText style={contentTitleStyle}>
        {item.videoMetaInfo.title}
      </BrandText>
      <View style={titleRowStyle}>
        <BrandText style={contentDescriptionStyle}>
          {item.viewCount} views
        </BrandText>
        {/* A dot separator */}
        <View
          style={{
            backgroundColor: neutral77,
            height: 2,
            width: 2,
            borderRadius: 999,
            marginHorizontal: layout.spacing_x0_75,
          }}
        />
        {/*---- Date */}
        <DateTime
          date={item.createdAt.toString()}
          textStyle={{ color: neutral77 }}
        />
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
const contentDescriptionStyle: TextStyle = {
  ...fontMedium14,
  color: neutral77,
};
const imgBoxStyle: ViewStyle = {
  position: "relative",
};
const videoDurationStyle: ViewStyle = {
  position: "absolute",
  left: 10,
  top: 10,
  backgroundColor: "gray",
  borderRadius: layout.spacing_x1,
};
const contentDurationStyle: TextStyle = {
  ...fontSemibold14,
  padding: layout.spacing_x0_5,
};
const contentImgStyle: ImageStyle = {
  width: "100%",
  borderRadius: layout.spacing_x1,
  aspectRatio: 1.7,
};
const titleRowStyle: ViewStyle = {
  marginLeft: "0.5em",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
};
