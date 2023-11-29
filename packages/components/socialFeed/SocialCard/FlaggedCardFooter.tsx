import React, { FC } from "react";
import { View } from "react-native";

import addThreadSVG from "../../../../assets/icons/add-thread.svg";
import { Post } from "../../../api/feed/v1/feed";
import { parseUserId } from "../../../networks";
import { neutral22, neutral77 } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { SpacerRow } from "../../spacer";

export const FlaggedCardFooter: FC<{
  post: Post;
}> = ({ post }) => {
  const [, authorAddress] = parseUserId(post.authorId);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderTopWidth: 0.5,
        borderTopColor: neutral22,
        paddingTop: layout.spacing_x2,
      }}
    >
      <BrandText style={[fontSemibold13, { color: neutral77 }]}>
        {authorAddress}
      </BrandText>

      <View style={{ flexDirection: "row" }}>
        <SVG source={addThreadSVG} width={20} height={20} />
        <SpacerRow size={0.75} />

        <BrandText style={fontSemibold13}>Open the thread</BrandText>
      </View>
    </View>
  );
};
