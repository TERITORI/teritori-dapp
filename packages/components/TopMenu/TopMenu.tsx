import React, { useRef } from "react";
import {View, ViewStyle, TouchableOpacity, StyleProp, StyleSheet} from "react-native";

import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../assets/icons/chevron-up.svg";
import { useDropdowns } from "../../context/DropdownsProvider";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {neutral00, neutral33, purpleLight, secondaryColor} from "../../utils/style/colors";
import {layout, topMenuWidth} from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";
import {Account} from "./Account";
import {MyWallets} from "./MyWallets";
import {Separator} from "../Separator";
import {MyTeritories} from "./MyTeritories";
import {WalletView} from "./WalletView";
import {HighlightedNews} from "./HighlightedNews";
import {LiveMint} from "./LiveMint";
import {fontSemibold14} from "../../utils/style/fonts";
import FlexCol from "../containers/FlexCol";
import {useAppNavigation} from "../../utils/navigation";

// FIXME: the dropdown menu goes under other elements, consider doing a web component and using https://www.npmjs.com/package/react-native-select-dropdown for native

export const TopMenu: React.FC<{
  style?: StyleProp<ViewStyle>;
}> = ({ style }) => {
  const selectedWallet = useSelectedWallet();
  const navigation = useAppNavigation();

  const { onPressDropdownButton, isDropdownOpen } =
    useDropdowns();
  const dropdownRef = useRef<View>(null);

  if (!selectedWallet) {
    return null;
  }

  return (
    <View style={style} ref={dropdownRef}>
      <TouchableOpacity onPress={() => onPressDropdownButton(dropdownRef)}>
        <TertiaryBox
          width={220}
          mainContainerStyle={[styles.buttonBoxMainContainer, {backgroundColor: isDropdownOpen(dropdownRef) ? neutral33 : neutral00}]}
          height={40}
        >
          <WalletView
            wallet={selectedWallet}
            style={styles.walletView}
          />
          <SVG
            source={isDropdownOpen(dropdownRef) ? chevronUpSVG : chevronDownSVG}
            width={16}
            height={16}
            color={secondaryColor}
          />
        </TertiaryBox>
      </TouchableOpacity>

        <TertiaryBox
          width={topMenuWidth}
          noBrokenCorners
          style={[styles.menuBox, !isDropdownOpen(dropdownRef) && {display: "none"}]}
        >

          <Account/>
          <MyWallets/>
          <MyTeritories/>
          <HighlightedNews/>
          <LiveMint/>

          <Separator/>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <FlexCol style={{paddingVertical: layout.padding_x1_5}}>
              <BrandText style={styles.settingsText}>Settings</BrandText>
            </FlexCol>
          </TouchableOpacity>

        </TertiaryBox>
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
    flex: 1, marginRight: 12
  },
  menuBox: {
    position: "absolute", top: 46, right: 0
  },
  settingsText : {
    ...(fontSemibold14 as object),
    color: purpleLight
  }
});
