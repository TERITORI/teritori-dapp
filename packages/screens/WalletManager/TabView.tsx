import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";

import { neutral00, neutral33, white } from "../../utils/style/colors";

const Tab = createMaterialTopTabNavigator();

const FakeScreen: React.FC = () => null;

export const TabView: React.FC = () => {
  return (
    <Tab.Navigator
      sceneContainerStyle={{
        height: 0,
        maxHeight: 0,
        display: "none",
        backgroundColor: "red",
      }}
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12, color: white },
        tabBarItemStyle: { width: 80 },
        tabBarStyle: { backgroundColor: neutral00 },
        tabBarIndicatorStyle: {
          backgroundColor: white,
          height: 1,
          width: 80,
        },
        tabBarIndicatorContainerStyle: {
          borderBottomWidth: 1,
          borderColor: neutral33,
          width: "100%",
        },
      }}
    >
      <Tab.Screen name="Overview" component={FakeScreen} />
      <Tab.Screen name="NFTs" component={FakeScreen} />
    </Tab.Navigator>
  );
};
