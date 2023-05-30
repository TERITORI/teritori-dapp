import React from "react";
import { useWindowDimensions, View } from "react-native";

import { FilterCheckbox } from "./FilterCheckbox";
import { FilteringDropdowns } from "./FilteringDropdowns";
import { leftMarginMainContent } from "../../../utils/style/layout";

export const FilteringOptions = () => {
  const { width } = useWindowDimensions();
  return (
    <View
      style={{
        paddingHorizontal: leftMarginMainContent,
        flexDirection: width > 1440 ? "row" : "column",
        justifyContent: "space-between",
      }}
    >
      <FilteringDropdowns />
      <FilterCheckbox />
    </View>
  );
};
