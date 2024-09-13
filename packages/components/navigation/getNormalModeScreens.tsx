import React from "react";

import { platformScreens } from "./platformSpecific";
import { getNav, screenTitle } from "./util";

import { AdministrationDashboardScreen } from "@/screens/AdministrationDashboard/AdministrationDashboardScreen";
import { AllProjectAdministrationDashScreen } from "@/screens/AllProjectAdministrationDash/AllProjectAdministrationDashScreen";
import { ApplicationRewiewScreen } from "@/screens/ApplicationRewiew/ApplicationRewiew";
import { BurnCapitalScreen } from "@/screens/BurnCapital/BurnCapitalScreen";
import { ComingSoonScreen } from "@/screens/ComingSoon/ComingSoon";
import { CoreDAOScreen } from "@/screens/CoreDAO/CoreDAOScreen";
import { DAppStoreScreen } from "@/screens/DAppStore/DAppStoreScreen";
import { ToriPunks } from "@/screens/DAppStore/apps/toripunks/HomeScreen";
import { FeedScreen } from "@/screens/Feed/FeedScreen";
import { FeedNewArticleScreen } from "@/screens/FeedNewArticle/FeedNewArticleScreen";
import { FeedPostViewScreen } from "@/screens/FeedPostView/FeedPostViewScreen";
import { GovernanceProposalScreen } from "@/screens/Governance/GovernanceProposal/GovernanceProposalScreen";
import { GovernanceScreen } from "@/screens/Governance/GovernanceScreen";
import { GuardiansScreen } from "@/screens/Guardians/GuardiansScreen";
import { HashtagFeedScreen } from "@/screens/HashtagFeed/HashtagFeedScreen";
import { HomeScreen } from "@/screens/Home/HomeScreen";
import { LaunchpadApplyScreen } from "@/screens/Launchpad/LaunchpadApplyScreen";
import { LaunchpadCreateScreen } from "@/screens/Launchpad/LaunchpadCreateScreen";
import { LaunchpadScreen } from "@/screens/Launchpad/LaunchpadScreen";
import { MintCollectionScreen } from "@/screens/Launchpad/MintCollectionScreen";
import { LaunchpadApplicationsScreen } from "@/screens/LaunchpadApplications/LaunchpadApplicationsScreen";
import { LaunchpadERC20SalesScreen } from "@/screens/LaunchpadERC20/LaunchpadERC20AirdropsScreen";
import { LaunchpadERC20AirdropsScreen } from "@/screens/LaunchpadERC20/LaunchpadERC20SalesScreen";
import { LaunchpadERC20Screen } from "@/screens/LaunchpadERC20/LaunchpadERC20Screen";
import { LaunchpadERC20TokensScreen } from "@/screens/LaunchpadERC20/LaunchpadERC20TokensScreen";
import { CollectionScreen } from "@/screens/Marketplace/CollectionScreen";
import { CollectionToolsScreen } from "@/screens/Marketplace/CollectionToolsScreen";
import { MarketplaceScreen } from "@/screens/Marketplace/MarketplaceScreen";
import { NFTDetailScreen } from "@/screens/Marketplace/NFTDetailScreen";
import { MarketplaceLeaderboardScreen } from "@/screens/MarketplaceLeaderboardScreen/MarketplaceLeaderboardScreen";
import { MessageScreen } from "@/screens/Message/MessageScreen";
import { ChatSectionScreen } from "@/screens/Message/components/ChatSection";
import { FriendshipManagerScreen } from "@/screens/Message/components/FriendshipManager";
import { MetricsScreen } from "@/screens/Metrics/MetricsScreen";
import { MultisigCreateScreen } from "@/screens/Multisig/MultisigCreateScreen";
import { MultisigScreen } from "@/screens/Multisig/MultisigScreen";
import { MultisigWalletDashboardScreen } from "@/screens/Multisig/MultisigWalletDashboardScreen";
import { MyCollectionScreen } from "@/screens/MyCollection/MyCollectionScreen";
import { OrganizationDeployerScreen } from "@/screens/Organizations/OrganizationDeployerScreen";
import { OrganizationsScreen } from "@/screens/Organizations/OrganizationsScreen";
import { ProjectsCompleteMilestoneScreen } from "@/screens/Projects/CompleteMilestoneScreen";
import { ProjectsConflictSolvingScreen } from "@/screens/Projects/ProjectsConflictSolvingScreen";
import { ProjectsDetailScreen } from "@/screens/Projects/ProjectsDetailScreen";
import { ProjectsMakeRequestScreen } from "@/screens/Projects/ProjectsMakeRequestScreen";
import { ProjectsManagerScreen } from "@/screens/Projects/ProjectsManagerScreen";
import { ProjectsPaymentScreen } from "@/screens/Projects/ProjectsPaymentScreen";
import { ProjectsScreen } from "@/screens/Projects/ProjectsScreen";
import { ReadyLaunchpadApplicationsScreen } from "@/screens/ReadyLaunchpadApplications/ReadyLaunchpadApplicationsScreen";
import { RiotGameBreedingScreen } from "@/screens/RiotGame/RiotGameBreedingScreen";
import { RiotGameEnrollScreen } from "@/screens/RiotGame/RiotGameEnrollScreen";
import { RiotGameFightScreen } from "@/screens/RiotGame/RiotGameFightScreen";
import { RiotGameInventoryScreen } from "@/screens/RiotGame/RiotGameInventoryScreen";
import { RiotGameLeaderboardScreen } from "@/screens/RiotGame/RiotGameLeaderboardScreen";
import { RiotGameMarketplaceScreen } from "@/screens/RiotGame/RiotGameMarketplaceScreen";
import { RiotGameMemoriesScreen } from "@/screens/RiotGame/RiotGameMemoriesScreen";
import { RiotGameScreen } from "@/screens/RiotGame/RiotGameScreen";
import { RiotersFooterScreen } from "@/screens/RiotersFooter/RiotersFooterScreen";
import { SettingsScreen } from "@/screens/Settings/SettingsScreen";
import { StakeScreen } from "@/screens/Stake";
import { SwapScreen } from "@/screens/Swap/SwapScreen";
import { TNSHomeScreen } from "@/screens/TeritoriNameService/TNSHomeScreen";
import { UserPublicProfileScreen } from "@/screens/UserPublicProfile/UserPublicProfileScreen";
import { CreatePassword } from "@/screens/Wallet/Screens/CreatePassword";
import { ImportWallet } from "@/screens/Wallet/Screens/ImportWallet";
import NativeWallet from "@/screens/Wallet/Screens/NativeWallet";
import { SuccessScreen } from "@/screens/Wallet/Screens/SucessScreen";
import { WalletManagerScreen } from "@/screens/WalletManager/WalletManagerScreen";
import { WalletManagerWalletsScreen } from "@/screens/WalletManager/WalletsScreen";
import { AppMode } from "@/utils/types/app-mode";

