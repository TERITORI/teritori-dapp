import React from "react";
import { StyleSheet, Text } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { neutralA3 } from "../../../utils/style/colors";
import { fontMedium14, fontSemibold20 } from "../../../utils/style/fonts";

interface EnrollStatProps {
  title: string;
  content: string;
}

export const EnrollStat: React.FC<EnrollStatProps> = ({ title, content }) => {
  return (
    <TertiaryBox
      width={160}
      style={styles.container}
      mainContainerStyle={{
        padding: 16,
        alignItems: "flex-start",
      }}
    >
      <BrandText style={styles.title}>{title}</BrandText>
      <BrandText style={styles.content}>{content}</BrandText>
    </TertiaryBox>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    marginHorizontal: 8,
  },
  title: {
    color: neutralA3,
    ...(fontMedium14 as object),
  },
  content: {
    marginTop: 5,
    ...(fontSemibold20 as object),
  },
});
