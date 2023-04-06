import React, { useRef } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

import { TopMenuAccount } from "./TopMenuAccount";
import { TopMenuHighlightedNews } from "./TopMenuHighlightedNews";
import { TopMenuLiveMint } from "./TopMenuLiveMint";
import { TopMenuMyTeritories } from "./TopMenuMyTeritories";
import { TopMenuMyWallets } from "./TopMenuMyWallets";
import { WalletView } from "./WalletView";
import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../assets/icons/chevron-up.svg";
import { useDropdowns } from "../../context/DropdownsProvider";
import { Wallet } from "../../context/WalletsProvider";
import {
  neutral00,
  neutral33,
  purpleLight,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout, topMenuWidth } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import FlexCol from "../FlexCol";
import { OmniLink } from "../OmniLink";
import { SVG } from "../SVG";
import { Separator } from "../Separator";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const TopMenu: React.FC<{
  selectedWallet?: Wallet;
}> = ({ selectedWallet }) => {
  const { onPressDropdownButton, isDropdownOpen } = useDropdowns();
  const dropdownRef = useRef<View>(null);

  return (
    <View ref={dropdownRef}>
      <TouchableOpacity onPress={() => onPressDropdownButton(dropdownRef)}>
        <TertiaryBox
          width={220}
          mainContainerStyle={[
            styles.buttonBoxMainContainer,
            {
              backgroundColor: isDropdownOpen(dropdownRef)
                ? neutral33
                : neutral00,
            },
          ]}
          height={40}
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

      {isDropdownOpen(dropdownRef) && (
        <TertiaryBox
          width={topMenuWidth}
          noBrokenCorners
          style={[styles.menuBox]}
        >
          <TopMenuAccount />
          <TopMenuMyWallets />
          <TopMenuMyTeritories />
          <TopMenuHighlightedNews />
          <TopMenuLiveMint />

          <Separator />
          <OmniLink to={{ screen: "Settings" }}>
            <FlexCol style={{ paddingVertical: layout.padding_x1_5 }}>
              <BrandText style={styles.settingsText}>Settings</BrandText>
            </FlexCol>
          </OmniLink>
        </TertiaryBox>
      )}
    </View>
  );
};

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
