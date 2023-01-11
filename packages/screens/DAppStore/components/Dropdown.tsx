import React, { useRef, useState } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

import chevronDownSVG from "../../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../../assets/icons/chevron-up.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { useDropdowns } from "../../../context/DropdownsProvider";
import { Network } from "../../../utils/network";
import { neutral17, secondaryColor } from "../../../utils/style/colors";
import { fontSemibold12, fontSemibold28 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { MyCheckbox } from "./MyCheckbox";

export const DropdownDappsStoreFilter: React.FC<{
  style?: StyleProp<ViewStyle>;
}> = ({ style }) => {
  const { onPressDropdownButton, isDropdownOpen, closeOpenedDropdown } =
    useDropdowns();
  const dropdownRef = useRef<View>(null);
  const [isChecked, setChecked] = useState(true);

  const onPressNetwork = () => {
    //TODO:
    closeOpenedDropdown();
  };

  return (
    <View ref={dropdownRef}>
      <TouchableOpacity
        style={{
          width: 420,
          flexDirection: "row",
          alignItems: "center",
        }}
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
          width={172}
          style={{ position: "absolute", top: 44 }}
          mainContainerStyle={{
            paddingHorizontal: 16,
            zIndex: 9999,
            paddingTop: 16,
            backgroundColor: neutral17,
            alignItems: "flex-start",
          }}
        >
          {Object.values(Network)
            .filter((n) => n !== Network.Unknown)
            .map((network, index) => {
              return (
                <TouchableOpacity
                  disabled={network !== Network.Teritori}
                  style={{
                    marginBottom: 16,
                    opacity: network !== Network.Teritori ? 0.5 : 1,
                  }}
                  key={index}
                  onPress={
                    network === Network.Teritori ? onPressNetwork : undefined
                  }
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MyCheckbox isChecked={isChecked} />
                    <BrandText style={[fontSemibold12, { marginLeft: 12 }]}>
                      {network}
                    </BrandText>
                  </View>
                </TouchableOpacity>
              );
            })}
        </TertiaryBox>
      )}
    </View>
  );
};
