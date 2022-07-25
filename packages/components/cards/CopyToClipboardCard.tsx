import Clipboard from "@react-native-clipboard/clipboard";
import React, { useContext, useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";

import copyPNG from "../../../assets/icons/copy.png";
import { NSBContext } from "../../context/NSBProvider";
import { neutral23, neutral33 } from "../../utils/colors";
import { BrandText } from "../BrandText";
import ModalBase from "../modals/ModalBase";

export const CopyToClipboardCard: React.FC<{
  text: string;
}> = ({ text }) => {
  const { setNsbSuccess } = useContext(NSBContext);

  const copyToClipboard = () => {
    setNsbSuccess({
      title: "Copied",
      message: "",
    });
    Clipboard.setString(text);
  };

  return (
    <TouchableOpacity onPress={copyToClipboard}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          maxWidth: 332,
          height: 40,
          maxHeight: 40,
          minHeight: 40,
          backgroundColor: neutral23,
          borderWidth: 1,
          borderColor: neutral33,
          borderRadius: 8,
        }}
      >
        <BrandText
          style={{ fontSize: 14, fontWeight: "500", marginLeft: 12 }}
          numberOfLines={1}
        >
          {text}
        </BrandText>
        <Image
          source={copyPNG}
          style={{ width: 24, height: 24, marginRight: 12 }}
        />
      </View>
    </TouchableOpacity>
  );
};
