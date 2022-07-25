import React, { ReactElement, useContext } from "react";
import { SafeAreaView, View, StyleSheet, ScrollView } from "react-native";

import { initialNsbError, NSBContext } from "../context/NSBProvider";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ToastError } from "./toasts/ToastError";
import { ToastSuccess } from "./toasts/ToastSuccess";

//*TODO: Name ScreenContainer2 with an explicit name. Difference with ScreenContainer : Header and not SideBar, simpler, ...

export const ScreenContainer2: React.FC<{
  footerChildren?: ReactElement;
}> = ({ children, footerChildren }) => {
  const { nsbError, setNsbError, nsbSuccess, setNsbSuccess } =
    useContext(NSBContext);

  return (
    <SafeAreaView style={{ width: "100%", flex: 1 }}>
      <View style={styles.container}>
        <View
          style={{ width: "100%", flex: 1, justifyContent: "space-between" }}
        >
          <View style={{ flex: 1 }}>
            <Header />

            {nsbError && nsbError.title ? (
              <ToastError
                onPress={() => setNsbError(initialNsbError)}
                title={nsbError.title}
                message={nsbError.message}
              />
            ) : null}
            {nsbSuccess && nsbSuccess.title ? (
              <ToastSuccess
                onPress={() => setNsbSuccess(initialNsbError)}
                title={nsbSuccess.title}
                message={nsbSuccess.message}
              />
            ) : null}

            {/*TODO: Better scroll. Footer in ScrollView ? ... */}
            <ScrollView
              style={{ width: "100%", flex: 1 }}
              contentContainerStyle={{ flex: 1 }}
            >
              <>{children}</>
            </ScrollView>
          </View>

          <Footer>{footerChildren}</Footer>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
