import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";

export type RouteName = keyof RWAStackParamList;

export type RWAStackParamList = {
  RWAHome: undefined;
};

export type AppNavigationProp = NativeStackNavigationProp<RWAStackParamList>;

export type ScreenFC<T extends keyof RWAStackParamList> = React.FC<{
  navigation: NativeStackNavigationProp<RWAStackParamList, T>;
  route: RouteProp<RWAStackParamList, T>;
}>;

export type AppRouteType<T extends keyof RWAStackParamList> = RouteProp<
  RWAStackParamList,
  T
>;

export const useAppNavigation = () => useNavigation<AppNavigationProp>();

export const rwaNavConfig: {
  screens: { [Name in keyof RWAStackParamList]: string };
} = {
  screens: {
    // === RWA
    RWAHome: "rwa-home",
  },
};

export const linking = {
  prefixes: [],
  config: rwaNavConfig,
};

export const useAppRoute = () => useRoute<RouteProp<RWAStackParamList>>();
