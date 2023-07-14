import React, { useRef } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

import { NetworkSelectorMenu } from "./NetworkSelectorMenu";
import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../assets/icons/chevron-up.svg";
import { useDropdowns } from "../../context/DropdownsProvider";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import { NetworkFeature, NetworkKind } from "../../networks";
import { secondaryColor } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { NetworkIcon } from "../NetworkIcon";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { SpacerRow } from "../spacer";

export const NetworkSelectorMobile: React.FC<{
  style?: StyleProp<ViewStyle>;
  forceNetworkId?: string;
  forceNetworkKind?: NetworkKind;
  forceNetworkFeatures?: NetworkFeature[];
}> = ({ style, forceNetworkId, forceNetworkKind, forceNetworkFeatures }) => {
  const { onPressDropdownButton, isDropdownOpen } = useDropdowns();
  const dropdownRef = useRef<View>(null);
  const selectedNetworkInfo = useSelectedNetworkInfo();

  return (
    <View style={style} ref={dropdownRef}>
      <TouchableOpacity onPress={() => onPressDropdownButton(dropdownRef)}>
        <TertiaryBox
          noBrokenCorners
          mainContainerStyle={{
            flexDirection: "row",
            paddingHorizontal: layout.padding_x1,
          }}
          height={32}
        >
          <NetworkIcon networkId={selectedNetworkInfo?.id || ""} size={16} />
          <SpacerRow size={0.5} />
          <SVG
            source={isDropdownOpen(dropdownRef) ? chevronUpSVG : chevronDownSVG}
            width={16}
            height={16}
            color={secondaryColor}
          />
        </TertiaryBox>
      </TouchableOpacity>

      {isDropdownOpen(dropdownRef) && (
        <NetworkSelectorMenu
          style={{ position: "absolute", top: 48, right: -108 }}
          forceNetworkId={forceNetworkId}
          forceNetworkKind={forceNetworkKind}
          forceNetworkFeatures={forceNetworkFeatures}
        />
      )}
    </View>
  );
};
