import { FC, useRef } from "react";
import { View, TouchableOpacity, ViewStyle } from "react-native";

import { TopMenuBox } from "./TopMenuBox";
import { WalletView } from "./WalletView";
import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../assets/icons/chevron-up.svg";
import { useDropdowns } from "../../context/DropdownsProvider";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { neutral00, neutral33, secondaryColor } from "../../utils/style/colors";
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
          width={220}
          mainContainerStyle={[
            buttonBoxMainContainerStyle,
            {
              backgroundColor: isDropdownOpen(dropdownRef)
                ? neutral33
                : neutral00,
            },
          ]}
          height={TOP_MENU_BUTTON_HEIGHT}
        >
          <WalletView wallet={selectedWallet} style={walletViewStyle} />
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
          menuBoxStyle,
          !isDropdownOpen(dropdownRef) && { display: "none" },
        ]}
      />
    </View>
  );
};

const buttonBoxMainContainerStyle: ViewStyle = {
  justifyContent: "space-between",
  flexDirection: "row",
  paddingHorizontal: 12,
};
const walletViewStyle: ViewStyle = {
  flex: 1,
  marginRight: 12,
};
const menuBoxStyle: ViewStyle = {
  position: "absolute",
  top: 46,
  right: 0,
};
