import React, { useCallback, useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";

import {
  additionalRed,
  neutral00,
  neutral33,
  neutralA3,
  primaryColor,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { TertiaryButton } from "../../buttons/TertiaryButton";
import ModalBase from "../../modals/ModalBase";

type VerifyPhoneModalProps = {
  visible: boolean;
  onClose: () => void;
};

export const VerifyPhoneModal: React.FC<VerifyPhoneModalProps> = ({
  visible,
  onClose,
}) => {
  const modalWidth = 372;

  const [country, setCountry] = useState<string>();
  const [phoneNumber, setPhoneNumber] = useState<string>();

  const styles = StyleSheet.create({
    footerContainer: {
      width: modalWidth,
      paddingBottom: layout.padding_x2_5,
    },
    footerContent: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: layout.padding_x2_5,
    },
    contentContainer: {
      flexDirection: "column",
      width: "100%",
    },
    titleBox: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    title: StyleSheet.flatten([
      fontSemibold14,
      {
        color: neutralA3,
      },
    ]),
    important: StyleSheet.flatten([
      fontSemibold14,
      {
        color: additionalRed,
      },
    ]),
    input: StyleSheet.flatten([
      fontSemibold14,
      {
        width: "100%",
        backgroundColor: neutral00,
        borderWidth: 1,
        borderColor: neutral33,
        borderRadius: layout.padding_x1_5,
        padding: layout.padding_x2,
        marginTop: layout.padding_x1_5,
        marginBottom: layout.padding_x2_5,
        color: secondaryColor,
      },
    ]),
    divideLine: {
      width: "100%",
      height: 1,
      backgroundColor: neutral33,
      marginBottom: layout.padding_x2_5,
    },
  });

  const ModalHeader = useCallback(
    () => <BrandText>Verify Phone Number</BrandText>,
    []
  );

  const ModalFooter = useCallback(
    () => (
      <View style={styles.footerContainer}>
        <View style={styles.divideLine} />
        <View style={styles.footerContent}>
          <TertiaryButton
            text="Verify by SMS"
            textColor={primaryColor}
            size="M"
          />
          <TertiaryButton
            text="Verify by Call"
            textColor={primaryColor}
            size="M"
          />
        </View>
      </View>
    ),
    [styles]
  );

  return (
    <ModalBase
      visible={visible}
      onClose={onClose}
      Header={ModalHeader}
      width={modalWidth}
      childrenBottom={ModalFooter()}
    >
      <View style={styles.contentContainer}>
        <View style={styles.titleBox}>
          <BrandText style={styles.title}>Enter Country&nbsp;</BrandText>
          <BrandText style={styles.important}>*</BrandText>
        </View>
        <TextInput
          style={[styles.input, { outlineStyle: "none" } as any]}
          value={country}
          onChangeText={(value) => setCountry(value)}
        />
        <View style={styles.titleBox}>
          <BrandText style={styles.title}>
            Enter your Phone Number&nbsp;
          </BrandText>
          <BrandText style={styles.important}>*</BrandText>
        </View>
        <TextInput
          style={[styles.input, { outlineStyle: "none" } as any]}
          value={phoneNumber}
          onChangeText={(value) => setPhoneNumber(value)}
        />
      </View>
    </ModalBase>
  );
};
