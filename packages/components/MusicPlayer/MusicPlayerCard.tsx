import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Pressable } from "react-native-hoverable";

import { TrackImageHover } from "./TrackImageHover";
import { AlbumShortInfo } from "../../screens/MusicPlayer/types";
import { ipfsPinataUrl } from "../../utils/ipfs";
import { neutral17, neutral77, primaryColor } from "../../utils/style/colors";
import { fontSemibold14, fontMedium14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";

export const MusicPlayerCard: React.FC<{
  item: AlbumShortInfo;
  index: number;
  mine?: boolean;
}> = ({ item, index, mine = false }) => {
  const unitWidth = 240;

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const styles = StyleSheet.create({
    unitCard: {
      width: unitWidth,
      padding: layout.padding_x1_5,
      backgroundColor: neutral17,
      borderRadius: layout.padding_x1_5,
    },
    contentImg: {
      width: "100%",
      borderRadius: layout.padding_x1,
      aspectRatio: 1,
    },
    contentTitle: StyleSheet.flatten([
      fontSemibold14,
      {
        marginVertical: layout.padding_x1_5,
      },
    ]),
    contentDescription: StyleSheet.flatten([
      fontMedium14,
      {
        color: neutral77,
      },
    ]),
    imgBox: {
      position: "relative",
    },
    contentName: StyleSheet.flatten([
      fontSemibold14,
      {
        color: primaryColor,
        marginTop: layout.padding_x1,
      },
    ]),
  });

  return (
    <View style={styles.unitCard}>
      <View
        style={styles.imgBox}
        onMouseEnter={() => setSelectedIndex(index + 1)}
        onMouseLeave={() => setSelectedIndex(0)}
      >
        <Image source={ipfsPinataUrl(item.image)} style={styles.contentImg} />
        {selectedIndex === index + 1 && (
          <TrackImageHover mine={mine} albumId={item.id} />
        )}
      </View>
      <BrandText style={styles.contentTitle}>{item.name}</BrandText>
      <BrandText style={styles.contentDescription}>
        {item.description}
      </BrandText>
      {!mine && (
        <Pressable>
          <BrandText style={styles.contentName}>@{item.name}</BrandText>
        </Pressable>
      )}
    </View>
  );
};
