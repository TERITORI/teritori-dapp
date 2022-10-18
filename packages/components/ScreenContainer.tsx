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
  TouchableOpacity,
} from "react-native";

import secondaryCardSmSVG from "../../assets/cards/secondary-card-sm.svg";
import { useAreThereWallets } from "../hooks/useAreThereWallets";
import { useMaxResolution } from "../hooks/useMaxResolution";
import { useAppNavigation } from "../utils/navigation";
import {
  headerHeight,
  headerMarginHorizontal,
  screenContainerContentMarginHorizontal,
  walletSelectorWidth,
} from "../utils/style/layout";
import { BrandText } from "./BrandText";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { NetworkSelector } from "./NetworkSelector";
import { SVG } from "./SVG";
import { WalletSelector } from "./WalletSelector";
import { WalletsManager } from "./WalletsManager";
import { Sidebar } from "./navigation/Sidebar";

export const ScreenContainer: React.FC<{
  headerChildren?: JSX.Element;
  footerChildren?: JSX.Element;
  headerStyle?: StyleProp<ViewStyle>;
  hideSidebar?: boolean;
  customSidebar?: React.ReactNode;
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
  customSidebar,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { height } = useWindowDimensions();
  const hasMargin = !noMargin;
  const hasScroll = !noScroll;
  const marginStyle = hasMargin && {
    marginHorizontal: screenContainerContentMarginHorizontal,
  };
  const [walletsManagerVisible, setWalletsManagerVisible] = useState(false);
  const areThereWallets = useAreThereWallets();
  const navigation = useAppNavigation();
  const { width } = useMaxResolution();

  return (
    <SafeAreaView style={{ width: "100%", flex: 1 }}>
      {/*TODO: Refactor this*/}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <WalletsManager onClose={() => setModalVisible(!modalVisible)} />
      </Modal>

      <View style={styles.container}>
        {["android", "ios"].includes(Platform.OS) ||
          (!hideSidebar ? <Sidebar /> : null)}
        {!["android", "ios"].includes(Platform.OS) && customSidebar}

        <View style={{ width: "100%", flex: 1 }}>
          {/*==== Header*/}
          <Header style={headerStyle}>{headerChildren}</Header>

          <View
            style={{ width: "100%", flexDirection: "row", flex: 1, height }}
          >
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
                  <View style={[styles.childrenContainer, { width }]}>
                    {children}
                    {footerChildren && <Footer>{footerChildren}</Footer>}
                  </View>
                </ScrollView>
              ) : (
                <View
                  style={[styles.childrenContainer, { width }, marginStyle]}
                >
                  {children}
                  {footerChildren && <Footer>{footerChildren}</Footer>}
                </View>
              )}
            </View>
          </View>
          {/* 
            We render the wallet selector here with absolute position to make sure 
            the popup is on top of everything else, otherwise it's unusable
          */}
          <View
            style={{
              position: "absolute",
              flexDirection: "row",
              top: 0,
              right: headerMarginHorizontal,
              height: headerHeight,
              alignItems: "center",
            }}
          >
            <NetworkSelector style={{ marginRight: 12 }} />

            {areThereWallets ? (
              <WalletSelector
                style={{ marginRight: headerMarginHorizontal }}
                onPressAddWallet={() => navigation.navigate("Wallets")}
              />
            ) : (
              <ConnectWalletButton
                style={{ marginRight: headerMarginHorizontal }}
                onPress={() => setWalletsManagerVisible(true)}
              />
            )}
          </View>

          <WalletsManager
            visible={walletsManagerVisible}
            onClose={() => setWalletsManagerVisible(false)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    flexDirection: "row",
  },
  childrenContainer: {
    height: "100%",
    alignSelf: "center",
  },
});

// Displayed when no wallet connected. Press to connect wallet
const ConnectWalletButton: React.FC<{
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}> = ({ style, onPress }) => {
  const height = 40;

  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <SVG
        width={walletSelectorWidth}
        height={height}
        source={secondaryCardSmSVG}
        style={{ position: "absolute" }}
      />

      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          height,
          minHeight: height,
          width: walletSelectorWidth,
          minWidth: walletSelectorWidth,
        }}
      >
        <BrandText
          style={{
            fontSize: 14,
          }}
        >
          Connect wallet
        </BrandText>
      </View>
    </TouchableOpacity>
  );
};
