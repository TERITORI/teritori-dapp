import React, { useState } from "react";
import { View } from "react-native";

import { WalletHeader } from "./WalletHeader";
import { WalletItem } from "./WalletItem";
import { joinElements } from "../Multisig/components/MultisigRightSection";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { ConnectWalletModal } from "@/components/modals/ConnectWalletModal";
import { useWallets } from "@/context/WalletsProvider";
import { useMaxResolution } from "@/hooks/useMaxResolution";
import { ScreenFC } from "@/utils/navigation";
import { neutral33, neutralA3 } from "@/utils/style/colors";
import { fontRegular14, fontRegular20 } from "@/utils/style/fonts";

export const WalletManagerWalletsScreen: ScreenFC<
  "WalletManagerWallets" | "WalletManagerChains"
> = () => {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const { wallets: allWallets } = useWallets();
  const { width } = useMaxResolution({ isLarge: true });

  return (
    <ScreenContainer fullWidth headerChildren={<WalletHeader />}>
      <View
        style={{
          paddingVertical: 48,
          width,
          alignSelf: "center",
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
            <BrandText style={[fontRegular20, { marginRight: 20 }]}>
              All Wallets
            </BrandText>
            <BrandText style={[fontRegular14, { color: neutralA3 }]}>
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
