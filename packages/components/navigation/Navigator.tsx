import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { ComingSoonScreen } from "../../screens/ComingSoon/ComingSoon";
import { GovernanceScreen } from "../../screens/Governance/GovernanceScreen";
import { GuardiansScreen } from "../../screens/Guardians/GuardiansScreen";
import { GuardiansGameScreen } from "../../screens/GuardiansGame/GuardiansGameScreen";
import { HomeScreen } from "../../screens/Home/HomeScreen";
import { LaunchpadApplyScreen } from "../../screens/Launchpad/LaunchpadApplyScreen";
import { LaunchpadScreen } from "../../screens/Launchpad/LaunchpadScreen";
import { MintCollectionScreen } from "../../screens/Launchpad/MintCollectionScreen";
import { CollectionActivityScreen } from "../../screens/Marketplace/CollectionActivityScreen";
import { CollectionScreen } from "../../screens/Marketplace/CollectionScreen";
import { MarketplaceScreen } from "../../screens/Marketplace/MarketplaceScreen";
import { NFTDetailScreen } from "../../screens/Marketplace/NFTDetailScreen";
import { MultisigCreateScreen } from "../../screens/Multisig/MultisigCreateScreen";
import { MultisigDelegateScreen } from "../../screens/Multisig/MultisigDelegateScreen";
import { MultisigLegacyScreen } from "../../screens/Multisig/MultisigLegacyScreen";
import { MultisigScreen } from "../../screens/Multisig/MultisigScreen";
import { MultisigTransferScreen } from "../../screens/Multisig/MultisigTransferScreen";
import { MyCollectionScreen } from "../../screens/MyCollection/MyCollectionScreen";
import { MultisigWalletManageScreen } from "../../screens/Multisig/MultisigWalletManageScreen";
import { MultisigWalletTransactionScreen } from "../../screens/Multisig/MultisigWalletTransactionScreen";
import { OrganizationGetStartedScreen } from "../../screens/OrganizerDeployer/OrganizationGetStartedScreen";
import { OrganizerDeployerScreen } from "../../screens/OrganizerDeployer/OrganizerDeployerScreen";
import { TransactionProposalScreen } from "../../screens/OrganizerDeployer/TransactionProposalScreen";
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
        name="GuardiansGame"
        component={GuardiansGameScreen}
        options={{ header: () => null, title: screenTitle("Guardians Game") }}
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

      {/* ==== Organization */}

      <Stack.Screen
        name="OrganizationDeployer"
        component={OrganizerDeployerScreen}
        options={{
          header: () => null,
          title: screenTitle("Organization Deployer"),
        }}
      />
      <Stack.Screen
        name="OrganizationGetStarted"
        component={OrganizationGetStartedScreen}
        options={{
          header: () => null,
          title: screenTitle("Organization Name"),
        }}
      />

      {/* ==== Multisig */}
      <Stack.Screen
        name="Multisig"
        component={MultisigScreen}
        options={{
          header: () => null,
          title: screenTitle("Multisig Wallet"),
        }}
      />
      <Stack.Screen
        name="MultisigCreate"
        component={MultisigCreateScreen}
        options={{
          header: () => null,
          title: screenTitle("Multisig Wallet Create"),
        }}
      />
      <Stack.Screen
        name="MultisigLegacy"
        component={MultisigLegacyScreen}
        options={{
          header: () => null,
          title: screenTitle("Multisig Legacy"),
        }}
      />
      <Stack.Screen
        name="MultisigTransfer"
        component={MultisigTransferScreen}
        options={{
          header: () => null,
          title: screenTitle("Multisig Create Transaction"),
        }}
      />
      <Stack.Screen
        name="MultisigDelegate"
        component={MultisigDelegateScreen}
        options={{
          header: () => null,
          title: screenTitle("Multisig Delegate"),
        }}
      />
      <Stack.Screen
        name="MultisigWalletManage"
        component={MultisigWalletManageScreen}
        options={{
          header: () => null,
          title: screenTitle("Manage Multisig Wallet"),
        }}
      />
      <Stack.Screen
        name="MultisigWalletTransaction"
        component={MultisigWalletTransactionScreen}
        options={{
          header: () => null,
          title: screenTitle("Wallet Name 1"),
        }}
      />
      <Stack.Screen
        name="MultisigTransactionProposal"
        component={TransactionProposalScreen}
        options={{
          header: () => null,
          title: screenTitle("Transactions history"),
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
