import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { MiniChatScreen } from "../../screens/Mini/Chat/MiniChatScreen";
import { NewConversationScreen } from "../../screens/Mini/Chat/NewConversationScreen";
import { ConversationScreeen } from "../../screens/Mini/Conversation/ConversationScreen";
import { DAppStoreScreen } from "../../screens/Mini/DAppStore/DAppStoreScreen";
import { MiniFeedScreen } from "../../screens/Mini/Feed/MiniFeedScreen";
import { ProfileScreen } from "../../screens/Mini/Profile/ProfileScreen";
import { MiniWalletScreen } from "../../screens/Mini/Wallet/MiniWalletScreen";
import { CreatePassword } from "../../screens/Wallet/Screens/CreatePassword";
import { CreateScreen } from "../../screens/Wallet/Screens/CreateScreen";
import { ImportWallet } from "../../screens/Wallet/Screens/ImportWallet";
import { SuccessScreen } from "../../screens/Wallet/Screens/SucessScreen";
import { ViewSeed } from "../../screens/Wallet/Screens/ViewSeed";
import { RootStackParamList } from "../../utils/navigation";
import { neutral00, secondaryColor } from "../../utils/style/colors";
import { TabBarIcon } from "../TabBarIcon";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

export type MiniTabScreenFC<T extends keyof RootStackParamList> = React.FC<{
  navigation: BottomTabNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
}>;

const MainTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: secondaryColor,
        tabBarIcon: (props) => {
          return <TabBarIcon {...props} title={route.name} />;
        },
        tabBarStyle: { backgroundColor: neutral00, borderTopWidth: 0 },
      })}
    >
      <Tab.Screen
        name="MiniChats"
        options={{ header: () => null, title: "Chats" }}
        component={MiniChatScreen}
      />
      <Tab.Screen
        name="MiniFeeds"
        options={{ header: () => null, title: "Feed" }}
        component={MiniFeedScreen}
      />
      <Tab.Screen
        name="MiniWallets"
        options={{ header: () => null, title: "Wallets" }}
        component={MiniWalletScreen}
      />
    </Tab.Navigator>
  );
};

export const MiniNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="MiniTabs">
      <Stack.Screen
        name="NativeWallet"
        component={CreateScreen}
        options={{ header: () => null, title: "Wallet Create" }}
      />
      <Stack.Screen
        name="MiniTabs"
        options={{ header: () => null }}
        component={MainTab}
      />

      <Stack.Screen
        name="ViewSeed"
        component={ViewSeed}
        options={{ header: () => null, title: "View Seed" }}
      />
      <Stack.Screen
        name="ImportWallet"
        component={ImportWallet}
        options={{
          header: () => null,
          title: "Import Wallet with Seed",
        }}
      />
      <Stack.Screen
        name="CreatePassword"
        component={CreatePassword}
        options={{
          header: () => null,
          title: "Create Password",
        }}
      />
      <Stack.Screen
        name="Conversation"
        component={ConversationScreeen}
        options={{
          header: () => null,
          title: "Chat",
        }}
      />
      <Stack.Screen
        name="SuccessScreen"
        component={SuccessScreen}
        options={{
          header: () => null,
          title: "All Set",
        }}
      />
      <Stack.Screen
        name="MiniProfile"
        component={ProfileScreen}
        options={{
          header: () => null,
          title: "Profile",
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen
        name="MiniDAppStore"
        component={DAppStoreScreen}
        options={{
          header: () => null,
          title: "dApp Store",
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen
        name="MiniNewConversation"
        component={NewConversationScreen}
        options={{
          header: () => null,
          title: "New Conversation",
          presentation: "transparentModal",
        }}
      />
    </Stack.Navigator>
  );
};
