import React from "react";
import { View, Image, ViewStyle, TouchableOpacity } from "react-native";

import connectedImagePNG from "../../../assets/default-images/connected-image-bad.png";
import logoSVG from "../../../assets/logos/logo.svg";
import { useSolanaBalance } from "../../context/SolanaBalanceProvider/solanaBalanceContext";
import { useTeritoriBalance } from "../../context/TeritoriBalanceProvider";
import { useWallets } from "../../context/WalletsProvider";
import { getCurrentRouteName, useAppNavigation } from "../../utils/navigation";
import { WalletProvider } from "../../utils/walletProvider";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { WalletSelector } from "../WalletSelector";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { BalanceCard } from "../cards/BalanceCard";

export type HubPageName = "Home" | "MyCollection" | "Activity" | "Guardians";

const MyCollectionCard: React.FC<{
  style?: ViewStyle;
  highlighted?: boolean;
}> = ({ style, highlighted }) => {
  const navigation = useAppNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("MyCollection")}
      style={style}
    >
      <BalanceCard
        highlighted={highlighted}
        label="MyCollection"
        balanceTitle="Total Floor Value"
        balanceText="4.75 SOL"
      />
    </TouchableOpacity>
  );
};

const ActivityCard: React.FC<{
  style?: ViewStyle;
  highlighted?: boolean;
}> = ({ style, highlighted }) => {
  const navigation = useAppNavigation();
  const { totalString } = useSolanaBalance();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Activity")}
      style={style}
    >
      <BalanceCard
        highlighted={highlighted}
        label="Activity"
        balanceTitle="Total Wallet Amount"
        balanceText={totalString}
      />
    </TouchableOpacity>
  );
};

const GuardiansCard: React.FC<{
  style?: ViewStyle;
  highlighted?: boolean;
}> = ({ style, highlighted }) => {
  const navigation = useAppNavigation();
  const { totalString } = useTeritoriBalance();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Guardians")}
      style={style}
    >
      <BalanceCard
        highlighted={highlighted}
        label="Guardians"
        balanceTitle="Total $Teri Tokens"
        balanceText={totalString}
      />
    </TouchableOpacity>
  );
};

const ConnectedIntro: React.FC = () => {
  const navigation = useAppNavigation();
  const currentRoutName = getCurrentRouteName(navigation);
  return (
    <View style={{ alignItems: "center", marginBottom: 124, marginTop: 80 }}>
      <Image
        source={connectedImagePNG}
        style={{ width: 200, aspectRatio: 1, marginBottom: 20 }}
      />
      <WalletSelector onPressAddWallet={() => navigation.navigate("Wallets")} />
      <View style={{ marginHorizontal: 25 }}>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginTop: 72,
            margin: -30,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MyCollectionCard
            style={{ margin: 30 }}
            highlighted={currentRoutName === "MyCollection"}
          />
          <ActivityCard
            style={{ margin: 30 }}
            highlighted={currentRoutName === "Activity"}
          />
          <GuardiansCard
            style={{ margin: 30 }}
            highlighted={currentRoutName === "Guardians"}
          />
        </View>
      </View>
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
        format="XL"
        style={{ marginTop: 72 }}
        text="Connect wallet"
        onPress={() => navigation.navigate("Wallets")}
      />
    </View>
  );
};

export const HubIntro: React.FC<{
  hubPage: HubPageName;
}> = ({ hubPage }) => {
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
