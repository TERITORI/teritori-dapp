import React from "react";
import { View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { SearchInput } from "../../../components/sorts/SearchInput";
import { fontSemibold28 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { DropdownDappsStoreFilter } from "./Dropdown";

export function Header({
  setSearchInput,
}: {
  setSearchInput: (arg0: string) => void;
}) {
  const handleChangeText = (e: string) => {
    setSearchInput(e);
  };
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
          width: 432,
          marginTop: layout.padding_x3,
          marginBottom: layout.padding_x1,
          height: 40,
        }}
        borderRadius={12}
        handleChangeText={handleChangeText}
      />

      <DropdownDappsStoreFilter />
    </View>
  );
}
