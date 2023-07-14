import React from "react";
import { View } from "react-native";

import { Tag } from "../../../api/pathwar/v1/pathwar";
import { BrandText } from "../../../components/BrandText";
import { neutral44, neutral77 } from "../../../utils/style/colors";
import { fontSemibold12 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const PathWarTags: React.FC<{ tags: Tag[] }> = ({ data }) => {
  return (
    <View
      style={{
        width: 390,
        flexDirection: "row",
        marginBottom: layout.padding_x1,
        flexWrap: "wrap",
      }}
    >
      {data &&
        data.map((tag, index) => (
          <View
            style={{
              width: "fit-content",
              height: "fit-content",
              borderColor: neutral44,
              borderWidth: 1,
              borderRadius: 6,
              alignItems: "center",
              justifyContent: "center",
              marginRight: layout.padding_x1,
              marginBottom: layout.padding_x1,
            }}
            key={index}
          >
            <BrandText
              style={[
                {
                  color: neutral77,
                  paddingRight: layout.padding_x1,
                  paddingLeft: layout.padding_x1,
                  paddingBottom: layout.padding_x0_25,
                  paddingTop: layout.padding_x0_25,
                },
                fontSemibold12,
              ]}
            >
              {tag.text}
            </BrandText>
          </View>
        ))}
    </View>
  );
};
