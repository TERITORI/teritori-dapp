import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Pressable } from "react-native-hoverable";

import { TrackImageHover } from "./TrackImageHover";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { parseUserId } from "../../networks";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { neutral17, neutral77, primaryColor } from "../../utils/style/colors";
import { fontSemibold14, fontMedium14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { tinyAddress } from "../../utils/text";
import { AlbumInfo } from "../../utils/types/music";
import { BrandText } from "../BrandText";

export const MusicPlayerCard: React.FC<{
  item: AlbumInfo;
  hasLibrary: boolean;
}> = ({ item, hasLibrary }) => {
  const unitWidth = 240;
  const authorNSInfo = useNSUserInfo(item.createdBy);
  const [, userAddress] = parseUserId(item.createdBy);
  const [selectedIndex, setSelectedIndex] = useState<string>(item.id);

  const username = authorNSInfo?.metadata?.tokenId
    ? authorNSInfo?.metadata?.tokenId
    : tinyAddress(userAddress);

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
          source={ipfsURLToHTTPURL(item.image)}
          style={styles.contentImg}
        />
        {selectedIndex === item.id && (
          <TrackImageHover
            album={item}
            hasLibrary={hasLibrary}
            userName={username}
          />
        )}
      </View>
      <BrandText style={styles.contentTitle}>{item.name}</BrandText>
      <BrandText style={styles.contentDescription}>
        {item.description}
      </BrandText>
      <Pressable>
        <BrandText style={styles.contentName}>@{username}</BrandText>
      </Pressable>
    </View>
  );
};
