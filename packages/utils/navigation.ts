import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";

export type RootStackParamList = {
  Home: undefined;
  MyCollection: undefined;
  Activity: undefined;
  Guardians: undefined;
  GuardiansGame: undefined;
  Wallets: undefined;
  WalletManager: undefined;
  WalletManagerWallets: undefined;
  WalletManagerChains: undefined;
  Governance: undefined;
  UserPublicProfile: { id: string };
  RiotersFooter: undefined;

  Launchpad: undefined;
  MintCollection: { id: string };

  TNSHome: undefined;
  TNSExplore: undefined;
  TNSManage: undefined;
  TNSRegister: undefined;
  TNSConsultName: { name: string };
  TNSMintName: { name: string };
  TNSUpdateName: { name: string };
  TNSBurnName: { name: string };
  TNSMintPath: { name: string };

  Marketplace: undefined;
  Collection: { id: string };
  CollectionActivity: { id: string };
  NFTDetail: { id: string };

  Staking: undefined;

  FindAJob: undefined;

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
    FindAJob: "find-a-job",
    MyCollection: "my-collection",
    Activity: "activity",
    Guardians: "guardians",
    Wallets: "wallets",
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
    TNSHome: "tns",
    TNSExplore: "tns/explore",
    TNSManage: "tns/manage",
    TNSRegister: "tns/register",
    // Consult token
    TNSConsultName: "tns/token/:name",
    // Do things on token (Necessary minted and owned by the user)
    TNSMintName: "tns/tokens/:name/mint",
    TNSUpdateName: "tns/tokens/:name/update",
    TNSBurnName: "tns/tokens/:name/burn",
    TNSMintPath: "tns/tokens/:name/mint-path",
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
