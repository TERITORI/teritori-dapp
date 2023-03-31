import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { View } from "react-native";

import AddFriend from "./AddFriend";
import DetailsChatScreen from "./DetailsChatScreen";
import SideBarChatScreen from "./SideBarChatScreen";

const Tab = createMaterialTopTabNavigator();

const TopHeaderButtonChat = () => {
  return (
    <View style={{ marginLeft: 10 }}>
      <Tab.Navigator
        initialRouteName="SideBarChatScreen"
        screenOptions={{
          tabBarActiveTintColor: "#e91e63",
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: "600",
            color: "#FFFFFF",
          },
          tabBarItemStyle: { width: 150 },
          tabBarStyle: { backgroundColor: "#000" },
        }}
      >
        <Tab.Screen
          name="SideBarChatScreen"
          component={SideBarChatScreen}
          options={{ tabBarLabel: "Friends" }}
        />
        <Tab.Screen
          name="AddFriend"
          component={AddFriend}
          options={{ tabBarLabel: "Add A Friend" }}
        />
        <Tab.Screen
          name="DetailsChatScreen"
          component={DetailsChatScreen}
          options={{ tabBarLabel: "Requests" }}
        />
      </Tab.Navigator>
    </View>
  );
};
export default TopHeaderButtonChat;
