import React from "react";
import { Linking, Pressable, useWindowDimensions, View } from "react-native";
import { SparklesIcon } from "react-native-heroicons/outline";

import { DropdownDappsStoreFilter } from "./Dropdown";
import { BrandText } from "../../../components/BrandText";
import { SearchInput } from "../../../components/sorts/SearchInput";
import { fontSemibold11, fontSemibold28 } from "../../../utils/style/fonts";
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
      <Pressable
        style={{
          marginTop: layout.spacing_x3,
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
        }}
        onPress={() =>
          Linking.openURL(
            "https://github.com/TERITORI/teritori-dapp/issues/564",
          )
        }
      >
        <SparklesIcon width={32} color="white" />

        <BrandText style={fontSemibold11}>
          To be listed, submit PR on Github
        </BrandText>
      </Pressable>

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
