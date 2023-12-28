import { createDrawerNavigator } from "@react-navigation/drawer";
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
import { ChatSectionScreen } from "../../screens/Message/components/ChatSection";
import { FriendshipManagerScreen } from "../../screens/Message/components/FriendshipManager";
import { MetricsScreen } from "../../screens/Metrics/MetricsScreen";
import { MultisigCreateScreen } from "../../screens/Multisig/MultisigCreateScreen";
import { MultisigScreen } from "../../screens/Multisig/MultisigScreen";
import { MultisigWalletDashboardScreen } from "../../screens/Multisig/MultisigWalletDashboardScreen";
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
import { RiotGameScreen } from "../../screens/RiotGame/RiotGameScreen";
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

//const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<RootStackParamList>();
const screenTitle = (title: string) => "Teritori - " + title;

export const Navigator: React.FC = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={() => (Platform.OS === "web" ? null : <Sidebar />)}
      screenOptions={{
        drawerStyle: {
          backgroundColor: neutral00,
          width: fullSidebarWidth,
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ header: () => null, title: screenTitle("Home") }}
      />
      <Drawer.Screen
        name="MyCollection"
        component={MyCollectionScreen}
        options={{ header: () => null, title: screenTitle("My Collection") }}
      />
      <Drawer.Screen
        name="Guardians"
        component={GuardiansScreen}
        options={{ header: () => null, title: screenTitle("Guardians") }}
      />
      <Drawer.Screen
        name="RiotGame"
        component={RiotGameScreen}
        options={{ header: () => null }}
      />

      <Drawer.Screen
        name="Marketplace"
        component={MarketplaceScreen}
        options={{
          header: () => null,
          title: screenTitle("NFT Marketplace - Popular Collections"),
        }}
      />
      <Drawer.Screen
        name="Governance"
        component={GovernanceScreen}
        options={{ header: () => null, title: screenTitle("Governance") }}
      />
      <Drawer.Screen
        name="UserPublicProfile"
        component={UserPublicProfileScreen}
        options={{ header: () => null }}
      />
      <Drawer.Screen
        name="RiotersFooter"
        component={RiotersFooterScreen}
        options={{ header: () => null, title: screenTitle("Rioters Footer") }}
      />

      {/* === Riot Game */}
      <Drawer.Screen
        name="RiotGameEnroll"
        component={RiotGameEnrollScreen}
        options={{ header: () => null, title: screenTitle("Riot Game Enroll") }}
      />
      <Drawer.Screen
        name="RiotGameFight"
        component={RiotGameFightScreen}
        options={{
          header: () => null,
          title: screenTitle("Riot Game Fight"),
        }}
      />
      <Drawer.Screen
        name="RiotGameBreeding"
        component={RiotGameBreedingScreen}
        options={{
          header: () => null,
          title: screenTitle("Riot Game Breeding"),
        }}
      />
      <Drawer.Screen
        name="RiotGameMarketplace"
        component={RiotGameMarketplaceScreen}
        options={{
          header: () => null,
          title: screenTitle("Riot Game Marketplace"),
        }}
      />
      <Drawer.Screen
        name="RiotGameMemories"
        component={RiotGameMemoriesScreen}
        options={{
          header: () => null,
          title: screenTitle("Riot Game Memories"),
        }}
      />
      <Drawer.Screen
        name="RiotGameLeaderboard"
        component={RiotGameLeaderboardScreen}
        options={{
          header: () => null,
          title: screenTitle("Riot Game Leaderboard"),
        }}
      />
      <Drawer.Screen
        name="RiotGameInventory"
        component={RiotGameInventoryScreen}
        options={{
          header: () => null,
          title: screenTitle("Riot Game Inventory"),
        }}
      />

      {/* ==== Wallet Manager */}
      <Drawer.Screen
        name="WalletManager"
        component={WalletManagerScreen}
        options={{ header: () => null, title: screenTitle("Wallet Manager") }}
      />
      <Drawer.Screen
        name="WalletManagerWallets"
        component={WalletManagerWalletsScreen}
        options={{
          header: () => null,
          title: screenTitle("Wallet Manager (Wallets)"),
        }}
      />
      <Drawer.Screen
        name="WalletManagerChains"
        component={WalletManagerWalletsScreen}
        options={{
          header: () => null,
          title: screenTitle("Wallet Manager (Chains)"),
        }}
      />

      {/* ==== Launchpad */}
      <Drawer.Screen
        name="Launchpad"
        component={LaunchpadScreen}
        options={{ header: () => null, title: screenTitle("Launchpad") }}
      />
      <Drawer.Screen
        name="LaunchpadApply"
        component={LaunchpadApplyScreen}
        options={{
          header: () => null,
          title: screenTitle("Launchpad (Apply)"),
        }}
      />
      <Drawer.Screen
        name="MintCollection"
        component={MintCollectionScreen}
        options={{ header: () => null, title: screenTitle("Mint Collection") }}
      />

      {/* ==== Multisig */}
      <Drawer.Screen
        name="Multisig"
        component={MultisigScreen}
        options={{
          header: () => null,
          title: screenTitle("Multisig Wallets"),
        }}
      />
      <Drawer.Screen
        name="MultisigCreate"
        component={MultisigCreateScreen}
        options={{
          header: () => null,
          title: screenTitle("Create Multisig Wallet"),
        }}
      />
      <Drawer.Screen
        name="MultisigWalletDashboard"
        component={MultisigWalletDashboardScreen}
        options={{
          header: () => null,
          title: screenTitle("Multisig Wallet Dashboard"),
        }}
      />

      {/* ==== Organization */}

      <Drawer.Screen
        name="OrganizationDeployer"
        component={OrganizationDeployerScreen}
        options={{
          header: () => null,
          title: screenTitle("Organization Deployer"),
        }}
      />
      <Drawer.Screen
        name="Organizations"
        component={OrganizationsScreen}
        options={{
          header: () => null,
          title: screenTitle("Organizations"),
        }}
      />

      {/* ==== Teritori Name Service*/}
      <Drawer.Screen
        name="TNSHome"
        component={TNSHomeScreen}
        options={{ header: () => null, title: screenTitle("Name Service") }}
      />
      <Drawer.Screen
        name="Collection"
        component={CollectionScreen}
        options={{ header: () => null, title: screenTitle("Collection") }}
      />
      <Drawer.Screen
        name="NFTDetail"
        component={NFTDetailScreen}
        options={{ header: () => null, title: screenTitle("NFT") }}
      />
      <Drawer.Screen
        name="Staking"
        component={StakeScreen}
        options={{ header: () => null, title: screenTitle("Staking") }}
      />
      {/* ==== Swap*/}
      <Drawer.Screen
        name="Swap"
        component={SwapScreen}
        options={{ header: () => null, title: screenTitle("Swap") }}
      />
      <Drawer.Screen
        name="ComingSoon"
        component={ComingSoonScreen}
        options={{ header: () => null }}
      />
      <Drawer.Screen
        name="CollectionTools"
        component={CollectionToolsScreen}
        options={{ header: () => null }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ header: () => null }}
      />
      <Drawer.Screen
        name="FeedNewArticle"
        component={FeedNewArticleScreen}
        options={{ header: () => null, title: screenTitle("New Article") }}
      />

      <Drawer.Screen
        name="FeedPostView"
        component={FeedPostViewScreen}
        options={{ header: () => null, title: "Teritori" }}
      />
      <Drawer.Screen
        name="Feed"
        component={FeedScreen}
        options={{ header: () => null, title: screenTitle("Feed") }}
      />
      <Drawer.Screen
        name="HashtagFeed"
        component={HashtagFeedScreen}
        options={{ header: () => null, title: screenTitle("") }}
      />
      <Drawer.Screen
        name="ToriPunks"
        component={ToriPunks}
        options={{ header: () => null, title: screenTitle("ToriPunks") }}
      />
      <Drawer.Screen
        name="DAppStore"
        component={DAppStoreScreen}
        options={{ header: () => null, title: screenTitle("dApp Store") }}
      />
      <Drawer.Screen
        name="CoreDAO"
        component={CoreDAOScreen}
        options={{ header: () => null, title: screenTitle("Core DAO") }}
      />
      <Drawer.Screen
        name="Metrics"
        component={MetricsScreen}
        options={{ header: () => null, title: screenTitle("Metrics") }}
      />
      <Drawer.Screen
        name="Message"
        component={MessageScreen}
        options={{ header: () => null, title: screenTitle("Message") }}
      />
      <Drawer.Screen
        name="ChatSection"
        component={ChatSectionScreen}
        options={{
          header: () => null,
          title: screenTitle("Chat Message"),
        }}
      />
      <Drawer.Screen
        name="FriendshipManager"
        component={FriendshipManagerScreen}
        options={{
          header: () => null,
          title: screenTitle("Friends Add"),
        }}
      />
    </Drawer.Navigator>
  );
};
