import React from "react";
import { TouchableOpacity, View } from "react-native";

import chevronDownSVG from "./../../../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "./../../../../../assets/icons/chevron-up.svg";
import { SelectionDropdownProps } from "./DropdownProps.type";
import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { PrimaryBox } from "../../../../components/boxes/PrimaryBox";
import { TertiaryBox } from "../../../../components/boxes/TertiaryBox";
import { Label } from "../../../../components/inputs/TextInputCustom";
import { Separator } from "../../../../components/separators/Separator";
import { SpacerColumn } from "../../../../components/spacer";
import { useDropdowns } from "../../../../hooks/useDropdowns";
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
  const [isDropdownOpen, setDropdownState, ref] = useDropdowns();

  return (
    <View
      style={[
        {
          zIndex: 1,
          width: "100%",
          marginBottom: layout.spacing_x3,
        },
        style,
      ]}
      ref={ref}
    >
      <Label style={{ marginBottom: layout.spacing_x1 }} isRequired>
        {label}
      </Label>

      <View>
        <TertiaryBox
          style={{
            width: "100%",
            height: 40,
            flexDirection: "row",
            paddingHorizontal: layout.spacing_x1_5,
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
                fontMedium14,
                { marginRight: layout.spacing_x1, color: neutral77 },
              ]}
            >
              {item ? item : placeHolder}
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
                  setDropdownState(false);
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
