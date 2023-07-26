import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import { VerifyPhoneModal } from "./VerifyPhoneModal";
import EmailIcon from "../../../../assets/icons/account/email-icon.svg";
import PhoneIcon from "../../../../assets/icons/account/phone-icon.svg";
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

export const AccountSecurityPanel: React.FC<{
  seller: SellerInfo;
  setSeller: React.Dispatch<React.SetStateAction<SellerInfo>>;
}> = ({ seller, setSeller }) => {
  const [openVerifyPhoneModal, setOpenVerifyPhoneModal] =
    useState<boolean>(true);

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
      marginBottom: layout.padding_x4,
    },
    iconBox: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
  });

  return (
    <View style={{ flexDirection: "column" }}>
      <View style={{ flexDirection: "column" }}>
        <BrandText style={[fontSemibold28]}>Account Security</BrandText>
        <BrandText style={styles.pageSubtitle}>
          Trust and safety is a big deal in our community. Please verify your
          email and phone number so that we can keep your account secured.
        </BrandText>
        <View style={[styles.divideLine, { marginVertical: 24 }]} />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.accountBox}>
          <View style={styles.iconBox}>
            <SVG
              source={EmailIcon}
              width={24}
              height={24}
              style={{ marginRight: layout.padding_x2 }}
            />
            <BrandText>Email</BrandText>
          </View>
          <TertiaryButton text="Verified" size="M" disabled />
        </View>
        <View style={styles.accountBox}>
          <View style={styles.iconBox}>
            <SVG
              source={PhoneIcon}
              width={24}
              height={24}
              style={{ marginRight: layout.padding_x2 }}
            />
            <BrandText>Phone Number</BrandText>
          </View>
          <TertiaryButton
            text="Add Number"
            size="M"
            textColor={primaryColor}
            onPress={() => setOpenVerifyPhoneModal(true)}
          />
        </View>
      </View>

      <VerifyPhoneModal
        visible={openVerifyPhoneModal}
        onClose={() => setOpenVerifyPhoneModal(false)}
      />
    </View>
  );
};
