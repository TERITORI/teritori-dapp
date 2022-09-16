import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { GovernanceScreen } from "../../screens/Governance/GovernanceScreen";
import { GuardiansScreen } from "../../screens/Guardians/GuardiansScreen";
import { GuardiansGameScreen } from "../../screens/GuardiansGame/GuardiansGameScreen";
import { HomeScreen } from "../../screens/Home/HomeScreen";
import { LaunchpadScreen } from "../../screens/Launchpad/LaunchpadScreen";
import { MintCollectionScreen } from "../../screens/Launchpad/MintCollectionScreen";
import { CollectionActivityScreen } from "../../screens/Marketplace/CollectionActivityScreen";
import { CollectionScreen } from "../../screens/Marketplace/CollectionScreen";
import { MarketplaceScreen } from "../../screens/Marketplace/MarketplaceScreen";
import { NFTDetailScreen } from "../../screens/Marketplace/NFTDetailScreen";
import { MintScreen } from "../../screens/Mint/MintScreen";
import { MyCollectionScreen } from "../../screens/MyCollection/MyCollectionScreen";
import { RiotersFooterScreen } from "../../screens/RiotersFooter/RiotersFooterScreen";
import { TNSBurnNameScreen } from "../../screens/TeritoriNameService/TNSBurnNameScreen";
import { TNSConsultNameScreen } from "../../screens/TeritoriNameService/TNSConsultNameScreen";
import { TNSExploreScreen } from "../../screens/TeritoriNameService/TNSExploreScreen";
import { TNSHomeScreen } from "../../screens/TeritoriNameService/TNSHomeScreen";
import { TNSManageScreen } from "../../screens/TeritoriNameService/TNSManageScreen";
import { TNSMintNameScreen } from "../../screens/TeritoriNameService/TNSMintNameScreen";
import { TNSMintPathScreen } from "../../screens/TeritoriNameService/TNSMintPathScreen";
import { TNSRegisterScreen } from "../../screens/TeritoriNameService/TNSRegisterScreen";
import { TNSUpdateNameScreen } from "../../screens/TeritoriNameService/TNSUpdateNameScreen";
import { WalletsScreen } from "../../screens/Wallets/WalletsScreen";
import { RootStackParamList } from "../../utils/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="MyCollection"
        component={MyCollectionScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="Guardians"
        component={GuardiansScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="GuardiansGame"
        component={GuardiansGameScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="Marketplace"
        component={MarketplaceScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="Governance"
        component={GovernanceScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="Mint"
        component={MintScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="Wallets"
        component={WalletsScreen}
        options={{ presentation: "transparentModal", header: () => null }}
      />
      <Stack.Screen
        name="RiotersFooter"
        component={RiotersFooterScreen}
        options={{ header: () => null }}
      />

      {/* ==== Launchpad */}
      <Stack.Screen
        name="Launchpad"
        component={LaunchpadScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="MintCollection"
        component={MintCollectionScreen}
        options={{ header: () => null }}
      />

      {/* ==== Teritori Name Service*/}
      <Stack.Screen
        name="TNSHome"
        component={TNSHomeScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="TNSExplore"
        component={TNSExploreScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="TNSManage"
        component={TNSManageScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="TNSRegister"
        component={TNSRegisterScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="TNSConsultName"
        component={TNSConsultNameScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="TNSUpdateName"
        component={TNSUpdateNameScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="TNSMintName"
        component={TNSMintNameScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="TNSBurnName"
        component={TNSBurnNameScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="TNSMintPath"
        component={TNSMintPathScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="Collection"
        component={CollectionScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="CollectionActivity"
        component={CollectionActivityScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="NFTDetail"
        component={NFTDetailScreen}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
};
