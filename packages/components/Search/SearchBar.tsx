import React from "react";
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
import { useSearchBar } from "../../context/SearchBarProvider";
import { useClickOutside } from "../../hooks/useClickOutside";
import { COLLECTION_VIEW_SM_WIDTH } from "../CollectionView";
import { LegacyTertiaryBox } from "../boxes/LegacyTertiaryBox";

export const SearchBar: React.FC<{ style?: StyleProp<ViewStyle> }> = ({
  style,
}) => {
  const [isDropdownOpen, setDropdownState, dropdownRef] = useClickOutside();
  const { hasCollections, hasNames } = useSearchBar();
  const hasSomething = hasNames || hasCollections;

  return (
    <View
      style={[{ justifyContent: "center", alignItems: "center" }, style]}
      ref={dropdownRef}
      collapsable={false}
    >
      <SearchBarInputGlobal onInteraction={() => setDropdownState(true)} />
      {isDropdownOpen && hasSomething && (
        <LegacyTertiaryBox
          noBrokenCorners
          style={{
            position: "absolute",
            top: SEARCH_BAR_INPUT_HEIGHT + 4,
            right: 0,
          }}
          mainContainerStyle={{
            // make the results fit 3 collections horizontally
            width:
              3 * COLLECTION_VIEW_SM_WIDTH +
              4 * SEARCH_RESULTS_COLLECTIONS_MARGIN +
              2 * SEARCH_RESULTS_MARGIN +
              2, // need to add 2 arbitrary pixel to fit in tertiary box, not needed if using a view
          }}
        >
          <SearchBarResults />
        </LegacyTertiaryBox>
      )}
    </View>
  );
};
