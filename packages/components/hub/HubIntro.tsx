import axios from "axios";
import React, { useState } from "react";
import { View } from "react-native";

import { ProfileButton } from "./ProfileButton";
import logoSVG from "../../../assets/logos/logo.svg";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useAreThereWallets } from "../../hooks/useAreThereWallets";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getNetwork, NetworkKind } from "../../networks";
import { MyNFTs } from "../../screens/WalletManager/MyNFTs";
import { WalletDashboardHeader } from "../../screens/WalletManager/WalletDashboardHeader";
import { Overview } from "../../screens/WalletManager/components/Overview";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { FullWidthSeparator } from "../FullWidthSeparator";
import { Quests } from "../Quests";
import { SVG } from "../SVG";
import { Section } from "../Section";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { MainConnectWalletButton } from "../connectWallet/MainConnectWalletButton";
import { UserAvatarWithFrame } from "../images/AvatarWithFrame";
import { SpacerColumn } from "../spacer";
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

  return (
    <View
      style={{
        alignItems: "center",
        marginTop: layout.contentSpacing,
        width: "100%",
      }}
    >
      <UserAvatarWithFrame userId={selectedWallet?.userId} size="XL" />

      <ProfileButton style={{ marginTop: 40 }} />

      <FaucetButton />

      <Section title="Quests">
        <FullWidthSeparator />
        <View style={{ marginTop: 20 }}>
          <Quests userId={selectedWallet?.userId} />
        </View>
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

const FaucetButton: React.FC = () => {
  const selectedWallet = useSelectedWallet();
  const network = getNetwork(selectedWallet?.networkId);
  const { wrapWithFeedback } = useFeedbacks();
  if (
    network?.kind !== NetworkKind.Gno ||
    !network.faucetURL ||
    !selectedWallet
  ) {
    return null;
  }
  return (
    <>
      <SpacerColumn size={4} />
      <PrimaryButton
        text="Get test tokens"
        loader
        onPress={wrapWithFeedback(
          async () => {
            if (!network.faucetURL) {
              throw new Error("No faucet for this network");
            }
            const res = await axios.get(
              network.faucetURL.replace("$addr", selectedWallet.address),
            );
            if (res.status !== 200 || res.data !== "faucet success") {
              throw new Error(res.data || "Unexpected error");
            }
          },
          {
            title: "Success",
            message: "500 GNOTs have been sent to your address",
          },
        )}
      />
    </>
  );
};

const DisconnectedIntro: React.FC = () => {
  return (
    <View
      style={{
        alignItems: "center",
        marginBottom: 72,
        marginTop: layout.contentSpacing,
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
  const hasWallet = useAreThereWallets();
  if (hasWallet) {
    return <ConnectedIntro />;
  }
  return <DisconnectedIntro />;
};
