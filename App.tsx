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

import { Navigator } from "./packages/components/Navigator";
import { LaunchpadProvider } from "./packages/context/LaunchpadProvider";
import NSBContextProvider from "./packages/context/NSBProvider";
import { SolanaBalanceProvider } from "./packages/context/SolanaBalanceProvider";
import { SolanaOwnedNFTsProvider } from "./packages/context/SolanaOwnedNFTsProvider";
import { TeritoriBalanceProvider } from "./packages/context/TeritoriBalanceProvider";
import { WalletsProvider } from "./packages/context/WalletsProvider";
import { SigningCosmWasmProvider } from "./packages/context/cosmwasm";
import { store } from "./packages/store/store";
import { linking } from "./packages/utils/navigation";
import FeedbacksContextProvider from "./packages/context/FeedbacksProvider"

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
                  <SigningCosmWasmProvider>
                    <FeedbacksContextProvider>
                      <NSBContextProvider>
                        <LaunchpadProvider>
                          <StatusBar style="inverted" />
                          <Navigator />
                        </LaunchpadProvider>
                      </NSBContextProvider>
                    </FeedbacksContextProvider>
                  </SigningCosmWasmProvider>
                </SolanaOwnedNFTsProvider>
              </TeritoriBalanceProvider>
            </SolanaBalanceProvider>
          </WalletsProvider>
        </ReduxProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
