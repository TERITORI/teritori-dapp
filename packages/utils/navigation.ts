import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Home: undefined;
  MyCollection: undefined;
  Activities: undefined;
  Guardians: undefined;
  GuardiansGame: undefined;
  Launchpad: undefined;
  Marketplace: undefined;
  Wallets: undefined;
  Governance: undefined;
  Mint: undefined;
  NSBHome: undefined;
  NSBExplore: undefined;
  NSBManage: undefined;
  NSBRegister: undefined;
  NSBConsultName: undefined;
  NSBEditCreateName: undefined;
};

export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const useAppNavigation = () => useNavigation<AppNavigationProp>();

export const getCurrentRouteName = (navigation: AppNavigationProp) => {
  const routes = navigation.getState().routes;
  return routes[routes.length - 1].name;
};

const navConfig = {
  screens: {
    Home: "",
    MyCollection: "my-collection",
    Activities: "activities",
    Guardians: "guardians",
    Wallets: "wallets",
    Marketplace: "marketplace",
    GuardiansGame: "guardians-game",
    Launchpad: "launchpad",
    Governance: "governance",
    Mint: "mint",
    NSBHome: "nsb",
    NSBExplore: "nsb/explore",
    NSBManage: "nsb/manage",
    NSBRegister: "nsb/register",
    NSBConsultName: "nsb/consult-name",
    NSBEditCreateName: "nsb/edit-create-name",
  },
};

export const linking = {
  prefixes: [],
  config: navConfig,
};
