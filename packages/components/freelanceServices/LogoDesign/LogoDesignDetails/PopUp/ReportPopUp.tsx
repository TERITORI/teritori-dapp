import React, { useState } from "react";
import { View } from "react-native";
import { RadioButton } from "react-native-paper";

import { SecondaryButton } from "../../../../../components/buttons/SecondaryButton";
import {
  neutral00,
  primaryColor,
  neutral77,
} from "../../../../../utils/style/colors";
import {
  fontSemibold14,
  fontSemibold16,
} from "../../../../../utils/style/fonts";
import { BrandText } from "../../../../BrandText/BrandText";
import { Separator } from "../../../../Separator";
import { ModalBase } from "../../../../modals/ModalBase";
import { DescritpionReportPopup } from "./DescritpionReportPopup";

export const ReportPopUp: React.FC<{
  visible?: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
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
            <DescritpionReportPopup
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
          marginTop: 12,
        }}
      >
        <RadioButton
          value=""
          color="#16BBFF"
          uncheckedColor="#777777"
          status={
            isSelected === "Non orininal Content" ? "checked" : "unchecked"
          }
          onPress={() => setIsSelected("Non orininal Content")}
        />
        <BrandText style={[fontSemibold16, { marginLeft: 8 }]}>
          Non Original Content
        </BrandText>
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
      >
        <RadioButton
          value=""
          color="#16BBFF"
          uncheckedColor="#777777"
          status={isSelected === "Inappropriate Gig" ? "checked" : "unchecked"}
          onPress={() => setIsSelected("Inappropriate Gig")}
        />
        <BrandText style={[fontSemibold16, { marginLeft: 8 }]}>
          Inappropriate Gig
        </BrandText>
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
      >
        <RadioButton
          value=""
          color="#16BBFF"
          uncheckedColor="#777777"
          status={
            isSelected === "Trademark Violations" ? "checked" : "unchecked"
          }
          onPress={() => setIsSelected("Trademark Violations")}
        />
        <BrandText style={[fontSemibold16, { marginLeft: 8 }]}>
          Trademark Violations
        </BrandText>
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}
      >
        <RadioButton
          value=""
          color="#16BBFF"
          uncheckedColor="#777777"
          status={
            isSelected === "Copyright Violations" ? "checked" : "unchecked"
          }
          onPress={() => setIsSelected("Copyright Violations")}
        />
        <BrandText style={[fontSemibold16, { marginLeft: 8 }]}>
          Copyright Violations
        </BrandText>
      </View>
    </ModalBase>
  );
};
