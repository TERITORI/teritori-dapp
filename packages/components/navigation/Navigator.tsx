import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { ComingSoonScreen } from "../../screens/ComingSoon/ComingSoon";
import { GovernanceScreen } from "../../screens/Governance/GovernanceScreen";
import { GuardiansScreen } from "../../screens/Guardians/GuardiansScreen";
import { HomeScreen } from "../../screens/Home/HomeScreen";
import { LaunchpadApplyScreen } from "../../screens/Launchpad/LaunchpadApplyScreen";
import { LaunchpadScreen } from "../../screens/Launchpad/LaunchpadScreen";
import { MintCollectionScreen } from "../../screens/Launchpad/MintCollectionScreen";
import { CollectionActivityScreen } from "../../screens/Marketplace/CollectionActivityScreen";
import { CollectionScreen } from "../../screens/Marketplace/CollectionScreen";
import { MarketplaceScreen } from "../../screens/Marketplace/MarketplaceScreen";
import { NFTDetailScreen } from "../../screens/Marketplace/NFTDetailScreen";
import { MyCollectionScreen } from "../../screens/MyCollection/MyCollectionScreen";
import { RiotGameBreedingScreen } from "../../screens/RiotGame/RiotGameBreedingScreen";
import { RiotGameEnrollScreen } from "../../screens/RiotGame/RiotGameEnrollScreen";
import { RiotGameFightScreen } from "../../screens/RiotGame/RiotGameFightScreen";
import { RiotGameInventoryScreen } from "../../screens/RiotGame/RiotGameInventoryScreen";
import { RiotGameLeaderboardScreen } from "../../screens/RiotGame/RiotGameLeaderboardScreen";
import { RiotGameMarketplaceScreen } from "../../screens/RiotGame/RiotGameMarketplaceScreen";
import { RiotGameMemoriesScreen } from "../../screens/RiotGame/RiotGameMemoriesScreen";
import { RiotGameRarityScreen } from "../../screens/RiotGame/RiotGameRarityScreen";
import { RiotGameScreen } from "../../screens/RiotGame/RiotGameScreen.web";
import { GameScreen } from "../../screens/RiotGame/types";
import { RiotersFooterScreen } from "../../screens/RiotersFooter/RiotersFooterScreen";
import { StakeScreen } from "../../screens/Stake";
import { TNSHomeScreen } from "../../screens/TeritoriNameService/TNSHomeScreen";
import { UserPublicProfileScreen } from "../../screens/UserPublicProfile/UserPublicProfileScreen";
import { WalletManagerScreen } from "../../screens/WalletManager/WalletManagerScreen";
import { WalletManagerWalletsScreen } from "../../screens/WalletManager/WalletsScreen";
import { RootStackParamList } from "../../utils/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();
const screenTitle = (title: string) => "Teritori - " + title;

