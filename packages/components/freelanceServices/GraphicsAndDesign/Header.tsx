import React from "react";
import { View } from "react-native";

import graphicAndDesignSVG from "../../../../assets/icons/freelance-service/graphics-and-design.svg";
import { fontSemibold28 } from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText/BrandText";
import { SVG } from "../../SVG";
import { Separator } from "../../Separator";

export const GraphicsAndDesignHeader: React.FC = () => {
  return (
    <View>
      <SVG
        source={graphicAndDesignSVG}
        style={{ alignSelf: "center", marginTop: 50 }}
      />
      <BrandText
        style={[{ alignSelf: "center", marginTop: 20 }, fontSemibold28]}
      >
        Graphics & Design
      </BrandText>
      <Separator style={{ width: 320, alignSelf: "center", marginTop: 50 }} />
    </View>
  );
};
