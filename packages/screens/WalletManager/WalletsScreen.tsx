import React, { useState } from "react";
import { View } from "react-native";

import { WalletHeader } from "./WalletHeader";
import { WalletItem } from "./WalletItem";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { ConnectWalletModal } from "../../components/connectWallet/ConnectWalletModal";
import { useWallets } from "../../context/WalletsProvider";
import { ScreenFC } from "../../utils/navigation";
import { neutral33, neutralA3 } from "../../utils/style/colors";
import { joinElements } from "../Multisig/components/MultisigRightSection";

export const WalletManagerWalletsScreen: ScreenFC<
  "WalletManagerWallets" | "WalletManagerChains"
> = () => {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const { wallets: allWallets } = useWallets();

  return (
    <ScreenContainer headerChildren={<WalletHeader />}>
      <View
        style={{
          paddingVertical: 48,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <View>
            <BrandText style={{ marginRight: 20, fontSize: 20 }}>
              All Wallets
            </BrandText>
            <BrandText
              style={{
                fontSize: 14,
                color: neutralA3,
              }}
            >
              Manage your wallets
            </BrandText>
          </View>
          <PrimaryButton
            size="SM"
            text="Add wallet"
            onPress={() => setShowConnectModal(true)}
          />
        </View>
        {joinElements(
          allWallets.map((item, index) => (
            <WalletItem
              key={index}
              item={item}
              zIndex={10 + allWallets.length - index}
              selectable
            />
          )),
          <View style={{ borderBottomWidth: 1, borderColor: neutral33 }} />,
        )}
      </View>
      <ConnectWalletModal
        visible={showConnectModal}
        onClose={() => setShowConnectModal(false)}
      />
    </ScreenContainer>
  );
};
