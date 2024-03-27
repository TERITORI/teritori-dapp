import React, { FC } from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";

import { CheckboxDappStore } from "../../../../DAppStore/components/CheckboxDappStore";

import chevronDownSVG from "@/assets/icons/chevron-down.svg";
import chevronUpSVG from "@/assets/icons/chevron-up.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { Label } from "@/components/inputs/TextInputCustom";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn } from "@/components/spacer";
import { useDropdowns } from "@/hooks/useDropdowns";
import {
  neutral17,
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
  setItems: (item: string) => void;
  items: string[];
  label: string;
  sublabel?: React.ReactElement;
}

export const MultipleSelectInput: FC<Props> = ({
  style,
  dropdownOptions,
  placeHolder,
  items,
  label,
  setItems,
  sublabel,
}) => {
  const [isDropdownOpen, setDropdownState, ref] = useDropdowns();

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
      ref={ref}
    >
      <Label style={{ marginBottom: layout.spacing_x1 }} isRequired>
        {label}
      </Label>

      {sublabel && sublabel}

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
              {items?.length > 0 ? items.join(", ") : placeHolder}
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
                  setItems(item);
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
    </View>
  );
};
