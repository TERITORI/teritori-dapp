import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";

import ModalBase from "../modals/ModalBase";
import { SVG } from "../SVG";
import Upload from "../../../assets/music-player/upload.svg";
import { fontSemibold14 } from "../../utils/style/fonts";
import { neutral33, neutral77, primaryColor } from "../../utils/style/colors";
import { PrimaryButton } from "../buttons/PrimaryButton";


interface UploadAlbumModalProps {
  onClose: () => void;
  isVisible: boolean;
  submit: () => void;
}

export const UploadAlbumModal: React.FC<UploadAlbumModalProps> = ({
  onClose, isVisible, submit
}) => {

  const modalWidth = 564;
  const paddingHorizontal = layout.padding_x2_5;

  const styles = StyleSheet.create({
    contentContainer: {
      paddingBottom: layout.padding_x2_5
    },
    uploadBox: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: layout.padding_x1,
      borderStyle: "dotted",
      borderWidth: 1,
      backgroundColor: "rgba(22, 187, 255, 0.1)",
      paddingVertical: layout.padding_x4,
      borderColor: "#16BBFF",
      borderRadius: layout.padding_x1_5
    },
    buttonContainer: {
      marginTop: layout.padding_x2,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center"
    },
    buttonText: StyleSheet.flatten([
      fontSemibold14,
      {
        color: primaryColor,
        paddingHorizontal: layout.padding_x1_5,
        paddingVertical: layout.padding_x1,
        marginBottom: layout.padding_x2_5,
        borderRadius: layout.padding_x1,
        backgroundColor: "#2B2B33",
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
        color: neutral77
      }
    ])
  })

  return (
    <ModalBase label="Upload album" visible={isVisible} onClose={onClose} width={modalWidth}>

      <View style={styles.contentContainer}>
        <Pressable style={styles.uploadBox}>
          <SVG source={Upload} width={layout.padding_x2} height={layout.padding_x2}></SVG>
          <BrandText>Drag and drop your tracks & albums here</BrandText>
        </Pressable>
        <View style={styles.buttonContainer}>
          <Pressable><BrandText style={styles.buttonText}>or choose files to upload</BrandText></Pressable>
        </View>
      </View>

      <View style={styles.divideLine}></View>

      <View style={styles.footer}>
        <BrandText style={styles.footerText}>Provide FLAC, WAV or AIFF for highest audio quality.</BrandText>
        <PrimaryButton text="Continue" size="SM" onPress={submit}></PrimaryButton>
      </View>
    </ModalBase>
  )
}