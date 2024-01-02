import React from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

import { NetworkSelectorMenu } from "./NetworkSelectorMenu";
import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../assets/icons/chevron-up.svg";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import { NetworkFeature, NetworkKind } from "../../networks";
import { secondaryColor } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { NetworkIcon } from "../NetworkIcon";
import { SVG } from "../SVG";
import { LegacyTertiaryBox } from "../boxes/LegacyTertiaryBox";
import { SpacerRow } from "../spacer";

export const NetworkSelectorMobile: React.FC<{
  style?: StyleProp<ViewStyle>;
  forceNetworkId?: string;
  forceNetworkKind?: NetworkKind;
  forceNetworkFeatures?: NetworkFeature[];
}> = ({ style, forceNetworkId, forceNetworkKind, forceNetworkFeatures }) => {
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const [isDropdownOpen, setDropdownState, dropdownRef] = useClickOutside();

  return (
    <View style={style} ref={dropdownRef} collapsable={false}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setDropdownState(!isDropdownOpen)}
      >
        <LegacyTertiaryBox
          noBrokenCorners
          mainContainerStyle={{
            flexDirection: "row",
            paddingHorizontal: layout.spacing_x1,
          }}
          height={32}
        >
          <NetworkIcon networkId={selectedNetworkInfo?.id || ""} size={16} />
          <SpacerRow size={0.5} />
          <SVG
            source={isDropdownOpen ? chevronUpSVG : chevronDownSVG}
            width={16}
            height={16}
            color={secondaryColor}
          />
        </LegacyTertiaryBox>
      </TouchableOpacity>

      {isDropdownOpen && (
        <NetworkSelectorMenu
          style={{ position: "absolute", top: 48, right: -93 }}
          forceNetworkId={forceNetworkId}
          forceNetworkKind={forceNetworkKind}
          forceNetworkFeatures={forceNetworkFeatures}
          onSelect={() => setDropdownState(false)}
        />
      )}
    </View>
  );
};
