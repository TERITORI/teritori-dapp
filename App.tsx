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
import { Platform, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";

import { BrandText } from "./packages/components/BrandText";
import { Navigator } from "./packages/components/navigation/Navigator";
import { DropdownsContextProvider } from "./packages/context/DropdownsProvider";
import { FeedbacksContextProvider } from "./packages/context/FeedbacksProvider";
import { SidebarContextProvider } from "./packages/context/SidebarProvider";
import { TNSContextProvider } from "./packages/context/TNSProvider";
import { TransactionModalsProvider } from "./packages/context/TransactionModalsProvider";
import { WalletsProvider } from "./packages/context/WalletsProvider";
import { store } from "./packages/store/store";
import { linking } from "./packages/utils/navigation";
import { neutral00 } from "./packages/utils/style/colors";

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

  if (Platform.OS !== "web") {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: neutral00,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <BrandText>⛩️ Not available on mobile for now ⛩️</BrandText>
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <FormProvider<DefaultForm> {...methods}>
        <NavigationContainer linking={linking}>
          <SafeAreaProvider>
            <ReduxProvider store={store}>
              <FeedbacksContextProvider>
                <DropdownsContextProvider>
                  <WalletsProvider>
                    <TransactionModalsProvider>
                      <TNSContextProvider>
                        <SidebarContextProvider>
                          <StatusBar style="inverted" />
                          <Navigator />
                        </SidebarContextProvider>
                      </TNSContextProvider>
                    </TransactionModalsProvider>
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
