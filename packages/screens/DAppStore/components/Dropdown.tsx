import React, { useEffect, useRef, useState } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import { useSelector } from "react-redux";

import { CheckboxDappStore } from "./CheckboxDappStore";
import chevronDownSVG from "../../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../../assets/icons/chevron-up.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { Box } from "../../../components/boxes/Box";
import { useDropdowns } from "../../../context/DropdownsProvider";
import {
  selectAvailableApps,
  setAvailableApps,
} from "../../../store/slices/dapps-store";
import { useAppDispatch } from "../../../store/store";
import {
  neutral33,
  neutralA3,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

const SelectableOption: React.FC<{
  name: string;
  id: string;
  style?: StyleProp<ViewStyle>;
}> = ({ id, name, style }) => {
  const availableApps = useSelector(selectAvailableApps);
  const dispatch = useAppDispatch();
  const group = { ...availableApps[id] };
  const [isChecked, setChecked] = useState(group.active);

  const handleClick = () => {
    group.active = !isChecked;
    const newState = {
      ...availableApps,
    };
    newState[id] = group;
    dispatch(setAvailableApps(newState));
  };

  useEffect(() => {
    setChecked(group.active);
  }, [group.active]);

  return (
    <TouchableOpacity
      onPress={handleClick}
      style={[{ flexDirection: "row", alignItems: "center" }, style]}
    >
      <CheckboxDappStore isChecked={isChecked} />
      <BrandText style={[fontSemibold13, { marginLeft: 12, color: neutralA3 }]}>
        {name}
      </BrandText>
    </TouchableOpacity>
  );
};

export const DropdownDappsStoreFilter: React.FC = () => {
  const { onPressDropdownButton, isDropdownOpen } = useDropdowns();
  const dropdownRef = useRef<View>(null);
  const availableApps = useSelector(selectAvailableApps);
  const options = Object.values(availableApps).map((option) => {
    return {
      id: option.id,
      name: option.groupName,
    };
  });

  return (
    <View
      ref={dropdownRef}
      style={{
        alignSelf: "flex-end",
        marginRight: layout.spacing_x3,
        marginBottom: layout.spacing_x2,
      }}
    >
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
        activeOpacity={1}
        onPress={() => onPressDropdownButton(dropdownRef)}
      >
        <BrandText style={[fontSemibold14, { marginRight: layout.spacing_x1 }]}>
          All dApps
        </BrandText>
        <SVG
          source={isDropdownOpen(dropdownRef) ? chevronUpSVG : chevronDownSVG}
          width={16}
          height={16}
          color={secondaryColor}
        />
      </TouchableOpacity>

      {isDropdownOpen(dropdownRef) && (
        <Box
          style={{
            width: 248,
            position: "absolute",
            top: 29,
            right: -14,
            paddingHorizontal: layout.spacing_x1_5,
            paddingTop: layout.spacing_x1_5,
            backgroundColor: neutral33,
            alignItems: "flex-start",
          }}
        >
          {options.map((option) => (
            <SelectableOption
              style={{ marginBottom: layout.spacing_x1_5 }}
              key={option.id}
              name={option.name}
              id={option.id}
            />
          ))}
        </Box>
      )}
    </View>
  );
};
