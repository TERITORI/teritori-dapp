import React, { useRef, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useSelector } from "react-redux";

import chevronDownSVG from "../../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../../assets/icons/chevron-up.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { useDropdowns } from "../../../context/DropdownsProvider";
import { selectAvailableApps } from "../../../store/slices/dapps-store";
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

export const DropdownDappsStoreFilter: React.FC<{
  style?: StyleProp<ViewStyle>;
}> = ({ style }) => {
  const { onPressDropdownButton, isDropdownOpen } = useDropdowns();
  const dropdownRef = useRef<View>(null);
  const [isChecked] = useState(true);
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
          style={{ position: "absolute", top: 29, right: 0 }}
          mainContainerStyle={{
            paddingHorizontal: layout.padding_x3,
            paddingTop: layout.padding_x1,
            paddingBottom: layout.padding_x1,
            backgroundColor: neutral17,
            alignItems: "flex-start",
          }}
        >
          {options.map((option, index) => {
            return (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <CheckboxDappStore
                  isChecked={isChecked}
                  styles={checkBoxStyles}
                />
                <BrandText style={[fontSemibold12, { marginLeft: 12 }]}>
                  {option.name}
                </BrandText>
              </View>
            );
          })}
        </TertiaryBox>
      )}
    </View>
  );
};
