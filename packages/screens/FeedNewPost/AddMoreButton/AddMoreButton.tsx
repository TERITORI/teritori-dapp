import React from "react";
import { TouchableOpacity, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { PrimaryBox } from "../../../components/boxes/PrimaryBox";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { AddMoreButtonProps } from "./AddMoreButton.type";

export const AddMoreButton: React.FC<AddMoreButtonProps> = ({ onPress }) => (
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
      </TouchableOpacity>
    </PrimaryBox>
  </View>
);
