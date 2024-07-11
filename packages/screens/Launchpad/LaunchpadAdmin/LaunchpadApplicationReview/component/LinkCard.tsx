import React from "react";
import {FlatList, Linking, View} from "react-native";

import { BrandText } from "@/components/BrandText";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import {neutral77, primaryColor} from "@/utils/style/colors";
import {fontSemibold12, fontSemibold14} from "@/utils/style/fonts";
import {layout} from "@/utils/style/layout";
import {CustomPressable} from "@/components/buttons/CustomPressable";

export const LinkCard: React.FC<{ title: string; linksData: { title: string; link: string; }[] }> = ({
  title,
  linksData,
}) => {
  return (
    <TertiaryBox
      style={{
        borderRadius: layout.spacing_x0_75,
        padding:  layout.spacing_x1_25,
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
          <View style={{ marginTop: layout.spacing_x0_75, flexDirection: "row" }} key={index}>
            <BrandText style={[fontSemibold14, { color: neutral77 }]}>
              {item.title}
            </BrandText>
              <CustomPressable onPress={() => Linking.openURL(item.link)}>
                <BrandText style={[fontSemibold14, { marginLeft:  layout.spacing_x1_25, color: primaryColor }]} numberOfLines={1}>
                  {item.link}
                </BrandText>
              </CustomPressable>
          </View>
        )}
      />
    </TertiaryBox>
  );
};
