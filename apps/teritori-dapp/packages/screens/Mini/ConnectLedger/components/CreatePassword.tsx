import React, { useState } from "react";
import { View } from "react-native";

import Checkbox from "../../components/Checkbox/Checkbox";
import MiniTextInput from "../../components/MiniTextInput";
import { StepType } from "../ConnectLedgerScreen";

import { BrandText } from "@/components/BrandText";
import { CustomButton } from "@/components/buttons/CustomButton";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { SpacerColumn } from "@/components/spacer";
import { neutral22, neutral77, neutralA3 } from "@/utils/style/colors";
import { fontMedium16, fontSemibold30 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

type Props = {
  onStepChange: (step: StepType) => void;
};

export const CreatePassword = ({ onStepChange }: Props) => {
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
    <View
      style={{
        flex: 1,
        paddingHorizontal: layout.spacing_x2,
      }}
    >
      <SpacerColumn size={8} />
      <View style={{ flex: 1 }}>
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

        <MiniTextInput
          placeholder="New Password"
          value={formData.password}
          onChangeText={(text) => handleTextChange(text, "password")}
          secureTextEntry
        />
        <SpacerColumn size={2} />
        <MiniTextInput
          placeholder="Confirm New Pasword"
          value={formData.confirmPassword}
          onChangeText={(text) => handleTextChange(text, "confirmPassword")}
          secureTextEntry
        />
      </View>

      <Checkbox
        type="circle"
        isChecked={isTermsAccepted}
        onPress={() => setIsTermsAccepted((prev) => !prev)}
        label={
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
        }
        value="terms and conditions"
        size="md"
        labelStyle={[{ color: neutralA3, lineHeight: 22, flex: 1 }]}
        wrapperStyle={{
          alignItems: "center",
          borderRadius: layout.borderRadius,
          backgroundColor: neutral22,
          paddingVertical: layout.spacing_x1,
          paddingHorizontal: layout.spacing_x2,
        }}
      />
      <SpacerColumn size={2} />
      <CustomButton
        title="Save"
        isDisabled={isDisabled}
        onPress={onPressSave}
        style={{}}
      />
    </View>
  );
};
