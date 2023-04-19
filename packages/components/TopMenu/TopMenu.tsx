import {
  View,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { FC, useRef } from "react";

import { TopMenuBox } from "./TopMenuBox";
import { WalletView } from "./WalletView";
import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../assets/icons/chevron-up.svg";
import { useDropdowns } from "../../context/DropdownsProvider";
import {
  neutral00,
  neutral33,
  purpleLight,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { topMenuWidth } from "../../utils/style/layout";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";

const BUTTON_HEIGHT = 40;

export const TopMenu: FC = () => {
  const selectedWallet = useSelectedWallet();
  const { onPressDropdownButton, isDropdownOpen } = useDropdowns();
  const dropdownRef = useRef<View>(null);
  const { height: windowHeight } = useWindowDimensions();

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
          height={BUTTON_HEIGHT}
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
  scrollView: {
    height: "100%",
    width: topMenuWidth - 2,
  },
  settingsText: {
    ...(fontSemibold14 as object),
    color: purpleLight,
  },
});
