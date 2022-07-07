import React, { useState } from "react";
import { View, ViewStyle, Image, TouchableOpacity, Text } from "react-native";

import downPNG from "../../assets/icons/down.png";
import upPNG from "../../assets/icons/up.png";
import { setSelectedWalletId } from "../store/slices/settings";
import { useAppDispatch } from "../store/store";
import { neutral17, neutral33, neutral44, primaryColor } from "../utils/colors";
import { WalletProvider } from "../utils/walletProvider";
import { BrandText } from "./BrandText";
import { NetworkIcon } from "./NetworkIcon";
import { useWallets, Wallet } from "./WalletsProvider/WalletsProvider";

// FIXME: the dropdown menu goes under other elements, consider doing a web component and using https://www.npmjs.com/package/react-native-select-dropdown for native

const SecondaryBox: React.FC<{
  style?: ViewStyle;
}> = ({ children, style }) => {
  return (
    <View
      style={[
        {
          borderColor: "#3D3D3D",
          borderWidth: 1,
          borderRadius: 12,
          paddingHorizontal: 12,
          height: 40,
        },
        style,
      ]}
    >
      <>{children}</>
    </View>
  );
};

const tinyAddress = (fullAddress: string) => {
  if (fullAddress.length <= 13) {
    return fullAddress;
  }
  return `${fullAddress.substring(0, 5)}...${fullAddress.substring(
    fullAddress.length - 5
  )}`;
};

const WalletView: React.FC<{ wallet?: Wallet; style?: ViewStyle }> = ({
  wallet,
  style,
}) => {
  const fontSize = 14;
  return (
    <View style={[{ flexDirection: "row", alignItems: "center" }, style]}>
      <NetworkIcon network={wallet.network} />
      <BrandText
        style={{
          color: "white",
          fontSize,
          letterSpacing: -(fontSize * 0.04),
          marginLeft: 12,
          fontWeight: "500",
        }}
      >
        {tinyAddress(wallet.publicKey)}
      </BrandText>
      {wallet.provider === WalletProvider.Store && (
        <Text style={{ marginLeft: 12 }}>👁️</Text>
      )}
    </View>
  );
};

export const WalletSelector: React.FC<{ onPressAddWallet?: () => void }> = ({
  onPressAddWallet,
}) => {
  const { selectedWallet, wallets } = useWallets();
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useAppDispatch();

  if (!selectedWallet) {
    return null;
  }

  const otherWallets = wallets.filter(
    (wallet) => wallet.id !== selectedWallet.id && wallet.publicKey
  );
  return (
    <View>
      <TouchableOpacity onPress={() => setIsExpanded((value) => !value)}>
        <SecondaryBox
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: 220,
            justifyContent: "space-between",
          }}
        >
          <WalletView wallet={selectedWallet} />
          <Image
            source={isExpanded ? upPNG : downPNG}
            style={{ width: 16, aspectRatio: 1 }}
          />
        </SecondaryBox>
      </TouchableOpacity>
      {isExpanded && (
        <View
          style={{
            position: "absolute",
            top: 44,
            padding: 12,
            backgroundColor: neutral17,
            borderWidth: 1,
            borderColor: neutral33,
            borderRadius: 8,
          }}
        >
          {otherWallets.map((wallet) => (
            <TouchableOpacity
              onPress={() => {
                setIsExpanded(false);
                dispatch(setSelectedWalletId(wallet.id));
              }}
              key={wallet.id}
            >
              <WalletView wallet={wallet} style={{ marginBottom: 24 }} />
            </TouchableOpacity>
          ))}
          {otherWallets.length > 0 && (
            <View
              style={{
                borderBottomColor: neutral44,
                borderBottomWidth: 1,
                marginBottom: 10,
              }}
            />
          )}
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#2B2B33",
                borderRadius: 8,
                paddingHorizontal: 13,
                paddingVertical: 10,
              }}
              onPress={() => {
                setIsExpanded(false);
                if (typeof onPressAddWallet === "function") {
                  onPressAddWallet();
                }
              }}
            >
              <BrandText style={{ color: primaryColor, fontSize: 14 }}>
                Add wallet
              </BrandText>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};
