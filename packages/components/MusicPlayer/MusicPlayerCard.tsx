import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Pressable } from "react-native-hoverable";

import { TrackImageHover } from "./TrackImageHover";
import { ipfsPinataUrl } from "../../utils/ipfs";
import { neutral17, neutral77, primaryColor } from "../../utils/style/colors";
import { fontSemibold14, fontMedium14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { AlbumInfo } from "../../utils/types/music";
import { BrandText } from "../BrandText";

export const MusicPlayerCard: React.FC<{
  item: AlbumInfo;
}> = ({ item }) => {
  const unitWidth = 240;

  const [selectedIndex, setSelectedIndex] = useState<string>(item.id);

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
        // @ts-ignore
        onMouseEnter={() => setSelectedIndex(item.id)}
        onMouseLeave={() => setSelectedIndex("")}
      >
        <Image
          // @ts-ignore
          source={ipfsPinataUrl(item.image)}
          style={styles.contentImg}
        />
        {selectedIndex === item.id && (
          <TrackImageHover albumId={item.id} />
        )}
      </View>
      <BrandText style={styles.contentTitle}>{item.name}</BrandText>
      <BrandText style={styles.contentDescription}>
        {item.description}
      </BrandText>
      <Pressable>
        <BrandText style={styles.contentName}>@{item.name}</BrandText>
      </Pressable>
      
    </View>
  );
};
