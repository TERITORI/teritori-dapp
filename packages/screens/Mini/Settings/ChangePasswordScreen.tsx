import React, { useState } from "react";
import { Dimensions, View } from "react-native";

import { Input } from "./components/Input";
import { SettingBase } from "./components/SettingBase";
import { SpacerColumn } from "../../../components/spacer";
import { ScreenFC } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";
import { CustomButton } from "../components/CustomButton";

export const ChangePasswordScreen: ScreenFC<"MiniChangePassword"> = ({
  navigation,
}) => {
  const [formData, setFormDate] = useState({
    pasword: "",
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
    <SettingBase
      title="Change Password"
      onGoBack={gotoSecurityAndPrivacy}
      reverseView={false}
      background="transparent"
    >
      <View
        style={{
          height: Dimensions.get("window").height - 180,
          marginTop: layout.spacing_x4,
          paddingHorizontal: layout.spacing_x2,
          position: "relative",
        }}
      >
        <Input
          placeholder="Current Pasword"
          value={formData.pasword}
          onChangeText={(text) => handleTextChange(text, "pasword")}
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

        <CustomButton
          onPress={onSaveNewPassword}
          style={{
            position: "absolute",
            bottom: 0,
            left: layout.spacing_x2,
            right: layout.spacing_x2,
            zIndex: 99,
          }}
          title="Save"
        />
      </View>
    </SettingBase>
  );
};
