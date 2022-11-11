import React, { useState } from "react";
import { View } from "react-native";

import { SecondaryButton } from "../../../../../components/buttons/SecondaryButton";
import {
  neutral00,
  neutral33,
  primaryColor,
  neutral77,
} from "../../../../../utils/style/colors";
import {
  fontSemibold14,
  fontSemibold12,
} from "../../../../../utils/style/fonts";
import { BrandText } from "../../../../BrandText/BrandText";
import { Separator } from "../../../../Separator";
import { TextInputCustom } from "../../../../inputs/TextInputCustom";
import { ModalBase } from "../../../../modals/ModalBase";

export const DescritpionReportPopup: React.FC<{
  visible?: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const [displayDescriptionReportPopUp, setDisplayDescriptionReportPopUp] =
    useState(visible);

  function handleConfirmClick() {
    onClose();
    setDisplayDescriptionReportPopUp(false);
  }

  return (
    <ModalBase
      onClose={() => {
        handleConfirmClick();
      }}
      label="Reporting Inappropriate Gig"
      visible={displayDescriptionReportPopUp}
      width={372}
      childrenBottom={
        <>
          <Separator style={{ width: "100%" }} />

          <View
            style={{
              width: "100%",
              justifyContent: "space-around",
              flexDirection: "row",
              marginTop: 16,
              marginBottom: 16,
            }}
          >
            <SecondaryButton
              size="XS"
              text="   Continue   "
              color={neutral00}
              backgroundColor={primaryColor}
            />
            <SecondaryButton
              size="XS"
              text="   Cancel   "
              color={primaryColor}
              backgroundColor={neutral33}
              onPress={() => {
                handleConfirmClick();
              }}
            />
          </View>
        </>
      }
    >
      <BrandText
        style={[fontSemibold14, { color: neutral77, marginBottom: 12 }]}
      >
        Describe the violation/reason for Gig removal request *
      </BrandText>
      <TextInputCustom
        label=""
        name="Description Input"
        placeHolder="Type description here"
        height={120}
        mainContainerStyle={{}}
        multiline
        numberOfLines={5}
      />
      <BrandText
        style={[
          fontSemibold14,
          { color: neutral77, marginTop: 20, marginBottom: 12 },
        ]}
      >
        Reference URL (if applicable)
      </BrandText>
      <TextInputCustom
        label=""
        name="Description Input"
        placeHolder="Type description here"
        height={40}
        mainContainerStyle={{}}
      />
      <BrandText
        style={[
          fontSemibold12,
          { color: neutral77, marginTop: 20, marginBottom: 12 },
        ]}
      >
        * Gigs associated with non permitted usage as detailed in the User
        Conduct section under our{" "}
        <BrandText style={fontSemibold12}>Terms of Service</BrandText>
      </BrandText>
    </ModalBase>
  );
};
