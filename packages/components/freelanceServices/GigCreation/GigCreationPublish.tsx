import React from "react";
import { View, StyleSheet, Pressable } from "react-native";

import FaceBookIcon from "../../../../assets/icons/gig-creation/facebook.svg";
import GoogleIcon from "../../../../assets/icons/gig-creation/google.svg";
import ShareIcon from "../../../../assets/icons/gig-creation/share.svg";
import TwitterIcon from "../../../../assets/icons/gig-creation/twitter.svg";
import { GigInfo } from "../../../screens/FreelanceServices/types/fields";
import {
  neutralA3,
  primaryColor,
  neutral33,
  neutral00,
} from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";

export const GigCreationPublish: React.FC<{
  gigInfo: GigInfo;
  setGig: React.Dispatch<React.SetStateAction<GigInfo>>;
}> = ({ gigInfo, setGig }) => {
  const pageContentWidth = 760;

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
    oneLine: {
      flexDirection: "row",
      alignItems: "center",
      gap: layout.padding_x2,
    },
    selectedButton: {
      borderWidth: 1,
      paddingLeft: layout.padding_x1_5,
      paddingRight: layout.padding_x2,
      paddingVertical: layout.padding_x1,
      borderColor: primaryColor,
      backgroundColor: neutral00,
      borderRadius: layout.padding_x4,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: layout.padding_x1_5,
      marginTop: layout.padding_x4,
    },
    normalButton: {
      borderWidth: 1,
      paddingLeft: layout.padding_x1_5,
      paddingRight: layout.padding_x2,
      paddingVertical: layout.padding_x1,
      borderColor: neutral33,
      borderRadius: layout.padding_x4,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: layout.padding_x1_5,
      marginTop: layout.padding_x4,
    },
  });

  return (
    <View style={styles.pageContent}>
      <BrandText>Your Gig is open for business!</BrandText>
      <BrandText style={[styles.text, { marginTop: layout.padding_x2 }]}>
        Spread the word to boost your sales.
      </BrandText>
      <View style={styles.oneLine}>
        <Pressable>
          <View style={styles.selectedButton}>
            <SVG source={ShareIcon} width={24} height={24} />
            <BrandText style={[fontSemibold16]}>Copy Link</BrandText>
          </View>
        </Pressable>
        <Pressable>
          <View style={styles.normalButton}>
            <SVG source={FaceBookIcon} width={24} height={24} />
            <BrandText style={[fontSemibold16]}>Facebook</BrandText>
          </View>
        </Pressable>
        <Pressable>
          <View style={styles.normalButton}>
            <SVG source={TwitterIcon} width={24} height={24} />
            <BrandText style={[fontSemibold16]}>Twitter</BrandText>
          </View>
        </Pressable>
        <Pressable>
          <View style={styles.normalButton}>
            <SVG source={GoogleIcon} width={24} height={24} />
            <BrandText style={[fontSemibold16]}>Google</BrandText>
          </View>
        </Pressable>
      </View>
    </View>
  );
};
