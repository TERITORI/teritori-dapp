import React, { useRef, useState } from "react";
import { View, ViewStyle, TouchableOpacity, StyleProp } from "react-native";

import chevronUpSVG from "../../assets/icons/chevron-down.svg";
import chevronDownSVG from "../../assets/icons/chevron-up.svg";
import { useDropdowns } from "../context/DropdownsProvider";
import { useWallets, Wallet } from "../context/WalletsProvider";
import useSelectedWallet from "../hooks/useSelectedWallet";
import { useTNSMetadata } from "../hooks/useTNSMetadata";
import { setSelectedWalletId } from "../store/slices/settings";
import { useAppDispatch } from "../store/store";
import { neutral17, neutral44, secondaryColor } from "../utils/style/colors";
import { walletSelectorWidth } from "../utils/style/layout";
import { BrandText } from "./BrandText";
import { SVG } from "./SVG";
import { WalletProviderIcon } from "./WalletProviderIcon";
import { TertiaryBox } from "./boxes/TertiaryBox";
import { SecondaryButton } from "./buttons/SecondaryButton";
import { ConnectWalletModal } from "./connectWallet/ConnectWalletModal";

// FIXME: the dropdown menu goes under other elements, consider doing a web component and using https://www.npmjs.com/package/react-native-select-dropdown for native

export const tinyAddress = (
  fullAddress: string = "",
  nbCharBefore: number = 5
) => {
  if (fullAddress.length <= 13) {
    return fullAddress;
  }
  return `${fullAddress.substring(0, nbCharBefore)}...${fullAddress.substring(
    fullAddress.length - 5
  )}`;
};

const WalletView: React.FC<{
  wallet?: Wallet;
  style?: StyleProp<ViewStyle>;
}> = ({ wallet, style }) => {
  const tnsMetadata = useTNSMetadata(wallet?.address);
  const fontSize = 14;
  return (
    <View style={[{ flexDirection: "row", alignItems: "center" }, style]}>
      <View style={{ width: 16, height: 16 }}>
        <WalletProviderIcon size={16} walletProvider={wallet?.provider} />
      </View>
      <BrandText
        style={{
          color: "white",
          fontSize,
          letterSpacing: -(fontSize * 0.04),
          marginLeft: 12,
          fontWeight: "500",
        }}
        numberOfLines={1}
        ellipsizeMode="middle"
      >
        {tnsMetadata?.metadata?.tokenId || wallet?.address || ""}
      </BrandText>
    </View>
  );
};

export const WalletSelector: React.FC<{
  style?: StyleProp<ViewStyle>;
}> = ({ style }) => {
  const { wallets } = useWallets();
  const selectedWallet = useSelectedWallet();
  const dispatch = useAppDispatch();
  const [isConnectWalletVisible, setIsConnectWalletVisible] = useState(false);

  const { onPressDropdownButton, isDropdownOpen, closeOpenedDropdown } =
    useDropdowns();
  const dropdownRef = useRef<View>(null);

  if (!selectedWallet) {
    return null;
  }

  const otherWallets = wallets.filter(
    (wallet) => wallet.id !== selectedWallet.id && wallet.address
  );
  return (
    <View style={style} ref={dropdownRef}>
      <TouchableOpacity onPress={() => onPressDropdownButton(dropdownRef)}>
        <TertiaryBox
          width={walletSelectorWidth}
          mainContainerStyle={{
            justifyContent: "space-between",
            flexDirection: "row",
            paddingHorizontal: 12,
          }}
          height={40}
        >
          <WalletView
            wallet={selectedWallet}
            style={{ flex: 1, marginRight: 12 }}
          />
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
          style={{ position: "absolute", top: 44 }}
          mainContainerStyle={{
            paddingHorizontal: 12,
            paddingVertical: 12,
            backgroundColor: neutral17,
          }}
        >
          {otherWallets.map((wallet) => (
            <TouchableOpacity
              onPress={() => {
                closeOpenedDropdown();
                dispatch(setSelectedWalletId(wallet.id));
              }}
              key={wallet.id}
              style={{ width: "100%" }}
            >
              <WalletView wallet={wallet} style={{ marginBottom: 24 }} />
            </TouchableOpacity>
          ))}
          {otherWallets.length > 0 && (
            <View
              style={{
                borderBottomColor: neutral44,
                borderBottomWidth: 1,
                height: 1,
                width: "100%",
                marginBottom: 10,
              }}
            />
          )}
          <View style={{ flexDirection: "row" }}>
            <SecondaryButton
              size="XS"
              squaresBackgroundColor={neutral17}
              text="Add wallet"
              onPress={() => {
                closeOpenedDropdown();
                setIsConnectWalletVisible(true);
              }}
            />
          </View>
        </TertiaryBox>
      )}
      <ConnectWalletModal
        visible={isConnectWalletVisible}
        onClose={() => setIsConnectWalletVisible(false)}
      />
    </View>
  );
};
