import React from "react";
import { Switch, TouchableOpacity, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import {
  neutral55,
  neutralA3,
  primaryColor,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { SettingItemType } from "../types";
import { useCommonStyles } from "./commonStyles";

export const SettingItem: React.FC<{
  item: SettingItemType;
  onPress: (item: SettingItemType) => void;
}> = ({ item, onPress }) => {
  const commonStyles = useCommonStyles();

  return (
    <TouchableOpacity onPress={() => onPress(item)}>
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
          // @ts-ignore
          activeThumbColor={primaryColor}
          thumbColor={item.state ? primaryColor : neutral55}
          trackColor={{ true: secondaryColor, false: neutralA3 }}
          value={item.state as boolean}
        />
      </View>
    </TouchableOpacity>
  );
};
