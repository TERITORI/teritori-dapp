import React from "react";
import {
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";

import { Header, HeaderMobile, HeaderProps } from "./Header";
import { Sidebar, SidebarMobile } from "./Sidebar/Sidebar";
import { useIsMobile } from "../../../../hooks/useIsMobile";
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
  const isMobile = useIsMobile();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          backgroundColor: theme.backgroundColor,
        }}
      >
        {isMobile ? <SidebarMobile /> : <Sidebar />}
        <View style={{ flex: 1 }}>
          {isMobile ? (
            <HeaderMobile onBackPress={onBackPress} headerTitle={headerTitle} />
          ) : (
            <Header onBackPress={onBackPress} headerTitle={headerTitle} />
          )}
          <View style={{ flexDirection: "row", flex: 1, height }}>
            <View style={{ flex: 1, height: "100%" }}>
              <ScrollView contentContainerStyle={{ paddingVertical: 40 }}>
                <View>{children}</View>
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
