import React from "react";

import { BrandText } from "./BrandText";
import { SVG } from "./SVG";
import { AnimationFadeIn } from "./animations/AnimationFadeIn";
import { SpacerColumn } from "./spacer";
import emptyListSVG from "../../assets/icons/empty-list.svg";
import { neutral77 } from "../utils/style/colors";
import { fontSemibold16 } from "../utils/style/fonts";

interface EmptyListProps {
  text: string;
  size?: number;
}

export const EmptyList: React.FC<EmptyListProps> = ({ text, size = 250 }) => {
  return (
    <AnimationFadeIn
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SVG source={emptyListSVG} width={size} height={size} />
      <SpacerColumn size={2} />
      <BrandText style={[fontSemibold16, { color: neutral77 }]}>
        {text}
      </BrandText>
    </AnimationFadeIn>
  );
};
