import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";

export type RootStackParamList = {
  Home: undefined;
  MyCollection: undefined;
  Activity: undefined;
  Guardians: undefined;
  GuardiansGame: undefined;
  WalletManager: undefined;
  WalletManagerWallets: undefined;
  WalletManagerChains: undefined;
  Governance: undefined;
  UserPublicProfile: { id: string };
  RiotersFooter: undefined;

  Launchpad: undefined;
  MintCollection: { id: string };
  TNSHome: { modal: string; name?: string } | undefined;

  Marketplace: undefined;
  Collection: { id: string };
  CollectionActivity: { id: string };
  NFTDetail: { id: string; openBuy?: boolean };

  Staking: undefined;

  ComingSoon: undefined;

  OrganizationDeployer: undefined;
  OrganizationGetStarted: undefined;

  Multisig: undefined;
  MultisigCreate: undefined;
  MultisigWalletManage: undefined;
  MultisigWalletTransaction: undefined;
  MultisigLegacy: { address: string };
  MultisigTransfer: { address: string };
  MultisigDelegate: { address: string };

  MultisigTransactionProposal: { address: string };
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
    GuardiansGame: "guardians-game",
    Governance: "governance",
    UserPublicProfile: "user/:id",
    RiotersFooter: "rioters-footer",

    // ==== Launchpad
    Launchpad: "launchpad",

    // ==== Mint NFT collection
    MintCollection: "collection/:id/mint",

    // ==== Teritori Name Service
    TNSHome: "tns/:modal?",

    // ==== Marketplace
    Marketplace: "marketplace",
    Collection: "collection/:id",
    CollectionActivity: "collection/:id/activity",
    NFTDetail: "nft/:id",

    // ==== Staking
    Staking: "staking",
    // === Organization

    OrganizationDeployer: "organization-deployer",
    OrganizationGetStarted: "organization-get-started",

    // === Multisig
    Multisig: "multisig",
    MultisigCreate: "multisig/create",
    MultisigWalletManage: "multisig-wallet/manage",
    MultisigWalletTransaction: "multisig-wallet/transaction",
    MultisigTransactionProposal: "multisig/:address/transaction/proposals",
    MultisigLegacy: "multisig/:address",
    MultisigTransfer: "multisig/:address/transfer",
    MultisigDelegate: "multisig/:address/delegate",

    // ==== ComingSoon
    ComingSoon: "coming-soon",
  },
};

export const linking = {
  prefixes: [],
  config: navConfig,
};