export const Navigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ header: () => null, title: screenTitle("Home") }}
      />
      <Stack.Screen
        name="MyCollection"
        component={MyCollectionScreen}
        options={{ header: () => null, title: screenTitle("My Collection") }}
      />
      <Stack.Screen
        name="Guardians"
        component={GuardiansScreen}
        options={{ header: () => null, title: screenTitle("Guardians") }}
      />
      <Stack.Screen
        name="RiotGame"
        component={RiotGameScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="Marketplace"
        component={MarketplaceScreen}
        options={{ header: () => null, title: screenTitle("Marketplace") }}
      />
      <Stack.Screen
        name="Governance"
        component={GovernanceScreen}
        options={{ header: () => null, title: screenTitle("Governance") }}
      />
      <Stack.Screen
        name="UserPublicProfile"
        component={UserPublicProfileScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="RiotersFooter"
        component={RiotersFooterScreen}
        options={{ header: () => null, title: screenTitle("Rioters Footer") }}
      />

      {/* === Riot Game */}
      <Stack.Screen
        name={GameScreen.RiotGameEnroll}
        component={RiotGameEnrollScreen}
        options={{ header: () => null, title: screenTitle("Riot Game Enroll") }}
      />
      <Stack.Screen
        name={GameScreen.RiotGameFight}
        component={RiotGameFightScreen}
        options={{
          header: () => null,
          title: screenTitle("Riot Game Fight"),
        }}
      />
      <Stack.Screen
        name={GameScreen.RiotGameBreeding}
        component={RiotGameBreedingScreen}
        options={{
          header: () => null,
          title: screenTitle("Riot Game Breeding"),
        }}
      />
      <Stack.Screen
        name={GameScreen.RiotGameMarketplace}
        component={RiotGameMarketplaceScreen}
        options={{
          header: () => null,
          title: screenTitle("Riot Game Marketplace"),
        }}
      />
      <Stack.Screen
        name={GameScreen.RiotGameMemories}
        component={RiotGameMemoriesScreen}
        options={{
          header: () => null,
          title: screenTitle("Riot Game Memories"),
        }}
      />
      <Stack.Screen
        name={GameScreen.RiotGameLeaderboard}
        component={RiotGameLeaderboardScreen}
        options={{
          header: () => null,
          title: screenTitle("Riot Game Leaderboard"),
        }}
      />
      <Stack.Screen
        name={GameScreen.RiotGameInventory}
        component={RiotGameInventoryScreen}
        options={{
          header: () => null,
          title: screenTitle("Riot Game Inventory"),
        }}
      />
      <Stack.Screen
        name={GameScreen.RiotGameRarity}
        component={RiotGameRarityScreen}
        options={{
          header: () => null,
          title: screenTitle("Riot Game Rarity"),
        }}
      />

      {/* ==== Wallet Manager */}
      <Stack.Screen
        name="WalletManager"
        component={WalletManagerScreen}
        options={{ header: () => null, title: screenTitle("Wallet Manager") }}
      />
      <Stack.Screen
        name="WalletManagerWallets"
        component={WalletManagerWalletsScreen}
        options={{
          header: () => null,
          title: screenTitle("Wallet Manager (Wallets)"),
        }}
      />
      <Stack.Screen
        name="WalletManagerChains"
        component={WalletManagerWalletsScreen}
        options={{
          header: () => null,
          title: screenTitle("Wallet Manager (Chains)"),
        }}
      />
      {/* ==== Launchpad */}
      <Stack.Screen
        name="Launchpad"
        component={LaunchpadScreen}
        options={{ header: () => null, title: screenTitle("Launchpad") }}
      />
      <Stack.Screen
        name="LaunchpadApply"
        component={LaunchpadApplyScreen}
        options={{
          header: () => null,
          title: screenTitle("Launchpad (Apply)"),
        }}
      />
      <Stack.Screen
        name="MintCollection"
        component={MintCollectionScreen}
        options={{ header: () => null, title: screenTitle("Mint Collection") }}
      />

      {/* ==== Teritori Name Service*/}
      <Stack.Screen
        name="TNSHome"
        component={TNSHomeScreen}
        options={{ header: () => null, title: screenTitle("Name Service") }}
      />
      <Stack.Screen
        name="Collection"
        component={CollectionScreen}
        options={{ header: () => null, title: screenTitle("Collection") }}
      />
      <Stack.Screen
        name="CollectionActivity"
        component={CollectionActivityScreen}
        options={{
          header: () => null,
          title: screenTitle("Collection Activity"),
        }}
      />
      <Stack.Screen
        name="NFTDetail"
        component={NFTDetailScreen}
        options={{ header: () => null, title: screenTitle("NFT") }}
      />
      <Stack.Screen
        name="Staking"
        component={StakeScreen}
        options={{ header: () => null, title: screenTitle("Staking") }}
      />
      <Stack.Screen
        name="ComingSoon"
        component={ComingSoonScreen}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
};
