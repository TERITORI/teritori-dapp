import React, { useState } from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { FullWidthSeparator } from "../../components/FullWidthSeparator";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Separator } from "../../components/Separator";
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

        <Separator horizontal />

        <RightRail searchInput={searchInput} />
      </View>
    </ScreenContainer>
  );
};
