import React from "react";
import { Image, Linking, Pressable, StyleSheet, View } from "react-native";

import { OpenGraphType } from "../../../hooks/feed/types";
import {
  transparentColor,
  neutral33,
  neutral77,
} from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SpacerColumn } from "../../spacer";

export const RichOpenGraphCard: React.FC<OpenGraphType> = ({
  domain,
  title,
  description,
  image,
  url,
}) => {
  if (!title) {
    return null;
  }

  return (
    <Pressable onPress={() => Linking.openURL(url)} style={styles.container}>
      <Image source={{ uri: image.url }} style={styles.image} />
      <View style={styles.content}>
        <BrandText style={[fontSemibold13, { color: neutral77 }]}>
          {domain}
        </BrandText>
        <SpacerColumn size={0.5} />
        <BrandText style={[fontSemibold14]} numberOfLines={1}>
          {title}
        </BrandText>
        <SpacerColumn size={0.5} />
        <BrandText
          style={[fontSemibold14, { color: neutral77 }]}
          numberOfLines={2}
        >
          {description}
        </BrandText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: neutral33,
    borderWidth: 1,
    borderRadius: 20,
    overflow: "hidden",
    flexDirection: "row",
    backgroundColor: transparentColor,
    marginVertical: layout.padding_x2,
    maxWidth: 850,
  },
  image: { height: 106, width: 106 },
  content: { padding: layout.padding_x2, flex: 1, flexWrap: "wrap" },
});
