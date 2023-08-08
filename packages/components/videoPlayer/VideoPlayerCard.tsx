import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Pressable } from "react-native-hoverable";

import { TrackVideoHover } from "./TrackVideoHover";
import Avatar from "../../../assets/icons/player/avatar.svg";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { parseUserId } from "../../networks";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { neutral77, primaryColor } from "../../utils/style/colors";
import { fontSemibold14, fontMedium14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { tinyAddress } from "../../utils/text";
import { VideoInfoWithMeta } from "../../utils/types/video";
import { durationToString } from "../../utils/videoPlayer";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";

export const VideoPlayerCard: React.FC<{
  item: VideoInfoWithMeta;
  hasLibrary: boolean;
}> = ({ item, hasLibrary }) => {
  const unitWidth = 300;
  const authorNSInfo = useNSUserInfo(item.createdBy);
  const [, userAddress] = parseUserId(item.createdBy);
  const [selectedIndex, setSelectedIndex] = useState<string>(item.identifier);

  const username = authorNSInfo?.metadata?.tokenId
    ? authorNSInfo?.metadata?.tokenId
    : tinyAddress(userAddress);

  const styles = StyleSheet.create({
    unitCard: {
      width: unitWidth,
    },
    contentVideo: {
      backgroundColor: "gray",
      borderRadius: 10,
      aspectRatio: 1.5,
    },

    contentTitle: StyleSheet.flatten([
      fontSemibold14,
      {
        marginVertical: layout.padding_x0_5,
      },
    ]),
    contentDescription: StyleSheet.flatten([
      fontMedium14,
      {
        color: neutral77,
      },
    ]),
    contentDate: StyleSheet.flatten([
      fontMedium14,
      {
        color: neutral77,
        marginLeft: "1em",
      },
    ]),
    imgBox: {
      position: "relative",
    },
    videoDuration: {
      position: "absolute",
      left: 10,
      top: 10,
      backgroundColor: "gray",
      color: "white",
      borderRadius: layout.padding_x1,
    },
    contentDuration: StyleSheet.flatten([
      fontSemibold14,
      {
        padding: layout.padding_x0_5,
      },
    ]),
    contentName: StyleSheet.flatten([
      fontSemibold14,
      {
        color: primaryColor,
      },
    ]),
  });

  return (
    <View style={styles.unitCard}>
      <View
        style={styles.imgBox}
        // @ts-ignore
        onMouseEnter={() => setSelectedIndex(item.identifier)}
        onMouseLeave={() => setSelectedIndex("")}
      >
        <video
          src={ipfsURLToHTTPURL(item.videoMetaInfo.url)}
          style={{ backgroundColor: "gray", borderRadius: 10 }}
        />
        <View style={styles.videoDuration}>
          <BrandText style={styles.contentDuration}>
            {durationToString(item.videoMetaInfo.duration)}
          </BrandText>
        </View>
        {selectedIndex === item.identifier && (
          <TrackVideoHover
            videoInfo={item}
            hasLibrary={hasLibrary}
            userName={username}
          />
        )}
      </View>
      <BrandText style={styles.contentTitle}>
        {item.videoMetaInfo.title}
      </BrandText>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View>
          <SVG
            source={Avatar}
            style={{
              aspectRatio: 1,
              width: "32px",
              borderRadius: 1000,
              marginRight: layout.padding_x1,
            }}
          />
        </View>
        <Pressable>
          <BrandText style={styles.contentName}>@{username}</BrandText>
        </Pressable>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        {/* <BrandText style={styles.contentDescription}>
          {item.videoMetaInfo.description} views
        </BrandText>
        <BrandText style={styles.contentDate}>
          {item.videoMetaInfo.description} days ago
        </BrandText> */}
      </View>
    </View>
  );
};
