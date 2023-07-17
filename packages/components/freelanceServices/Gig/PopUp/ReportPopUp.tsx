import React, { useState } from "react";
import { View } from "react-native";
import { RadioButton } from "react-native-paper";

import { DescriptionReportPopup } from "./DescriptionReportPopup";
import {
  neutral00,
  primaryColor,
  neutral77,
} from "../../../../utils/style/colors";
import { fontSemibold14, fontSemibold16 } from "../../../../utils/style/fonts";
import { BrandText } from "../../../BrandText/BrandText";
import { Separator } from "../../../Separator";
import { SecondaryButton } from "../../../buttons/SecondaryButton";
import { ModalBase } from "../../../modals/ModalBase";
const options = [
  "Non Original Content",
  "Inappropriate Gig",
  "Trademark Violations",
  "Copyright Violations",
];

export const ReportPopUp: React.FC<{
  seller: string;
  visible?: boolean;
  onClose: () => void;
}> = ({ seller, visible, onClose }) => {
  const [displayReportPopUp, setDisplayReportPopUp] = useState(visible);
  const [displayDescriptionReportPopUp, setDisplayDescriptionReportPopUp] =
    useState(false);
  const [isSelected, setIsSelected] = useState("");

  function handleConfirmClick() {
    onClose();
    setDisplayReportPopUp(false);
  }

  return (
    <ModalBase
      onClose={() => {
        handleConfirmClick();
      }}
      label="Report This Gig"
      visible={displayReportPopUp}
      width={372}
      childrenBottom={
        <>
          {displayDescriptionReportPopUp && (
            <DescriptionReportPopup
              seller={seller}
              optionIndex={options.indexOf(isSelected)}
              visible
              onClose={() => {
                setDisplayDescriptionReportPopUp(false);
              }}
            />
          )}

          <Separator style={{ width: "100%" }} />

          <View style={{ width: "100%", alignItems: "flex-end" }}>
            <SecondaryButton
              size="XS"
              text="   Continue   "
              color={neutral00}
              backgroundColor={primaryColor}
              style={{ marginTop: 16, marginBottom: 16, marginRight: 12 }}
              onPress={() => {
                setDisplayDescriptionReportPopUp(true);
              }}
            />
          </View>
        </>
      }
    >
      <BrandText style={fontSemibold16}>
        Let us know why you would like to report this GIG
      </BrandText>
      <BrandText style={[fontSemibold14, { color: neutral77, marginTop: 12 }]}>
        Your report will be kept anonymous
      </BrandText>
      {options.map((option, index) => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
            marginTop: 12,
          }}
          key={index}
        >
          <RadioButton
            value={option}
            color="#16BBFF"
            uncheckedColor="#777777"
            status={isSelected === option ? "checked" : "unchecked"}
            onPress={() => setIsSelected(option)}
          />
          <BrandText style={[fontSemibold16, { marginLeft: 8 }]}>
            {option}
          </BrandText>
        </View>
      ))}
    </ModalBase>
  );
};
