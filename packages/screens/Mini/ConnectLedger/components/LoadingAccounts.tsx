import React from "react";
import { useWindowDimensions, View } from "react-native";

import requestingPermissionPNG from "../../../../../assets/icons/loader.png";
import { BrandText } from "../../../../components/BrandText";
import { SVGorImageIcon } from "../../../../components/SVG/SVGorImageIcon";
import { SpacerColumn } from "../../../../components/spacer";
import { neutral77 } from "../../../../utils/style/colors";
import { fontMedium16, fontSemibold30 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { CustomButton } from "../../components/Button/CustomButton";
import { StepType } from "../ConnectLedgerScreen";

type Props = {
  onStepChange: (step: StepType) => void;
};
export const LoadingAccounts = ({ onStepChange }: Props) => {
  const { width: windowWidth } = useWindowDimensions();

  const onPressNext = () => {
    onStepChange("step_5");
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
          }}
        >
          <SVGorImageIcon icon={requestingPermissionPNG} iconSize={152} />
        </View>
        <BrandText
          style={[
            fontSemibold30,
            {
              textAlign: "center",
              lineHeight: 36,
              marginBottom: layout.spacing_x1_5,
            },
          ]}
        >
          Loading Accounts
        </BrandText>
        <BrandText
          style={[
            fontMedium16,
            {
              width: windowWidth - 100,
              color: neutral77,
              textAlign: "center",
              lineHeight: 22,
            },
          ]}
        >
          We're loading accounts from your ledger device. This will take a few
          seconds...
        </BrandText>
      </View>
      <CustomButton title="Next" onPress={onPressNext} />
    </View>
  );
};
