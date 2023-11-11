import React from "react";
import {
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
  View,
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
          flex: 1,
          flexDirection: "row",
          width: "100%",
          backgroundColor: theme.backgroundColor,
        }}
      >
        <SideBar />
        <View style={{ flex: 1, width: "100%" }}>
          <Header onBackPress={onBackPress} headerTitle={headerTitle} />
          <View
            style={{ width: "100%", flexDirection: "row", flex: 1, height }}
          >
            <View
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ScrollView
                style={{ width: "100%", flex: 1 }}
                contentContainerStyle={{ paddingVertical: 40 }}
              >
                <View
                  style={{
                    flex: 1,
                    width: "100%",
                    height: "100%",
                    alignSelf: "center",
                  }}
                >
                  {children}
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
