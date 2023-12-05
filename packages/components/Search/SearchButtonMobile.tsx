import React from "react";
import { TouchableOpacity } from "react-native";

import searchSVG from "../../../assets/icons/search.svg";
import { useSearchBar } from "../../context/SearchBarProvider";
import { layout } from "../../utils/style/layout";
import { SVG } from "../SVG";
import { LegacyTertiaryBox } from "../boxes/LegacyTertiaryBox";

export const SearchButtonMobile: React.FC = () => {
  const { setSearchModalMobileOpen } = useSearchBar();
  return (
    <TouchableOpacity onPress={() => setSearchModalMobileOpen(true)}>
      <LegacyTertiaryBox
        noBrokenCorners
        mainContainerStyle={{
          flexDirection: "row",
          paddingHorizontal: layout.spacing_x1,
        }}
        height={32}
        width={32}
      >
        <SVG source={searchSVG} width={16} height={16} />
      </LegacyTertiaryBox>
    </TouchableOpacity>
  );
};
