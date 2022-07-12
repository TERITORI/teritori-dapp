import {
  useFonts,
  Exo_600SemiBold,
  Exo_500Medium,
} from "@expo-google-fonts/exo";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";

import { LaunchpadProvider } from "./packages/components/LaunchpadProvider";
import { Navigator } from "./packages/components/Navigator";
import { SolanaBalanceProvider } from "./packages/components/SolanaBalanceProvider";
import { SolanaOwnedNFTsProvider } from "./packages/components/SolanaOwnedNFTsProvider";
import { TeritoriBalanceProvider } from "./packages/components/TeritoriBalanceProvider";
import { WalletsProvider } from "./packages/components/WalletsProvider";
import { store } from "./packages/store/store";
import { linking } from "./packages/utils/navigation";

export default function App() {
  const [fontsLoaded] = useFonts({
    Exo_500Medium,
    Exo_600SemiBold,
  });

  // FIXME: Fonts don't load on electron
  if (Platform.OS !== "web" && !fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer linking={linking}>
      <SafeAreaProvider>
        <ReduxProvider store={store}>
          <WalletsProvider>
            <SolanaBalanceProvider>
              <TeritoriBalanceProvider>
                <SolanaOwnedNFTsProvider>
                  <LaunchpadProvider>
                    <StatusBar style="inverted" />
                    <Navigator />
                  </LaunchpadProvider>
                </SolanaOwnedNFTsProvider>
              </TeritoriBalanceProvider>
            </SolanaBalanceProvider>
          </WalletsProvider>
        </ReduxProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
