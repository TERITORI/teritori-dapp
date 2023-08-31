import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";

import { NewPostFormValues } from "../components/socialFeed/NewsFeed/NewsFeed.type";

export type RouteName = keyof RootStackParamList;

export type RootStackParamList = {
  Home?: { network?: string };
  MyCollection: undefined;
  Activity: undefined;
  Guardians: undefined;
  WalletManager: undefined;
  WalletManagerWallets: undefined;
  WalletManagerChains: undefined;
  Governance: undefined;
  UserPublicProfile: { id: string };
  RiotersFooter: undefined;
  Pathwar: undefined;
  Resources: undefined;
  Tournaments: undefined;
  Statistics: undefined;

  Launchpad: undefined;
  LaunchpadApply: undefined;
  MintCollection: { id: string };
  TNSHome: { modal: string; name?: string } | undefined;

  Marketplace: undefined;
  Collection: { id: string };
  CollectionTools: { id: string };
  NFTDetail: { id: string; openBuy?: boolean };
  Feed?: { network?: string };
  FeedNewArticle:
    | (NewPostFormValues & {
        additionalMention?: string;
        additionalHashtag?: string;
      })
    | undefined;
  FeedPostView: { id: string };
  HashtagFeed: { hashtag: string };

  RiotGame: undefined;
  RiotGameEnroll: undefined;
  RiotGameFight: undefined;
  RiotGameBreeding: undefined;
  RiotGameMemories: undefined;
  RiotGameMarketplace: { collectionId?: string } | undefined;
  RiotGameLeaderboard: undefined;
  RiotGameInventory: undefined;

  Swap: undefined;
  Staking: undefined;

  ComingSoon: undefined;

  Settings: undefined;

  OrganizationDeployer: undefined;
  Organizations?: { network?: string };
  CoreDAO: undefined;

  DAppStore: undefined;
  ToriPunks: { route: string };
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

    // === Pathwar
    Pathwar: "pathwar",
    Resources: "pathwar/resources",
    Tournaments: "pathwar/tournaments",
    Statistics: "pathwar/statistics",
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
    NFTDetail: "nft/:id",
    Feed: "feed",
    FeedNewArticle: "feed/new",
    FeedPostView: "feed/post/:id",
    HashtagFeed: "feed/tag/:hashtag",

    // ==== Staking
    Staking: "staking",

    // === Organizations
    OrganizationDeployer: "create-org",
    Organizations: "orgs",
    CoreDAO: "core-dao",

    // ==== Swap
    Swap: "swap",
    // ==== ComingSoon
    ComingSoon: "coming-soon",
    Settings: "settings",
    // ==== DAppStore
    DAppStore: "dapp-store",
    // === DApps
    ToriPunks: "dapp/tori-punks/:route?",
  },
};

export const linking = {
  prefixes: [],
  config: navConfig,
};

export const useAppRoute = () => useRoute<RouteProp<RootStackParamList>>();
