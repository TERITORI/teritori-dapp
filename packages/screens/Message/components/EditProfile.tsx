import React, { useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { BrandText } from "../../../components/BrandText";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SpacerColumn } from "../../../components/spacer";
import {
  MessageState,
  selectContactInfo,
  setContactInfo,
} from "../../../store/slices/message";
import { neutral00, secondaryColor } from "../../../utils/style/colors";
import { fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { createSharableLink } from "../../../weshnet/services";

interface EditProfileProps {
  onClose: () => void;
}

export const EditProfile = ({ onClose }: EditProfileProps) => {
  const contactInfo = useSelector(selectContactInfo);
  const [values, setValues] = useState({
    name: contactInfo.name,
    avatar: contactInfo.avatar,
  });
  const dispatch = useDispatch();

  const handleChange = (
    key: keyof MessageState["contactInfo"],
    value: string,
  ) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    const shareLink = createSharableLink({
      ...contactInfo,
      ...values,
    });
    dispatch(
      setContactInfo({
        shareLink,
        ...values,
      }),
    );
    onClose();
  };

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
      }}
    >
      <SpacerColumn size={2} />
      <BrandText style={[fontSemibold16, { marginBottom: layout.spacing_x1 }]}>
        Name
      </BrandText>
      <View style={{ height: 50 }}>
        <TextInputCustom
          name="name"
          label=""
          placeHolder="Add name here"
          height={50}
          fullWidth
          onChangeText={(text) => handleChange("name", text)}
          value={values.name}
          containerStyle={{
            flex: 1,
          }}
          placeholderTextColor={secondaryColor}
          squaresBackgroundColor={neutral00}
        />
      </View>
      <SpacerColumn size={2} />
      <BrandText style={[fontSemibold16, { marginBottom: layout.spacing_x1 }]}>
        Avatar
      </BrandText>
      <View style={{ height: 50 }}>
        <TextInputCustom
          name="avatar"
          label=""
          placeHolder="Paste avatar URL here"
          height={50}
          fullWidth
          onChangeText={(text) => handleChange("avatar", text)}
          value={values.avatar}
          containerStyle={{
            flex: 1,
          }}
          placeholderTextColor={secondaryColor}
          squaresBackgroundColor={neutral00}
        />
      </View>
      <SpacerColumn size={2} />
      <PrimaryButton
        onPress={handleSave}
        text="Update profile"
        size="M"
        touchableStyle={{
          alignSelf: "center",
        }}
      />
    </View>
  );
};
