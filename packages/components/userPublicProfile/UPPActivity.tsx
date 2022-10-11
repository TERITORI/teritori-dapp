import React from "react";
import { View } from "react-native";

import { layout } from "../../utils/style/layout";
import { FilterButton } from "../sorts/FilterButton";
import { SearchInput } from "../sorts/SearchInput";

export const UPPActivity: React.FC = () => {
  return (
    <>
      <View style={{ flexDirection: "row", width: "100%" }}>
        <FilterButton style={{ marginRight: layout.padding_x2 }} />
        <SearchInput />
      </View>
    </>
  );
};
