import React, { useState } from "react";
import { View, Pressable, StyleSheet, Image, TextInput } from "react-native";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";

import ModalBase from "../modals/ModalBase";
import { SVG } from "../SVG";
import Upload from "../../../assets/music-player/upload.svg";
import { fontSemibold14 } from "../../utils/style/fonts";
import { neutral17, neutral33, neutral77, neutralA3, primaryColor, secondaryColor } from "../../utils/style/colors";
import { PrimaryButton } from "../buttons/PrimaryButton";
import Remove from "../../../assets/music-player/remove.svg";
import Add from "../../../assets/music-player/add-primary.svg";
import List from "../../../assets/music-player/list.svg";
import DefaultAlbumImage from "../../../assets/music-player/album.png";
import Img from "../../../assets/music-player/img.svg";


interface AlbumInfoModalProps {
  onClose: () => void;
  isVisible: boolean;
  submit?: () => void;
}

export const AlbumInfoModal: React.FC<AlbumInfoModalProps> = ({
  onClose, isVisible, submit
}) => {

  const modalWidth = 564;
  const paddingHorizontal = layout.padding_x2_5;
  const imgSize = 172;

  const unitSongData = {
    name: "Song Name",
    duration: "3:26"
  };
  const [songData, setSongData] = useState(Array(3).fill(unitSongData));

  const removeSong = (index: number) => {
    setSongData((data) => {
      data.splice(index, 1);
      return [...data];
    })
  }

  const styles = StyleSheet.create({
    buttonContainer: {
      marginTop: layout.padding_x2,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      height: 40,
      borderRadius: layout.padding_x1,
      backgroundColor: "#2B2B33",
      gap: layout.padding_x1,
      marginBottom: layout.padding_x2_5
    },
    buttonText: StyleSheet.flatten([
      fontSemibold14,
      {
        color: primaryColor,
      }
    ]),
    divideLine: {
      height: 1,
      width: modalWidth - 2,
      marginLeft: - paddingHorizontal,
      backgroundColor: neutral33,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: layout.padding_x2_5,
      paddingVertical: layout.padding_x2
    },
    footerText: StyleSheet.flatten([
      fontSemibold14,
      {
        color: neutral77,
        width: "55%"
      }
    ]),
    songGroup: {
      flexDirection: "column",
      gap: layout.padding_x1
    },
    unitBox: {
      backgroundColor: neutral17,
      paddingHorizontal: layout.padding_x1_5,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: layout.padding_x1,
      height: 40
    },
    oneLine: {
      flexDirection: "row",
      alignItems: "center",
      gap: layout.padding_x1_5
    },
    inputBox: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between"
    },
    imgBox: {
      position: "relative"
    },
    img: {
      width: imgSize,
      height: imgSize,
      borderRadius: layout.padding_x1
    },
    textBox: {
      width: 332,
    },
    inputTitle: StyleSheet.flatten([
      fontSemibold14,
      {
        color: neutralA3,
        marginBottom: layout.padding_x1_5
      }
    ]),
    required: StyleSheet.flatten([
      fontSemibold14,
      {
        color: "#FFAEAE",
        paddingLeft: layout.padding_x0_5
      }
    ]),
    input: StyleSheet.flatten([
      fontSemibold14,
      {
        color: secondaryColor,
        padding: layout.padding_x2,
        borderWidth: 1,
        borderColor: neutral33,
        marginBottom: layout.padding_x2_5,
        borderRadius: 10,
        outlineStyle: "none"
      }
    ]),
    uploadImg: {
      width: "100%",
      position: "absolute",
      left: 0,
      bottom: layout.padding_x1,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    },
    uploadButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#2B2B33",
      borderRadius: layout.padding_x4,
      gap: layout.padding_x1,
      paddingLeft: layout.padding_x1,
      paddingRight: layout.padding_x1_5,
      paddingVertical: layout.padding_x1
    }
  })

  return (
    <ModalBase label="Album Info" visible={isVisible} onClose={onClose} width={modalWidth}>

      <View style={styles.inputBox}>
        <View style={styles.imgBox}>
          <Image source={DefaultAlbumImage} style={styles.img}></Image>
          <View style={styles.uploadImg}>
            <Pressable style={styles.uploadButton}>
              <SVG source={Img} width={layout.padding_x2} height={layout.padding_x2}></SVG>
              <BrandText style={fontSemibold14}>upload image</BrandText>
            </Pressable>
          </View>
        </View>
        <View style={styles.textBox}>
          <BrandText style={styles.inputTitle}>Album name<BrandText style={styles.required}>*</BrandText></BrandText>
          <TextInput style={styles.input}></TextInput>
          <BrandText style={styles.inputTitle}>Album Description<BrandText style={styles.required}>*</BrandText></BrandText>
          <TextInput style={styles.input} numberOfLines={4} multiline={true}></TextInput>
        </View>
      </View>
      <View style={styles.songGroup}>
        {
          songData.map((item, index) => (
            <View key={index} style={styles.unitBox}>
              <View style={styles.oneLine}>
                <Pressable><SVG source={List} width={layout.padding_x2} height={layout.padding_x2}></SVG></Pressable>
                <BrandText style={fontSemibold14}>{item.name}</BrandText>
              </View>
              <View style={styles.oneLine}>
                <BrandText style={[fontSemibold14, { color: neutral77 }]}>{item.duration}</BrandText>
                <Pressable onPress={() => removeSong(index)}><SVG source={Remove} width={layout.padding_x3} height={layout.padding_x3}></SVG></Pressable>
              </View>
            </View>
          ))
        }
      </View>
      <Pressable style={styles.buttonContainer}>
        <SVG source={Add} width={layout.padding_x2_5} height={layout.padding_x2_5}></SVG>
        <BrandText style={styles.buttonText}>Add more</BrandText>
      </Pressable>

      <View style={styles.divideLine}></View>

      <View style={styles.footer}>
        <BrandText style={styles.footerText} numberOfLines={2}>By uploading, you confirm that your sounds comply with our Terms of Use.</BrandText>
        <PrimaryButton text="Upload" size="SM" onPress={submit}></PrimaryButton>
      </View>

    </ModalBase>
  )
}