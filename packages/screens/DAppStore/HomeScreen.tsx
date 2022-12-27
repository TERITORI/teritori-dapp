import React, { useState } from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { FullHeightSeparator } from "../../components/FullHeightSeparator";
import { FullWidthSeparator } from "../../components/FullWidthSeparator";
import { ScreenContainer } from "../../components/ScreenContainer";
import { setAvailableApps } from "../../store/slices/dapps-store";
import { useAppDispatch } from "../../store/store";
import { ScreenFC } from "../../utils/navigation";
import { Header } from "./components/Header";
import { LeftRail } from "./components/LeftRail";
import { RightRail } from "./components/RightRail";
import { getAvailableApps } from "./query";

export const DAppStore: ScreenFC<"DAppStore"> = () => {
  const dispatch = useAppDispatch();
  const [searchInput, setSearchInput] = useState("");
  dispatch(setAvailableApps(getAvailableApps()));

  return (
    <ScreenContainer
      fullWidth
      headerChildren={<BrandText>dApp Store</BrandText>}
    >
      <Header setSearchInput={setSearchInput} />

      <FullWidthSeparator />

      <View style={{ flexDirection: "row", height: "100vh" }}>
        <LeftRail />

        <FullHeightSeparator />

        <RightRail searchInput={searchInput} />
      </View>
    </ScreenContainer>
  );
};
