import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable } from "react-native";

import { AlbumShortInfo } from "./types";
import Logo from "../../../assets/logos/logo.svg";
import { BrandText } from "../../components/BrandText";
import { MusicPlayerCard } from "../../components/MusicPlayer/MusicPlayerCard";
import { UploadAlbumModal } from "../../components/MusicPlayer/UploadAlbumModal";
import { SVG } from "../../components/SVG";
import { musicplayerClient } from "../../utils/backend";
import { primaryColor } from "../../utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export const MusicPlayerHomeContent: React.FC = () => {
  const [albumList, setAlbumList] = useState<AlbumShortInfo[]>([]);

  const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);
  // const [openAlbumInfoModal, setOpenAlbumInfoModal] = useState<boolean>(false);
  useEffect(() => {
    const getAlbumList = async () => {
      const res = await musicplayerClient.getAlbumList({});
      const newAlbumList: AlbumShortInfo[] = [];
      res.albums.map((albumInfo, index) => {
        newAlbumList.push({
          id: albumInfo.id,
          name: albumInfo.name,
          description: albumInfo.description,
          image: albumInfo.image,
        });
      });
      setAlbumList(newAlbumList);
    };
    getAlbumList();
  }, []);

  const styles = StyleSheet.create({
    container: {
      marginTop: layout.padding_x3,
      width: "100%",
    },
    oneLine: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    contentGroup: {
      flexDirection: "row",
      justifyContent: "center",
      flexWrap: "wrap",
      marginTop: layout.padding_x3,
      gap: layout.padding_x2_5,
      marginBottom: 40,
    },
    buttonGroup: {
      flexDirection: "row",
      alignItems: "center",
      gap: layout.padding_x2,
    },
    buttonContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: layout.padding_x1,
      paddingRight: layout.padding_x1_5,
      paddingVertical: layout.padding_x1,
      backgroundColor: "#2B2B33",
      borderRadius: layout.padding_x4,
      gap: layout.padding_x1_5,
    },
    buttonText: StyleSheet.flatten([
      fontSemibold14,
      {
        color: primaryColor,
      },
    ]),
  });

  return (
    <View style={styles.container}>
      <View style={styles.oneLine}>
        <BrandText style={fontSemibold20}>All Albums</BrandText>
        <View style={styles.buttonGroup}>
          <Pressable
            style={styles.buttonContainer}
            onPress={() => setOpenUploadModal(true)}
          >
            <SVG
              source={Logo}
              width={layout.padding_x2}
              height={layout.padding_x2}
            />
            <BrandText style={styles.buttonText}>Upload album</BrandText>
          </Pressable>
          <Pressable style={styles.buttonContainer}>
            <SVG
              source={Logo}
              width={layout.padding_x2}
              height={layout.padding_x2}
            />
            <BrandText style={styles.buttonText}>Create funding</BrandText>
          </Pressable>
        </View>
      </View>

      <View style={styles.contentGroup}>
        {albumList.map((item: AlbumShortInfo, index) => {
          return <MusicPlayerCard item={item} index={index} key={index} />;
        })}
      </View>
      <UploadAlbumModal
        isVisible={openUploadModal}
        onClose={() => setOpenUploadModal(false)}
      />
    </View>
  );
};
