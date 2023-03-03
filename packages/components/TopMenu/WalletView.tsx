import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { Wallet } from "../../context/WalletsProvider";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { fontMedium14 } from "../../utils/style/fonts";
import { tinyAddress } from "../../utils/text";
import { BrandText } from "../BrandText";
import { WalletProviderIcon } from "../WalletProviderIcon";

export const WalletView: React.FC<{
  wallet?: Wallet;
  style?: StyleProp<ViewStyle>;
}> = ({ wallet, style }) => {
  const userInfo = useNSUserInfo(wallet?.userId);

  return (
    <View style={[{ flexDirection: "row", alignItems: "center" }, style]}>
      <View style={{ width: 16, height: 16 }}>
        <WalletProviderIcon size={16} walletProvider={wallet?.provider} />
      </View>
      <BrandText
        style={[fontMedium14, { marginLeft: 12 }]}
        ellipsizeMode="middle"
      >
        {tinyAddress(userInfo?.metadata?.tokenId || wallet?.address || "", 16)}
      </BrandText>
    </View>
  );
};
