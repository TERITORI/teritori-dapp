import React, { useMemo, useRef } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

import chevronDownSVG from "../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../assets/icons/chevron-up.svg";
import { useDropdowns } from "../context/DropdownsProvider";
import { useWallets } from "../context/WalletsProvider";
import useSelectedWallet from "../hooks/useSelectedWallet";
import { setSelectedWalletId } from "../store/slices/settings";
import { useAppDispatch } from "../store/store";
import { Network } from "../utils/network";
import { neutral17, secondaryColor } from "../utils/style/colors";
import { fontSemibold12 } from "../utils/style/fonts";
import { layout } from "../utils/style/layout";
import { WalletProvider } from "../utils/walletProvider";
import { BrandText } from "./BrandText";
import { SVG } from "./SVG";
import { TertiaryBox } from "./boxes/TertiaryBox";
import { NetworkIcon } from "./images/NetworkIcon";
import { SpacerRow } from "./spacer";

const SUPPORTED_NETWORKS = [Network.Teritori, Network.Ethereum];

export const NetworkSelector: React.FC<{
  style?: StyleProp<ViewStyle>;
}> = ({ style }) => {
  const { onPressDropdownButton, isDropdownOpen, closeOpenedDropdown } =
    useDropdowns();
  const dropdownRef = useRef<View>(null);
  const selectedWallet = useSelectedWallet();
  const dispatch = useAppDispatch();
  const { wallets } = useWallets();

  const network = useMemo(() => {
    let network: Network;

    switch (selectedWallet?.provider) {
      case WalletProvider.Metamask:
        network = Network.Ethereum;
        break;
      case WalletProvider.Keplr:
      default:
        network = Network.Teritori;
    }

    return network;
  }, [selectedWallet?.provider]);

  const onPressNetwork = (network: Network) => {
    let walletProvider: WalletProvider;

    switch (network) {
      case Network.Ethereum:
        walletProvider = WalletProvider.Metamask;
        break;
      case Network.Teritori:
      default:
        walletProvider = WalletProvider.Keplr;
    }

    const selectedWallet = wallets.find(
      (w) => w.connected && w.provider === walletProvider
    );

    if (selectedWallet) {
      dispatch(setSelectedWalletId(selectedWallet.id));
    }
    closeOpenedDropdown();
  };

  return (
    <View style={style} ref={dropdownRef}>
      <TouchableOpacity onPress={() => onPressDropdownButton(dropdownRef)}>
        <TertiaryBox
          width={60}
          mainContainerStyle={{
            flexDirection: "row",
            paddingHorizontal: 12,
            backgroundColor: neutral17,
          }}
          height={40}
        >
          <NetworkIcon network={network} size={16} />
          <SpacerRow size={1} />
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
          width={172}
          style={{ position: "absolute", top: 44 }}
          mainContainerStyle={{
            paddingHorizontal: layout.padding_x2,
            paddingTop: layout.padding_x2,
            backgroundColor: neutral17,
            alignItems: "flex-start",
          }}
        >
          {Object.values(Network)
            .filter((n) => n !== Network.Unknown)
            .map((network, index) => {
              return (
                <TouchableOpacity
                  disabled={!SUPPORTED_NETWORKS.includes(network)}
                  style={{
                    marginBottom: layout.padding_x2,
                    opacity: SUPPORTED_NETWORKS.includes(network) ? 1 : 0.5,
                  }}
                  key={index}
                  onPress={() => onPressNetwork(network)}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <NetworkIcon network={network} size={16} />
                    <BrandText
                      style={[
                        fontSemibold12,
                        { marginLeft: layout.padding_x1_5 },
                      ]}
                    >
                      {network}
                    </BrandText>
                  </View>
                </TouchableOpacity>
              );
            })}
        </TertiaryBox>
      )}
    </View>
  );
};
