import {
  useFonts,
  Exo_600SemiBold,
  Exo_500Medium,
  Exo_700Bold,
} from "@expo-google-fonts/exo";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { MetaMaskProvider } from "metamask-react";
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Platform } from "react-native";
import { MenuProvider } from "react-native-popup-menu";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Provider as ReduxProvider } from "react-redux";

import { Navigator } from "./packages/components/navigation/Navigator";
import { DropdownsContextProvider } from "./packages/context/DropdownsProvider";
import { FeedbacksContextProvider } from "./packages/context/FeedbacksProvider";
import { MultisigContextProvider } from "./packages/context/MultisigReducer";
import { SearchBarContextProvider } from "./packages/context/SearchBarProvider";
import { SidebarContextProvider } from "./packages/context/SidebarProvider";
import { TNSMetaDataListContextProvider } from "./packages/context/TNSMetaDataListProvider";
import { TNSContextProvider } from "./packages/context/TNSProvider";
import { TransactionModalsProvider } from "./packages/context/TransactionModalsProvider";
import { WalletsProvider } from "./packages/context/WalletsProvider";
import { store } from "./packages/store/store";
import { linking } from "./packages/utils/navigation";

const queryClient = new QueryClient();

// it's here just to fix a TS2589 error
type DefaultForm = {
  novalue: string;
};

export default function App() {
  const methods = useForm<DefaultForm>();
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
      <FormProvider<DefaultForm> {...methods}>
        <MetaMaskProvider>
          <NavigationContainer linking={linking}>
            <SafeAreaProvider>
              <ReduxProvider store={store}>
                <FeedbacksContextProvider>
                  <DropdownsContextProvider>
                    <WalletsProvider>
                      <SearchBarContextProvider>
                        <MultisigContextProvider>
                          <TransactionModalsProvider>
                            <TNSContextProvider>
                              <TNSMetaDataListContextProvider>
                                <MenuProvider>
                                  <SidebarContextProvider>
                                    <StatusBar style="inverted" />
                                    <Navigator />
                                    <Toast autoHide visibilityTime={2000} />
                                  </SidebarContextProvider>
                                </MenuProvider>
                              </TNSMetaDataListContextProvider>
                            </TNSContextProvider>
                          </TransactionModalsProvider>
                        </MultisigContextProvider>
                      </SearchBarContextProvider>
                    </WalletsProvider>
                  </DropdownsContextProvider>
                </FeedbacksContextProvider>
              </ReduxProvider>
            </SafeAreaProvider>
          </NavigationContainer>
        </MetaMaskProvider>
      </FormProvider>
    </QueryClientProvider>
  );
}
