import React from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

import { NetworkSelectorMenu } from "./NetworkSelectorMenu";
import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../assets/icons/chevron-up.svg";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import { NetworkFeature, NetworkKind } from "../../networks";
import { neutral17, secondaryColor } from "../../utils/style/colors";
import { fontMedium14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { NetworkIcon } from "../NetworkIcon";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { SpacerRow } from "../spacer";

export const NetworkSelector: React.FC<{
  style?: StyleProp<ViewStyle>;
  forceNetworkId?: string;
  forceNetworkKind?: NetworkKind;
  forceNetworkFeatures?: NetworkFeature[];
}> = ({ style, forceNetworkId, forceNetworkKind, forceNetworkFeatures }) => {
  const [isDropdownOpen, setDropdownState, dropdownRef] = useClickOutside();
  const selectedNetworkInfo = useSelectedNetworkInfo();

  return (
    <View style={style} ref={dropdownRef} collapsable={false}>
      <TouchableOpacity onPress={() => setDropdownState(true)}>
        <TertiaryBox
          style={{
            flexDirection: "row",
            paddingHorizontal: 12,
            backgroundColor: neutral17,
            alignItems: "center",
            height: 40,
          }}
        >
          <NetworkIcon networkId={selectedNetworkInfo?.id || ""} size={16} />
          <SpacerRow size={1} />
          <BrandText
            style={[
              fontMedium14,
              {
                color: "white",
              },
            ]}
          >
            {selectedNetworkInfo?.displayName}
          </BrandText>
          <SpacerRow size={1} />
          <SVG
            source={isDropdownOpen ? chevronUpSVG : chevronDownSVG}
            width={16}
            height={16}
            color={secondaryColor}
          />
        </TertiaryBox>
      </TouchableOpacity>

      {isDropdownOpen && (
        <NetworkSelectorMenu
          style={{ position: "absolute", top: 44 }}
          forceNetworkId={forceNetworkId}
          forceNetworkKind={forceNetworkKind}
          forceNetworkFeatures={forceNetworkFeatures}
          onSelect={() => setDropdownState(false)}
        />
      )}
    </View>
  );
};
