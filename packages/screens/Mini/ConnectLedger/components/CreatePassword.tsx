import React, { useState } from "react";
import { useWindowDimensions, View } from "react-native";

import { BrandText } from "../../../../components/BrandText";
import { CustomPressable } from "../../../../components/buttons/CustomPressable";
import { SpacerColumn } from "../../../../components/spacer";
import {
  neutral17,
  neutral77,
  neutralA3,
} from "../../../../utils/style/colors";
import { fontMedium16, fontSemibold30 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { CustomButton } from "../../components/CustomButton";
import { CustomCheckbox } from "../../components/CustomCheckbox";
import { Input } from "../../components/Input";
import { StepType } from "../ConnectLedgerScreen";

type Props = {
  onStepChange: (step: StepType) => void;
};

export const CreatePassword = ({ onStepChange }: Props) => {
  const { width: windowWidth } = useWindowDimensions();

  const [formData, setFormDate] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const handleTextChange = (text: string, key: keyof typeof formData) => {
    setFormDate((prev) => ({ ...prev, [key]: text }));
  };
  const onPressSave = () => {
    onStepChange("step_7");
  };

  const isDisabled =
    !formData.password ||
    !isTermsAccepted ||
    formData.password !== formData.confirmPassword;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingTop: 80, flex: 1 }}>
        <BrandText
          style={[
            fontSemibold30,
            {
              lineHeight: 36,
              marginBottom: layout.spacing_x1_5,
            },
          ]}
        >
          Create a Password
        </BrandText>
        <BrandText
          style={[
            fontMedium16,
            {
              color: neutral77,
              lineHeight: 22,
            },
          ]}
        >
          This will be used to unlock your wallet.
        </BrandText>
        <SpacerColumn size={4} />
        <Input
          placeholder="New Pasword"
          value={formData.password}
          onChangeText={(text) => handleTextChange(text, "password")}
          secureTextEntry
        />
        <SpacerColumn size={2} />
        <Input
          placeholder="Confirm New Pasword"
          value={formData.confirmPassword}
          onChangeText={(text) => handleTextChange(text, "confirmPassword")}
          secureTextEntry
        />
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 30,
          left: 10,
          right: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: layout.spacing_x1_5,

            backgroundColor: neutral17,
            borderRadius: 10,
            width: "100%",
            paddingHorizontal: layout.spacing_x2,
            paddingVertical: layout.spacing_x1_5,
            marginBottom: layout.spacing_x2,
          }}
        >
          <CustomCheckbox
            isChecked={isTermsAccepted}
            onPress={() => setIsTermsAccepted((prev) => !prev)}
          />
          <View style={{ flexDirection: "row", gap: layout.spacing_x0_5 }}>
            <BrandText style={[fontMedium16, { color: neutralA3 }]}>
              I agree to the
            </BrandText>
            <CustomPressable
              onPress={() => alert("Terms and conditions")}
              style={{}}
            >
              <BrandText
                style={[
                  fontMedium16,
                  { color: neutralA3, textDecorationLine: "underline" },
                ]}
              >
                Terms of Use.
              </BrandText>
            </CustomPressable>
          </View>
        </View>
        <CustomButton
          title="Save"
          isDisabled={isDisabled}
          onPress={onPressSave}
          width={windowWidth - 20}
          style={{}}
        />
      </View>
    </View>
  );
};
