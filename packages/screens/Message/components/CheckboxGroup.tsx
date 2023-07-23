import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Avatar } from "react-native-paper";

import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { secondaryColor } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { CheckboxDappStore } from "../../DAppStore/components/CheckboxDappStore";
interface CheckboxItem {
  name: string;
  avatar: string;
  icon: string;
  checked: boolean;
}
interface CheckboxGroupProps {
  items: CheckboxItem[];
  onChange: (items: CheckboxItem[]) => void;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  items,
  onChange,
}) => {
  const [checkboxItems, setCheckboxItems] = useState<CheckboxItem[]>(items);
  const handleCheckboxPress = (index: number) => {
    const newItems = [...checkboxItems];
    newItems[index].checked = !newItems[index].checked;
    setCheckboxItems(newItems);
    onChange(newItems);
  };

  return (
    <View>
      {checkboxItems.map((item, index) => (
        <>
          <FlexRow>
            <TouchableOpacity
              key={index}
              onPress={() => handleCheckboxPress(index)}
            >
              <CheckboxDappStore isChecked={item.checked} />
            </TouchableOpacity>
            <SpacerRow size={2} />
            <Avatar.Image size={40} source={item.avatar || ""} />

            <SpacerRow size={2} />
            <BrandText style={[fontSemibold14, { color: secondaryColor }]}>
              {item.name}
            </BrandText>
          </FlexRow>
          <SpacerColumn size={1} />
        </>
      ))}
    </View>
  );
};
