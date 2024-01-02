import { FC } from "react";
import { View, TouchableOpacity } from "react-native";

import { TopMenuBox } from "./TopMenuBox";
import { useClickOutside } from "../../hooks/useClickOutside";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { neutral00 } from "../../utils/style/colors";
import { UserAvatarWithFrame } from "../images/AvatarWithFrame";

export const TopMenuMobile: FC = () => {
  const [isDropdownOpen, setDropdownState, dropdownRef] = useClickOutside();

  const selectedWallet = useSelectedWallet();

  return (
    <View ref={dropdownRef} collapsable={false}>
      <TouchableOpacity onPress={() => setDropdownState(!isDropdownOpen)}>
        <UserAvatarWithFrame size="XXS" userId={selectedWallet?.userId} />
      </TouchableOpacity>

      <TopMenuBox
        style={[
          {
            backgroundColor: neutral00,
            position: "absolute",
            top: 48,
            right: -60,
          },
          !isDropdownOpen && { display: "none" },
        ]}
        mainContainerStyle={{
          borderTopWidth: 0,
          borderRightWidth: 0,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }}
      />
    </View>
  );
};
