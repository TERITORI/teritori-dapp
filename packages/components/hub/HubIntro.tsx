import React, { useState } from "react";
import { View, Image } from "react-native";

import connectedImagePNG from "../../../assets/default-images/connected-image-bad.png";
import logoSVG from "../../../assets/logos/logo.svg";
import { useAreThereWallets } from "../../hooks/useAreThereWallets";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { MyNFTs } from "../../screens/WalletManager/MyNFTs";
import { WalletDashboardHeader } from "../../screens/WalletManager/WalletDashboardHeader";
import { Overview } from "../../screens/WalletManager/components/Overview";
import { useAppNavigation } from "../../utils/navigation";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { FullWidthSeparator } from "../FullWidthSeparator";
import { Quests } from "../Quests";
import { SVG } from "../SVG";
import { Section } from "../Section";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { Tabs } from "../tabs/Tabs";
import { ProfileButton } from "./ProfileButton";

const walletsManagerTabItems = {
  overview: {
    name: "Overview",
  },
  nfts: {
    name: "NFTs",
  },
};

const ConnectedIntro: React.FC = () => {
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof walletsManagerTabItems>("overview");

  const selectedWallet = useSelectedWallet();

  return (
    <View
      style={{
        alignItems: "center",
        marginTop: layout.contentPadding,
        width: "100%",
      }}
    >
      <Image
        source={connectedImagePNG}
        style={{ width: 200, aspectRatio: 1, marginBottom: 20 }}
      />

      <ProfileButton style={{ marginTop: 40 }} />

      <Section title="Quests" subtitle="6">
        <FullWidthSeparator />
        <Quests userId={`tori-${selectedWallet?.publicKey}`} />
      </Section>

      <Section title="Wallets manager">
        <FullWidthSeparator />
        <WalletDashboardHeader />
        <Tabs
          items={walletsManagerTabItems}
          selected={selectedTab}
          style={{ marginTop: 24, height: 40 }}
          onSelect={setSelectedTab}
        />
        {selectedTab === "overview" && <Overview />}
        {selectedTab === "nfts" && <MyNFTs />}
      </Section>
    </View>
  );
};

const DisconnectedIntro: React.FC = () => {
  const navigation = useAppNavigation();

  return (
    <View
      style={{
        alignItems: "center",
        marginBottom: 72,
        marginTop: layout.contentPadding,
      }}
    >
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
  const hasWallet = useAreThereWallets();
  if (hasWallet) {
    return <ConnectedIntro />;
  }
  return <DisconnectedIntro />;
};
