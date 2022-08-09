import React, { ReactElement, useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from "react-native";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { WalletsManager } from "./WalletsManager";

export const ScreenContainer: React.FC<{
  headerChildren?: ReactElement;
}> = ({ children, headerChildren }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { height } = useWindowDimensions();

  return (
    <SafeAreaView style={{ width: "100%", flex: 1 }}>
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <WalletsManager onClose={() => setModalVisible(!modalVisible)} />
      </Modal>

      <View style={styles.container}>
        <View style={{ width: "100%", flex: 1 }}>
          <Header>{headerChildren}</Header>

          <View
            style={{ width: "100%", flexDirection: "row", flex: 1, height }}
          >
            {["android", "ios"].includes(Platform.OS) || <Sidebar />}

            <ScrollView
              style={{ width: "100%", flex: 1 }}
              contentContainerStyle={{ flex: 1 }}
            >
              <>{children}</>
            </ScrollView>

            {/*TODO: Merge ScreenContainerNSB in this ScreenContainer (Footer, Toasts, ect..)*/}
          </View>
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
