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
  checked: boolean;
};

type DropdownWithCheckProps = {
  filterOptions: FilterOption[];
  headerOptions: { name: string; icon?: React.FC<SvgProps> | string };
  onPress: (selectedOptions: DropdownReturnedType[]) => void;
};

export default function DropdownWithCheck({
  filterOptions,
  headerOptions,
  onPress,
}: DropdownWithCheckProps) {
  const [filters, setFilters] = useState<FilterOption[]>(filterOptions);
  const [allOption, setAllOption] = useState(true);

  const filterButtons = (option: DropdownReturnedType) => {
    // if (option.value === "all" && !option.checked) {
    //   setAllOption(true);
    //   setFilters((prev) => {
    //     const newData = prev.map((item) => ({ ...item, checked: true }));
    //     onPress(newData);
    //     return newData;
    //   });
    // } else {
    // console.log(filters);
    // if (option.value === "all") {
    console.log(option);
    //   if (option.checked) {
    //     console.log(option.checked);
    //     // console.log(filters.map((item) => ({ ...item, checked: false })));
    //     setFilters(filters.map((item) => ({ ...item, checked: false })));
    //   }

    //   if (!option.checked) {
    //     console.log("hie");
    //     setFilters((prev) => prev.map((item) => ({ ...item, checked: true })));
    //     // return;
    //   }
    // }

    // setFilters((prev) => {
    //   const newData = prev.map((item) => {
    //     if (item.value === option.value) {
    //       if (item.checked) {
    //         return { ...item, checked: false };
    //       }
    //       return { ...item, checked: true };
    //     }
    //     return item;
    //   });

    //   onPress(newData);
    //   return newData;
    // });
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

type DropdownOptionType = {
  value: string;
  name: string;
  checked: boolean;
};

export type DropdownReturnedType = { value: string; checked: boolean };

type DropdownItemProps = {
  dropdownOption: DropdownOptionType;
  lastItem?: boolean;
  onPress: (option: DropdownReturnedType) => void;
};

function DropdownItem({
  dropdownOption,
  lastItem,
  onPress,
}: DropdownItemProps) {
  // const [checkedItem, setCheckedItem] = useState({
  //   value: dropdownOption.value,
  //   checked: dropdownOption.checked,
  // });
  const [checked, setChecked] = useState(dropdownOption.checked ?? false);

  function checkHandler(isChecked: boolean, value: string) {
    setChecked(isChecked);
  }
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
        value={dropdownOption.value}
        isChecked={checked}
        onPress={checkHandler}
      />
    </View>
  );
}
