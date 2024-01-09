import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { screenTitle } from "packages/components/navigation/Navigator";
import { RWAHomeScreen } from "packages/screens/RWA/RWAHomeScreen/RWAHomeScreen";
import React from "react";

import { RWAStackParamList } from "../../utils/navigation";

const Stack = createNativeStackNavigator<RWAStackParamList>();

export const RWAScreens: React.FC = () => {
  return (
    <>
      <Stack.Screen
        name="RWAHome"
        component={RWAHomeScreen}
        options={{ header: () => null, title: screenTitle("RWA Home") }}
      />
    </>
  );
};

export const RWANavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <RWAScreens />
    </Stack.Navigator>
  );
};
