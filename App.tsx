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
import React, { memo, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Platform, View } from "react-native";
import { MenuProvider } from "react-native-popup-menu";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";

import { BrandText } from "./packages/components/BrandText";
import { Navigator } from "./packages/components/navigation/Navigator";
import { DropdownsContextProvider } from "./packages/context/DropdownsProvider";
import { FeedbacksContextProvider } from "./packages/context/FeedbacksProvider";
import { MusicplayerContextProvider } from "./packages/context/MusicplayerProvider";
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
import { setSelectedWalletId } from "./packages/store/slices/settings";
import { store, useAppDispatch } from "./packages/store/store";
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
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <FormProvider<DefaultForm> {...methods}>
          <MetaMaskProvider>
            <NavigationContainer linking={linking}>
              <SafeAreaProvider>
                <ReduxProvider store={store}>
                  <FeedbacksContextProvider>
                    <DropdownsContextProvider>
                      <WalletsProvider>
                        <WalletSyncer />
                        <SearchBarContextProvider>
                          <TransactionModalsProvider>
                            <TNSContextProvider>
                              <TNSMetaDataListContextProvider>
                                <MenuProvider>
                                  <MusicplayerContextProvider>
                                    <StatusBar style="inverted" />
                                    <Navigator />
                                  </MusicplayerContextProvider>
                                </MenuProvider>
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
    </ErrorBoundary>
  );
}

class ErrorBoundary extends React.Component {
  state: {
    hasError: boolean;
    error?: unknown;
    catchError?: unknown;
    catchInfo?: React.ErrorInfo;
  };

  constructor(props: object) {
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
          <BrandText>{`${this.state.error}`}</BrandText>
          {this.state.error !== this.state.catchError && (
            <BrandText>{`${this.state.catchError}`}</BrandText>
          )}
          <BrandText>{this.state.catchInfo?.componentStack}</BrandText>
        </View>
      );
    }

    return this.props.children;
  }
}

const WalletSyncer: React.FC = memo(() => {
  const selectedWallet = useSelectedWallet();
  const selectedNetworkId = useSelectedNetworkId();
  const { wallets } = useWallets();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!selectedWallet || selectedWallet.networkId !== selectedNetworkId) {
      dispatch(
        setSelectedWalletId(
          wallets.find((w) => w.networkId === selectedNetworkId)?.id
        )
      );
    }
  }, [dispatch, selectedNetworkId, selectedWallet, wallets]);
  return null;
});
