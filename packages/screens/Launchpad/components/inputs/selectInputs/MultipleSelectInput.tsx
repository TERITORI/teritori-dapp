import React, { FC, useState } from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";

import { CheckboxDappStore } from "../../../../DAppStore/components/CheckboxDappStore";

import chevronDownSVG from "@/assets/icons/chevron-down.svg";
import chevronUpSVG from "@/assets/icons/chevron-up.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { Label } from "@/components/inputs/TextInputCustom";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn } from "@/components/spacer";
import { useDropdowns } from "@/hooks/useDropdowns";
import {
  neutral22,
  neutral44,
  neutral55,
  neutral77,
  secondaryColor,
} from "@/utils/style/colors";
import { fontMedium14, fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

interface Props {
  style?: ViewStyle;
  onDropdownClosed?: () => void;
  dropdownOptions: string[];
  placeHolder?: string;
  onPressItem: (item: string) => void;
  items: string[];
  label: string;
  sublabel?: React.ReactElement;
  required?: boolean;
}

export const MultipleSelectInput: FC<Props> = ({
  style,
  dropdownOptions,
  placeHolder,
  items,
  label,
  onPressItem,
  sublabel,
  required = true,
}) => {
  const [isDropdownOpen, setDropdownState, ref] = useDropdowns();
  const [hovered, setHovered] = useState(false);

  return (
    <View
      style={[
        {
          zIndex: 1,
          width: "100%",
          minHeight: 40,
        },
        style,
      ]}
      ref={ref}
    >
      <CustomPressable
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        onPress={() => setDropdownState(!isDropdownOpen)}
      >
        <Label isRequired={required} hovered={hovered}>
          {label}
        </Label>
        {sublabel && sublabel}

        <SpacerColumn size={1.5} />
        <View>
          <TertiaryBox
            style={[
              {
                width: "100%",
                height: 40,
                flexDirection: "row",
                paddingHorizontal: layout.spacing_x1_5,
                backgroundColor: neutral22,
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
              <BrandText
                style={[
                  fontMedium14,
                  {
                    marginRight: layout.spacing_x1,
                    color: items?.length > 0 ? secondaryColor : neutral77,
                  },
                ]}
              >
                {items?.length > 0 ? items.join(", ") : placeHolder}
              </BrandText>
              <SVG
                source={isDropdownOpen ? chevronUpSVG : chevronDownSVG}
                width={16}
                height={16}
                color={secondaryColor}
              />
            </View>
          </TertiaryBox>

          {isDropdownOpen && (
            <PrimaryBox
              style={{
                position: "absolute",
                top: 44,
                right: 0,
                width: "100%",
                paddingHorizontal: layout.spacing_x1_5,
                paddingBottom: layout.spacing_x1,
                backgroundColor: neutral44,
                borderColor: neutral55,
                alignItems: "flex-start",
              }}
            >
              {dropdownOptions.map((item, index) => (
                <TouchableOpacity
                  onPress={() => {
                    onPressItem(item);
                  }}
                  key={index}
                  style={{
                    paddingTop: layout.spacing_x1_5,
                    width: "100%",
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <CheckboxDappStore
                      isChecked={items.includes(item)}
                      style={{ marginRight: layout.spacing_x1 }}
                    />

                    <BrandText
                      style={[fontSemibold14, { color: secondaryColor }]}
                    >
                      {item}
                    </BrandText>
                  </View>
                  {dropdownOptions.length - 1 !== index && (
                    <>
                      <SpacerColumn size={1} />
                      <Separator color={neutral55} />
                    </>
                  )}
                </TouchableOpacity>
              ))}
            </PrimaryBox>
          )}
        </View>
      </CustomPressable>
    </View>
  );
};
