import React from "react";
import { View } from "react-native";

import commentSVG from "../../../../../assets/icons/social/comments-gray.svg";
import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { SpacerRow } from "../../../../components/spacer";
import { neutralA3 } from "../../../../utils/style/colors";
import { fontSemibold14 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";

type Props = {
  count: number;
};

export const PostCommentCount = ({ count }: Props) => {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: layout.spacing_x0_5,
        alignItems: "center",
      }}
    >
      <SVG source={commentSVG} width={20} height={20} />
      <SpacerRow size={0.5} />
      <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
        {count}
      </BrandText>
    </View>
  );
};
