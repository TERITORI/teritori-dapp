import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { Wallet } from "../../context/WalletsProvider";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { BrandText } from "../BrandText";
import { WalletProviderIcon } from "../WalletProviderIcon";

export const tinyAddress = (
  fullAddress: string = "",
  totalCount: number = 10
) => {
  if (fullAddress.length <= 13) {
    return fullAddress;
  }
  const chainIdReg = fullAddress.match(/.+?(?=\d+)/);
  const chainIdName = chainIdReg?.length ? chainIdReg[0] : "";
  const startingCharLength =
    Math.ceil(totalCount / 2) - chainIdName?.length / 2;
  const endingCharLength = Math.floor(totalCount / 2) - chainIdName?.length / 2;

  return `${fullAddress.substring(
    0,
    startingCharLength + chainIdName.length
  )}...${fullAddress.substring(fullAddress.length - endingCharLength)}`;
};

export const WalletView: React.FC<{
  wallet?: Wallet;
  style?: StyleProp<ViewStyle>;
}> = ({ wallet, style }) => {
  const userInfo = useNSUserInfo(wallet?.userId);

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
        ellipsizeMode="middle"
      >
        {tinyAddress(userInfo?.metadata?.tokenId || wallet?.address || "", 16)}
      </BrandText>
    </View>
  );
};
