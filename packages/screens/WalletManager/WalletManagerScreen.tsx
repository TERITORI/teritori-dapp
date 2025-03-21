import React from "react";
import { View } from "react-native";

import { Assets } from "./Assets";
import { WalletHeader } from "./WalletHeader";
import { WalletItem } from "./WalletItem";
import useSelectedWallet from "../../hooks/useSelectedWallet";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { MainConnectWalletButton } from "@/components/connectWallet/MainConnectWalletButton";
import { MyNFTs } from "@/components/hub/MyNFTs";
import { WalletDashboardHeader } from "@/components/hub/WalletDashboardHeader";
import { useAreThereWallets } from "@/hooks/useAreThereWallets";
import { useMaxResolution } from "@/hooks/useMaxResolution";
import { ScreenFC } from "@/utils/navigation";
import { neutral33 } from "@/utils/style/colors";
import { fontRegular20 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const WalletManagerScreen: ScreenFC<"WalletManager"> = () => {
  const selectedWallet = useSelectedWallet();
  const areThereWallets = useAreThereWallets();
  const { height, width } = useMaxResolution({ isLarge: true });

  return (
    <ScreenContainer fullWidth headerChildren={<WalletHeader />}>
      {areThereWallets ? (
        <View
          style={{
            flex: 1,
            width,
            alignSelf: "center",
            paddingBottom: layout.contentSpacing,
          }}
        >
          <WalletDashboardHeader />
          <Assets
            userId={selectedWallet?.userId}
            style={{
              marginTop: 40,
              borderTopWidth: 1,
              borderColor: neutral33,
              paddingTop: 40,
            }}
          />
          <View
            style={{
              paddingTop: 40,
              borderTopWidth: 1,
              borderColor: neutral33,
              zIndex: 99,
            }}
          >
            <BrandText style={[fontRegular20, { marginRight: 20 }]}>
              Wallet
            </BrandText>
            {!!selectedWallet && (
              <WalletItem item={selectedWallet} zIndex={10} />
            )}
          </View>
          <MyNFTs />
        </View>
      ) : (
        <View
          style={{
            height,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MainConnectWalletButton />
        </View>
      )}
    </ScreenContainer>
  );
};
