import React, { useState } from "react";
import { View } from "react-native";

import cameraSVG from "../../../../assets/icons/camera-white.svg";
import micSVG from "../../../../assets/icons/mic-white.svg";
import chatPlusSVG from "../../../../assets/icons/plus-white.svg";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { neutral77 } from "../../../utils/style/colors";
import { fontMedium16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import MiniTextInput from "../components/MiniTextInput";

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
        alignItems: "center",
        gap: layout.spacing_x2,
      }}
    >
      <CustomPressable onPress={onPlusPress}>
        <SVG source={chatPlusSVG} />
      </CustomPressable>

      <View style={{ flex: 1 }}>
        <MiniTextInput
          placeholder="Message"
          value={newMessage}
          onChangeText={onNewMessageChange}
          style={{ paddingVertical: layout.spacing_x1 }}
          inputStyle={[fontMedium16, { color: neutral77 }]}
        />
      </View>
      <CustomPressable onPress={onCameraPress}>
        <SVG source={cameraSVG} height={24} />
      </CustomPressable>
      <CustomPressable onPress={onMicPress}>
        <SVG source={micSVG} height={24} />
      </CustomPressable>
    </View>
  );
};
