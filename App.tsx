// eslint-disable-next-line import/order
import React from "react";
// import './expo-crypto-shim.js' --> Only for Expo SDK 48+
//import "@walletconnect/react-native-compat";
//import "@ethersproject/shims";

import {
  useFonts,
  Exo_600SemiBold,
  Exo_500Medium,
  Exo_700Bold,
} from "@expo-google-fonts/exo";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { MetaMaskProvider } from "metamask-react";
import { useForm, FormProvider } from "react-hook-form";
import { Platform } from "react-native";
import { MenuProvider } from "react-native-popup-menu";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";

import { Navigator } from "./packages/components/navigation/Navigator";
import { DropdownsContextProvider } from "./packages/context/DropdownsProvider";
import { FeedbacksContextProvider } from "./packages/context/FeedbacksProvider";
import { SidebarContextProvider } from "./packages/context/SidebarProvider";
import { TNSMetaDataListContextProvider } from "./packages/context/TNSMetaDataListProvider";
import { TNSContextProvider } from "./packages/context/TNSProvider";
import { TransactionModalsProvider } from "./packages/context/TransactionModalsProvider";
import { WalletConnectProvider } from "./packages/context/WalletConnectProvider";
import { WalletsProvider } from "./packages/context/WalletsProvider";
import { store } from "./packages/store/store";
import { linking } from "./packages/utils/navigation";

/*

const sleep = (durationms: number) =>
  new Promise((resolve) => setTimeout(resolve, durationms));

let queue: string[] = [];

(async () => {
  //let index = 0;
  while (true) {
    if (!queue.length) {
      await sleep(100);
      continue;
    }
    const msg = queue[0];
    try {
      await axios.post(
        "http://192.168.1.164:4242/push",
        msg
      );
    } catch {
      // axios.post("http://192.168.1.164:4242/push", `${JSON.stringify(err)}\n`);
      // FIXME: find a way to show error to user
    }
    queue = queue.slice(1);
    //index++;
  }
})();

const remoteLog = (...args: any[]) => {
  queue.push(JSON.stringify(args) + "\n");
};

const nativeLog = console.log;
console.log = (...args) => {
  remoteLog(...args);
  nativeLog(...args);
};
const nativeError = console.error;
console.error = (...args) => {
  remoteLog(...args);
  nativeError(...args);
};
const nativeWarn = console.warn;
console.warn = (...args) => {
  remoteLog(...args);
  nativeWarn(...args);
};

*/

const queryClient = new QueryClient();

// it's here just to fix a TS2589 error
type DefaultForm = {
  novalue: string;
};

// Web3Modal no work

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
                    <WalletConnectProvider>
                      <WalletsProvider>
                        <TransactionModalsProvider>
                          <TNSContextProvider>
                            <TNSMetaDataListContextProvider>
                              <MenuProvider>
                                <SidebarContextProvider>
                                  <StatusBar style="inverted" />
                                  <Navigator />
                                </SidebarContextProvider>
                              </MenuProvider>
                            </TNSMetaDataListContextProvider>
                          </TNSContextProvider>
                        </TransactionModalsProvider>
                      </WalletsProvider>
                    </WalletConnectProvider>
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
