import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";

import { feedsTabItems } from "./social-feed";
import { AppMode } from "./types/app-mode";
import { NewPostFormValues } from "./types/feed";
import { MessageFriendsTabItem } from "./types/message";
import { uppTabItems } from "./upp";
export type RouteName = keyof RootStackParamList;

type MiniTabsScreen = {
  screen?: "MiniChats" | "MiniWallets" | "MiniFeeds";
};

export type RootStackParamList = {
  Home?: { network?: string };
  RedirectHome?: undefined;
  MyCollection: undefined;
  Activity: undefined;
  Guardians: undefined;
  WalletManager: undefined;
  WalletManagerWallets: undefined;
  WalletManagerChains: undefined;
  Governance: undefined;
  UserPublicProfile: {
    id: string;
    tab?: keyof typeof uppTabItems;
  };
  GovernanceProposal: {
    id: string;
  };

  Launchpad: undefined;
  LaunchpadApply: undefined;

  LaunchpadERC20: undefined;
  LaunchpadERC20Tokens?: { network?: string };
  LaunchpadERC20CreateToken: { step?: number };
  LaunchpadERC20Airdrops?: { network?: string };
  LaunchpadERC20CreateAirdrop: { step?: number };
  LaunchpadERC20Sales?: { network?: string };
  LaunchpadERC20CreateSale: { step?: number };

  MintCollection: { id: string };
  TNSHome: { modal: string; name?: string } | undefined;

  Marketplace: undefined;
  MarketplaceLeaderboard: undefined;
  Collection: { id: string };
  CollectionTools: { id: string };
  NFTDetail: { id: string; openBuy?: boolean };
  Feed?: {
    tab: keyof typeof feedsTabItems;
    network?: string;
    post?: string;
  };
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
  RiotGameBridge: undefined;
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

  Projects?: { network?: string };
  ProjectsManager: { view?: string };
  ProjectsPayment: { projectId: string; milestoneId: string };
  ProjectsCompleteMilestone: { projectId: string; milestoneId: string };
  ProjectsMakeRequest: { step?: number };
  ProjectsDetail: { id: string };
  ProjectsConflictSolving: { projectId: string };

  OrganizationDeployer: undefined;
  Organizations?: { network?: string };
  CoreDAO: undefined;

  DAppStore: undefined;
  ToriPunks: { route: string };

  Metrics: undefined;
  Message: { view: string; tab?: string } | undefined;
  ChatSection: { id: string };
  FriendshipManager: { tab?: MessageFriendsTabItem } | undefined;

  // native wallet screens
  NativeWallet: undefined;
  ViewSeed: undefined;
  ImportWallet: undefined;
  CreatePassword: undefined;
  CreatePasswordWallet: undefined;
  SuccessScreen: undefined;

  //Mini Screens
  MiniTabs: MiniTabsScreen;
  Conversation: { conversationId: string };
  MiniChats: { back?: RouteName };
  MiniWallets: undefined;
  MiniFeeds: undefined;
  MiniCreatePost: undefined;
  MiniProfile: undefined;
  MiniProfileDetail: undefined;
  MiniDAppStore: undefined;
  MiniNewConversation: undefined;
  MiniFriend: { activeTab?: "friends" | "requests" };
  MiniAddFriend: undefined;
  MiniNewGroup: undefined;
  MiniChatSetting: { back?: RouteName };
  MiniPreferencesSetting: { back?: RouteName };
  MiniSettings: undefined;
  MiniAccountDetails: { accountName: string; id: string };
  MiniAddAccount: undefined;
  Notifications: undefined;
  AddressBook: { back?: RouteName };
  AddAddressBook: { back?: RouteName };
  EditAddressBook: { addressId: string; back?: RouteName };
  MiniSecurityAndPrivacy: undefined;
  MiniChangePassword: undefined;
  MiniFaceLogin: undefined;
  MiniRevealSeedPhrase: undefined;
  MiniExportPrivateKey: undefined;
  MiniResetWallet: undefined;
  ChangeNetwork: undefined;
  About: undefined;
  MiniManageTokens: undefined;
  MiniAddCustomToken: undefined;
  MiniSelectToken: { navigateTo: RouteName };
  MiniDepositTORI: { back?: RouteName; denom: string };
  ModeSelection: undefined;
  ChatActivation: { appMode: AppMode };
  MiniSendTori: { back?: RouteName; denom: string };
  MiniSendingTori: {
    back?: RouteName;
    amount: string;
    denom: string;
    address: string;
  };
  MiniTransactionDetail: { type: string; transactionId: string };
  ConnectLedger: undefined;
  CreateWallet: undefined;
  MiniChatProfile: undefined;
  MiniChatCreateAccount: undefined;
  MiniGroupActions: { conversationId: string };
  BurnCapital: { network?: string };
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

type NavConfig = {
  screens: { [Name in keyof RootStackParamList]: string };
};

const getNavConfig: (homeScreen: keyof RootStackParamList) => NavConfig = (
  homeScreen,
) => {
  const navConfig: NavConfig = {
    screens: {
      MyCollection: "my-collection",
      Activity: "activity",
      Guardians: "guardians",
      WalletManager: "wallet-manager",
      WalletManagerWallets: "wallet-manager/wallets",
      WalletManagerChains: "wallet-manager/chains",
      Governance: "governance",
      GovernanceProposal: "governance/:id",
      UserPublicProfile: "user/:id/:tab?",

      // === RiotGame
      RiotGame: "riot-game",
      RiotGameEnroll: "riot-game/enroll",
      RiotGameFight: "riot-game/fight",
      RiotGameBreeding: "riot-game/breeding",
      RiotGameMemories: "riot-game/memories",
      RiotGameBridge: "riot-game/bridge",
      RiotGameMarketplace: "riot-game/marketplace",
      RiotGameLeaderboard: "riot-game/leaderboard",
      RiotGameInventory: "riot-game/inventory",

      // ==== Launchpad
      Launchpad: "launchpad",
      LaunchpadApply: "launchpad/apply",

      // ==== Launchpad ERC20
      LaunchpadERC20: "launchpad-erc20",
      LaunchpadERC20Tokens: "launchpad-erc20/tokens",
      LaunchpadERC20CreateToken: "launchpad-erc20/create-token",
      LaunchpadERC20Airdrops: "launchpad-erc20/airdrops",
      LaunchpadERC20CreateAirdrop: "launchpad-erc20/create-airdrop",
      LaunchpadERC20Sales: "launchpad-erc20/sales",
      LaunchpadERC20CreateSale: "launchpad-erc20/create-sale",

      // Mint NFT collection
      MintCollection: "collection/:id/mint",
      // ==== Teritori Name Service
      TNSHome: "tns/:modal?",

      // ==== Marketplace
      Marketplace: "marketplace",
      MarketplaceLeaderboard: "marketplace/leaderboard",
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

      // === Projects Program
      Projects: "projects",
      ProjectsPayment: "projects/payment",
      ProjectsCompleteMilestone:
        "projects/completeMilestone/:projectId/:milestoneId",
      ProjectsManager: "projects/manager/:view",
      ProjectsMakeRequest: "projects/make-request",
      ProjectsDetail: "projects/:id",
      ProjectsConflictSolving: "projects/:projectId/conflicts",
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
      CreatePasswordWallet: "native-wallet/create-password-wallet",
      SuccessScreen: "native-wallet/success",

      // ==== Mini nav
      MiniTabs: "mini-tabs",
      MiniChats: "mini-chat",
      MiniWallets: "mini-wallet",
      MiniFeeds: "mini-feed",
      MiniCreatePost: "mini-create-post",
      Conversation: "mini-conversation",
      MiniProfile: "mini-profile",
      MiniProfileDetail: "mini-profile-detail",
      MiniDAppStore: "mini-dApp-store",
      MiniNewConversation: "mini-new-conversation",
      MiniFriend: "mini-friend",
      MiniAddFriend: "mini-add-friend",
      MiniNewGroup: "mini-new-group",
      MiniChatSetting: "mini-chat-setting",
      MiniPreferencesSetting: "mini-preferences-setting",
      MiniChatCreateAccount: "mini-chat-create-account",
      MiniSettings: "mini-settings",
      MiniAccountDetails: "mini-account-details",
      MiniAddAccount: "mini-add-account",
      Notifications: "notifications",
      AddressBook: "address-book",
      AddAddressBook: "add-address-book",
      EditAddressBook: "edit-address-book/:addressId",
      MiniSecurityAndPrivacy: "mini-security-and-privacy",
      MiniChangePassword: "mini-change-password",
      MiniFaceLogin: "mini-face-login",
      MiniRevealSeedPhrase: "mini-reveal-seed-phrase",
      MiniExportPrivateKey: "mini-export-private-key",
      MiniResetWallet: "mini-reset-wallet",
      ChangeNetwork: "change-network",
      About: "about",
      MiniManageTokens: "mini-manage-tokens",
      MiniAddCustomToken: "mini-add-custom-token",
      MiniSelectToken: "mini-select-token",
      MiniDepositTORI: "mini-deposit-tori",
      ModeSelection: "mode-selection",
      ChatActivation: "chat-activation",
      MiniSendTori: "mini-send-tori",
      MiniSendingTori: "mini-sending-tori",
      MiniTransactionDetail: "mini-transaction-detail",
      ConnectLedger: "connect-ledger",
      CreateWallet: "create-wallet",
      MiniChatProfile: "mini-chat-profile",
      MiniGroupActions: "mini-group-actions",
      BurnCapital: "burn-capital",
    },
  };
  if (homeScreen === "Home") {
    navConfig.screens["Home"] = "";
  }
  return navConfig;
};

export const getLinking = (homeScreen: keyof RootStackParamList) => ({
  prefixes: [],
  config: getNavConfig(homeScreen),
});
