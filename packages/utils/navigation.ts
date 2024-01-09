import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";

import { feedsTabItems } from "./social-feed";
import { Conversation, MessageFriendsTabItem } from "./types/message";
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

  Launchpad: undefined;
  LaunchpadApply: undefined;
  MintCollection: { id: string };
  TNSHome: { modal: string; name?: string } | undefined;

  Marketplace: undefined;
  Collection: { id: string };
  CollectionTools: { id: string };
  NFTDetail: { id: string; openBuy?: boolean };
  Feed?: { tab: keyof typeof feedsTabItems; network?: string };
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
  Staking: { multisigId?: string; daoId?: string } | undefined;

  ComingSoon: undefined;

  OrganizationGetStarted: undefined;

  Multisig: undefined;
  MultisigCreate: undefined;
  MultisigWalletDashboard: { id: string };

  Settings: undefined;

  OrganizationDeployer: undefined;
  Organizations?: { network?: string };
  CoreDAO: undefined;

  DAppStore: undefined;
  ToriPunks: { route: string };

  Metrics: undefined;
  Message: { view: string; tab?: string } | undefined;
  ChatSection: Conversation;
  FriendshipManager: { tab?: MessageFriendsTabItem } | undefined;

  // native wallet screens
  NativeWallet: undefined;
  ViewSeed: undefined;
  ImportWallet: undefined;
  CreatePassword: undefined;
  SuccessScreen: undefined;

  //Mini Screens
  MiniTabs: undefined;
  Conversation: { conversationId: string };
  MiniChats: undefined;
  MiniWallets: undefined;
  MiniFeeds: undefined;
  MiniProfile: undefined;
  MiniDAppStore: undefined;
  MiniNewConversation: undefined;
  MiniNewGroup: undefined;
  MiniChatSetting: undefined;
  MiniSettings: undefined;
  MiniAccountDetails: { accountName: string; id: string };
  MiniAddAccount: undefined;
  Notifications: undefined;
  AddressBook: undefined;
  AddAddressBook: undefined;
  EditAddressBook: { addressId: string };
  MiniSecurityAndPrivacy: undefined;
  MiniChangePassword: undefined;
  MiniRevealSeedPhrase: undefined;
  MiniExportPrivateKey: undefined;
  MiniResetWallet: undefined;
  ChangeNetwork: undefined;
};

export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type ScreenFC<T extends keyof RootStackParamList> = React.FC<{
  navigation: NativeStackNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
}>;

export type AppRouteType<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;

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
    Feed: "feed/:tab?",
    FeedNewArticle: "feed/new",
    FeedPostView: "feed/post/:id",
    HashtagFeed: "feed/tag/:hashtag",

    // ==== Staking
    Staking: "staking",

    // === Organizations
    OrganizationDeployer: "create-org",
    Organizations: "orgs",
    CoreDAO: "core-dao",

    // === Organization

    OrganizationGetStarted: "organization-get-started",

    // === Multisig
    Multisig: "multisig",
    MultisigCreate: "multisig/create",
    MultisigWalletDashboard: "multisig/:id",

    // ==== Swap
    Swap: "swap",
    // ==== ComingSoon
    ComingSoon: "coming-soon",
    Settings: "settings",
    // ==== DAppStore
    DAppStore: "dapp-store",
    // === DApps
    ToriPunks: "dapp/tori-punks/:route?",
    // === Metrics
    Metrics: "stats",

    // ==== Message
    Message: "message/:view?",
    ChatSection: "message/chat",
    FriendshipManager: "/friends",

    // ==== Native Wallet
    NativeWallet: "native-wallet",
    ViewSeed: "native-wallet/view-seed",
    ImportWallet: "native-wallet/import",
    CreatePassword: "native-wallet/create-password",
    SuccessScreen: "native-wallet/success",

    // ==== Mini nav
    MiniTabs: "mini-tabs",
    MiniChats: "mini-chat",
    MiniWallets: "mini-wallet",
    MiniFeeds: "mini-feed",
    Conversation: "mini-conversation",
    MiniProfile: "mini-profile",
    MiniDAppStore: "mini-dApp-store",
    MiniNewConversation: "mini-new-conversation",
    MiniNewGroup: "mini-new-group",
    MiniChatSetting: "mini-chat-setting",
    MiniSettings: "mini-settings",
    MiniAccountDetails: "mini-account-details",
    MiniAddAccount: "mini-add-account",
    Notifications: "notifications",
    AddressBook: "address-book",
    AddAddressBook: "add-address-book",
    EditAddressBook: "edit-address-book/:addressId",
    MiniSecurityAndPrivacy: "mini-security-and-privacy",
    MiniChangePassword: "mini-change-password",
    MiniRevealSeedPhrase: "mini-reveal-seed-phrase",
    MiniExportPrivateKey: "mini-export-private-key",
    MiniResetWallet: "mini-reset-wallet",
    ChangeNetwork: "change-network",
  },
};

export const linking = {
  prefixes: [],
  config: navConfig,
};

export const useAppRoute = () => useRoute<RouteProp<RootStackParamList>>();
