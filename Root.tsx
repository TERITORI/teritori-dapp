import {
  Exo_500Medium,
  Exo_600SemiBold,
  Exo_700Bold,
  useFonts,
} from "@expo-google-fonts/exo";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { MetaMaskProvider } from "metamask-react";
import Plausible from "plausible-tracker";
import React, { memo, ReactNode, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Platform, Text, TextStyle, View } from "react-native";
import { ClickOutsideProvider as DropdownsProvider } from "react-native-click-outside";
import {
  enableLegacyWebImplementation,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { MenuProvider } from "react-native-popup-menu";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { MultisigDeauth } from "./packages/components/multisig/MultisigDeauth";
import { Navigator } from "./packages/components/navigation/Navigator";
import { FeedbacksContextProvider } from "./packages/context/FeedbacksProvider";
import { MediaPlayerContextProvider } from "./packages/context/MediaPlayerProvider";
import { MessageContextProvider } from "./packages/context/MessageProvider";
import { SearchBarContextProvider } from "./packages/context/SearchBarProvider";
import { TNSMetaDataListContextProvider } from "./packages/context/TNSMetaDataListProvider";
import { TNSContextProvider } from "./packages/context/TNSProvider";
import { TransactionModalsProvider } from "./packages/context/TransactionModalsProvider";
import { WalletControlContextProvider } from "./packages/context/WalletControlProvider";
import {
  useWallets,
  WalletsProvider,
} from "./packages/context/WalletsProvider";
import { useSelectedNetworkId } from "./packages/hooks/useSelectedNetwork";
import useSelectedWallet from "./packages/hooks/useSelectedWallet";
import { getAvailableApps } from "./packages/screens/DAppStore/query/getFromFile";
import { setAvailableApps } from "./packages/store/slices/dapps-store";
import { setSelectedWalletId } from "./packages/store/slices/settings";
import { persistor, store, useAppDispatch } from "./packages/store/store";
import { isElectron } from "./packages/utils/isElectron";
import { linking } from "./packages/utils/navigation";

if (!globalThis.Buffer) {
  globalThis.Buffer = require("buffer").Buffer;
}

if (Platform.OS === "web") {
  const plausible = Plausible({
    domain: "app.teritori.com",
  });
  plausible.enableAutoPageviews();
}

const queryClient = new QueryClient();

// it's here just to fix a TS2589 error
type DefaultForm = {
  novalue: string;
};
// this is required for react-native-gesture-handler to work on web
enableLegacyWebImplementation(true);
// ^ required for drog and drop on the dAppStore

export default function App() {
  const methods = useForm<DefaultForm>();
  const [fontsLoaded] = useFonts({
    Exo_500Medium,
    Exo_600SemiBold,
    Exo_700Bold,
  });

  // FIXME: Fonts don't load on electron
  if (isElectron() && !fontsLoaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PersistGate
            loading={
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "black",
                }}
              />
            }
            persistor={persistor}
          >
            <QueryClientProvider client={queryClient}>
              <FormProvider<DefaultForm> {...methods}>
                <MetaMaskProvider>
                  <NavigationContainer linking={linking}>
                    <SafeAreaProvider>
                      <FeedbacksContextProvider>
                        <DropdownsProvider>
                          <WalletsProvider>
                            <WalletSyncer />
                            <DappStoreApps />
                            <MultisigDeauth />
                            <WalletControlContextProvider>
                              <SearchBarContextProvider>
                                <TransactionModalsProvider>
                                  <TNSContextProvider>
                                    <TNSMetaDataListContextProvider>
                                      <MenuProvider>
                                        <MessageContextProvider>
                                          <MediaPlayerContextProvider>
                                            <StatusBar
                                              style={
                                                Platform.OS === "android"
                                                  ? "light"
                                                  : "inverted"
                                              }
                                            />
                                            <Navigator />
                                          </MediaPlayerContextProvider>
                                        </MessageContextProvider>
                                      </MenuProvider>
                                    </TNSMetaDataListContextProvider>
                                  </TNSContextProvider>
                                </TransactionModalsProvider>
                              </SearchBarContextProvider>
                            </WalletControlContextProvider>
                          </WalletsProvider>
                        </DropdownsProvider>
                      </FeedbacksContextProvider>
                    </SafeAreaProvider>
                  </NavigationContainer>
                </MetaMaskProvider>
              </FormProvider>
            </QueryClientProvider>
          </PersistGate>
        </GestureHandlerRootView>
      </ReduxProvider>
    </ErrorBoundary>
  );
}

class ErrorBoundary extends React.Component<{ children: ReactNode }> {
  state: {
    hasError: boolean;
    error?: unknown;
    catchError?: unknown;
    catchInfo?: React.ErrorInfo;
  };

  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown) {
    console.log("derived state from error");
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.log("did catch");
    console.error(error, info);
    this.setState({ catchError: error, catchInfo: info });
  }

  render() {
    if (this.state.hasError) {
      console.log("rendering error boundary");
      // You can render any custom fallback UI
      return (
        <View style={{ backgroundColor: "black", height: "100%" }}>
          <Text style={errorBoundaryTextCStyle}>{`${this.state.error}`}</Text>
          {this.state.error !== this.state.catchError && (
            <Text
              style={errorBoundaryTextCStyle}
            >{`${this.state.catchError}`}</Text>
          )}
          <Text style={errorBoundaryTextCStyle}>
            {this.state.catchInfo?.componentStack}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const errorBoundaryTextCStyle: TextStyle = { color: "white" };

const WalletSyncer: React.FC = memo(() => {
  const selectedWallet = useSelectedWallet();
  const selectedNetworkId = useSelectedNetworkId();
  const { wallets } = useWallets();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!selectedWallet || selectedWallet.networkId !== selectedNetworkId) {
      const newWallet = wallets.find((w) => w.networkId === selectedNetworkId);
      dispatch(setSelectedWalletId(newWallet?.id));
    }
  }, [dispatch, selectedNetworkId, selectedWallet, wallets]);
  return null;
});

const DappStoreApps: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const dAppStoreValues = getAvailableApps();
    if (Platform.OS !== "web") {
      // setSelectedApps([]);
      // setAvailableApps({});
      const allowedApps = [
        "marketplace",
        "staking",
        "social-feed",
        "organizations",
        "governance",
        "toriwallet",
        "namespace",
        "toripunks",
        "teritori-staking",
        "teritori-explorer",
        "mintscan",
      ];
      delete dAppStoreValues.bookmarks;
      delete dAppStoreValues["coming-soon"];

      Object.values(dAppStoreValues).map((group) => {
        Object.values(group.options).map((app) => {
          if (!allowedApps.includes(app.id)) {
            delete dAppStoreValues[app.groupKey].options[app.id];
          }
        });
      });
    }
    dispatch(setAvailableApps(dAppStoreValues));
  }, [dispatch]);

  return null;
};
