import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import FaceBookIcon from "../../../../assets/icons/gig-creation/facebook.svg";
import GoogleIcon from "../../../../assets/icons/gig-creation/google.svg";
import ShareIcon from "../../../../assets/icons/gig-creation/share.svg";
import TwitterIcon from "../../../../assets/icons/gig-creation/twitter.svg";
import {
  neutral00,
  neutral33,
  neutralA3,
  primaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { GigInfo } from "../types/fields";

export const GigCreationPublish: React.FC<{
  gigInfo: GigInfo;
  setGig: React.Dispatch<React.SetStateAction<GigInfo>>;
}> = ({ gigInfo, setGig }) => {
  const pageContentWidth = 760;
  // FIXME: remove StyleSheet.create
  // eslint-disable-next-line no-restricted-syntax
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
      gap: layout.spacing_x2,
    },
    selectedButton: {
      borderWidth: 1,
      paddingLeft: layout.spacing_x1_5,
      paddingRight: layout.spacing_x2,
      paddingVertical: layout.spacing_x1,
      borderColor: primaryColor,
      backgroundColor: neutral00,
      borderRadius: layout.spacing_x4,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: layout.spacing_x1_5,
      marginTop: layout.spacing_x4,
    },
    normalButton: {
      borderWidth: 1,
      paddingLeft: layout.spacing_x1_5,
      paddingRight: layout.spacing_x2,
      paddingVertical: layout.spacing_x1,
      borderColor: neutral33,
      borderRadius: layout.spacing_x4,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: layout.spacing_x1_5,
      marginTop: layout.spacing_x4,
    },
  });

  return (
    <View style={styles.pageContent}>
      <BrandText>Your Gig is open for business!</BrandText>
      <BrandText style={[styles.text, { marginTop: layout.spacing_x2 }]}>
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
