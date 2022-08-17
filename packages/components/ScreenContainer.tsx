import React, { useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  Platform,
} from "react-native";

import helpAreaPNG from "../../assets/help-area.png";
import logoTopPNG from "../../assets/logo-top.png";
import { useAppNavigation } from "../utils/navigation";
import { neutral33 } from "../utils/style/colors";
import { helpAreaWidth } from "../utils/style/layout";
import { headerHeight, HubHeader } from "./HubHeader";
import { Sidebar } from "./Sidebar";
import { WalletsManager } from "./WalletsManager";

export const ScreenContainer: React.FC = ({ children }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useAppNavigation();
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
        <View style={{ flexDirection: "row", width: "100%", flex: 1 }}>
          {["android", "ios"].includes(Platform.OS) || (
            <>
              <View>
                <View
                  style={{
                    height: headerHeight,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                    <Image
                      source={logoTopPNG}
                      style={{
                        width: 68,
                        height: 68,
                        resizeMode: "contain",
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <Sidebar />
              </View>
              <Image
                source={helpAreaPNG}
                style={{
                  width: helpAreaWidth,
                  borderRightWidth: 1,
                  resizeMode: "stretch",
                  borderLeftWidth: 1,
                  borderColor: neutral33,
                }}
              />
            </>
          )}
          <View style={{ width: "100%", flex: 1, height }}>
            <HubHeader />
            <ScrollView
              style={{ width: "100%", flex: 1 }}
              contentContainerStyle={{ flex: 1 }}
            >
              <>{children}</>
            </ScrollView>
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
