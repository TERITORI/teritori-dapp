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
  FreelanceServices: undefined;
  GraphicsAndDesign: undefined;
  LogoDesign: undefined;
  LogoDesignDetails: { title: string };
  SellerDetails: undefined;

  Launchpad: undefined;
  MintCollection: { id: string };
  TNSHome: { modal: string; name?: string } | undefined;

  Marketplace: undefined;
  Collection: { id: string };
  CollectionActivity: { id: string };
  NFTDetail: { id: string };

  Staking: undefined;

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
    FreelanceServices: "freelance-services",
    MyCollection: "my-collection",
    GraphicsAndDesign: "graphics-and-design",
    SellerDetails: "seller-details",
    LogoDesign: "logo-design",
    LogoDesignDetails: "logo-design-details",
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
    // Mint NFT collection
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
    // ==== ComingSoon
    ComingSoon: "coming-soon",
  },
};

export const linking = {
  prefixes: [],
  config: navConfig,
};
