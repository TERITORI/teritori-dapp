import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { ActivitiesScreen } from "../../screens/Activities/ActivitiesScreen";
import { GovernanceScreen } from "../../screens/Governance/GovernanceScreen";
import { GuardiansScreen } from "../../screens/Guardians/GuardiansScreen";
import { GuardiansGameScreen } from "../../screens/GuardiansGame/GuardiansGameScreen";
import { HomeScreen } from "../../screens/Home/HomeScreen";
import { LaunchpadScreen } from "../../screens/Launchpad/LaunchpadScreen";
import { MintGuardiansScreen } from "../../screens/Launchpad/MintGuardiansScreen";
import { MarketplaceScreen } from "../../screens/Marketplace/MarketplaceScreen";
import { MintScreen } from "../../screens/Mint/MintScreen";
import { MyCollectionScreen } from "../../screens/MyCollection/MyCollectionScreen";
import { NSBBurnNameScreen } from "../../screens/NameServiceBooking/NSBBurnNameScreen";
import { NSBConsultNameScreen } from "../../screens/NameServiceBooking/NSBConsultNameScreen";
import { NSBExploreScreen } from "../../screens/NameServiceBooking/NSBExploreScreen";
import { NSBHomeScreen } from "../../screens/NameServiceBooking/NSBHomeScreen";
import { NSBManageScreen } from "../../screens/NameServiceBooking/NSBManageScreen";
import { NSBMintNameScreen } from "../../screens/NameServiceBooking/NSBMintNameScreen";
import { NSBMintPathScreen } from "../../screens/NameServiceBooking/NSBMintPathScreen";
import { NSBRegisterScreen } from "../../screens/NameServiceBooking/NSBRegisterScreen";
import { NSBUpdateNameScreen } from "../../screens/NameServiceBooking/NSBUpdateNameScreen";
import { WalletsScreen } from "../../screens/Wallets/WalletsScreen";
import { RootStackParamList } from "../../utils/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigator: React.FC = () => {
  return (
    // @ts-expect-error
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
        name="Activities"
        component={ActivitiesScreen}
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

      {/* ==== Launchpad */}
      <Stack.Screen
        name="Launchpad"
        component={LaunchpadScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="MintGuardians"
        component={MintGuardiansScreen}
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
      {/* ==== Teritori Name Service (TNS) (= Name Service Booking (NSB))*/}
      <Stack.Screen
        name="NSBHome"
        component={NSBHomeScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="NSBExplore"
        component={NSBExploreScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="NSBManage"
        component={NSBManageScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="NSBRegister"
        component={NSBRegisterScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="NSBConsultName"
        component={NSBConsultNameScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="NSBUpdateName"
        component={NSBUpdateNameScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="NSBMintName"
        component={NSBMintNameScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="NSBBurnName"
        component={NSBBurnNameScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="NSBMintPath"
        component={NSBMintPathScreen}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
};
