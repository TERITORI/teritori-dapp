import React, { useState } from "react";
import {
  View,
  ViewStyle,
  TouchableOpacity,
  Text,
  StyleProp,
} from "react-native";

import chevronUpSVG from "../../assets/icons/chevron-down.svg";
import chevronDownSVG from "../../assets/icons/chevron-up.svg";
import { useWallets, Wallet } from "../context/WalletsProvider";
import useSelectedWallet from "../hooks/useSelectedWallet";
import { setSelectedWalletId } from "../store/slices/settings";
import { useAppDispatch } from "../store/store";
import { neutral17, neutral44 } from "../utils/style/colors";
import { walletSelectorWidth } from "../utils/style/layout";
import { WalletProvider } from "../utils/walletProvider";
import { BrandText } from "./BrandText";
import { ClosableByClickOutside } from "./ClosableByClickOutside";
import { SVG } from "./SVG";
import { TertiaryBox } from "./boxes/TertiaryBox";
import { SecondaryButton } from "./buttons/SecondaryButton";
import { NetworkIcon } from "./images/NetworkIcon";

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
  const fontSize = 14;
  return (
    <View style={[{ flexDirection: "row", alignItems: "center" }, style]}>
      <NetworkIcon network={wallet?.network} />
      <BrandText
        style={{
          color: "white",
          fontSize,
          letterSpacing: -(fontSize * 0.04),
          marginLeft: 12,
          fontWeight: "500",
        }}
      >
        {tinyAddress(wallet?.publicKey || "")}
      </BrandText>
      {wallet?.provider === WalletProvider.Store && (
        <Text style={{ marginLeft: 12 }}>👁️</Text>
      )}
    </View>
  );
};

export const WalletSelector: React.FC<{
  onPressAddWallet?: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ onPressAddWallet, style }) => {
  const { wallets } = useWallets();
  const selectedWallet = useSelectedWallet();
  const dispatch = useAppDispatch();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  if (!selectedWallet) {
    return null;
  }

  const otherWallets = wallets.filter(
    (wallet) => wallet.id !== selectedWallet.id && wallet.publicKey
  );

  return (
    <View style={style}>
      <TouchableOpacity
        onPress={() => setDropdownVisible((visible) => !visible)}
      >
        <TertiaryBox
          width={walletSelectorWidth}
          mainContainerStyle={{
            justifyContent: "space-between",
            flexDirection: "row",
            paddingHorizontal: 12,
          }}
          height={40}
        >
          <WalletView wallet={selectedWallet} />
          <SVG
            source={dropdownVisible ? chevronUpSVG : chevronDownSVG}
            width={16}
            height={16}
          />
        </TertiaryBox>
      </TouchableOpacity>

      <ClosableByClickOutside
        close={() => setDropdownVisible(false)}
        visible={dropdownVisible}
      >
        <TertiaryBox
          mainContainerStyle={{
            paddingHorizontal: 12,
            paddingVertical: 12,
            backgroundColor: neutral17,
          }}
        >
          {otherWallets.map((wallet) => (
            <TouchableOpacity
              onPress={() => {
                setDropdownVisible(false);
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
                setDropdownVisible(false);
                if (typeof onPressAddWallet === "function") {
                  onPressAddWallet();
                }
              }}
            />
          </View>
        </TertiaryBox>
      </ClosableByClickOutside>
    </View>
  );
};
