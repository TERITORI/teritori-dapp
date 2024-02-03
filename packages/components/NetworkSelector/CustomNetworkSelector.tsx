import React from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

import { NetworkSelectorMenu } from "./NetworkSelectorMenu";
import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../assets/icons/chevron-up.svg";
import { useDropdowns } from "../../hooks/useDropdowns";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import { NetworkFeature, NetworkKind } from "../../networks";
import { neutral17, neutral77, secondaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { Label } from "../inputs/TextInputCustom";

export const CustomNetworkSelector: React.FC<{
  label: string;
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
  const [isDropdownOpen, setDropdownState, ref] = useDropdowns();
  const selectedNetworkInfo = useSelectedNetworkInfo();

  return (
    <View
      style={[
        style,
        {
          width: "100%",
          zIndex: 100,
        },
      ]}
      ref={ref}
    >
      <Label style={{ marginBottom: layout.spacing_x1 }} isRequired>
        {label}
      </Label>

      <TertiaryBox
        style={{
          width: "100%",
          height: 40,
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
          onPress={() => setDropdownState()}
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
            source={isDropdownOpen ? chevronUpSVG : chevronDownSVG}
            width={16}
            height={16}
            color={secondaryColor}
          />
        </TouchableOpacity>
      </TertiaryBox>

      {isDropdownOpen && (
        <NetworkSelectorMenu
          onSelect={() => {}}
          optionsMenuwidth={416}
          style={{ width: "100%", marginTop: layout.spacing_x0_75 }}
          forceNetworkId={forceNetworkId}
          forceNetworkKind={forceNetworkKind}
          forceNetworkFeatures={forceNetworkFeatures}
        />
      )}
    </View>
  );
};
