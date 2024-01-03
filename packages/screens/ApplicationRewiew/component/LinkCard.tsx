import React from "react";
import { View, FlatList } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { Box } from "../../../components/boxes/Box";
import { neutral33, neutral77 } from "../../../utils/style/colors";
import { fontSemibold12, fontSemibold14 } from "../../../utils/style/fonts";

export const LinkCard: React.FC<{ title: any; linksData: any }> = ({
  title,
  linksData,
}) => {
  return (
    <Box
      notched
      style={{
        borderWidth: 1,
        borderColor: neutral33,
        borderRadius: 6,
        padding: 12,
        flex: 1,
        height: "100%",
      }}
    >
      <BrandText style={[fontSemibold12, { color: neutral77 }]}>
        {title}
      </BrandText>
      <FlatList
        data={linksData}
        renderItem={({ item, index }) => (
          <View style={{ marginTop: 6, flexDirection: "row" }} key={index}>
            <BrandText style={[fontSemibold14, { color: neutral77 }]}>
              {item?.title}
            </BrandText>
            <BrandText style={[fontSemibold14, { marginStart: 12 }]}>
              {item?.link}
            </BrandText>
          </View>
        )}
      />
    </Box>
  );
};
