import React from "react";
import { TouchableOpacity } from "react-native";

import searchSVG from "../../../assets/icons/search.svg";
import { useSearchBar } from "../../context/SearchBarProvider";
import { layout } from "../../utils/style/layout";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const SearchButtonMobile: React.FC = () => {
  const { setSearchModalMobileOpen } = useSearchBar();
  return (
    <TouchableOpacity onPress={() => setSearchModalMobileOpen(true)}>
      <TertiaryBox
        noBrokenCorners
        mainContainerStyle={{
          flexDirection: "row",
          paddingHorizontal: layout.spacing_x1,
        }}
        height={32}
        width={32}
      >
        <SVG source={searchSVG} width={16} height={16} />
      </TertiaryBox>
    </TouchableOpacity>
  );
};
