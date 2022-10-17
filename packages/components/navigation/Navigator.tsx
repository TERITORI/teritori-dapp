import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { AllPeriodScreen } from "../../screens/Governance/AllPeriodScreen";
import { PassedScreen } from "../../screens/Governance/PassedScreen";
import { RejectedScreen } from "../../screens/Governance/RejectedScreen";
import { VotingScreen } from "../../screens/Governance/VotingScreen";
import { GuardiansScreen } from "../../screens/Guardians/GuardiansScreen";
import { GuardiansGameScreen } from "../../screens/GuardiansGame/GuardiansGameScreen";
import { HomeScreen } from "../../screens/Home/HomeScreen";
import { LaunchpadScreen } from "../../screens/Launchpad/LaunchpadScreen";
import { MintCollectionScreen } from "../../screens/Launchpad/MintCollectionScreen";
import { CollectionActivityScreen } from "../../screens/Marketplace/CollectionActivityScreen";
import { CollectionScreen } from "../../screens/Marketplace/CollectionScreen";
import { MarketplaceScreen } from "../../screens/Marketplace/MarketplaceScreen";
import { NFTDetailScreen } from "../../screens/Marketplace/NFTDetailScreen";
import { MyCollectionScreen } from "../../screens/MyCollection/MyCollectionScreen";
import { RiotersFooterScreen } from "../../screens/RiotersFooter/RiotersFooterScreen";
import { StakeScreen } from "../../screens/Stake";
import { TNSBurnNameScreen } from "../../screens/TeritoriNameService/TNSBurnNameScreen";
import { TNSConsultNameScreen } from "../../screens/TeritoriNameService/TNSConsultNameScreen";
import { TNSExploreScreen } from "../../screens/TeritoriNameService/TNSExploreScreen";
import { TNSHomeScreen } from "../../screens/TeritoriNameService/TNSHomeScreen";
import { TNSManageScreen } from "../../screens/TeritoriNameService/TNSManageScreen";
import { TNSMintNameScreen } from "../../screens/TeritoriNameService/TNSMintNameScreen";
import { TNSMintPathScreen } from "../../screens/TeritoriNameService/TNSMintPathScreen";
import { TNSRegisterScreen } from "../../screens/TeritoriNameService/TNSRegisterScreen";
import { TNSUpdateNameScreen } from "../../screens/TeritoriNameService/TNSUpdateNameScreen";
import { WalletManagerScreen } from "../../screens/WalletManager/WalletManagerScreen";
import { WalletManagerWalletsScreen } from "../../screens/WalletManager/WalletsScreen";
import { WalletsScreen } from "../../screens/Wallets/WalletsScreen";
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
        name="Wallets"
        component={WalletsScreen}
        options={{
          presentation: "transparentModal",
          header: () => null,
          title: screenTitle("Wallets"),
        }}
      />
      <Stack.Screen
        name="RiotersFooter"
        component={RiotersFooterScreen}
        options={{ header: () => null, title: screenTitle("Rioters Footer") }}
      />

      {/* ==== Governance Pages */}

      <Stack.Screen
        name="Rejected"
        component={RejectedScreen}
        options={{ header: () => null }}
      />

      <Stack.Screen
        name="AllPeriods"
        component={AllPeriodScreen}
        options={{ header: () => null }}
      />

      <Stack.Screen
        name="Voting"
        component={VotingScreen}
        options={{ header: () => null }}
      />

      <Stack.Screen
        name="Passed"
        component={PassedScreen}
        options={{ header: () => null }}
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
        name="TNSExplore"
        component={TNSExploreScreen}
        options={{
          header: () => null,
          title: screenTitle("Name Service (Explore names)"),
        }}
      />
      <Stack.Screen
        name="TNSManage"
        component={TNSManageScreen}
        options={{
          header: () => null,
          title: screenTitle("Name Service (Manage names)"),
        }}
      />
      <Stack.Screen
        name="TNSRegister"
        component={TNSRegisterScreen}
        options={{
          header: () => null,
          title: screenTitle("Name Service (Register name)"),
        }}
      />
      <Stack.Screen
        name="TNSConsultName"
        component={TNSConsultNameScreen}
        options={{
          header: () => null,
          title: screenTitle("Name Service (Consult name)"),
        }}
      />
      <Stack.Screen
        name="TNSUpdateName"
        component={TNSUpdateNameScreen}
        options={{
          header: () => null,
          title: screenTitle("Name Service (Update name)"),
        }}
      />
      <Stack.Screen
        name="TNSMintName"
        component={TNSMintNameScreen}
        options={{
          header: () => null,
          title: screenTitle("Name Service (Register name)"),
        }}
      />
      <Stack.Screen
        name="TNSBurnName"
        component={TNSBurnNameScreen}
        options={{
          header: () => null,
          title: screenTitle("Name Service (Burn name)"),
        }}
      />
      <Stack.Screen
        name="TNSMintPath"
        component={TNSMintPathScreen}
        options={{
          header: () => null,
          title: screenTitle("Name Service (Mint path)"),
        }}
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
