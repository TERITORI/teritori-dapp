import { FC } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

import { TopMenuBox } from "./TopMenuBox";
import { WalletView } from "./WalletView";
import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../assets/icons/chevron-up.svg";
import { useClickOutside } from "../../hooks/useClickOutside";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  neutral00,
  neutral33,
  purpleLight,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { SVG } from "../SVG";
import { LegacyTertiaryBox } from "../boxes/LegacyTertiaryBox";

export const TOP_MENU_BUTTON_HEIGHT = 40;

export const TopMenu: FC = () => {
  const selectedWallet = useSelectedWallet();

  const [isDropdownOpen, setDropdownState, dropdownRef] = useClickOutside();

  return (
    <View ref={dropdownRef} collapsable={false}>
      <TouchableOpacity onPress={() => setDropdownState(true)}>
        <LegacyTertiaryBox
          width={220}
          mainContainerStyle={[
            styles.buttonBoxMainContainer,
            {
              backgroundColor: isDropdownOpen ? neutral33 : neutral00,
            },
          ]}
          height={TOP_MENU_BUTTON_HEIGHT}
        >
          <WalletView wallet={selectedWallet} style={styles.walletView} />
          <SVG
            source={isDropdownOpen ? chevronUpSVG : chevronDownSVG}
            width={16}
            height={16}
            color={secondaryColor}
          />
        </LegacyTertiaryBox>
      </TouchableOpacity>

      <TopMenuBox
        style={[styles.menuBox, !isDropdownOpen && { display: "none" }]}
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
