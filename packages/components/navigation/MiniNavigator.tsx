import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import AddAddressBookScreen from "../../screens/Mini/AddressBook/AddAddressBookScreen";
import AddressBookScreen from "../../screens/Mini/AddressBook/AddressBookScreen";
import EditAddressBookScreen from "../../screens/Mini/AddressBook/EditAddressBookScreen";
import { MiniChatScreen } from "../../screens/Mini/Chat/MiniChatScreen";
import { NewConversationScreen } from "../../screens/Mini/Chat/NewConversationScreen";
import { NewGroupScreen } from "../../screens/Mini/Chat/NewGroupScreen";
import { ConversationScreeen } from "../../screens/Mini/Conversation/ConversationScreen";
import { DAppStoreScreen } from "../../screens/Mini/DAppStore/DAppStoreScreen";
import { MiniFeedScreen } from "../../screens/Mini/Feed/MiniFeedScreen";
import NotificationScreen from "../../screens/Mini/Notifications/NotificationScreen";
import { AccountDetailsScreen } from "../../screens/Mini/Profile/AccountDetailsScreen";
import { AddAccountScreen } from "../../screens/Mini/Profile/AddAccountScreen";
import { ProfileScreen } from "../../screens/Mini/Profile/ProfileScreen";
import { ChangePasswordScreen } from "../../screens/Mini/Settings/ChangePasswordScreen";
import { ChatSettingScreen } from "../../screens/Mini/Settings/ChatSettingScreen";
import { ExportPrivateKeyScreen } from "../../screens/Mini/Settings/ExportPrivateKeyScreen";
import { ResetWalletScreen } from "../../screens/Mini/Settings/ResetWalletScreen";
import { RevealSeedPhraseScreen } from "../../screens/Mini/Settings/RevealSeedPhraseScreen";
import { SecurityAndPrivacy } from "../../screens/Mini/Settings/SecurityAndPrivacy";
import { SettingsScreen } from "../../screens/Mini/Settings/SettingsScreen";
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
      <Stack.Screen
        name="MiniNewGroup"
        component={NewGroupScreen}
        options={{
          header: () => null,
          title: "New Group",
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen
        name="MiniChatSetting"
        component={ChatSettingScreen}
        options={{
          header: () => null,
          title: "Chat Setting",
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen
        name="MiniSettings"
        component={SettingsScreen}
        options={{
          header: () => null,
          title: "Settings",
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen
        name="MiniAccountDetails"
        component={AccountDetailsScreen}
        options={{
          header: () => null,
          title: "Account Details",
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen
        name="MiniAddAccount"
        component={AddAccountScreen}
        options={{
          header: () => null,
          title: "Add Account",
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          header: () => null,
          title: "Notifications",
        }}
      />
      <Stack.Screen
        name="AddressBook"
        component={AddressBookScreen}
        options={{
          header: () => null,
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen
        name="AddAddressBook"
        component={AddAddressBookScreen}
        options={{
          header: () => null,
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen
        name="EditAddressBook"
        component={EditAddressBookScreen}
        options={{
          header: () => null,
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen
        name="MiniSecurityAndPrivacy"
        component={SecurityAndPrivacy}
        options={{
          header: () => null,
          title: "Security & Privacy",
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen
        name="MiniChangePassword"
        component={ChangePasswordScreen}
        options={{
          header: () => null,
          title: "Change Password",
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen
        name="MiniRevealSeedPhrase"
        component={RevealSeedPhraseScreen}
        options={{
          header: () => null,
          title: "Reveal Seed Phrase",
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen
        name="MiniExportPrivateKey"
        component={ExportPrivateKeyScreen}
        options={{
          header: () => null,
          title: "Export Private Key",
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen
        name="MiniResetWallet"
        component={ResetWalletScreen}
        options={{
          header: () => null,
          title: "Reset Wallet",
          presentation: "transparentModal",
        }}
      />
    </Stack.Navigator>
  );
};
