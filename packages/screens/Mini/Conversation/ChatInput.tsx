import React, { useState } from "react";
import { TextInput, View } from "react-native";

import cameraSVG from "../../../../assets/icons/camera-white.svg";
import micSVG from "../../../../assets/icons/mic-white.svg";
import chatPlusSVG from "../../../../assets/icons/plus-white.svg";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { neutral22, neutral77 } from "../../../utils/style/colors";
import { fontMedium16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

type Props = object;

export const ChatInput = (props: Props) => {
  const [newMessage, setNewMessage] = useState("");

  const onNewMessageChange = (text: string) => {
    setNewMessage(text);
  };
  const onPlusPress = () => {};
  const onCameraPress = () => {};
  const onMicPress = () => {};

  return (
    <View
      style={{
        flexDirection: "row",
        paddingHorizontal: layout.spacing_x2,
        alignItems: "center",
        gap: layout.spacing_x2,
      }}
    >
      <CustomPressable onPress={onPlusPress}>
        <SVG source={chatPlusSVG} />
      </CustomPressable>
      <TextInput
        placeholder="Message"
        value={newMessage}
        onChangeText={onNewMessageChange}
        placeholderTextColor={neutral77}
        style={[
          fontMedium16,
          {
            color: neutral77,
            flex: 1,
            backgroundColor: neutral22,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 10,
          },
        ]}
      />
      <CustomPressable onPress={onCameraPress}>
        <SVG source={cameraSVG} height={24} />
      </CustomPressable>
      <CustomPressable onPress={onMicPress}>
        <SVG source={micSVG} height={24} />
      </CustomPressable>
    </View>
  );
};
