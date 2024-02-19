import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { RootStackParamList } from "../../utils/navigation";
import { neutral00, secondaryColor } from "../../utils/style/colors";
import { TabBarIcon } from "../TabBarIcon";

import { useOnboardedStatus } from "@/hooks/useOnboardStatus";
import { FeedPostViewScreen } from "@/screens/FeedPostView/FeedPostViewScreen";
import { NFTDetailScreen } from "@/screens/Marketplace/NFTDetailScreen";
import AboutScreen from "@/screens/Mini/About/AboutScreen";
import AddAddressBookScreen from "@/screens/Mini/AddressBook/AddAddressBookScreen";
import AddressBookScreen from "@/screens/Mini/AddressBook/AddressBookScreen";
import EditAddressBookScreen from "@/screens/Mini/AddressBook/EditAddressBookScreen";
import { MiniChatScreen } from "@/screens/Mini/Chat/MiniChatScreen";
import { MiniFriendScreen } from "@/screens/Mini/Chat/MiniFriendScreen";
import { NewConversationScreen } from "@/screens/Mini/Chat/NewConversationScreen";
import { NewGroupScreen } from "@/screens/Mini/Chat/NewGroupScreen";
import { ConnectLedgerScreen } from "@/screens/Mini/ConnectLedger/ConnectLedgerScreen";
import { ConversationScreeen } from "@/screens/Mini/Conversation/ConversationScreen";
import { DAppStoreScreen } from "@/screens/Mini/DAppStore/DAppStoreScreen";
import { MiniFeedScreen } from "@/screens/Mini/Feed/MiniFeedScreen";
import ChangeNetworkScreen from "@/screens/Mini/Network/ChangeNetworkScreen";
import NotificationScreen from "@/screens/Mini/Notifications/NotificationScreen";
import { AccountDetailsScreen } from "@/screens/Mini/Profile/AccountDetailsScreen";
import { AddAccountScreen } from "@/screens/Mini/Profile/AddAccountScreen";
import ProfileDetailScreen from "@/screens/Mini/Profile/ProfileDetailScreen";
import { ProfileScreen } from "@/screens/Mini/Profile/ProfileScreen";
import { ChangePasswordScreen } from "@/screens/Mini/Settings/ChangePasswordScreen";
import { ChatSettingScreen } from "@/screens/Mini/Settings/ChatSettingScreen";
import { ExportPrivateKeyScreen } from "@/screens/Mini/Settings/ExportPrivateKeyScreen";
import FaceIdLoginScreen from "@/screens/Mini/Settings/FaceIdLoginScreen";
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
import { CreatePassword } from "@/screens/Wallet/Screens/CreatePassword";
import { CreatePasswordWallet } from "@/screens/Wallet/Screens/CreatePasswordWallet";
import { CreateWalletScreen } from "@/screens/Wallet/Screens/CreateWalletScreen";
import { ImportWallet } from "@/screens/Wallet/Screens/ImportWallet";
import NativeWallet from "@/screens/Wallet/Screens/NativeWallet";
import { SuccessScreen } from "@/screens/Wallet/Screens/SucessScreen";

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

export const MiniModeNavigator = () => {
  const [isLoading, isOnboarded] = useOnboardedStatus();

  if (isLoading) return null;

  return (
    <Stack.Navigator
      initialRouteName={!isOnboarded ? "ModeSelection" : "NativeWallet"}
    >
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
        name="NativeWallet"
        component={NativeWallet}
        options={{ header: () => null, title: "Wallet Create" }}
      />
      <Stack.Screen
        name="MiniTabs"
        options={{ header: () => null }}
        component={MainTab}
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
        name="MiniProfileDetail"
        component={ProfileDetailScreen}
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
        name="MiniFriend"
        component={MiniFriendScreen}
        options={{
          header: () => null,
          title: "Friends",
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
        name="FeedPostView"
        component={FeedPostViewScreen}
        options={{ header: () => null, title: "Feed", animation: "fade" }}
      />
      <Stack.Screen
        name="NFTDetail"
        component={NFTDetailScreen}
        options={{ header: () => null, title: "NFT" }}
      />
    </Stack.Navigator>
  );
};
