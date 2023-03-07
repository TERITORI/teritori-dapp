import { View } from "react-native";

import chatSVG from "../../../../assets/icons/social-threads/chat.svg";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";

export const CommentsCount: React.FC<{
  count: number;
}> = ({ count }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <SVG
        source={chatSVG}
        height={20}
        width={20}
        style={{ marginRight: layout.padding_x1_5 }}
      />
      <BrandText style={fontSemibold14}>{count}</BrandText>
    </View>
  );
};
