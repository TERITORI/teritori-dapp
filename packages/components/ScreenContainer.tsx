import React, { useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  useWindowDimensions,
  Platform,
  ViewStyle,
  StyleProp,
} from "react-native";

import { screenContainerContentMarginHorizontal } from "../utils/style/layout";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { WalletsManager } from "./WalletsManager";
import { Sidebar } from "./navigation/Sidebar";

export const ScreenContainer: React.FC<{
  headerChildren?: JSX.Element;
  footerChildren?: JSX.Element;
  headerStyle?: StyleProp<ViewStyle>;
  hideSidebar?: boolean;
  noMargin?: boolean;
  noScroll?: boolean;
}> = ({
  children,
  headerChildren,
  footerChildren,
  headerStyle,
  hideSidebar,
  noMargin,
  noScroll,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { height } = useWindowDimensions();
  const hasMargin = !noMargin;
  const hasScroll = !noScroll;
  const marginStyle = hasMargin && {
    marginHorizontal: screenContainerContentMarginHorizontal,
  };

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
          {/*==== Header*/}
          <Header style={headerStyle}>{headerChildren}</Header>

          <View
            style={{ width: "100%", flexDirection: "row", flex: 1, height }}
          >
            {["android", "ios"].includes(Platform.OS) ||
              (!hideSidebar ? <Sidebar /> : null)}

            {/*==== Scrollable screen content*/}
            <View style={{ flex: 1 }}>
              {hasScroll ? (
                <ScrollView
                  style={{ width: "100%", flex: 1 }}
                  contentContainerStyle={[
                    {
                      flex: 1,
                    },
                    marginStyle,
                  ]}
                >
                  {children}
                </ScrollView>
              ) : (
                <View style={[{ flex: 1 }, marginStyle]}>{children}</View>
              )}
              {footerChildren && <Footer>{footerChildren}</Footer>}
            </View>
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
