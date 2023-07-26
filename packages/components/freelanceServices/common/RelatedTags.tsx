import React from "react";
import { View } from "react-native";

import { neutral44, neutral17 } from "../../../utils/style/colors";
import { fontMedium14, fontSemibold20 } from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText";

export const RelatedTags: React.FC<{ tags: string[] }> = ({ tags }) => {
  return (
    <View style={{ flexDirection: "column", marginTop: 30, marginBottom: 30 }}>
      <BrandText style={[fontSemibold20, { marginTop: 40, marginBottom: 30 }]}>
        Related Tags
      </BrandText>
      <View style={{ flexDirection: "row", width: "100%", flexWrap: "wrap" }}>
        {tags.map((item, index) => (
          <View
            key={index}
            style={{
              marginRight: 8,
              marginBottom: 8,
              backgroundColor: neutral17,
              borderRadius: 8,
              borderColor: neutral44,
              borderWidth: 0.5,
            }}
          >
            <BrandText style={[fontMedium14, { margin: 12 }]}>{item}</BrandText>
          </View>
        ))}
      </View>
    </View>
  );
};
