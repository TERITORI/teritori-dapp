import React from "react";
import { View } from "react-native";

import ledgerSVG from "@/assets/icons/ledger.svg";
import { StepType } from "../ConnectLedgerScreen";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { CustomButton } from "@/components/buttons/CustomButton";
import { SpacerColumn } from "@/components/spacer";
import { neutral17, neutral77 } from "@/utils/style/colors";
import { fontMedium16, fontSemibold30 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

type Props = {
  onStepChange: (step: StepType) => void;
};

export const ConnectDevice = ({ onStepChange }: Props) => {
  const onPressConnect = () => {
    onStepChange("step_2");
  };

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: layout.spacing_x2,
      }}
    >
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
          <SVG source={ledgerSVG} height={72} width={72} />
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
          Connect a Ledger Device
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
          Connect your ledger device to your ? and make sure it is unlocked.
        </BrandText>
      </View>
      <CustomButton title="Connect" onPress={onPressConnect} />
    </View>
  );
};
