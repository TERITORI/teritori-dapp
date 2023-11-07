import { FC, useRef } from "react";
import { View, TouchableOpacity } from "react-native";

import { TopMenuBox } from "./TopMenuBox";
import { useDropdowns } from "../../context/DropdownsProvider";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { neutral00 } from "../../utils/style/colors";
import { UserAvatarWithFrame } from "../images/AvatarWithFrame";

export const TopMenuMobile: FC = () => {
  const { onPressDropdownButton, isDropdownOpen } = useDropdowns();
  const dropdownRef = useRef<View>(null);
  const selectedWallet = useSelectedWallet();

  return (
    <View ref={dropdownRef}>
      <TouchableOpacity onPress={() => onPressDropdownButton(dropdownRef)}>
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
          !isDropdownOpen(dropdownRef) && { display: "none" },
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