export const getNormalModeScreens = ({ appMode }: { appMode: AppMode }) => {
  const { Nav } = getNav(appMode);

  return (
    <>
      <Nav.Screen
        name="Home"
        component={HomeScreen}
        options={{ header: () => null, title: screenTitle("Home") }}
      />

      <Nav.Screen
        name="MyCollection"
        component={MyCollectionScreen}
        options={{ header: () => null, title: screenTitle("My Collection") }}
      />
      <Nav.Screen
        name="Guardians"
        component={GuardiansScreen}
        options={{ header: () => null, title: screenTitle("Guardians") }}
      />
      <Nav.Screen
        name="RiotGame"
        component={RiotGameScreen}
        options={{ header: () => null }}
      />

      <Nav.Screen
        name="Marketplace"
        component={MarketplaceScreen}
        options={{
          header: () => null,
          title: screenTitle("NFT Marketplace - Popular Collections"),
        }}
      />
      <Nav.Screen
        name="Governance"
        component={GovernanceScreen}
        options={{ header: () => null, title: screenTitle("Governance") }}
      />
      <Nav.Screen
        name="GovernanceProposal"
        component={GovernanceProposalScreen}
        options={{ header: () => null }}
      />
      <Nav.Screen
        name="UserPublicProfile"
        component={UserPublicProfileScreen}
        options={{ header: () => null }}
      />
      <Nav.Screen
        name="RiotersFooter"
        component={RiotersFooterScreen}
        options={{ header: () => null, title: screenTitle("Rioters Footer") }}
      />
      <Nav.Screen
        name="AdministrationDashboard"
        component={AdministrationDashboardScreen}
        options={{
          header: () => null,
          title: screenTitle("Administration Dashboard"),
        }}
      />
      <Nav.Screen
        name="LaunchpadApplications"
        component={LaunchpadApplicationsScreen}
        options={{
          header: () => null,
          title: screenTitle("Launchpad Applications"),
        }}
      />
      <Nav.Screen
        name="ReadyLaunchpadApplications"
        component={ReadyLaunchpadApplicationsScreen}
        options={{
          header: () => null,
          title: screenTitle("Ready Launchpad Applications"),
        }}
      />
      <Nav.Screen
        name="AllProjectAdministrationDash"
        component={AllProjectAdministrationDashScreen}
        options={{
          header: () => null,
          title: screenTitle("All Launchpad Applications"),
        }}
      />
      <Nav.Screen
        name="ApplicationReview"
        component={ApplicationRewiewScreen}
        options={{
          header: () => null,
          title: screenTitle("Application Review"),
        }}
      />

      <Nav.Screen
        name="MarketplaceLeaderboard"
        component={MarketplaceLeaderboardScreen}
        options={{
          header: () => null,
          title: screenTitle("Application Review"),
        }}
      />

      {/* === Riot Game */}
      <Nav.Screen
        name="RiotGameEnroll"
        component={RiotGameEnrollScreen}
        options={{ header: () => null, title: screenTitle("Riot Game Enroll") }}
      />
      <Nav.Screen
        name="RiotGameFight"
        component={RiotGameFightScreen}
        options={{
          header: () => null,
          title: screenTitle("Riot Game Fight"),
        }}
      />
      <Nav.Screen
        name="RiotGameBreeding"
        component={RiotGameBreedingScreen}
        options={{
          header: () => null,
          title: screenTitle("Riot Game Breeding"),
        }}
      />
      <Nav.Screen
        name="RiotGameMarketplace"
        component={RiotGameMarketplaceScreen}
        options={{
          header: () => null,
          title: screenTitle("Riot Game Marketplace"),
        }}
      />
      <Nav.Screen
        name="RiotGameMemories"
        component={RiotGameMemoriesScreen}
        options={{
          header: () => null,
          title: screenTitle("Riot Game Memories"),
        }}
      />
      <Nav.Screen
        name="RiotGameLeaderboard"
        component={RiotGameLeaderboardScreen}
        options={{
          header: () => null,
          title: screenTitle("Riot Game Leaderboard"),
        }}
      />
      <Nav.Screen
        name="RiotGameInventory"
        component={RiotGameInventoryScreen}
        options={{
          header: () => null,
          title: screenTitle("Riot Game Inventory"),
        }}
      />

      {/* ==== Wallet Manager */}
      <Nav.Screen
        name="WalletManager"
        component={WalletManagerScreen}
        options={{ header: () => null, title: screenTitle("Wallet Manager") }}
      />
      <Nav.Screen
        name="WalletManagerWallets"
        component={WalletManagerWalletsScreen}
        options={{
          header: () => null,
          title: screenTitle("Wallet Manager (Wallets)"),
        }}
      />
      <Nav.Screen
        name="WalletManagerChains"
        component={WalletManagerWalletsScreen}
        options={{
          header: () => null,
          title: screenTitle("Wallet Manager (Chains)"),
        }}
      />

      {/* ==== Launchpad */}
      <Nav.Screen
        name="Launchpad"
        component={LaunchpadScreen}
        options={{ header: () => null, title: screenTitle("Launchpad") }}
      />
      <Nav.Screen
        name="LaunchpadApply"
        component={LaunchpadApplyScreen}
        options={{
          header: () => null,
          title: screenTitle("Launchpad (Apply)"),
        }}
      />
      <Nav.Screen
        name="LaunchpadCreate"
        component={LaunchpadCreateScreen}
        options={{
          header: () => null,
          title: screenTitle("Launchpad (Apply)"),
        }}
      />
      <Nav.Screen
        name="MintCollection"
        component={MintCollectionScreen}
        options={{ header: () => null, title: screenTitle("Mint Collection") }}
      />

      { /* ==== Launchpad ERC20 */}
      <Nav.Screen
        name="LaunchpadERC20"
        component={LaunchpadERC20Screen}
        options={{
          header: () => null,
          title: screenTitle("Launchpad ERC20"),
        }}
      />

      <Nav.Screen
        name="LaunchpadERC20Tokens"
        component={LaunchpadERC20TokensScreen}
        options={{
          header: () => null,
          title: screenTitle("Launchpad ERC20 Tokens"),
        }}
      />

      <Nav.Screen
        name="LaunchpadERC20Airdrops"
        component={LaunchpadERC20AirdropsScreen}
        options={{
          header: () => null,
          title: screenTitle("Launchpad ERC20 Airdrops"),
        }}
      />

      <Nav.Screen
        name="LaunchpadERC20Sales"
        component={LaunchpadERC20SalesScreen}
        options={{
          header: () => null,
          title: screenTitle("Launchpad ERC20 Sales"),
        }}
      />

      {/* ==== Multisig */}
      <Nav.Screen
        name="Multisig"
        component={MultisigScreen}
        options={{
          header: () => null,
          title: screenTitle("Multisig Wallets"),
        }}
      />
      <Nav.Screen
        name="MultisigCreate"
        component={MultisigCreateScreen}
        options={{
          header: () => null,
          title: screenTitle("Create Multisig Wallet"),
        }}
      />
      <Nav.Screen
        name="MultisigWalletDashboard"
        component={MultisigWalletDashboardScreen}
        options={{
          header: () => null,
          title: screenTitle("Multisig Wallet Dashboard"),
        }}
      />

      {/* ==== Organization */}

      <Nav.Screen
        name="OrganizationDeployer"
        component={OrganizationDeployerScreen}
        options={{
          header: () => null,
          title: screenTitle("Organization Deployer"),
        }}
      />
      <Nav.Screen
        name="Organizations"
        component={OrganizationsScreen}
        options={{
          header: () => null,
          title: screenTitle("Organizations"),
        }}
      />

      {/* ==== Projects program */}
      <Nav.Screen
        name="Projects"
        component={ProjectsScreen}
        options={{ header: () => null, title: screenTitle("Projects Program") }}
      />

      <Nav.Screen
        name="ProjectsDetail"
        component={ProjectsDetailScreen}
        options={{
          header: () => null,
          title: screenTitle("Projects Program Detail"),
        }}
      />

      <Nav.Screen
        name="ProjectsManager"
        component={ProjectsManagerScreen}
        options={{
          header: () => null,
          title: screenTitle("Projects Program Manager"),
        }}
      />

      <Nav.Screen
        name="ProjectsPayment"
        component={ProjectsPaymentScreen}
        options={{
          header: () => null,
          title: screenTitle("Projects Program Payment"),
        }}
      />

      <Nav.Screen
        name="ProjectsCompleteMilestone"
        component={ProjectsCompleteMilestoneScreen}
        options={{
          header: () => null,
          title: screenTitle("Projects Milestone"),
        }}
      />

      <Nav.Screen
        name="ProjectsMakeRequest"
        component={ProjectsMakeRequestScreen}
        options={{
          header: () => null,
          title: screenTitle("Projects Program Make Request"),
        }}
      />

      <Nav.Screen
        name="ProjectsConflictSolving"
        component={ProjectsConflictSolvingScreen}
        options={{
          header: () => null,
          title: screenTitle("Project Conflict Solving"),
        }}
      />

      {/* ==== Teritori Name Service*/}
      <Nav.Screen
        name="TNSHome"
        component={TNSHomeScreen}
        options={{ header: () => null, title: screenTitle("Name Service") }}
      />
      <Nav.Screen
        name="Collection"
        component={CollectionScreen}
        options={{ header: () => null, title: screenTitle("Collection") }}
      />
      <Nav.Screen
        name="NFTDetail"
        component={NFTDetailScreen}
        options={{ header: () => null, title: screenTitle("NFT") }}
      />
      <Nav.Screen
        name="Staking"
        component={StakeScreen}
        options={{ header: () => null, title: screenTitle("Staking") }}
      />
      {/* ==== Swap*/}
      <Nav.Screen
        name="Swap"
        component={SwapScreen}
        options={{ header: () => null, title: screenTitle("Swap") }}
      />
      <Nav.Screen
        name="ComingSoon"
        component={ComingSoonScreen}
        options={{ header: () => null }}
      />
      <Nav.Screen
        name="CollectionTools"
        component={CollectionToolsScreen}
        options={{ header: () => null }}
      />
      <Nav.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ header: () => null }}
      />
      <Nav.Screen
        name="FeedNewArticle"
        component={FeedNewArticleScreen}
        options={{ header: () => null, title: screenTitle("New Article") }}
      />

      <Nav.Screen
        name="FeedPostView"
        component={FeedPostViewScreen}
        options={{ header: () => null, title: "Teritori" }}
      />
      <Nav.Screen
        name="Feed"
        component={FeedScreen}
        options={{ header: () => null, title: screenTitle("Feed") }}
      />
      <Nav.Screen
        name="HashtagFeed"
        component={HashtagFeedScreen}
        options={{ header: () => null, title: screenTitle("") }}
      />
      <Nav.Screen
        name="ToriPunks"
        component={ToriPunks}
        options={{ header: () => null, title: screenTitle("ToriPunks") }}
      />
      <Nav.Screen
        name="DAppStore"
        component={DAppStoreScreen}
        options={{ header: () => null, title: screenTitle("dApp Store") }}
      />
      <Nav.Screen
        name="CoreDAO"
        component={CoreDAOScreen}
        options={{ header: () => null, title: screenTitle("Core DAO") }}
      />
      <Nav.Screen
        name="Metrics"
        component={MetricsScreen}
        options={{ header: () => null, title: screenTitle("Metrics") }}
      />
      <Nav.Screen
        name="Message"
        component={MessageScreen}
        options={{ header: () => null, title: screenTitle("Message") }}
      />
      <Nav.Screen
        name="ChatSection"
        component={ChatSectionScreen}
        options={{
          header: () => null,
          title: screenTitle("Chat Message"),
        }}
      />
      <Nav.Screen
        name="FriendshipManager"
        component={FriendshipManagerScreen}
        options={{
          header: () => null,
          title: screenTitle("Friends Add"),
        }}
      />

      <Nav.Screen
        name="NativeWallet"
        component={NativeWallet}
        options={{ header: () => null, title: screenTitle("Wallet Create") }}
      />
      <Nav.Screen
        name="ImportWallet"
        component={ImportWallet}
        options={{
          header: () => null,
          title: screenTitle("Import Wallet with Seed"),
        }}
      />
      <Nav.Screen
        name="CreatePassword"
        component={CreatePassword}
        options={{
          header: () => null,
          title: screenTitle("Create Password"),
        }}
      />
      <Nav.Screen
        name="SuccessScreen"
        component={SuccessScreen}
        options={{
          header: () => null,
          title: screenTitle("All Set"),
        }}
      />
      <Nav.Screen
        name="BurnCapital"
        component={BurnCapitalScreen}
        options={{ header: () => null, title: screenTitle("Burn Capital") }}
      />
      {platformScreens}
    </>
  );
};
