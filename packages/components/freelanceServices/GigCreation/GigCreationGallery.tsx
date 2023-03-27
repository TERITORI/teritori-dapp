import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";

import PdfIcon from "../../../../assets/icons/pdf.svg";
import PicIcon from "../../../../assets/icons/pic.svg";
import VideoIcon from "../../../../assets/icons/video.svg";
import WarningIcon from "../../../../assets/icons/warning.svg";
import {
  neutralA3,
  primaryColor,
  neutral33,
  secondaryColor,
  neutral00,
} from "../../../utils/style/colors";
import {
  fontMedium10,
  fontMedium13,
  fontMedium16,
  fontSemibold13,
  fontSemibold14,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { CheckBox } from "../../checkbox/CheckBox";

export const GigCreationGallery: React.FC = () => {
  const pageContentWidth = 760;
  const cardWidth = 240;
  const cardHeight = 180;

  const [agreePolicy, setAgreePolicy] = useState<boolean>(false);

  const styles = StyleSheet.create({
    pageContent: {
      flexDirection: "column",
      width: pageContentWidth,
    },
    text: StyleSheet.flatten([
      fontSemibold14,
      {
        color: neutralA3,
      },
    ]),
    subTitle: StyleSheet.flatten([
      fontSemibold14,
      {
        marginBottom: layout.padding_x1_5,
        marginTop: layout.padding_x4,
      },
    ]),
    oneLine: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    questionInput: StyleSheet.flatten([
      fontSemibold14,
      {
        padding: layout.padding_x2,
        borderWidth: 1,
        borderColor: neutral33,
        borderRadius: layout.padding_x1_5,
        color: secondaryColor,
        marginBottom: layout.padding_x2,
      },
    ]),
    divideLine: {
      height: 1,
      width: "100%",
      backgroundColor: neutral33,
    },
    mediaCard: {
      width: cardWidth,
      height: cardHeight,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      borderColor: neutral33,
      borderRadius: layout.padding_x1_5,
      backgroundColor: neutral00,
      borderWidth: 1,
      marginTop: layout.padding_x1_5,
    },
    cardText: StyleSheet.flatten([
      fontMedium16,
      {
        color: neutralA3,
        marginTop: layout.padding_x1_5,
        marginBottom: layout.padding_x1,
      },
    ]),
    tipText: StyleSheet.flatten([
      fontMedium10,
      {
        color: neutralA3,
      },
    ]),
    policyBox: {
      flexDirection: "row",
      gap: layout.padding_x1_5,
      alignItems: "center",
      marginTop: layout.padding_x4,
    },
    warningBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: layout.padding_x1_5,
      marginTop: layout.padding_x2,
    },
  });

  return (
    <View style={styles.pageContent}>
      <BrandText>
        Get all the information you need from buyers to get started
      </BrandText>
      <BrandText style={[styles.text, { marginTop: layout.padding_x2 }]}>
        Add questions to help buyers provide you with exactly what you need to
        start working on their order.
      </BrandText>

      <BrandText style={styles.subTitle}>Images (up to 3)</BrandText>
      <BrandText style={styles.text}>
        Get noticed by the buyers with visual examples of your services.
      </BrandText>
      <View style={styles.oneLine}>
        <View style={styles.mediaCard}>
          <SVG source={PicIcon} width={32} height={32} />
          <BrandText style={styles.cardText}>Drag & drop a Photo or</BrandText>
          <Pressable>
            <BrandText style={[fontSemibold14, { color: primaryColor }]}>
              Browse
            </BrandText>
          </Pressable>
        </View>
        <View style={styles.mediaCard} />
        <View style={styles.mediaCard} />
      </View>

      <BrandText style={styles.subTitle}>Video (only one)</BrandText>
      <BrandText style={styles.text}>
        Capture buyers' attention with a video that showcases your service.
      </BrandText>
      <BrandText style={styles.tipText}>
        Please choose a video shorter than 75 seconds and smaller than 50MB
      </BrandText>
      <View style={styles.mediaCard}>
        <SVG source={VideoIcon} width={32} height={32} />
        <BrandText style={styles.cardText}>Drag & drop a Photo or</BrandText>
        <Pressable>
          <BrandText style={[fontSemibold14, { color: primaryColor }]}>
            Browse
          </BrandText>
        </Pressable>
      </View>

      <BrandText style={styles.subTitle}>Documents (up to 2)</BrandText>
      <BrandText style={styles.text}>
        Show some of the best work you created in a document (PDFs only).
      </BrandText>
      <View style={{ flexDirection: "row" }}>
        <View style={[styles.mediaCard, { marginRight: layout.padding_x2_5 }]}>
          <SVG source={PdfIcon} width={32} height={32} />
          <BrandText style={styles.cardText}>Drag & drop a Photo or</BrandText>
          <Pressable>
            <BrandText style={[fontSemibold14, { color: primaryColor }]}>
              Browse
            </BrandText>
          </Pressable>
        </View>
        <View style={styles.mediaCard} />
      </View>

      <View style={styles.policyBox}>
        <CheckBox
          value={agreePolicy}
          onValueChange={() => setAgreePolicy((value) => !value)}
        />
        <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
          I declare that materials were created by myself or by my team and do
          not infringe on any 3rd part insights. I understand that the illegal
          use of digital assets is against Teritori’s Terms of Service and may
          result blocking my account.*
        </BrandText>
      </View>
      <View style={styles.warningBox}>
        <SVG source={WarningIcon} width={16} height={16} />
        <BrandText style={[fontMedium13, { color: neutralA3 }]}>
          Please confirm that you’ve read and agreed to our Terms of Service
        </BrandText>
      </View>
    </View>
  );
};
