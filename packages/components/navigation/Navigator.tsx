import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Platform } from "react-native";

import { Sidebar } from "./Sidebar";
import { ComingSoonScreen } from "../../screens/ComingSoon/ComingSoon";
import { CoreDAOScreen } from "../../screens/CoreDAO/CoreDAOScreen";
import { DAppStoreScreen } from "../../screens/DAppStore/DAppStoreScreen";
import { ToriPunks } from "../../screens/DAppStore/apps/toripunks/HomeScreen";
import { FeedScreen } from "../../screens/Feed/FeedScreen";
import { FeedNewArticleScreen } from "../../screens/FeedNewArticle/FeedNewArticleScreen";
import { FeedPostViewScreen } from "../../screens/FeedPostView/FeedPostViewScreen";
import { GovernanceScreen } from "../../screens/Governance/GovernanceScreen";
import { GuardiansScreen } from "../../screens/Guardians/GuardiansScreen";
import { HashtagFeedScreen } from "../../screens/HashtagFeed/HashtagFeedScreen";
import { HomeScreen } from "../../screens/Home/HomeScreen";
import { LaunchpadApplyScreen } from "../../screens/Launchpad/LaunchpadApplyScreen";
import { LaunchpadScreen } from "../../screens/Launchpad/LaunchpadScreen";
import { MintCollectionScreen } from "../../screens/Launchpad/MintCollectionScreen";
import { CollectionScreen } from "../../screens/Marketplace/CollectionScreen";
import { CollectionToolsScreen } from "../../screens/Marketplace/CollectionToolsScreen";
import { MarketplaceScreen } from "../../screens/Marketplace/MarketplaceScreen";
import { NFTDetailScreen } from "../../screens/Marketplace/NFTDetailScreen";
import { MessageScreen } from "../../screens/Message/MessageScreen";
import { AddFriend } from "../../screens/Message/components/AddFriend";
import { ChatSection } from "../../screens/Message/components/ChatSection";
import { FriendshipManager } from "../../screens/Message/components/FriendshipManager";
import { MyCollectionScreen } from "../../screens/MyCollection/MyCollectionScreen";
import { OrganizationDeployerScreen } from "../../screens/Organizations/OrganizationDeployerScreen";
import { OrganizationsScreen } from "../../screens/Organizations/OrganizationsScreen";
import { RiotGameBreedingScreen } from "../../screens/RiotGame/RiotGameBreedingScreen";
import { RiotGameEnrollScreen } from "../../screens/RiotGame/RiotGameEnrollScreen";
import { RiotGameFightScreen } from "../../screens/RiotGame/RiotGameFightScreen";
import { RiotGameInventoryScreen } from "../../screens/RiotGame/RiotGameInventoryScreen";
import { RiotGameLeaderboardScreen } from "../../screens/RiotGame/RiotGameLeaderboardScreen";
import { RiotGameMarketplaceScreen } from "../../screens/RiotGame/RiotGameMarketplaceScreen";
import { RiotGameMemoriesScreen } from "../../screens/RiotGame/RiotGameMemoriesScreen";
import { RiotGameScreen } from "../../screens/RiotGame/RiotGameScreen.web";
import { RiotersFooterScreen } from "../../screens/RiotersFooter/RiotersFooterScreen";
import { SettingsScreen } from "../../screens/Settings/SettingsScreen";
import { StakeScreen } from "../../screens/Stake";
import { SwapScreen } from "../../screens/Swap/SwapScreen";
import { TNSHomeScreen } from "../../screens/TeritoriNameService/TNSHomeScreen";
import { UserPublicProfileScreen } from "../../screens/UserPublicProfile/UserPublicProfileScreen";
import { WalletManagerScreen } from "../../screens/WalletManager/WalletManagerScreen";
import { WalletManagerWalletsScreen } from "../../screens/WalletManager/WalletsScreen";
import { RootStackParamList } from "../../utils/navigation";
import { neutral00 } from "../../utils/style/colors";
import { fullSidebarWidth } from "../../utils/style/layout";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

const screenTitle = (title: string) => "Teritori - " + title;

