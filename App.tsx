import {
  useFonts,
  Exo_600SemiBold,
  Exo_500Medium,
  Exo_700Bold,
} from "@expo-google-fonts/exo";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { MetaMaskProvider } from "metamask-react";
import React, { useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MenuProvider } from "react-native-popup-menu";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";

import { Navigator } from "./packages/components/navigation/Navigator";
import { DropdownsContextProvider } from "./packages/context/DropdownsProvider";
import { FeedbacksContextProvider } from "./packages/context/FeedbacksProvider";
import { MessageContextProvider } from "./packages/context/MessageProvider";
import { SearchBarContextProvider } from "./packages/context/SearchBarProvider";
import { TNSMetaDataListContextProvider } from "./packages/context/TNSMetaDataListProvider";
import { TNSContextProvider } from "./packages/context/TNSProvider";
import { TransactionModalsProvider } from "./packages/context/TransactionModalsProvider";
import { WalletsProvider } from "./packages/context/WalletsProvider";
import { store } from "./packages/store/store";
import { handleAstilectronMessages } from "./packages/utils/astilectron";
import { linking } from "./packages/utils/navigation";
import { weshClient } from "./packages/weshnet/client";
SplashScreen.preventAutoHideAsync();
handleAstilectronMessages();

const bootWesh = async () => {
  if (Platform.OS === "web") {
    return;
  }
  try {
    const WeshnetModule = require("./modules/weshd");
    const port = await WeshnetModule.getPort();
    WeshnetModule.boot();

    setTimeout(() => {
      weshClient.createClient(port);
    }, 15 * 1000);
  } catch (err) {
    console.log("bootWesh", err);
  }
};
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

  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync();
    await bootWesh();
  }, []);

  // FIXME: Fonts don't load on electron
  if (Platform.OS !== "web" && !fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
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
                          <TransactionModalsProvider>
                            <TNSContextProvider>
                              <TNSMetaDataListContextProvider>
                                <MessageContextProvider>
                                  <MenuProvider>
                                    <StatusBar style="inverted" />
                                    <Navigator />
                                  </MenuProvider>
                                </MessageContextProvider>
                              </TNSMetaDataListContextProvider>
                            </TNSContextProvider>
                          </TransactionModalsProvider>
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
    </GestureHandlerRootView>
  );
}
