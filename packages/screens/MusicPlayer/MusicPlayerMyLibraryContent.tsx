import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";

import Album from "../../../assets/music-player/album.png";
import { BrandText } from "../../components/BrandText";
import { MusicPlayerCard } from "../../components/MusicPlayer/MusicPlayerCard";
import { useAppNavigation } from "../../utils/navigation";
import { neutral77, primaryColor } from "../../utils/style/colors";
import {
  fontMedium14,
  fontSemibold20,
  fontSemibold14
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import Logo from "../../../assets/logos/logo.svg";
import { SVG } from "../../components/SVG";
import { UploadAlbumModal } from "../../components/MusicPlayer/UploadAlbumModal";
import { AlbumInfoModal } from "../../components/MusicPlayer/AlbumInfoModal";


export const MusicPlayerMyLibraryContent: React.FC = () => {
  const unitWidth = 240;

  const unitAlbumData = {
    title: "Name",
    description: "Description here lorem ipsum dolor sit amet",
    img: Album,
    name: "artistname"
  };

  const myAlbumsData = Array(3).fill(unitAlbumData);
  const otherAlbumsData = Array(8).fill(unitAlbumData);

  const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);
  const [openAlbumInfoModal, setOpenAlbumInfoModal] = useState<boolean>(false);

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
      flexWrap: "wrap",
      justifyContent: "center",
      marginTop: layout.padding_x3,
      gap: layout.padding_x2_5,
      marginBottom: 40,
    },
    trackItem: {
      width: unitWidth,
      flexDirection: "row",
      alignItems: "center",
      gap: layout.padding_x1_5,
    },
    itemImg: {
      width: 40,
      height: 40,
      borderRadius: layout.padding_x0_5,
    },
    itemText: StyleSheet.flatten([
      fontMedium14,
      {
        color: neutral77,
        marginTop: layout.padding_x0_5,
      },
    ]),
    buttonGroup: {
      flexDirection: "row",
      alignItems: "center",
      gap: layout.padding_x2
    },
    buttonContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: layout.padding_x1,
      paddingRight: layout.padding_x1_5,
      paddingVertical: layout.padding_x1,
      backgroundColor: "#2B2B33",
      borderRadius: layout.padding_x4,
      gap: layout.padding_x1_5
    },
    buttonText: StyleSheet.flatten([
      fontSemibold14,
      {
        color: primaryColor
      }
    ])
  });

  return (
    <View style={styles.container}>

      <View style={styles.oneLine}>
        <BrandText style={fontSemibold20}>My Albums</BrandText>
        <View style={styles.buttonGroup}>
          <Pressable style={styles.buttonContainer} onPress={() => setOpenUploadModal(true)}>
            <SVG source={Logo} width={layout.padding_x2} height={layout.padding_x2}></SVG>
            <BrandText style={styles.buttonText}>Upload album</BrandText>
          </Pressable>
          <Pressable style={styles.buttonContainer}>
            <SVG source={Logo} width={layout.padding_x2} height={layout.padding_x2}></SVG>
            <BrandText style={styles.buttonText}>Create funding</BrandText>
          </Pressable>
        </View>
      </View>
      <View style={styles.contentGroup}>
        {myAlbumsData.map((item: any, index) => {
          return (
            <MusicPlayerCard
              item={item}
              index={index}
              mine={true}
              key={index}
            />
          );
        })}
      </View>

      <View style={styles.oneLine}>
        <BrandText style={fontSemibold20}>Other Albums</BrandText>
      </View>
      <View style={styles.contentGroup}>
        {otherAlbumsData.map((item: any, index) => {
          return (
            <MusicPlayerCard
              item={item}
              index={index}
              key={index}
            />
          );
        })}
      </View>

      <UploadAlbumModal isVisible={openUploadModal} onClose={() => setOpenUploadModal(false)} submit={() => { setOpenUploadModal(false); setOpenAlbumInfoModal(true); }} />
      <AlbumInfoModal isVisible={openAlbumInfoModal} onClose={() => setOpenAlbumInfoModal(false)}></AlbumInfoModal>

    </View>
  );
};
