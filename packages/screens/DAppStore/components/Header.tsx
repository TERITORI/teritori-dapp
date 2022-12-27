import React from "react";
import { View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { SearchInput } from "../../../components/sorts/SearchInput";
import { fontSemibold28 } from "../../../utils/style/fonts";

export function Header(props: { setSearchInput: (arg0: string) => void }) {
  const handleChangeText = (e: string) => {
    props.setSearchInput(e);
  };
  return (
    <View
      style={{
        flex: 1,
        marginTop: 52,
        marginBottom: 32,
        alignSelf: "center",
        alignItems: "center",
        height: 250,
      }}
    >
      <BrandText style={fontSemibold28}>dApp Store</BrandText>

      <SearchInput
        style={{ width: 480, marginTop: 32 }}
        handleChangeText={handleChangeText}
      />
    </View>
  );
}
