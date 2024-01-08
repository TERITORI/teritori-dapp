import { FC, useRef } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

import { TopMenuBox } from "./TopMenuBox";
import { WalletView } from "./WalletView";
import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../assets/icons/chevron-up.svg";
import { useDropdowns } from "../../context/DropdownsProvider";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  neutral00,
  neutral33,
  purpleLight,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const TOP_MENU_BUTTON_HEIGHT = 40;

export const TopMenu: FC = () => {
  const selectedWallet = useSelectedWallet();
  const { onPressDropdownButton, isDropdownOpen } = useDropdowns();
  const dropdownRef = useRef<View>(null);

  return (
    <View ref={dropdownRef}>
      <TouchableOpacity onPress={() => onPressDropdownButton(dropdownRef)}>
        <TertiaryBox
          style={[
            styles.buttonBoxMainContainer,
            {
              width: 220,
              height: TOP_MENU_BUTTON_HEIGHT,
              backgroundColor: isDropdownOpen(dropdownRef)
                ? neutral33
                : neutral00,
            },
          ]}
        >
          <WalletView wallet={selectedWallet} style={styles.walletView} />
          <SVG
            source={isDropdownOpen(dropdownRef) ? chevronUpSVG : chevronDownSVG}
            width={16}
            height={16}
            color={secondaryColor}
          />
        </TertiaryBox>
      </TouchableOpacity>

      <TopMenuBox
        style={[
          styles.menuBox,
          !isDropdownOpen(dropdownRef) && { display: "none" },
        ]}
      />
    </View>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  buttonBoxMainContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 12,
  },
  walletView: {
    flex: 1,
    marginRight: 12,
  },
  menuBox: {
    position: "absolute",
    top: 46,
    right: 0,
  },
  settingsText: {
    ...(fontSemibold14 as object),
    color: purpleLight,
  },
});
