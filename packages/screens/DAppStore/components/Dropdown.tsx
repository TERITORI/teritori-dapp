import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

import chevronDownSVG from "../../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../../assets/icons/chevron-up.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { useDropdowns } from "../../../context/DropdownsProvider";
import {
  selectAvailableApps,
  setAvailableApps,
} from "../../../store/slices/dapps-store";
import { useAppDispatch } from "../../../store/store";
import { neutral17, secondaryColor } from "../../../utils/style/colors";
import { fontSemibold12 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { CheckboxDappStore } from "./CheckboxDappStore";

const checkBoxStyles = StyleSheet.create({
  container: {},
  checkbox: {
    margin: layout.padding_x1,
    width: layout.padding_x2_5,
    height: layout.padding_x2_5,
    borderRadius: 4,
    borderWidth: 1,
  },
});

function SelectableOption({ id, name }: { name: string; id: string }) {
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
  }, [availableApps]);

  return (
    <Pressable onPress={handleClick}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <CheckboxDappStore isChecked={isChecked} styles={checkBoxStyles} />
        <BrandText style={[fontSemibold12, { marginLeft: 12 }]}>
          {name}
        </BrandText>
      </View>
    </Pressable>
  );
}

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
        marginRight: layout.padding_x2_5,
        marginBottom: layout.padding_x1_5,
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
        <BrandText style={{ fontSize: layout.padding_x1_5 }}>
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
        <TertiaryBox
          width={210}
          style={{ position: "absolute", top: 29, right: -14 }}
          mainContainerStyle={{
            paddingHorizontal: layout.padding_x3,
            paddingTop: layout.padding_x1,
            paddingBottom: layout.padding_x1,
            backgroundColor: neutral17,
            alignItems: "flex-start",
          }}
        >
          {options.map((option) => {
            return (
              <SelectableOption
                key={option.id}
                name={option.name}
                id={option.id}
              />
            );
          })}
        </TertiaryBox>
      )}
    </View>
  );
};
