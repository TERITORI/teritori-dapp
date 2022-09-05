import React from "react";
import { View } from "react-native";

import badgeSvg from "../../../assets/icons/badge.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";

const CollectionItem: React.FC<{
  collection: any;
}> = ({ collection }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
      }}
    >
      <SVG
        width={32}
        height={32}
        source={collection.avatar}
        style={{ marginRight: 12 }}
      />
      <BrandText style={{ fontSize: 14, marginRight: 8 }}>
        {collection.name}
      </BrandText>
      {collection.badge && <SVG width={16} height={16} source={badgeSvg} />}
    </View>
  );
};

export default CollectionItem;
