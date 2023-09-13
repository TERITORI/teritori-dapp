import React from "react";
import { Switch, TouchableOpacity, View } from "react-native";

import { useCommonStyles } from "./commonStyles";
import { BrandText } from "../../../components/BrandText";
import {
  neutral55,
  neutralA3,
  primaryColor,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { SettingItemType } from "../types";

export const SettingItem: React.FC<{
  item: SettingItemType;
  onPress: (item: SettingItemType) => void;
  disabled?: boolean;
}> = ({ item, onPress, disabled }) => {
  const commonStyles = useCommonStyles();

  return (
    <TouchableOpacity onPress={() => onPress(item)} disabled={disabled}>
      <View style={commonStyles.switchBox}>
        <View>
          <BrandText style={[fontSemibold14]}>{item.title}</BrandText>
          {item.description ? (
            <BrandText style={commonStyles.cardContent}>
              {item.description}
            </BrandText>
          ) : null}
        </View>
        <Switch
          // @ts-expect-error
          activeThumbColor={primaryColor}
          thumbColor={item.state ? primaryColor : neutral55}
          trackColor={{ true: secondaryColor, false: neutralA3 }}
          value={item.state}
        />
      </View>
    </TouchableOpacity>
  );
};
