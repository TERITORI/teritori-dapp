import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import chevronDownSVG from "../../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../../assets/icons/chevron-up.svg";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { Label } from "@/components/inputs/TextInputCustom";
import { neutral17, neutralFF, secondaryColor } from "@/utils/style/colors";
import { fontSemibold16 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { Token } from "@/utils/types/types";

interface LaunchpadERC20TokensDropdownProps {
  items: Token[];
  setSelectedItem: (token: Token) => void;
  selectedItem?: Token | null;
  placeholder?: string;
}

export const LaunchpadERC20TokensDropdown: React.FC<
  LaunchpadERC20TokensDropdownProps
> = ({
  items,
  setSelectedItem,
  selectedItem,
  placeholder = "Select an item",
}) => {
  const [isDropdownOpen, setDropdownState] = useState<boolean>(false);

  const selectItem = (item: Token) => {
    setSelectedItem(item);
    setDropdownState(false);
  };

  return (
    <View>
      <Label style={{ marginBottom: layout.spacing_x1 }} isRequired>
        Token
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
          onPress={() => setDropdownState(!isDropdownOpen)}
        >
          <BrandText
            style={[
              fontSemibold16,
              {
                color: neutralFF,
              },
            ]}
          >
            {selectedItem?.name || placeholder}
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
        <View
          style={{
            padding: 10,
            width: "100%",
          }}
        >
          <TertiaryBox
            style={{
              paddingTop: layout.spacing_x2,
              backgroundColor: neutral17,
              alignItems: "flex-start",
              borderRadius: 8,
            }}
          >
            {items &&
              items.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    marginBottom: layout.spacing_x2,
                    opacity: 1,
                  }}
                  onPress={() => selectItem(item)}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <BrandText
                      style={[
                        fontSemibold16,
                        { marginLeft: layout.spacing_x1_5 },
                      ]}
                    >
                      {item.name}
                    </BrandText>
                  </View>
                </TouchableOpacity>
              ))}
          </TertiaryBox>
        </View>
      )}
    </View>
  );
};
