import React, { useState } from "react";
import { View } from "react-native";

import { SpacerColumn } from "../../../components/spacer";
import { ScreenFC } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";
import { BlurScreenContainer } from "../components/BlurScreenContainer";
import { CustomButton } from "../components/CustomButton";
import { Input } from "../components/Input";

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
      background="transparent"
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
          <Input
            placeholder="Current Pasword"
            value={formData.password}
            onChangeText={(text) => handleTextChange(text, "password")}
            secureTextEntry
          />
          <SpacerColumn size={2} />
          <Input
            placeholder="New Pasword"
            value={formData.newPassword}
            onChangeText={(text) => handleTextChange(text, "newPassword")}
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

        <CustomButton onPress={onSaveNewPassword} title="Save" />
      </View>
    </BlurScreenContainer>
  );
};
