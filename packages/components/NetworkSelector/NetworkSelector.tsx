import React, { useRef } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

import { NetworkSelectorMenu } from "./NetworkSelectorMenu";
import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../assets/icons/chevron-up.svg";
import { useDropdowns } from "../../context/DropdownsProvider";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import { NetworkKind } from "../../networks";
import { neutral17, secondaryColor } from "../../utils/style/colors";
import { fontMedium14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { NetworkIcon } from "../NetworkIcon";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { SpacerRow } from "../spacer";

export const NetworkSelector: React.FC<{
  style?: StyleProp<ViewStyle>;
  forceNetworkIds?: string[];
  forceNetworkKind?: NetworkKind;
}> = ({ style, forceNetworkIds, forceNetworkKind }) => {
  const { onPressDropdownButton, isDropdownOpen } = useDropdowns();
  const dropdownRef = useRef<View>(null);
  const selectedNetworkInfo = useSelectedNetworkInfo();

  return (
    <View style={style} ref={dropdownRef}>
      <TouchableOpacity onPress={() => onPressDropdownButton(dropdownRef)}>
        <TertiaryBox
          mainContainerStyle={{
            flexDirection: "row",
            paddingHorizontal: 12,
            backgroundColor: neutral17,
          }}
          height={40}
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
            source={isDropdownOpen(dropdownRef) ? chevronUpSVG : chevronDownSVG}
            width={16}
            height={16}
            color={secondaryColor}
          />
        </TertiaryBox>
      </TouchableOpacity>

      {isDropdownOpen(dropdownRef) && (
        <NetworkSelectorMenu
          style={{ position: "absolute", top: 44 }}
          forceNetworkIds={forceNetworkIds}
          forceNetworkKind={forceNetworkKind}
        />
      )}
    </View>
  );
};
