import React from "react";
import { View } from "react-native";

import { SearchResultsSection } from "../../../components/Search/SearchBarResults";
import { AvatarWithName } from "../../../components/user/AvatarWithName";
import { neutral00, neutral33 } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";

const SEARCH_RESULTS_NAMES_MARGIN = layout.spacing_x1;

export const TNSResult: React.FC<{
  names: string[];
  visible: boolean;
  networkId: string;
  onSelected: (name: string) => void;
}> = ({ names, networkId, onSelected, visible }) => {
  if (!visible) return null;
  return (
    <SearchResultsSection
      title="Teritori Name Service"
      style={{
        width: "100%",
        backgroundColor: neutral00,
        marginTop: layout.spacing_x1,
        borderWidth: 1,
        borderColor: neutral33,
      }}
      isFirstSection
    >
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          margin: -SEARCH_RESULTS_NAMES_MARGIN,
        }}
      >
        {names.map((n) => (
          <AvatarWithName
            key={n}
            networkId={networkId}
            name={n}
            style={{ margin: SEARCH_RESULTS_NAMES_MARGIN }}
            onPress={() => onSelected(n)}
          />
        ))}
      </View>
    </SearchResultsSection>
  );
};
