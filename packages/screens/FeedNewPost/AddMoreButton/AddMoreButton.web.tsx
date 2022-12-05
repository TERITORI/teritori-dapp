import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { TouchableOpacity, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { PrimaryBox } from "../../../components/boxes/PrimaryBox";
import { neutral22 } from "../../../utils/style/colors";
import { fontMedium14, fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { AddMoreButtonProps } from "./AddMoreButton.type";

export const AddMoreButton: React.FC<AddMoreButtonProps> = ({ onPress }) => {
  useHotkeys("meta+/", onPress, []);

  return (
    <View style={{ flex: 1 }}>
      <PrimaryBox fullWidth>
        <TouchableOpacity
          style={{
            padding: layout.padding_x2,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
          onPress={onPress}
        >
          <BrandText style={[fontSemibold13]}>Add more</BrandText>
          <View
            style={{
              backgroundColor: neutral22,
              borderRadius: 4,
              paddingVertical: layout.padding_x0_25,
              paddingHorizontal: layout.padding_x0_75,
            }}
          >
            <BrandText style={[fontMedium14, {}]}>⌘ + /</BrandText>
          </View>
        </TouchableOpacity>
      </PrimaryBox>
    </View>
  );
};
