import React, { useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

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

import { NetworkIcon } from "@/components/NetworkIcon";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { SpacerRow } from "@/components/spacer";

export const NetworkSelectorWithLabel: React.FC<{
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
  const [hovered, setHovered] = useState(false);
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
      <CustomPressable
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        onPress={() => setDropdownState(!isDropdownOpen)}
      >
        <Label style={{ marginBottom: layout.spacing_x1_5 }} hovered={hovered}>
          {label}
        </Label>

        <TertiaryBox
          style={[
            {
              width: "100%",
              height: 40,
              flexDirection: "row",
              paddingHorizontal: 12,
              backgroundColor: neutral17,
              alignItems: "center",
            },
            hovered && { borderColor: secondaryColor },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              flex: 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <NetworkIcon
                networkId={selectedNetworkInfo?.id || ""}
                size={16}
              />
              <SpacerRow size={1} />

              <BrandText
                style={[
                  fontSemibold14,
                  {
                    marginRight: layout.spacing_x1,
                    color: selectedNetworkInfo ? secondaryColor : neutral77,
                  },
                ]}
              >
                {selectedNetworkInfo?.displayName}
              </BrandText>
            </View>

            <SVG
              source={isDropdownOpen ? chevronUpSVG : chevronDownSVG}
              width={16}
              height={16}
              color={secondaryColor}
            />
          </View>
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
      </CustomPressable>
    </View>
  );
};
