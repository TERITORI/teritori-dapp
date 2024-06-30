import React from "react";
import { TouchableOpacity, View } from "react-native";

import { useCommonStyles } from "./commonStyles";
import { SettingItemType } from "../types";

import { BrandText } from "@/components/BrandText";
import ToggleButton from "@/components/buttons/ToggleButton";
import { fontSemibold14 } from "@/utils/style/fonts";

export const SettingItem: React.FC<{
  item: SettingItemType;
  onPress: (item: SettingItemType) => void;
  disabled?: boolean;
  testID?: string;
}> = ({ item, onPress, disabled, testID }) => {
  const commonStyles = useCommonStyles();

  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      disabled={disabled}
      testID={testID}
    >
      <View style={commonStyles.switchBox}>
        <View>
          <BrandText style={[fontSemibold14]}>{item.title}</BrandText>
          {item.description ? (
            <BrandText style={commonStyles.cardContent}>
              {item.description}
            </BrandText>
          ) : null}
        </View>
        <ToggleButton value={item.state} />
      </View>
    </TouchableOpacity>
  );
};
