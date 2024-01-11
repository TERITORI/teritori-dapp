import React, { useRef } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

import { NetworkSelectorMenu } from "./NetworkSelectorMenu";
import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../assets/icons/chevron-up.svg";
import { useDropdowns } from "../../context/DropdownsProvider";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import { NetworkFeature, NetworkKind } from "../../networks";
import { neutral17, neutral77, secondaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const CustomNetworkSelector: React.FC<{
  label?: string;
  style?: StyleProp<ViewStyle>;
  forceNetworkId?: string;
  forceNetworkKind?: NetworkKind;
  forceNetworkFeatures?: NetworkFeature[];
}> = ({
  style,
  forceNetworkId,
  forceNetworkKind,
  forceNetworkFeatures,
  label,
}) => {
  const { onPressDropdownButton, isDropdownOpen } = useDropdowns();
  const dropdownRef = useRef<View>(null);
  const selectedNetworkInfo = useSelectedNetworkInfo();

  return (
    <View
      style={[
        style,
        {
          width: "100%",
          zIndex: 100,
          minHeight: 50,
        },
      ]}
    >
      <BrandText
        style={[
          fontSemibold14,
          {
            marginRight: layout.spacing_x1,
            color: neutral77,
            marginBottom: layout.spacing_x1,
          },
        ]}
      >
        {label}
      </BrandText>

      <TertiaryBox
        style={{
          width: "100%",
          minHeight: 50,
          flexDirection: "row",
          paddingHorizontal: 12,
          backgroundColor: neutral17,
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            flex: 1,
          }}
          activeOpacity={1}
          onPress={() => onPressDropdownButton(dropdownRef)}
        >
          <BrandText
            style={[
              fontSemibold14,
              { marginRight: layout.spacing_x1, color: neutral77 },
            ]}
          >
            {selectedNetworkInfo?.displayName}
          </BrandText>
          <SVG
            source={isDropdownOpen(dropdownRef) ? chevronUpSVG : chevronDownSVG}
            width={16}
            height={16}
            color={secondaryColor}
          />
        </TouchableOpacity>
      </TertiaryBox>

      {isDropdownOpen(dropdownRef) && (
        <NetworkSelectorMenu
          style={{ minWidth: 50, width: "100%" }}
          forceNetworkId={forceNetworkId}
          forceNetworkKind={forceNetworkKind}
          forceNetworkFeatures={forceNetworkFeatures}
        />
      )}
    </View>
  );
};
