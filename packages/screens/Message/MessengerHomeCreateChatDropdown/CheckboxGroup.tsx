import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import avatar from "../../../../assets/icons/avatar.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { secondaryColor } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { CheckboxDappStore } from "../../DAppStore/components/CheckboxDappStore";

interface CheckboxItem {
  name: string;
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
  const [isChecked, setChecked] = useState(true);
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
            <SVG source={avatar} />
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
