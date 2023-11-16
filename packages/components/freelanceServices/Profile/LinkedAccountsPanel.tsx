import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import FacebookIcon from "../../../../assets/icons/account/facebook-icon.svg";
import GoogleIcon from "../../../../assets/icons/account/google-icon.svg";
import TwitterIcon from "../../../../assets/icons/account/twitter-icon.svg";
import AddLinkIcon from "../../../../assets/icons/add-circle.svg";
import {
  neutral33,
  neutral77,
  primaryColor,
} from "../../../utils/style/colors";
import { fontSemibold16, fontSemibold28 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { TertiaryButton } from "../../buttons/TertiaryButton";
import { SellerInfo } from "../types/fields";

export const LinkedAccountsPanel: React.FC<{
  seller: SellerInfo;
  setSeller: React.Dispatch<React.SetStateAction<SellerInfo>>;
}> = ({ seller, setSeller }) => {
  // FIXME: remove StyleSheet.create
  // eslint-disable-next-line no-restricted-syntax
  const styles = StyleSheet.create({
    divideLine: {
      width: "100%",
      height: 1,
      backgroundColor: neutral33,
    },
    pageSubtitle: StyleSheet.flatten([
      fontSemibold16,
      {
        color: neutral77,
        marginTop: 10,
        width: 902,
      },
    ]),
    contentContainer: {
      flexDirection: "column",
    },
    accountBox: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: 588,
      marginBottom: layout.spacing_x4,
    },
    iconBox: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    addLInk: {
      flexDirection: "row",
      alignItems: "center",
      gap: layout.spacing_x2,
      marginTop: layout.spacing_x4,
    },
  });

  return (
    <View style={{ flexDirection: "column" }}>
      <View style={{ flexDirection: "column" }}>
        <BrandText style={[fontSemibold28]}>Linked Accounts</BrandText>
        <BrandText style={styles.pageSubtitle}>
          Taking the time to verify and link your accounts can upgrade your
          credibility and help us provide you with more business. Don’t worry,
          your information is and always will remain private.
        </BrandText>
        <View style={[styles.divideLine, { marginVertical: 24 }]} />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.accountBox}>
          <View style={styles.iconBox}>
            <SVG
              source={GoogleIcon}
              width={24}
              height={24}
              style={{ marginRight: layout.spacing_x2 }}
            />
            <BrandText>Google</BrandText>
          </View>
          <TertiaryButton text="Connected" size="M" disabled />
        </View>
        <View style={styles.accountBox}>
          <View style={styles.iconBox}>
            <SVG
              source={FacebookIcon}
              width={24}
              height={24}
              style={{ marginRight: layout.spacing_x2 }}
            />
            <BrandText>Facebook</BrandText>
          </View>
          <TertiaryButton text="Connect" size="M" textColor={primaryColor} />
        </View>
        <View style={styles.accountBox}>
          <View style={styles.iconBox}>
            <SVG
              source={TwitterIcon}
              width={24}
              height={24}
              style={{ marginRight: layout.spacing_x2 }}
            />
            <BrandText>Twitter</BrandText>
          </View>
          <TertiaryButton text="Connect" size="M" textColor={primaryColor} />
        </View>
        <View style={styles.divideLine} />
        <Pressable>
          <View style={styles.addLInk}>
            <SVG source={AddLinkIcon} width={24} height={24} />
            <BrandText style={[fontSemibold16]}>Add external link</BrandText>
          </View>
        </Pressable>
      </View>
    </View>
  );
};