export const Navigator: React.FC = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) =>
        Platform.OS === "web" ? null : <Sidebar {...props} expanded />
      }
      screenOptions={{
        drawerStyle: {
          backgroundColor: neutral00,
          width: fullSidebarWidth,
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ header: () => null, title: screenTitle("Home") }}
      />
      <Stack.Screen
        name="Message"
        component={MessageScreen}
        options={{ header: () => null, title: screenTitle("Message") }}
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
        options={{
          header: () => null,
          title: screenTitle("NFT Marketplace - Popular Collections"),
        }}
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
        name="RiotGameEnroll"
        component={RiotGameEnrollScreen}
        options={{
          header: () => null,
          title: screenTitle("Riot Game Enroll"),
        }}
      />
      <Stack.Screen
        name="RiotGameFight"
        component={RiotGameFightScreen}
        options={{
          header: () => null,
          title: screenTitle("Riot Game Fight"),
        }}
      />
      <Stack.Screen
        name="RiotGameBreeding"
        component={RiotGameBreedingScreen}
        options={{
          header: () => null,
          title: screenTitle("Riot Game Breeding"),
        }}
      />
      <Stack.Screen
        name="RiotGameMarketplace"
        component={RiotGameMarketplaceScreen}
        options={{
          header: () => null,
          title: screenTitle("Riot Game Marketplace"),
        }}
      />
      <Stack.Screen
        name="ChatSection"
        component={ChatSection}
        options={{
          header: () => null,
          title: screenTitle("Chat Message"),
        }}
      />
      <Stack.Screen
        name="AddFriend"
        component={AddFriend}
        options={{
          header: () => null,
          title: screenTitle("Add Friend"),
        }}
      />
      <Stack.Screen
        name="FriendshipManager"
        component={FriendshipManager}
        options={{
          header: () => null,
          title: screenTitle("Friends Add"),
        }}
      />
      <Stack.Screen
        name="RiotGameMemories"
        component={RiotGameMemoriesScreen}
        options={{
          header: () => null,
          title: screenTitle("Riot Game Memories"),
        }}
      />
      <Stack.Screen
        name="RiotGameLeaderboard"
        component={RiotGameLeaderboardScreen}
        options={{
          header: () => null,
          title: screenTitle("Riot Game Leaderboard"),
        }}
      />
      <Stack.Screen
        name="RiotGameInventory"
        component={RiotGameInventoryScreen}
        options={{
          header: () => null,
          title: screenTitle("Riot Game Inventory"),
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
        options={{
          header: () => null,
          title: screenTitle("Mint Collection"),
        }}
      />

      {/* ==== Organization */}

      <Stack.Screen
        name="OrganizationDeployer"
        component={OrganizationDeployerScreen}
        options={{
          header: () => null,
          title: screenTitle("Organization Deployer"),
        }}
      />
      <Stack.Screen
        name="Organizations"
        component={OrganizationsScreen}
        options={{
          header: () => null,
          title: screenTitle("Organizations"),
        }}
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
        name="NFTDetail"
        component={NFTDetailScreen}
        options={{ header: () => null, title: screenTitle("NFT") }}
      />
      <Stack.Screen
        name="Staking"
        component={StakeScreen}
        options={{ header: () => null, title: screenTitle("Staking") }}
      />
      {/* ==== Swap*/}
      <Stack.Screen
        name="Swap"
        component={SwapScreen}
        options={{ header: () => null, title: screenTitle("Swap") }}
      />
      <Stack.Screen
        name="ComingSoon"
        component={ComingSoonScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="CollectionTools"
        component={CollectionToolsScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="FeedNewArticle"
        component={FeedNewArticleScreen}
        options={{ header: () => null, title: screenTitle("New Article") }}
      />

      <Stack.Screen
        name="FeedPostView"
        component={FeedPostViewScreen}
        options={{ header: () => null, title: "Teritori" }}
      />
      <Stack.Screen
        name="Feed"
        component={FeedScreen}
        options={{ header: () => null, title: screenTitle("Feed") }}
      />
      <Stack.Screen
        name="HashtagFeed"
        component={HashtagFeedScreen}
        options={{ header: () => null, title: screenTitle("") }}
      />
      <Stack.Screen
        name="ToriPunks"
        component={ToriPunks}
        options={{ header: () => null, title: screenTitle("ToriPunks") }}
      />
      <Stack.Screen
        name="DAppStore"
        component={DAppStoreScreen}
        options={{ header: () => null, title: screenTitle("dApp Store") }}
      />
      <Stack.Screen
        name="CoreDAO"
        component={CoreDAOScreen}
        options={{ header: () => null, title: screenTitle("Core DAO") }}
      />
    </Drawer.Navigator>
  );
};
