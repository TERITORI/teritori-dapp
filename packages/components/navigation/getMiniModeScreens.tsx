import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useSelector } from "react-redux";

import { neutral00, secondaryColor } from "../../utils/style/colors";
import { TabBarIcon } from "../TabBarIcon";

import AboutScreen from "@/screens/Mini/About/AboutScreen";
import AddAddressBookScreen from "@/screens/Mini/AddressBook/AddAddressBookScreen";
import AddressBookScreen from "@/screens/Mini/AddressBook/AddressBookScreen";
import EditAddressBookScreen from "@/screens/Mini/AddressBook/EditAddressBookScreen";
import { MiniAddFriendScreen } from "@/screens/Mini/Chat/MiniAddFriendScreen";
import { MiniChatProfileScreen } from "@/screens/Mini/Chat/MiniChatProfile";
import { MiniChatScreen } from "@/screens/Mini/Chat/MiniChatScreen";
import { MiniCreateAccount } from "@/screens/Mini/Chat/MiniCreateAccount";
import { MiniFriendScreen } from "@/screens/Mini/Chat/MiniFriendScreen";
import { NewConversationScreen } from "@/screens/Mini/Chat/NewConversationScreen";
import { NewGroupScreen } from "@/screens/Mini/Chat/NewGroupScreen";
import { ConnectLedgerScreen } from "@/screens/Mini/ConnectLedger/ConnectLedgerScreen";
import { ConversationScreeen } from "@/screens/Mini/Conversation/ConversationScreen";
import GroupActionScreen from "@/screens/Mini/Conversation/GroupActionScreen";
import { DAppStoreScreen } from "@/screens/Mini/DAppStore/DAppStoreScreen";
import MiniCreatePostScreen from "@/screens/Mini/Feed/MiniCreatePostScreen";
import { MiniFeedScreen } from "@/screens/Mini/Feed/MiniFeedScreen";
import ChangeNetworkScreen from "@/screens/Mini/Network/ChangeNetworkScreen";
import NotificationScreen from "@/screens/Mini/Notifications/NotificationScreen";
import { AccountDetailsScreen } from "@/screens/Mini/Profile/AccountDetailsScreen";
import { AddAccountScreen } from "@/screens/Mini/Profile/AddAccountScreen";
import ProfileDetailScreen from "@/screens/Mini/Profile/ProfileDetailScreen";
import { ProfileScreen } from "@/screens/Mini/Profile/ProfileScreen";
import { ChangePasswordScreen } from "@/screens/Mini/Settings/ChangePasswordScreen";
import { ChatSettingScreen } from "@/screens/Mini/Settings/ChatSettingScreen";
import FaceIdLoginScreen from "@/screens/Mini/Settings/FaceIdLoginScreen";
import { PreferencesSettingScreen } from "@/screens/Mini/Settings/PreferencesSetttingScreen";
import { ResetWalletScreen } from "@/screens/Mini/Settings/ResetWalletScreen";
import { RevealSeedPhraseScreen } from "@/screens/Mini/Settings/RevealSeedPhraseScreen";
import { SecurityAndPrivacy } from "@/screens/Mini/Settings/SecurityAndPrivacy";
import { SettingsScreen } from "@/screens/Mini/Settings/SettingsScreen";
import { ChatActivationScreen } from "@/screens/Mini/StartScreens/ChatActivationScreen";
import { ModeSelectionScreen } from "@/screens/Mini/StartScreens/ModeSelectionScreen";
import AddCustomTokenScreen from "@/screens/Mini/Wallet/AddCustomTokenScreen";
import { DepositTORIScreen } from "@/screens/Mini/Wallet/DepositTORIScreen";
import { ManageTokensScreen } from "@/screens/Mini/Wallet/ManageTokensScreen";
import { MiniWalletScreen } from "@/screens/Mini/Wallet/MiniWalletScreen";
import SelectTokenScreen from "@/screens/Mini/Wallet/SelectTokenScreen";
import SendToriScreen from "@/screens/Mini/Wallet/SendToriScreen";
import SendingToriScreen from "@/screens/Mini/Wallet/SendingToriScreen";
import TransactionDetailScreen from "@/screens/Mini/Wallet/TransactionDetailScreen";
import { CreatePasswordWallet } from "@/screens/Wallet/Screens/CreatePasswordWallet";
import { CreateWalletScreen } from "@/screens/Wallet/Screens/CreateWalletScreen";
import { BrowserDetail } from "@/screens/WebView/BrowserDetail";
import { BrowserScreen, SearchWebViewScreen } from "@/screens/WebView/BrowserScreen";
import { selectIsChatActivated } from "@/store/slices/message";
import { RootStackParamList } from "@/utils/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

