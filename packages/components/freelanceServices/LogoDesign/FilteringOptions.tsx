import React from "react";
import { View } from "react-native";

import { FilterCheckbox } from "./FilterCheckbox";
import { FilteringDropdowns } from "./FilteringDropdowns";

export const FilteringOptions = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <FilteringDropdowns />
      <FilterCheckbox />
    </View>
  );
};
