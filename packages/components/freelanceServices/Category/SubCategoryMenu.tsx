import React from "react";
import { TouchableOpacity, View } from "react-native";

import chevronDown from "../../../../assets/icons/freelance-service/chevron-down.svg";
import { neutral77 } from "../../../utils/style/colors";
import { fontSemibold16 } from "../../../utils/style/fonts";
import { leftMarginMainContent } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { FilteringOptions } from "../common/FilteringOptions";

export const SubCategoryMenu: React.FC = () => {
  return (
    <View
      style={{
        flexDirection: "column",
        marginTop: 60,
        marginBottom: 70,
        alignSelf: "center",
        width: "100%",
        zIndex: 2,
      }}
    >
      <FilteringOptions />

      <View
        style={{
          flexDirection: "row",
          marginTop: 30,
          width: "100%",
          justifyContent: "space-between",
          paddingHorizontal: leftMarginMainContent,
          zIndex: -1,
        }}
      >
        <BrandText style={[{ color: neutral77 }, fontSemibold16]}>
          241,543 services available
        </BrandText>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <BrandText style={[{ color: neutral77 }, fontSemibold16]}>
            Sort by
          </BrandText>
          <BrandText
            style={[fontSemibold16, { marginLeft: 8, marginRight: 8 }]}
          >
            Best Selling
          </BrandText>
          <TouchableOpacity>
            <SVG source={chevronDown} width={16} height={16} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
