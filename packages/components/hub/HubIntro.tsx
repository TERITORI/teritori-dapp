import React, { useState } from "react";
import { View } from "react-native";

import { ProfileButton } from "./ProfileButton";
import logoSVG from "../../../assets/logos/logo.svg";
import { useNSUserInfo } from "../../hooks/name-service/useNSUserInfo";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { MyNFTs } from "../../screens/WalletManager/MyNFTs";
import { WalletDashboardHeader } from "../../screens/WalletManager/WalletDashboardHeader";
import { Overview } from "../../screens/WalletManager/components/Overview";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { FullWidthSeparator } from "../FullWidthSeparator";
import { Quests } from "../Quests";
import { SVG } from "../SVG";
import { Section } from "../Section";
import { MainConnectWalletButton } from "../connectWallet/MainConnectWalletButton";
import { AvatarWithFrame } from "../images/AvatarWithFrame";
import { Tabs } from "../tabs/Tabs";

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
  const userInfo = useNSUserInfo(selectedWallet?.userId);

  return (
    <View
      style={{
        alignItems: "center",
        marginTop: layout.contentPadding,
        width: "100%",
      }}
    >
      <AvatarWithFrame
        isLoading={userInfo?.loading}
        image={userInfo?.metadata?.image}
        size="XL"
      />

      <ProfileButton style={{ marginTop: 40 }} />

      <Section title="Quests">
        <FullWidthSeparator />
        <Quests userId={selectedWallet?.userId} />
      </Section>

      <Section title="Wallets manager">
        <FullWidthSeparator />
        <WalletDashboardHeader />
        <Tabs
          items={walletsManagerTabItems}
          selected={selectedTab}
          style={{ height: 60 }}
          onSelect={setSelectedTab}
        />
        {selectedTab === "overview" && <Overview />}
        {selectedTab === "nfts" && <MyNFTs />}
      </Section>
    </View>
  );
};

const DisconnectedIntro: React.FC = () => {
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
      <MainConnectWalletButton style={{ marginTop: 72 }} />
    </View>
  );
};

export const HubIntro: React.FC = () => {
  const selectedWallet = useSelectedWallet();
  const hasWallet = !!selectedWallet;
  if (hasWallet) {
    return <ConnectedIntro />;
  }
  return <DisconnectedIntro />;
};
