import { FC, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  ViewStyle,
  ImageStyle,
} from "react-native";

import { TopMenuBox } from "./TopMenuBox";
import { useDropdowns } from "../../context/DropdownsProvider";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getCosmosNetwork } from "../../networks";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { neutral00 } from "../../utils/style/colors";

export const TopMenuMobile: FC = () => {
  const { onPressDropdownButton, isDropdownOpen } = useDropdowns();
  const dropdownRef = useRef<View>(null);
  const selectedWallet = useSelectedWallet();
  const userInfo = useNSUserInfo(selectedWallet?.userId);
  const selectedNetworkId = useSelectedNetworkId();
  const network = getCosmosNetwork(selectedNetworkId);

  return (
    <View ref={dropdownRef}>
      <TouchableOpacity onPress={() => onPressDropdownButton(dropdownRef)}>
        <Image
          style={userImageStyle}
          source={{
            uri: ipfsURLToHTTPURL(
              userInfo?.metadata?.image ||
                network?.nameServiceDefaultImage ||
                ""
            ),
          }}
        />
      </TouchableOpacity>

      <TopMenuBox
        style={[
          menuBoxStyle,
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

const menuBoxStyle: ViewStyle = {
  backgroundColor: neutral00,
  position: "absolute",
  top: 48,
  right: -60,
};
const userImageStyle: ImageStyle = {
  borderRadius: 999,
  width: 32,
  height: 32,
};
