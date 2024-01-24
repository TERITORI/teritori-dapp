import React, { useRef } from "react";
import { TouchableOpacity, View } from "react-native";

import chevronDownSVG from "./../../../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "./../../../../../assets/icons/chevron-up.svg";
import { SelectionDropdownProps } from "./DropdownProps.type";
import { LabelText } from "./LabelText";
import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { PrimaryBox } from "../../../../components/boxes/PrimaryBox";
import { TertiaryBox } from "../../../../components/boxes/TertiaryBox";
import { Separator } from "../../../../components/separators/Separator";
import { SpacerColumn } from "../../../../components/spacer";
import { useDropdowns } from "../../../../context/DropdownsProvider";
import {
  neutral17,
  neutral44,
  neutral55,
  neutral77,
  secondaryColor,
} from "../../../../utils/style/colors";
import { fontMedium14, fontSemibold14 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";

export const SelectionDropdown = ({
  style,
  dropdownOptions,
  placeHolder,
  item,
  label,
  setItem,
}: SelectionDropdownProps) => {
  const { onPressDropdownButton, isDropdownOpen, closeOpenedDropdown } =
    useDropdowns();
  const dropdownRef = useRef<View>(null);

  return (
    <View
      style={[
        {
          zIndex: 1,
          width: "100%",
          minHeight: 40,
          marginBottom: layout.spacing_x3,
        },
        style,
      ]}
      ref={dropdownRef}
    >
      <LabelText label={label} />

      <View>
        <TertiaryBox
          style={{
            width: "100%",
            minHeight: 40,
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
                fontMedium14,
                { marginRight: layout.spacing_x1, color: neutral77 },
              ]}
            >
              {item ? item : placeHolder}
            </BrandText>
            <SVG
              source={
                isDropdownOpen(dropdownRef) ? chevronUpSVG : chevronDownSVG
              }
              width={16}
              height={16}
              color={secondaryColor}
            />
          </TouchableOpacity>
        </TertiaryBox>

        {isDropdownOpen(dropdownRef) && (
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
                  closeOpenedDropdown();
                  setItem(item);
                }}
                key={index}
                style={{
                  paddingTop: layout.spacing_x1_5,
                  width: "100%",
                }}
              >
                <BrandText style={[fontSemibold14, { color: secondaryColor }]}>
                  {item}
                </BrandText>

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
    </View>
  );
};
