import React, { useState } from "react";
import { Dimensions, View } from "react-native";

import { Input } from "./components/Input";
import { SettingBase } from "./components/SettingBase";
import { BrandText } from "../../../components/BrandText";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { SpacerColumn } from "../../../components/spacer";
import { ScreenFC } from "../../../utils/navigation";
import { blueDefault } from "../../../utils/style/colors";
import { fontSemibold15 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

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
        <CustomPressable
          onPress={onSaveNewPassword}
          style={{
            backgroundColor: blueDefault,
            paddingVertical: layout.spacing_x1_5,
            borderRadius: 100,
            position: "absolute",
            bottom: 0,
            left: layout.spacing_x2,
            right: layout.spacing_x2,
            zIndex: 99,
          }}
        >
          <BrandText style={[fontSemibold15, { textAlign: "center" }]}>
            Save
          </BrandText>
        </CustomPressable>
      </View>
    </SettingBase>
  );
};
