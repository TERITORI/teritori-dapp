import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import chevronDownSVG from "../../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../../assets/icons/chevron-up.svg";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { Label } from "@/components/inputs/TextInputCustom";
import { neutral17, secondaryColor } from "@/utils/style/colors";
import { fontSemibold16 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

interface LaunchpadERC20TokensDropdownProps {
  items: string[];
  setSelectedItem: (item: string) => void;
  selectedItem?: string | null;
  placeholder?: string;
}

export const LaunchpadERC20TokensDropdown: React.FC<
  LaunchpadERC20TokensDropdownProps
> = ({ items, setSelectedItem, selectedItem, placeholder = "Select an item" }) => {
  const [isDropdownOpen, setDropdownState] = useState<boolean>(false);

  const selectItem = (item: string) => {
    setSelectedItem(item);
    setDropdownState(false);
  };

  return (
    <View>
      <Label style={styles.label} isRequired>
        Token
      </Label>

      <TertiaryBox style={styles.dropdownBox}>
        <TouchableOpacity
          style={styles.dropdownButton}
          activeOpacity={1}
          onPress={() => setDropdownState(!isDropdownOpen)}
        >
          <BrandText
            style={[
              fontSemibold16,
              {
                color: "white",
              },
            ]}
          >
            {selectedItem || placeholder}
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
          <TertiaryBox style={styles.dropdownContent}>
            {items &&
              items.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => selectItem(item)}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <BrandText
                      style={[
                        fontSemibold16,
                        { marginLeft: layout.spacing_x1_5 },
                      ]}
                    >
                      {item}
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

// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  label: {
    marginBottom: layout.spacing_x1,
  },
  dropdownBox: {
    width: "100%",
    height: 40,
    flexDirection: "row",
    paddingHorizontal: 12,
    backgroundColor: neutral17,
    alignItems: "center",
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  dropdownItem: {
    marginBottom: layout.spacing_x2,
    opacity: 1,
  },
  dropdownContent: {
    paddingTop: layout.spacing_x2,
    backgroundColor: neutral17,
    alignItems: "flex-start",
    borderRadius: 8,
  },
});
