import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Pressable } from "react-native-hoverable";

import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { useAppNavigation } from "../../utils/navigation";
import { neutral77, primaryColor } from "../../utils/style/colors";
import { fontSemibold14, fontMedium14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { VideoInfoWithMeta } from "../../utils/types/video";
import { durationToString } from "../../utils/videoPlayer";
import { BrandText } from "../BrandText";
import { DateTime } from "../socialFeed/SocialThread/DateTime";

export const MoreVideoPlayerCard: React.FC<{
  item: VideoInfoWithMeta;
}> = ({ item }) => {
  const unitWidth = 300;
  const navigation = useAppNavigation();

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
        marginVertical: layout.spacing_x0_5,
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
      borderRadius: layout.spacing_x1,
    },
    contentDuration: StyleSheet.flatten([
      fontSemibold14,
      {
        padding: layout.spacing_x0_5,
      },
    ]),
    contentName: StyleSheet.flatten([
      fontSemibold14,
      {
        color: primaryColor,
      },
    ]),
    contentImg: {
      width: "100%",
      borderRadius: layout.spacing_x1,
      aspectRatio: 1.7,
    },
    titleRow: {
      marginLeft: "0.5em",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
  });

  return (
    <View style={styles.unitCard}>
      <View style={styles.imgBox}>
        <Pressable
          onPress={() => {
            navigation.navigate("VideoShow", { id: item.identifier });
          }}
        >
          <Image
            // @ts-ignore
            source={ipfsURLToHTTPURL(item.videoMetaInfo.coverImage)}
            style={styles.contentImg}
          />
          <View style={styles.videoDuration}>
            <BrandText style={styles.contentDuration}>
              {durationToString(item.videoMetaInfo.duration)}
            </BrandText>
          </View>
        </Pressable>
      </View>
      <BrandText style={styles.contentTitle}>
        {item.videoMetaInfo.title}
      </BrandText>
      <View style={styles.titleRow}>
        <BrandText style={styles.contentDescription}>
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
        <DateTime date={item.createdAt} textStyle={{ color: neutral77 }} />
      </View>
    </View>
  );
};
