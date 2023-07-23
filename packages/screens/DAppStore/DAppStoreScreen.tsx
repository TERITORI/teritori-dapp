import React, { useState } from "react";
import { Platform, useWindowDimensions, View } from "react-native";

import { Header } from "./components/Header";
import { LeftRail } from "./components/LeftRail";
import { RightRail } from "./components/RightRail";
import { BrandText } from "../../components/BrandText";
import { FullWidthSeparator } from "../../components/FullWidthSeparator";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Separator } from "../../components/Separator";
import { ScreenFC } from "../../utils/navigation";

export const DAppStoreScreen: ScreenFC<"DAppStore"> = () => {
  const [searchInput, setSearchInput] = useState("");
  const { width } = useWindowDimensions();
  const isMobile = width < 720;
  return (
    <ScreenContainer
      fullWidth
      headerChildren={<BrandText>dApp Store</BrandText>}
    >
      <Header setSearchInput={setSearchInput} />

      <FullWidthSeparator />

      <View
        style={{
          flexDirection: isMobile ? "column" : "row",
          minHeight: Platform.OS === "web" ? "inherit" : "100%",
        }}
      >
        <LeftRail />

        <Separator horizontal={!isMobile} />

        <RightRail searchInput={searchInput} />
      </View>
    </ScreenContainer>
  );
};
