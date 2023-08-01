import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Pressable } from "react-native-hoverable";

import { TrackVideoHover } from "./TrackVideoHover";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { parseUserId } from "../../networks";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { neutral77, primaryColor } from "../../utils/style/colors";
import { fontSemibold14, fontMedium14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { VideoInfoWithMeta } from "../../utils/types/video";
import { BrandText } from "../BrandText";
import { OmniLink } from "../OmniLink";
import { UserAvatarWithFrame } from "../images/AvatarWithFrame";

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
    : userAddress;

  const styles = StyleSheet.create({
    unitCard: {
      width: unitWidth,
    },
    contentImg: {
      width: "100%",
      borderRadius: layout.padding_x1,
      aspectRatio: 1,
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
    contentName: StyleSheet.flatten([
      fontSemibold14,
      {
        color: primaryColor,
      },
    ]),
    contentImg: {
      width: "100%",
      borderRadius: layout.padding_x1,
      aspectRatio: 1.7,
    },
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
          source={ipfsURLToHTTPURL(item.videoMetaInfo.coverImage)}
          style={styles.contentImg}
        />
        {selectedIndex === item.identifier && (
          <TrackImageHover
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
        <OmniLink
          to={{
            screen: "UserPublicProfile",
            params: { id: item.createdBy },
          }}
        >
          {/*---- User image */}
          <UserAvatarWithFrame
            style={{
              marginRight: layout.padding_x2,
            }}
            userId={item.createdBy}
            size="S"
          />
        </OmniLink>
        <Pressable>
          <BrandText style={styles.contentName}>@{username}</BrandText>
        </Pressable>
      </View>
    </View>
  );
};
