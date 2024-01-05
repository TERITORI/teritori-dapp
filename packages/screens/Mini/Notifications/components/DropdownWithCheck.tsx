import React, { Dispatch, SetStateAction, useState } from "react";
import { View } from "react-native";
import { ChevronDownIcon } from "react-native-heroicons/outline";
import { SvgProps } from "react-native-svg";

import Checkbox from "./Checkbox";
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
};

type DropdownWithCheckProps = {
  filterOptions: FilterOption[];
  headerOptions: { name: string; icon?: React.FC<SvgProps> | string };
};

export default function DropdownWithCheck({
  filterOptions,
  headerOptions,
}: DropdownWithCheckProps) {
  const [filters, setFilters] = useState<string[]>([]);

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
        {filterOptions.map((filterOptionItem, index) => {
          const lastItem = index === filterOptions.length - 1;

          return (
            <DropdownItem
              lastItem={lastItem}
              dropdownOption={filterOptionItem}
              filters={filters}
              setFilters={setFilters}
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
        source={options.icon ?? ChevronDownIcon}
        color={blueDefault}
        height={16}
        width={16}
      />
    </View>
  );
}

type DropdownItemProps = {
  dropdownOption: { value: string; name: string };
  lastItem?: boolean;
  filters?: string[];
  setFilters?: Dispatch<SetStateAction<string[]>>;
};

function DropdownItem({ dropdownOption, lastItem }: DropdownItemProps) {
  const [checkedItem, setCheckedItem] = useState(dropdownOption.value);

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
        isChecked={checkedItem === dropdownOption.value}
        onPress={(isChecked, value) => {
          if (!isChecked) {
            setCheckedItem(value);
            return;
          }

          setCheckedItem("");
        }}
      />
    </View>
  );
}
