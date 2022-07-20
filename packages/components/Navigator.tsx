import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { ActivitiesScreen } from "../screens/Activities/ActivitiesScreen";
import { GovernanceScreen } from "../screens/Governance/GovernanceScreen";
import { GuardiansScreen } from "../screens/Guardians/GuardiansScreen";
import { GuardiansGameScreen } from "../screens/GuardiansGame/GuardiansGameScreen";
import { HomeScreen } from "../screens/Home/HomeScreen";
import { LaunchpadScreen } from "../screens/Launchpad/LaunchpadScreen";
import { MarketplaceScreen } from "../screens/Marketplace/MarketplaceScreen";
import { MintScreen } from "../screens/Mint/MintScreen";
import { MyCollectionScreen } from "../screens/MyCollection/MyCollectionScreen";
import { WalletsScreen } from "../screens/Wallets/WalletsScreen";
import {NSBHomeScreen} from '../screens/NameServiceBooking/NSBHomeScreen';
import { RootStackParamList } from "../utils/navigation";
import {NSBExploreScreen} from "../screens/NameServiceBooking/NSBExploreScreen"
import {NSBRegisterScreen} from "../screens/NameServiceBooking/NSBRegisterScreen"
import {NSBManageScreen} from "../screens/NameServiceBooking/NSBManageScreen"
import {NSBConsultNameScreen} from "../screens/NameServiceBooking/NSBConsultNameScreen"
import {NSBEditCreateNameScreen} from "../screens/NameServiceBooking/NSBEditCreateNameScreen"

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
      <Stack.Screen
        name="Launchpad"
        component={LaunchpadScreen}
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
          name="NSBEditCreateName"
          component={NSBEditCreateNameScreen}
          options={{ header: () => null }}
        />
    </Stack.Navigator>
  );
};
