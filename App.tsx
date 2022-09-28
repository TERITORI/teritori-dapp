import {
  useFonts,
  Exo_600SemiBold,
  Exo_500Medium,
  Exo_700Bold,
} from "@expo-google-fonts/exo";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";

import DisclaimerPopup from "./packages/components/PopupDisclaimer/DisclaimerPopup";
import { Navigator } from "./packages/components/navigation/Navigator";
import { FeedbacksContextProvider } from "./packages/context/FeedbacksProvider";
import { SolanaBalanceProvider } from "./packages/context/SolanaBalanceProvider";
import { SolanaOwnedNFTsProvider } from "./packages/context/SolanaOwnedNFTsProvider";
import { TNSContextProvider } from "./packages/context/TNSProvider";
import { TeritoriBalanceProvider } from "./packages/context/TeritoriBalanceProvider";
import { WalletsProvider } from "./packages/context/WalletsProvider";
import { store } from "./packages/store/store";
import { linking } from "./packages/utils/navigation";

export default function App() {
  const methods = useForm();
  const [fontsLoaded] = useFonts({
    Exo_500Medium,
    Exo_600SemiBold,
    Exo_700Bold,
  });

  // FIXME: Fonts don't load on electron
  if (Platform.OS !== "web" && !fontsLoaded) {
    return null;
  }

  return (
    <FormProvider {...methods}>
      <NavigationContainer linking={linking}>
        <SafeAreaProvider>
          <ReduxProvider store={store}>
            <DisclaimerPopup />
            <FeedbacksContextProvider>
              <WalletsProvider>
                <SolanaBalanceProvider>
                  <TeritoriBalanceProvider>
                    <SolanaOwnedNFTsProvider>
                      <TNSContextProvider>
                        <StatusBar style="inverted" />
                        <Navigator />
                      </TNSContextProvider>
                    </SolanaOwnedNFTsProvider>
                  </TeritoriBalanceProvider>
                </SolanaBalanceProvider>
              </WalletsProvider>
            </FeedbacksContextProvider>
          </ReduxProvider>
        </SafeAreaProvider>
      </NavigationContainer>
    </FormProvider>
  );
}
