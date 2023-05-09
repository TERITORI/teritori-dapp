import React, { useRef } from "react";
import { StyleProp, View, ViewStyle, TouchableOpacity } from "react-native";

import { SEARCH_BAR_INPUT_HEIGHT, SearchBarInput } from "./SearchBarInput";
import {
  SEARCH_RESULTS_COLLECTIONS_MARGIN,
  SEARCH_RESULTS_MARGIN,
  SearchBarResults,
} from "./SearchBarResults";
import { useDropdowns } from "../../context/DropdownsProvider";
import { useSearchBar } from "../../context/SearchBarProvider";
import { useNSNameInfo } from "../../hooks/useNSNameInfo";
import { useNSNameOwner } from "../../hooks/useNSNameOwner";
import { getCosmosNetwork, getUserId } from "../../networks";
import { useAppNavigation } from "../../utils/navigation";
import { neutral22 } from "../../utils/style/colors";
import { fontSemibold12 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { COLLECTION_VIEW_SM_WIDTH } from "../CollectionView";
import { OptimizedImage } from "../OptimizedImage";
import { TertiaryBox } from "../boxes/TertiaryBox";

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
      <SearchBarInput onInteraction={() => openDropdown(dropdownRef)} />
      {isDropdownOpen(dropdownRef) && hasSomething && (
        <TertiaryBox
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
        </TertiaryBox>
      )}
    </View>
  );
};

export const NameResult: React.FC<{
  networkId: string;
  name: string;
  style: StyleProp<ViewStyle>;
  onPress: () => void;
}> = ({ networkId, name, style, onPress }) => {
  const { nameOwner } = useNSNameOwner(networkId, name);
  const { nsInfo } = useNSNameInfo(networkId, name);
  const network = getCosmosNetwork(networkId);
  const navigation = useAppNavigation();
  const imageSize = 32;
  const content = (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <OptimizedImage
        source={{
          uri: nsInfo?.extension.image || network?.nameServiceDefaultImage,
        }}
        width={imageSize}
        height={imageSize}
        style={{
          width: imageSize,
          height: imageSize,
          borderRadius: 4,
          marginRight: 10,
          borderWidth: 1,
          borderColor: neutral22,
        }}
      />
      <BrandText style={[fontSemibold12]}>@{name}</BrandText>
    </View>
  );
  return (
    <View style={style}>
      {nameOwner ? (
        <TouchableOpacity
          onPress={() => {
            onPress();
            navigation.navigate("UserPublicProfile", {
              id: getUserId(networkId, nameOwner),
            });
          }}
        >
          {content}
        </TouchableOpacity>
      ) : (
        content
      )}
    </View>
  );
};
