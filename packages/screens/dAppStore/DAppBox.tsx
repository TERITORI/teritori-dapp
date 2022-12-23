import {TertiaryBox} from "../../components/boxes/TertiaryBox";
import {neutral17} from "../../utils/style/colors";
import {SVG} from "../../components/SVG";
import burnSVG from "../../../assets/icons/burn.svg";
import {BrandText} from "../../components/BrandText";
import {fontSemibold12} from "../../utils/style/fonts";
import React from "react";

export interface dAppType {
  title: string;
  description: string;
  icon: string;
}

export function DAppBox(props: {
  option: dAppType
}) {
  return (
    <TertiaryBox
      height={116}
      width={320}
      style={{
        marginRight: 12,
        marginBottom: 12,
      }}
      mainContainerStyle={{
        backgroundColor: neutral17,
        alignItems: "flex-start",
        padding: 12,
      }}
    >
      <SVG width={32} height={32} source={burnSVG} />
      <BrandText style={fontSemibold12}>{props.option.title}</BrandText>
    </TertiaryBox>
  );
}
