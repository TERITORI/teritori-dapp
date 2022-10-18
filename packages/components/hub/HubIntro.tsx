import React from "react";
import { View, Image } from "react-native";

import connectedImagePNG from "../../../assets/default-images/connected-image-bad.png";
import logoSVG from "../../../assets/logos/logo.svg";
import { useWallets } from "../../context/WalletsProvider";
import { MyNFTs } from "../../screens/WalletManager/MyNFTs";
import { Overview } from "../../screens/WalletManager/Overview/Overview";
import { WalletDashboardHeader } from "../../screens/WalletManager/WalletDashboardHeader";
import { useAppNavigation } from "../../utils/navigation";
import { WalletProvider } from "../../utils/walletProvider";
import { BrandText } from "../BrandText";
import { FullWidthSeparator } from "../FullWidthSeparator";
import { Quests } from "../Quests";
import { SVG } from "../SVG";
import { Section } from "../Section";
import { WalletSelector } from "../WalletSelector";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { TabItem, Tabs, useTabs } from "../tabs/Tabs";

const walletsManagerTabItems: TabItem[] = [
  {
    label: "Overview",
    isSelected: true,
  },
  {
    label: "NFTs",
    isSelected: false,
  },
];

const ConnectedIntro: React.FC = () => {
  const navigation = useAppNavigation();
  const { onPressTabItem, tabItems, selectedTabItem } = useTabs(
    walletsManagerTabItems
  );

  return (
    <View style={{ alignItems: "center", marginTop: 80, width: "100%" }}>
      <Image
        source={connectedImagePNG}
        style={{ width: 200, aspectRatio: 1, marginBottom: 20 }}
      />

      <WalletSelector onPressAddWallet={() => navigation.navigate("Wallets")} />

      <Section title="Quests" subtitle="6">
        <FullWidthSeparator />
        <Quests />
      </Section>

      <Section title="Wallets manager">
        <FullWidthSeparator />
        <WalletDashboardHeader />
        <Tabs
          items={tabItems}
          style={{ marginTop: 24, height: 40 }}
          onPressTabItem={onPressTabItem}
        />
        {selectedTabItem.label === "Overview" && <Overview />}
        {selectedTabItem.label === "NFTs" && <MyNFTs />}
      </Section>
    </View>
  );
};

const DisconnectedIntro: React.FC = () => {
  const navigation = useAppNavigation();

  return (
    <View style={{ alignItems: "center", marginBottom: 72, marginTop: 180 }}>
      <SVG width={200} height={200} source={logoSVG} />
      <BrandText style={{ color: "#00C6FB", fontSize: 16 }}>
        Welcome to Teritori_
      </BrandText>
      <PrimaryButton
        size="XL"
        style={{ marginTop: 72 }}
        text="Connect wallet"
        onPress={() => navigation.navigate("Wallets")}
      />
    </View>
  );
};

export const HubIntro: React.FC = () => {
  const { wallets } = useWallets();
  if (
    wallets.filter(
      (wallet) => wallet.connected || wallet.provider === WalletProvider.Store
    ).length > 0
  ) {
    return <ConnectedIntro />;
  }
  return <DisconnectedIntro />;
};
