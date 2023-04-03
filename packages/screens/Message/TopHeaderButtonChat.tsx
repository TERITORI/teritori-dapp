import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { View, Text } from "react-native";

import AddFriend from "./AddFriend";
import Friends from "./Friends";
import Requests from "./Requests";

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
            marginTop: 10,
          },
          tabBarItemStyle: { width: 150 },
          tabBarStyle: { backgroundColor: "#000" },
        }}
      >
        <Tab.Screen
          name="Friends"
          component={Friends}
          options={{ tabBarLabel: "Friends" }}
        />
        <Tab.Screen
          name="Requests"
          component={Requests}
          options={{ tabBarLabel: "Requests" }}
        />
        <Tab.Screen
          name="AddFriend"
          component={AddFriend}
          options={{ tabBarLabel: "Add A Friend" }}
        />
      </Tab.Navigator>
    </View>
  );
};
export default TopHeaderButtonChat;
