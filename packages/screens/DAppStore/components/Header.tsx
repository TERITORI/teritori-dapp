import React from "react";
import { useWindowDimensions, View } from "react-native";

import { DropdownDappsStoreFilter } from "./Dropdown";
import { BrandText } from "../../../components/BrandText";
import { SearchInput } from "../../../components/sorts/SearchInput";
import { fontSemibold28 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export function Header({
  setSearchInput,
}: {
  setSearchInput: (arg0: string) => void;
}) {
  const handleChangeText = (e: string) => {
    setSearchInput(e);
  };
  const { width } = useWindowDimensions();
  const isMobile = width < 720;
  return (
    <View
      style={{
        flex: 1,
        marginTop: 52,
        zIndex: 2,
        alignSelf: "center",
        alignItems: "center",
        height: 250,
        width: "100%",
      }}
    >
      <BrandText style={fontSemibold28}>dApp Store</BrandText>

      <SearchInput
        style={{
          width: isMobile ? "100%" : 432,
          marginTop: layout.spacing_x3,
          marginBottom: layout.spacing_x1,
          height: 40,
        }}
        borderRadius={12}
        handleChangeText={handleChangeText}
      />

      <DropdownDappsStoreFilter />
    </View>
  );
}
