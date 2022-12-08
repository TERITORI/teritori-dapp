import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";

export type RootStackParamList = {
  Home: undefined;
  MyCollection: undefined;
  Activity: undefined;
  Guardians: undefined;
  WalletManager: undefined;
  WalletManagerWallets: undefined;
  WalletManagerChains: undefined;
  Governance: undefined;
  UserPublicProfile: { id: string };
  RiotersFooter: undefined;
  Launchpad: undefined;
  LaunchpadApply: undefined;
  MintCollection: { id: string };
  TNSHome: { modal: string; name?: string } | undefined;
  Marketplace: undefined;
  Collection: { id: string };
  CollectionTools: { id: string };
  CollectionActivity: { id: string };
  NFTDetail: { id: string; openBuy?: boolean };

  RiotGame: undefined;
  RiotGameEnroll: undefined;
  RiotGameFight: undefined;
  RiotGameBreeding: undefined;
  RiotGameMemories: undefined;
  RiotGameMarketplace: undefined;
  RiotGameLeaderboard: undefined;
  RiotGameInventory: undefined;
  RiotGameRarity: undefined;

  Staking: undefined;
  Swap: undefined;
  ComingSoon: undefined;
};

export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type ScreenFC<T extends keyof RootStackParamList> = React.FC<{
  navigation: NativeStackNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
}>;

export const useAppNavigation = () => useNavigation<AppNavigationProp>();

const navConfig: {
  screens: { [Name in keyof RootStackParamList]: string };
} = {
  screens: {
    Home: "",
    MyCollection: "my-collection",
    Activity: "activity",
    Guardians: "guardians",
    WalletManager: "wallet-manager",
    WalletManagerWallets: "wallet-manager/wallets",
    WalletManagerChains: "wallet-manager/chains",
    Governance: "governance",
    UserPublicProfile: "user/:id",
    RiotersFooter: "rioters-footer",
    // === RiotGame
    RiotGame: "riot-game",
    RiotGameEnroll: "riot-game/enroll",
    RiotGameFight: "riot-game/fight",
    RiotGameBreeding: "riot-game/breeding",
    RiotGameMemories: "riot-game/memories",
    RiotGameMarketplace: "riot-game/marketplace",
    RiotGameLeaderboard: "riot-game/leaderboard",
    RiotGameInventory: "riot-game/inventory",
    RiotGameRarity: "riot-game/rarity",

    // ==== Launchpad
    Launchpad: "launchpad",
    LaunchpadApply: "launchpad/apply",
    // Mint NFT collection
    MintCollection: "collection/:id/mint",
    // ==== Teritori Name Service
    TNSHome: "tns/:modal?",
    // ==== Marketplace
    Marketplace: "marketplace",
    Collection: "collection/:id",
    CollectionTools: "collection/:id/tools",
    CollectionActivity: "collection/:id/activity",
    NFTDetail: "nft/:id",
    // ==== Staking
    Staking: "staking",
    Swap: "swap",
    // ==== ComingSoon
    ComingSoon: "coming-soon",
  },
};

export const linking = {
  prefixes: [],
  config: navConfig,
};
