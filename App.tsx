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
import Plausible from "plausible-tracker";
import React, { ReactNode, memo, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Platform, View, Text, TextStyle } from "react-native";
import { enableLegacyWebImplementation } from "react-native-gesture-handler";
import { MenuProvider } from "react-native-popup-menu";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { MultisigDeauth } from "./packages/components/multisig/MultisigDeauth";
import { Navigator } from "./packages/components/navigation/Navigator";
import { DropdownsContextProvider } from "./packages/context/DropdownsProvider";
import { FeedbacksContextProvider } from "./packages/context/FeedbacksProvider";
import { MediaPlayerContextProvider } from "./packages/context/MediaPlayerProvider";
import { MessageContextProvider } from "./packages/context/MessageProvider";
import { SearchBarContextProvider } from "./packages/context/SearchBarProvider";
import { TNSMetaDataListContextProvider } from "./packages/context/TNSMetaDataListProvider";
import { TNSContextProvider } from "./packages/context/TNSProvider";
import { TransactionModalsProvider } from "./packages/context/TransactionModalsProvider";
import {
  WalletsProvider,
  useWallets,
} from "./packages/context/WalletsProvider";
import { useSelectedNetworkId } from "./packages/hooks/useSelectedNetwork";
import useSelectedWallet from "./packages/hooks/useSelectedWallet";
import { getAvailableApps } from "./packages/screens/DAppStore/query/getFromFile";
import { setAvailableApps } from "./packages/store/slices/dapps-store";
import { setSelectedWalletId } from "./packages/store/slices/settings";
import { persistor, store, useAppDispatch } from "./packages/store/store";
import { linking } from "./packages/utils/navigation";

const plausible = Plausible({
  domain: "app.teritori.com",
});
plausible.enableAutoPageviews();

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
  if (Platform.OS !== "web" && !fontsLoaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <ReduxProvider store={store}>
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
                      <DropdownsContextProvider>
                        <WalletsProvider>
                          <WalletSyncer />
                          <DappStoreApps />
                          <MultisigDeauth />
                          <SearchBarContextProvider>
                            <TransactionModalsProvider>
                              <TNSContextProvider>
                                <TNSMetaDataListContextProvider>
                                  <MenuProvider>
                                    <MessageContextProvider>
                                      <MediaPlayerContextProvider>
                                        <StatusBar style="inverted" />
                                        <Navigator />
                                      </MediaPlayerContextProvider>
                                    </MessageContextProvider>
                                  </MenuProvider>
                                </TNSMetaDataListContextProvider>
                              </TNSContextProvider>
                            </TransactionModalsProvider>
                          </SearchBarContextProvider>
                        </WalletsProvider>
                      </DropdownsContextProvider>
                    </FeedbacksContextProvider>
                  </SafeAreaProvider>
                </NavigationContainer>
              </MetaMaskProvider>
            </FormProvider>
          </QueryClientProvider>
        </PersistGate>
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
      console.log("syncing wallet", newWallet);
      dispatch(setSelectedWalletId(newWallet?.id));
    }
  }, [dispatch, selectedNetworkId, selectedWallet, wallets]);
  return null;
});

const DappStoreApps: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const dAppStoreValues = getAvailableApps();

    dispatch(setAvailableApps(dAppStoreValues));
  }, [dispatch]);

  return null;
};
