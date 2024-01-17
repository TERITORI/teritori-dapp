import React, { useState } from "react";
import { View } from "react-native";
import { SvgProps } from "react-native-svg";

import Checkbox from "./Checkbox";
import chevronDropdownSVG from "../../../../../assets/icons/chevron-down.svg";
import { BrandText } from "../../../../components/BrandText";
import { Dropdown } from "../../../../components/Dropdown";
import { SVG } from "../../../../components/SVG";
import { SpacerRow } from "../../../../components/spacer";
import {
  blueDefault,
  neutral22,
  secondaryColor,
  withAlpha,
} from "../../../../utils/style/colors";
import { fontSemibold14 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";

export type FilterOption = {
  value: string;
  name: string;
  isChecked: boolean;
};

type DropdownWithCheckProps = {
  filterOptions: FilterOption[];
  headerOptions: { name: string; icon?: React.FC<SvgProps> | string };
  onPress: (selectedOptions: Partial<FilterOption>[]) => void;
};

export default function DropdownWithCheck({
  filterOptions,
  headerOptions,
  onPress,
}: DropdownWithCheckProps) {
  const [filters, setFilters] =
    useState<Partial<FilterOption>[]>(filterOptions);
  // const [allOption, setAllOption] = useState(true);

  const filterButtons = (isChecked: boolean, value: string) => {
    if (value === "all") {
      if (!isChecked) {
        setFilters((prev) => {
          const newData = prev.map((item) => ({ ...item, isChecked: true }));
          onPress(newData);
          return newData;
        });
        return;
      }

      if (isChecked) {
        setFilters((prev) => {
          const newData = prev.map((item) => ({ ...item, isChecked: false }));
          onPress(newData);
          return newData;
        });
      }

      return;
    }

    setFilters((prev) => {
      const newData = prev.map((item) => {
        if (item.value === value) {
          if (item.isChecked) {
            return { ...item, isChecked: false };
          }
          return { ...item, isChecked: true };
        }

        return item;
      });

      let manipluatedData = newData;

      if (newData.some((item) => !item.isChecked)) {
        manipluatedData = newData.map((item) => {
          if (item.value === "all") {
            return { ...item, isChecked: false };
          }
          return item;
        });
      }
      onPress(manipluatedData);
      return manipluatedData;
    });
  };

  return (
    <Dropdown
      triggerComponent={<DropdownButton options={headerOptions} />}
      positionStyle={{
        right: 0,
        top: 40,
      }}
    >
      <View
        style={{
          borderRadius: 12,
          paddingHorizontal: layout.spacing_x2,
          width: 200,
          backgroundColor: neutral22,
        }}
      >
        {filters.map((filterOptionItem, index) => {
          const lastItem = index === filters.length - 1;

          return (
            <DropdownItem
              key={filterOptionItem.value}
              lastItem={lastItem}
              dropdownOption={filterOptionItem}
              onPress={filterButtons}
            />
          );
        })}
      </View>
    </Dropdown>
  );
}

function DropdownButton({
  options,
}: {
  options: { name: string; icon?: React.FC<SvgProps> | string };
}) {
  return (
    <View
      style={{
        backgroundColor: withAlpha(blueDefault, 0.2),
        flexDirection: "row",
        borderRadius: 999,
        position: "relative",
        paddingHorizontal: 12,
        paddingVertical: 6,
        alignItems: "center",
      }}
    >
      <BrandText
        style={{
          ...fontSemibold14,
          color: blueDefault,
        }}
      >
        {options.name}
      </BrandText>
      <SpacerRow size={1} />
      <SVG
        source={options.icon ?? chevronDropdownSVG}
        color={blueDefault}
        height={16}
        width={16}
      />
    </View>
  );
}

type DropdownItemProps = {
  dropdownOption: Partial<FilterOption>;
  lastItem?: boolean;
  onPress: (isChecked: boolean, value: string) => void;
};

function DropdownItem({
  dropdownOption,
  lastItem,
  onPress,
}: DropdownItemProps) {
  return (
    <View
      style={{
        paddingVertical: layout.spacing_x2,
        borderBottomWidth: !lastItem ? 0.5 : 0,
        borderBottomColor: !lastItem ? withAlpha(secondaryColor, 0.3) : "",
      }}
      key={dropdownOption.value}
    >
      <Checkbox
        label={dropdownOption.name}
        value={dropdownOption?.value ?? ""}
        isChecked={dropdownOption.isChecked ?? false}
        onPress={onPress}
      />
    </View>
  );
}
