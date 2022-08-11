import React, { ReactElement, useContext } from "react";
import { SafeAreaView, View, StyleSheet, ScrollView } from "react-native";

import { initialTnsError, TNSContext } from "../context/TNSProvider";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ToastError } from "./toasts/ToastError";
import { ToastSuccess } from "./toasts/ToastSuccess";

//*TODO: Name ScreenContainer2 with an explicit name. Difference with ScreenContainer : Header and not SideBar, simpler, ...

export const ScreenContainer2: React.FC<{
  footerChildren?: ReactElement;
}> = ({ children, footerChildren }) => {
  const { tnsError, setTnsError, tnsSuccess, setTnsSuccess } =
    useContext(TNSContext);

  return (
    <SafeAreaView style={{ width: "100%", flex: 1 }}>
      <View style={styles.container}>
        <View
          style={{ width: "100%", flex: 1, justifyContent: "space-between" }}
        >
          <View style={{ flex: 1 }}>
            <Header />

            {tnsError && tnsError.title ? (
              <ToastError
                onPress={() => setTnsError(initialTnsError)}
                title={tnsError.title}
                message={tnsError.message}
              />
            ) : null}
            {tnsSuccess && tnsSuccess.title ? (
              <ToastSuccess
                onPress={() => setTnsSuccess(initialTnsError)}
                title={tnsSuccess.title}
                message={tnsSuccess.message}
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
