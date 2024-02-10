import React from "react";
import { View } from "react-native";

import questionMarkSVG from "../../../../../assets/icons/question-gray.svg";
import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { SpacerColumn } from "../../../../components/spacer";
import { neutral17, neutral77 } from "../../../../utils/style/colors";
import { fontMedium16, fontSemibold30 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { CustomButton } from "../../components/Button/CustomButton";
import { StepType } from "../ConnectLedgerScreen";

type Props = {
  onStepChange: (step: StepType) => void;
};

export const OpenHelpInApp = ({ onStepChange }: Props) => {
  const onPressClose = () => {
    onStepChange("step_4");
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: layout.spacing_x2 }}>
      <SpacerColumn size={8} />
      <View style={{ alignItems: "center", flex: 1 }}>
        <View
          style={{
            height: 152,
            width: 152,
            marginBottom: layout.spacing_x4,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: neutral17,
            borderRadius: 100,
          }}
        >
          <SVG source={questionMarkSVG} height={40} width={40} />
        </View>
        <BrandText
          style={[
            fontSemibold30,
            {
              width: 195,
              textAlign: "center",
              lineHeight: 36,
              marginBottom: layout.spacing_x1_5,
            },
          ]}
        >
          Open ? App in your Ledger
        </BrandText>
        <BrandText
          style={[
            fontMedium16,
            {
              width: 250,
              color: neutral77,
              textAlign: "center",
              lineHeight: 22,
            },
          ]}
        >
          Please make sure the ? App is opened in your ledger device.
        </BrandText>
      </View>
      <CustomButton title="Close" type="gray" onPress={onPressClose} />
    </View>
  );
};