export type MiniTabScreenFC<T extends keyof RootStackParamList> = React.FC<{
  navigation: BottomTabNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
}>;

const MainTab = () => {
  const isChatActivated = useSelector(selectIsChatActivated);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: secondaryColor,
        tabBarIcon: (props) => {
          return <TabBarIcon {...props} title={route.name} />;
        },
        tabBarStyle: { backgroundColor: neutral00, borderTopWidth: 0 },
      })}
      initialRouteName={isChatActivated ? "MiniChats" : "MiniFeeds"}
    >
      {/* <Tab.Screen
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
      /> */}
      <Tab.Screen
        name="Browser"
        options={{ header: () => null, title: "Browser" }}
        component={BrowserScreen}
      />
    </Tab.Navigator>
  );
};

export const getMiniModeScreens = () => {
  return (
    <>
      <Stack.Screen
        name="ModeSelection"
        component={ModeSelectionScreen}
        options={{ header: () => null, title: "" }}
      />
      <Stack.Screen
        name="ChatActivation"
        component={ChatActivationScreen}
        options={{
          header: () => null,
          title: "",
        }}
      />

      <Stack.Screen
        name="MiniTabs"
        options={{ header: () => null }}
        component={MainTab}
      />

      <Stack.Screen
        name="MiniCreatePost"
        component={MiniCreatePostScreen}
        options={{
          header: () => null,
          title: "",
        }}
      />

      <Stack.Screen
        name="CreateWallet"
        component={CreateWalletScreen}
        options={{
          header: () => null,
          title: "",
        }}
      />
      <Stack.Screen
        name="CreatePasswordWallet"
        component={CreatePasswordWallet}
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
        name="MiniProfile"
        component={ProfileScreen}
        options={{
          header: () => null,
          title: "Profile",
          presentation: "containedTransparentModal",
        }}
      />
      <Stack.Screen
        name="MiniProfileDetail"
        component={ProfileDetailScreen}
        options={{
          header: () => null,
          title: "Profile",
          presentation: "containedTransparentModal",
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
        name="MiniChatCreateAccount"
        component={MiniCreateAccount}
        options={{
          header: () => null,
          title: "New Conversation",
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen
        name="MiniFriend"
        component={MiniFriendScreen}
        options={{
          header: () => null,
          title: "Friends",
          presentation: "containedTransparentModal",
        }}
      />
      <Stack.Screen
        name="MiniNewGroup"
        component={NewGroupScreen}
        options={{
          header: () => null,
          title: "New Group",
          presentation: "containedTransparentModal",
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
        name="MiniPreferencesSetting"
        component={PreferencesSettingScreen}
        options={{
          header: () => null,
          title: "Settings",
        }}
      />
      <Stack.Screen
        name="MiniChatProfile"
        component={MiniChatProfileScreen}
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
        name="MiniAddFriend"
        component={MiniAddFriendScreen}
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
        name="MiniFaceLogin"
        component={FaceIdLoginScreen}
        options={{
          header: () => null,
          title: "Log in with a FaceID",
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
      <Stack.Screen
        name="ChangeNetwork"
        component={ChangeNetworkScreen}
        options={{
          header: () => null,
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{
          header: () => null,
          title: "About Screen",
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen
        name="MiniManageTokens"
        component={ManageTokensScreen}
        options={{
          header: () => null,
          title: "Manage Tokens",
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen
        name="MiniAddCustomToken"
        component={AddCustomTokenScreen}
        options={{
          header: () => null,
          title: "Add Custom Token",
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen
        name="MiniSelectToken"
        component={SelectTokenScreen}
        options={{
          header: () => null,
          title: "Select Token",
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen
        name="MiniDepositTORI"
        component={DepositTORIScreen}
        options={{
          header: () => null,
          title: "Deposit TORI",
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen
        name="MiniSendTori"
        component={SendToriScreen}
        options={{
          header: () => null,
          title: "Send TORI",
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen
        name="MiniSendingTori"
        component={SendingToriScreen}
        options={{
          header: () => null,
          title: "Sending TOKEN",
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen
        name="MiniTransactionDetail"
        component={TransactionDetailScreen}
        options={{
          header: () => null,
        }}
      />
      <Stack.Screen
        name="ConnectLedger"
        component={ConnectLedgerScreen}
        options={{
          header: () => null,
          title: "",
        }}
      />
      <Stack.Screen
        name="MiniGroupActions"
        component={GroupActionScreen}
        options={{
          header: () => null,
          title: "",
        }}
      />
      <Stack.Screen
        name="BrowserDetail"
        component={BrowserDetail}
        options={{
          header: () => null,
          title: "",
        }}
      />
    </>
  );
};
