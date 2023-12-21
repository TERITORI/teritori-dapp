import React, { useRef } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import {
  SEARCH_BAR_INPUT_HEIGHT,
  SearchBarInputGlobal,
} from "./SearchBarInput";
import {
  SEARCH_RESULTS_COLLECTIONS_MARGIN,
  SEARCH_RESULTS_MARGIN,
  SearchBarResults,
} from "./SearchBarResults";
import { useDropdowns } from "../../context/DropdownsProvider";
import { useSearchBar } from "../../context/SearchBarProvider";
import { neutral33 } from "../../utils/style/colors";
import { COLLECTION_VIEW_SM_WIDTH } from "../CollectionView";
import { Box } from "../boxes/Box";

export const SearchBar: React.FC<{ style?: StyleProp<ViewStyle> }> = ({
  style,
}) => {
  const { openDropdown, isDropdownOpen } = useDropdowns();
  const dropdownRef = useRef<View>(null);
  const { hasCollections, hasNames } = useSearchBar();
  const hasSomething = hasNames || hasCollections;

  return (
    <View
      style={[{ justifyContent: "center", alignItems: "center" }, style]}
      ref={dropdownRef}
    >
      <SearchBarInputGlobal onInteraction={() => openDropdown(dropdownRef)} />
      {isDropdownOpen(dropdownRef) && hasSomething && (
        <Box
          style={{
            position: "absolute",
            top: SEARCH_BAR_INPUT_HEIGHT + 4,
            right: 0,
            borderWidth: 1,
            borderColor: neutral33,
            width:
              3 * COLLECTION_VIEW_SM_WIDTH +
              4 * SEARCH_RESULTS_COLLECTIONS_MARGIN +
              2 * SEARCH_RESULTS_MARGIN +
              2, // need to add 2 arbitrary pixel to fit in tertiary box, not needed if using a view
          }}
        >
          <SearchBarResults />
        </Box>
      )}
    </View>
  );
};
