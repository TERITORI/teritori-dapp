import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Home: undefined;
  MyCollection: undefined;
  Activity: undefined;
  Guardians: undefined;
  GuardiansGame: undefined;
  Wallets: undefined;
  Governance: undefined;
  Mint: undefined;

  Launchpad: undefined;
  MintCollection: { id: string };

  TNSHome: undefined;
  TNSExplore: undefined;
  TNSManage: undefined;
  TNSRegister: undefined;
  TNSConsultName: undefined;
  TNSMintName: undefined;
  TNSUpdateName: undefined;
  TNSBurnName: undefined;
  TNSMintPath: undefined;

  Marketplace: undefined;
  Collection: { mintAddress: string };
  CollectionActivity: { mintAddress: string };
  NFTDetail: { id: string };
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
    Activity: "activity",
    Guardians: "guardians",
    Wallets: "wallets",
    GuardiansGame: "guardians-game",
    Mint: "mint",
    Governance: "governance",
    // ==== Launchpad
    Launchpad: "launchpad",
    // Mint NFT collection
    MintCollection: "launchpad/collection/:id/mint",
    // ==== Teritori Name Service
    TNSHome: "tns",
    TNSExplore: "tns/explore",
    TNSManage: "tns/manage",
    TNSRegister: "tns/register",
    // Consult token
    TNSConsultName: "tns/token/:name",
    // Do things on token (Necessary minted and owned by the user)
    TNSMintName: "tns/tokens/:name/mint",
    TNSUpdateName: "tns/tokens/:name/update",
    TNSBurnName: "tns/tokens/:name/burn",
    TNSMintPath: "tns/tokens/:name/mint-path",
    // ==== Marketplace
    Marketplace: "marketplace",
    Collection: "collection/:mintAddress",
    CollectionActivity: "collection/:mintAddress/activity",
    NFTDetail: "nft/:id",
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
