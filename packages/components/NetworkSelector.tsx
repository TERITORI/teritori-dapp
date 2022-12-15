import React, { useRef } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

import chevronDownSVG from "../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../assets/icons/chevron-up.svg";
import teritoriSVG from "../../assets/icons/networks/teritori.svg";
import { useDropdowns } from "../context/DropdownsProvider";
import { Network } from "../utils/network";
import { neutral17, secondaryColor } from "../utils/style/colors";
import { fontSemibold12 } from "../utils/style/fonts";
import { BrandText } from "./BrandText";
import { SVG } from "./SVG";
import { TertiaryBox } from "./boxes/TertiaryBox";
import { NetworkIcon } from "./images/NetworkIcon";

export const NetworkSelector: React.FC<{
  style?: StyleProp<ViewStyle>;
}> = ({ style }) => {
  const { onPressDropdownButton, isDropdownOpen, closeOpenedDropdown } =
    useDropdowns();
  const dropdownRef = useRef<View>(null);

  const onPressNetwork = () => {
    //TODO:
    closeOpenedDropdown();
  };

  return (
    <View style={style} ref={dropdownRef}>
      <TouchableOpacity onPress={() => onPressDropdownButton(dropdownRef)}>
        <TertiaryBox
          width={60}
          mainContainerStyle={{
            flexDirection: "row",
            paddingHorizontal: 12,
            backgroundColor: neutral17,
          }}
          height={40}
        >
          <SVG
            style={{ marginRight: 4 }}
            source={teritoriSVG}
            width={16}
            height={16}
          />
          <SVG
            source={isDropdownOpen(dropdownRef) ? chevronUpSVG : chevronDownSVG}
            width={16}
            height={16}
            color={secondaryColor}
          />
        </TertiaryBox>
      </TouchableOpacity>

      {isDropdownOpen(dropdownRef) && (
        <TertiaryBox
          width={172}
          style={{ position: "absolute", top: 44 }}
          mainContainerStyle={{
            paddingHorizontal: 16,
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
                    <NetworkIcon network={network} size={16} />
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
