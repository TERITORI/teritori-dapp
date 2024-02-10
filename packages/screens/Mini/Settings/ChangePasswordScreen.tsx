import React, { useState } from "react";
import { View } from "react-native";

import { SpacerColumn } from "../../../components/spacer";
import { ScreenFC } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";
import { CustomButton } from "../components/Button/CustomButton";
import MiniTextInput from "../components/MiniTextInput";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

export const ChangePasswordScreen: ScreenFC<"MiniChangePassword"> = ({
  navigation,
}) => {
  const [formData, setFormDate] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const gotoSecurityAndPrivacy = () =>
    navigation.replace("MiniSecurityAndPrivacy");

  const handleTextChange = (text: string, key: keyof typeof formData) => {
    setFormDate((prev) => ({ ...prev, [key]: text }));
  };

  const onSaveNewPassword = () => {};

  return (
    <BlurScreenContainer
      title="Change Password"
      onGoBack={gotoSecurityAndPrivacy}
    >
      <View
        style={{
          paddingHorizontal: layout.spacing_x2,
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <View>
          <SpacerColumn size={2} />
          <MiniTextInput
            placeholder="Current Pasword"
            value={formData.password}
            onChangeText={(text) => handleTextChange(text, "password")}
            secureTextEntry
          />
          <SpacerColumn size={2} />
          <MiniTextInput
            placeholder="New Pasword"
            value={formData.newPassword}
            onChangeText={(text) => handleTextChange(text, "newPassword")}
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

        <CustomButton onPress={onSaveNewPassword} title="Save" />
      </View>
    </BlurScreenContainer>
  );
};
