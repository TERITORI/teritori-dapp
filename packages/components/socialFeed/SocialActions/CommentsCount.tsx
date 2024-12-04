import { View } from "react-native";

import chatSVG from "../../../../assets/icons/social-threads/chat.svg";
import { fontRegular12 } from "../../../utils/style/fonts";
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
        height={17}
        width={17}
        style={{ marginRight: layout.spacing_x0_75 }}
      />
      <BrandText style={fontRegular12}>{count}</BrandText>
    </View>
  );
};
