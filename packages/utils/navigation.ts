import { RouteProp, useNavigation } from "@react-navigation/native";
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
  NSBMintName: undefined;
  NSBUpdateName: undefined;
  NSBBurnName: undefined;
  NSBMintPath: undefined;
};

export type AppNavigationProp = NativeStackNavigationProp<
  RootStackParamList | any
>;

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
    // Name Service Booking
    NSBHome: "nsb",
    NSBExplore: "nsb/explore",
    NSBManage: "nsb/manage",
    NSBRegister: "nsb/register",
    // Consult token
    NSBConsultName: "nsb/token/:name",
    // Do things on token (Necessary minted and owned by the user)
    NSBMintName: "nsb/tokens/:name/mint",
    NSBUpdateName: "nsb/tokens/:name/update",
    NSBBurnName: "nsb/tokens/:name/burn",
    NSBMintPath: "nsb/tokens/:name/mint-path",
  },
};

export const linking = {
  prefixes: [],
  config: navConfig,
};

// export type RootStackComponent<RouteName extends keyof RootStackParamList> = React.FC<{
//   navigation: NativeStackNavigationProp<RootStackParamList, RouteName>,
//   route: RouteProp<RootStackParamList, RouteName>
// }>
