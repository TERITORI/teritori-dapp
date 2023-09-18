import React from "react";
import { TouchableOpacity, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import warningSVG from "../../../assets/icons/warning.svg";
import {
  errorColor,
  neutral11,
  neutral77,
  successColor,
} from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { SpacerRow } from "../spacer";

export const Toast: React.FC<{
  title: string;
  message?: string;
  onPress: () => void;
  type: "success" | "error";
}> = ({ title, message, onPress, type }) => {
  const insets = useSafeAreaInsets();

  const { width } = useWindowDimensions();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: neutral11,
        borderColor: type === "success" ? successColor : errorColor,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: "solid",
        maxWidth: width - layout.spacing_x1,
        width: 432,
        height: "auto",
        position: "absolute",
        top: insets.top + 24,
        zIndex: 99999999,
        alignSelf: "center",
      }}
    >
      {type === "error" && (
        <>
          <SpacerRow size={3} />
          <SVG width={24} height={24} source={warningSVG} />
        </>
      )}
      <SpacerRow size={3} />
      <View style={{ maxWidth: 287, marginVertical: 12 }}>
        <BrandText style={{ fontSize: 13, lineHeight: 20 }}>{title}</BrandText>
        <BrandText style={{ fontSize: 13, lineHeight: 15, color: neutral77 }}>
          {message}
        </BrandText>
      </View>
    </TouchableOpacity>
  );
};
