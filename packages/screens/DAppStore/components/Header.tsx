import React from "react";
import { View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { SearchInput } from "../../../components/sorts/SearchInput";
import { fontSemibold28 } from "../../../utils/style/fonts";
import { DropdownDappsStoreFilter } from "./Dropdown";

export function Header(props: { setSearchInput: (arg0: string) => void }) {
  const handleChangeText = (e: string) => {
    props.setSearchInput(e);
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
        style={{ width: 480, marginTop: 32, marginBottom: 32 }}
        handleChangeText={handleChangeText}
      />

      <DropdownDappsStoreFilter />
    </View>
  );
}
