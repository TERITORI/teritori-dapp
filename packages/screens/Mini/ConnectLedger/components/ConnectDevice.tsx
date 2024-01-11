import React from "react";
import { Dimensions, View } from "react-native";

import ledgerSVG from "../../../../../assets/icons/ledger.svg";
import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { neutral17, neutral77 } from "../../../../utils/style/colors";
import { fontMedium16, fontSemibold30 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { CustomButton } from "../../components/CustomButton";
import { StepType } from "../ConnectLedgerScreen";
type Props = {
  onStepChange: (step: StepType) => void;
};

export const ConnectDevice = ({ onStepChange }: Props) => {
  const onPressConnect = () => {
    onStepChange("step_2");
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignItems: "center", paddingTop: 100, flex: 1 }}>
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
      <CustomButton
        title="Connect"
        onPress={onPressConnect}
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
