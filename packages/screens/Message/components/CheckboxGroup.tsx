import React, { useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Avatar } from "react-native-paper";

import FlexRow from "../../../components/FlexRow";

import { BrandText } from "@/components/BrandText";
import { Checkbox } from "@/components/Checkbox";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { neutral77, secondaryColor } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export interface CheckboxMessageItem {
  id: string;
  name: string;
  avatar: string;
  checked: boolean;
}
interface CheckboxMessageGroupProps {
  items: CheckboxMessageItem[];
  onChange: (items: CheckboxMessageItem[]) => void;
  searchText: string;
}

const CheckboxMessage = ({
  item,
  onPress,
}: {
  item: CheckboxMessageItem;
  onPress: () => void;
}) => {
  return (
    <>
      <FlexRow>
        <TouchableOpacity onPress={onPress}>
          <Checkbox isChecked={item.checked} />
        </TouchableOpacity>
        <SpacerRow size={2} />
        <Avatar.Image size={40} source={{ uri: item.avatar || "" }} />

        <SpacerRow size={2} />
        <BrandText style={[fontSemibold14, { color: secondaryColor }]}>
          {item.name}
        </BrandText>
      </FlexRow>
      <SpacerColumn size={1} />
    </>
  );
};

export const CheckboxGroup: React.FC<CheckboxMessageGroupProps> = ({
  items,
  onChange,
  searchText,
}) => {
  const [checkboxItems, setCheckboxItems] =
    useState<CheckboxMessageItem[]>(items);
  const handleCheckboxPress = (id: string) => {
    const newItems = checkboxItems;
    const itemIndex = newItems.findIndex((item) => item.id === id);

    newItems[itemIndex].checked = !newItems[itemIndex].checked;
    setCheckboxItems(newItems);
    onChange(newItems);
  };

  const searchItems = useMemo(() => {
    return checkboxItems.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [searchText, checkboxItems]);

  return (
    <View>
      {!searchItems.length && !!searchText.trim() && (
        <View
          style={{
            alignItems: "center",
            paddingBottom: layout.spacing_x1,
          }}
        >
          <BrandText style={[fontSemibold14, { color: neutral77 }]}>
            No records found
          </BrandText>
        </View>
      )}
      {!searchText.length &&
        checkboxItems.map((item, index) => (
          <CheckboxMessage
            key={item.id}
            item={item}
            onPress={() => handleCheckboxPress(item.id)}
          />
        ))}
      {!!searchText.length &&
        searchItems.map((item, index) => (
          <CheckboxMessage
            key={item.id}
            item={item}
            onPress={() => handleCheckboxPress(item.id)}
          />
        ))}
    </View>
  );
};
