import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import avatar from "../../../../assets/icons/avatar.svg";
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

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ items, onChange }) => {
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
              {item.checked ? (
                <CheckboxDappStore isChecked={isChecked} />
              ) : (
                <CheckboxDappStore isChecked={!isChecked} />
              )}
            </TouchableOpacity>
            <SpacerRow size={2} />
            <SVG source={avatar} />
            <SpacerRow size={2} />
            <Text style={[fontSemibold14, { color: secondaryColor }]}>
              {item.name}
            </Text>
          </FlexRow>
          <SpacerColumn size={1} />
        </>
      ))}
    </View>
  );
};

export default CheckboxGroup;
