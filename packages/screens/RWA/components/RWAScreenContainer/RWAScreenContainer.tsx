import React from "react";
import {
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";

import { Header, HeaderProps } from "./Header";
import { SideBar } from "./SideBar/SideBar";
import { useTheme } from "../../../../hooks/useTheme";

type RWAScreenContainerProps = HeaderProps & {
  children: React.ReactNode;
};

export const RWAScreenContainer: React.FC<RWAScreenContainerProps> = ({
  children,
  headerTitle,
  onBackPress,
}) => {
  const { height } = useWindowDimensions();
  const theme = useTheme();
  return (
    <SafeAreaView style={{ width: "100%", flex: 1 }}>
      <View
        style={{
          ...ScreenContainerCStyle,
          backgroundColor: theme.backgroundColor,
        }}
      >
        <SideBar />
        <View style={{ flex: 1, width: "100%" }}>
          <Header onBackPress={onBackPress} headerTitle={headerTitle} />
          <View
            style={{ width: "100%", flexDirection: "row", flex: 1, height }}
          >
            <View style={ScrollViewContainerCStyle}>
              <ScrollView
                style={{ width: "100%" }}
                contentContainerStyle={{ paddingVertical: 40 }}
              >
                <View style={ChildrenContainerCStyle}>{children}</View>
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const ScreenContainerCStyle: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  width: "100%",
};

const ScrollViewContainerCStyle: ViewStyle = {
  flex: 1,
  width: "100%",
  height: "100%",
};

const ChildrenContainerCStyle: ViewStyle = {
  flex: 1,
  width: "100%",
  height: "100%",
};
