import React, { useRef } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import { useSelector } from "react-redux";

import chevronDownSVG from "../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../assets/icons/chevron-up.svg";
import { useDropdowns } from "../context/DropdownsProvider";
import { NetworkInfo, displayedNetworks } from "../networks";
import {
  selectSelectedNetworkId,
  setSelectedNetworkId,
} from "../store/slices/settings";
import { useAppDispatch } from "../store/store";
import { neutral17, secondaryColor } from "../utils/style/colors";
import { fontSemibold12 } from "../utils/style/fonts";
import { BrandText } from "./BrandText";
import { NetworkIcon } from "./NetworkIcon";
import { SVG } from "./SVG";
import { TertiaryBox } from "./boxes/TertiaryBox";

export const NetworkSelector: React.FC<{
  style?: StyleProp<ViewStyle>;
}> = ({ style }) => {
  const dispatch = useAppDispatch();
  const { onPressDropdownButton, isDropdownOpen, closeOpenedDropdown } =
    useDropdowns();
  const dropdownRef = useRef<View>(null);
  const selectedNetworkId = useSelector(selectSelectedNetworkId);

  const onPressNetwork = (networkInfo: NetworkInfo) => {
    dispatch(setSelectedNetworkId(networkInfo.id));
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
          <NetworkIcon networkId={selectedNetworkId} size={16} />
          <SVG
            source={isDropdownOpen(dropdownRef) ? chevronUpSVG : chevronDownSVG}
            width={16}
            height={16}
            color={secondaryColor}
            style={{ marginLeft: 4 }}
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
          {displayedNetworks().map((networkInfo, index) => {
            return (
              <TouchableOpacity
                style={{
                  marginBottom: 16,
                  opacity: networkInfo.disabled ? 0.5 : 1,
                }}
                key={index}
                onPress={() => onPressNetwork(networkInfo)}
                disabled={networkInfo.disabled}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <NetworkIcon networkId={networkInfo.id} size={16} />
                  <BrandText style={[fontSemibold12, { marginLeft: 12 }]}>
                    {networkInfo.displayName}
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
