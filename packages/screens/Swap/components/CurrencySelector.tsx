import React, { useRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import chevronDownSVG from "../../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../../assets/icons/chevron-up.svg";
import atomCircleSVG from "../../../../assets/icons/networks/cosmos-hub-circle.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { useDropdowns } from "../../../context/DropdownsProvider";
import {
  neutral17,
  neutralA3,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const CurrencySelector: React.FC = () => {
  const { onPressDropdownButton, isDropdownOpen } = useDropdowns();
  const dropdownRef = useRef<View>(null);

  return (
    <View ref={dropdownRef}>
      <TouchableOpacity
        onPress={() => onPressDropdownButton(dropdownRef)}
        style={styles.container}
      >
        <SVG source={atomCircleSVG} height={48} width={48} />

        <View style={styles.labelChevronNetwork}>
          <View style={styles.labelChevron}>
            <BrandText style={styles.label}>ATOM</BrandText>
            <SVG
              source={
                isDropdownOpen(dropdownRef) ? chevronUpSVG : chevronDownSVG
              }
              width={16}
              height={16}
              color={secondaryColor}
            />
          </View>
          <BrandText style={[fontSemibold13, styles.network]}>
            Cosmos Hub
          </BrandText>
        </View>

        {isDropdownOpen(dropdownRef) && (
          <TertiaryBox
            width={172}
            style={{ position: "absolute", top: 56 }}
            mainContainerStyle={{
              paddingHorizontal: 16,
              paddingVertical: 16,
              backgroundColor: neutral17,
              alignItems: "flex-start",
            }}
          >
            <BrandText>TODO</BrandText>
          </TertiaryBox>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  labelChevronNetwork: {
    marginLeft: layout.padding_x1_5,
  },
  labelChevron: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    marginRight: layout.padding_x1,
  },
  network: {
    color: neutralA3,
  },
});
