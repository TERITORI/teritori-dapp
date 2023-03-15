import React, { useState } from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { FullHeightSeparator } from "../../components/FullHeightSeparator";
import { FullWidthSeparator } from "../../components/FullWidthSeparator";
import { ScreenContainer } from "../../components/ScreenContainer";
import { ScreenFC } from "../../utils/navigation";
import { Header } from "./components/Header";
import { LeftRail } from "./components/LeftRail";
import { RightRail } from "./components/RightRail";

export const DAppStore: ScreenFC<"DAppStore"> = () => {
  const [searchInput, setSearchInput] = useState("");

  return (
    <ScreenContainer
      fullWidth
      headerChildren={<BrandText>dApp Store</BrandText>}
    >
      <Header setSearchInput={setSearchInput} />

      <FullWidthSeparator />

      <View style={{ flexDirection: "row", minHeight: "inherit" }}>
        <LeftRail />

        <FullHeightSeparator />

        <RightRail searchInput={searchInput} />
      </View>
    </ScreenContainer>
  );
};
