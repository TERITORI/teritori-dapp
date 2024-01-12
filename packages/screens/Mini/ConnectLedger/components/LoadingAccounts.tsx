import React from "react";
import { Dimensions, View } from "react-native";

import requestingPermissionPNG from "../../../../../assets/icons/loader.png";
import { BrandText } from "../../../../components/BrandText";
import { SVGorImageIcon } from "../../../../components/SVG/SVGorImageIcon";
import { neutral77 } from "../../../../utils/style/colors";
import { fontMedium16, fontSemibold30 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { CustomButton } from "../../components/CustomButton";
import { StepType } from "../ConnectLedgerScreen";
type Props = {
  onStepChange: (step: StepType) => void;
};
export const LoadingAccounts = ({ onStepChange }: Props) => {
  const onPressNext = () => {
    onStepChange("step_5");
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignItems: "center", paddingTop: 80, flex: 1 }}>
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
              width: Dimensions.get("window").width - 100,
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
      <CustomButton
        title="Next"
        onPress={onPressNext}
        width={Dimensions.get("window").width - 20}
        style={{
          position: "absolute",
          bottom: 30,
          left: 10,
          right: 10,
        }}
      />
    </View>
  );
};
