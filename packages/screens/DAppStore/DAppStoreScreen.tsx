import React, { useState } from "react";
import { useWindowDimensions, View } from "react-native";

import { Header } from "./components/Header";
import { LeftRail } from "./components/LeftRail";
import { RightRail } from "./components/RightRail";

import { FullWidthSeparator } from "@/components/FullWidthSeparator";
import { ScreenContainer } from "@/components/ScreenContainer";
import { ScreenTitle } from "@/components/ScreenContainer/ScreenTitle";
import { Separator } from "@/components/separators/Separator";
import { ScreenFC } from "@/utils/navigation";

export const DAppStoreScreen: ScreenFC<"DAppStore"> = () => {
  const [searchInput, setSearchInput] = useState("");
  const { width } = useWindowDimensions();
  const isMobile = width < 720;
  return (
    <ScreenContainer
      fullWidth
      headerChildren={<ScreenTitle>dApp Store</ScreenTitle>}
    >
      <Header setSearchInput={setSearchInput} />

      <FullWidthSeparator />

      <View
        style={{
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <LeftRail />

        <Separator horizontal={!isMobile} />

        <RightRail searchInput={searchInput} />
      </View>
    </ScreenContainer>
  );
};
