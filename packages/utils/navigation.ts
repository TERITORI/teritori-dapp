import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useMemo } from "react";

import { useFeedbacks } from "./../context/FeedbacksProvider";
import { useSelectedNetwork } from "./../hooks/useSelectedNetwork";
import { Network } from "./network";

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

  ComingSoon: undefined;
};

export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type ScreenFC<T extends keyof RootStackParamList> = React.FC<{
  navigation: NativeStackNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
}>;

export const useAppNavigation = () => {
  const route = useRoute();
  const selectedNetwork = useSelectedNetwork();
  const { setToastError } = useFeedbacks();

  // Supported Screen on ETH
  const ethSupportedScreens = useMemo<string[]>(
    () => [
      "Home",
      "MyCollection",
      "Activity",
      "Guardians",
      "WalletManager",
      "WalletManagerWallets",
      "WalletManagerChains",
      "UserPublicProfile",

      // ==== Launchpad
      "Launchpad",
      "LaunchpadApply",

      // Mint NFT collection
      "MintCollection",

      // ==== Marketplace
      "Marketplace",
      "Collection",
      "CollectionTools",
      "CollectionActivity",
      "NFTDetail",

      // ==== ComingSoon
      "ComingSoon",
    ],
    []
  );

  useEffect(() => {
    if (
      selectedNetwork === Network.Ethereum &&
      !ethSupportedScreens.includes(route.name)
    ) {
      return setToastError({
        title: "Warning",
        message: "This feature is not supported yet on Ethereum network",
      });
    }

    // NOTE: when changing network, sometime network has been changed before route.name
    // user has not been redirected to allowed route yet so we could be in a state where wrong toast is displayed
    // so we need to clear toast once the we are in the right screen
    setToastError({ title: "", message: "", duration: 0 });
  }, [route.name, selectedNetwork]);

  return useNavigation<AppNavigationProp>();
};

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
    // ==== ComingSoon
    ComingSoon: "coming-soon",
  },
};

export const linking = {
  prefixes: [],
  config: navConfig,
};
