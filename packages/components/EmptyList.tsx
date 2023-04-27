import React from "react";
import { StyleSheet } from "react-native";

import { BrandText } from "./BrandText";
import { SVG } from "./SVG";
import { AnimationFadeIn } from "./animations";
import { SpacerColumn } from "./spacer";
import emptyListSVG from "../../assets/icons/empty-list.svg";
import { neutral77 } from "../utils/style/colors";
import { fontSemibold16 } from "../utils/style/fonts";

interface EmptyListProps {
  text: string;
}

export const EmptyList: React.FC<EmptyListProps> = ({ text }) => {
  return (
    <AnimationFadeIn style={styles.container}>
      <SVG source={emptyListSVG} width={250} height={250} />
      <SpacerColumn size={2} />
      <BrandText style={styles.text}>{text}</BrandText>
    </AnimationFadeIn>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: StyleSheet.flatten([fontSemibold16, { color: neutral77 }]),
});
