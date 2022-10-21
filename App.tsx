import {
  useFonts,
  Exo_600SemiBold,
  Exo_500Medium,
  Exo_700Bold,
} from "@expo-google-fonts/exo";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";

import { Navigator } from "./packages/components/navigation/Navigator";
import { DropdownsContextProvider } from "./packages/context/DropdownsProvider";
import { FeedbacksContextProvider } from "./packages/context/FeedbacksProvider";
import { SidebarContextProvider } from "./packages/context/SidebarProvider";
import { SolanaBalanceProvider } from "./packages/context/SolanaBalanceProvider";
import { SolanaOwnedNFTsProvider } from "./packages/context/SolanaOwnedNFTsProvider";
import { TNSContextProvider } from "./packages/context/TNSProvider";
import { TeritoriBalanceProvider } from "./packages/context/TeritoriBalanceProvider";
import { WalletsProvider } from "./packages/context/WalletsProvider";
import { store } from "./packages/store/store";
import { linking } from "./packages/utils/navigation";

const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
      <FormProvider {...methods}>
        <NavigationContainer linking={linking}>
          <SafeAreaProvider>
            <ReduxProvider store={store}>
              <FeedbacksContextProvider>
                <DropdownsContextProvider>
                  <WalletsProvider>
                    <SolanaBalanceProvider>
                      <TeritoriBalanceProvider>
                        <SolanaOwnedNFTsProvider>
                          <TNSContextProvider>
                            <SidebarContextProvider>
                              <StatusBar style="inverted" />
                              <Navigator />
                            </SidebarContextProvider>
                          </TNSContextProvider>
                        </SolanaOwnedNFTsProvider>
                      </TeritoriBalanceProvider>
                    </SolanaBalanceProvider>
                  </WalletsProvider>
                </DropdownsContextProvider>
              </FeedbacksContextProvider>
            </ReduxProvider>
          </SafeAreaProvider>
        </NavigationContainer>
      </FormProvider>
    </QueryClientProvider>
  );
}
