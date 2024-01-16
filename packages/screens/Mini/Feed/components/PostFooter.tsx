import { View } from "react-native";

import commentSVG from "../../../../../assets/icons/social/comments-gray.svg";
import reactionSVG from "../../../../../assets/icons/social/happy-gray.svg";
import transferSVG from "../../../../../assets/icons/social/transfer-gray.svg";
import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { SpacerRow } from "../../../../components/spacer";
import { neutralA3 } from "../../../../utils/style/colors";
import { fontSemibold14 } from "../../../../utils/style/fonts";

type CardFooterProps = {
  comments: number;
  reaction: number;
  transfer: number;
};

export function PostFooter({ comments, reaction, transfer }: CardFooterProps) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <SVG source={commentSVG} width={20} height={20} />
        <SpacerRow size={0.5} />
        <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
          {comments.toString()}
        </BrandText>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <SVG source={reactionSVG} width={20} height={20} />
        <SpacerRow size={0.5} />

        <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
          {reaction}
        </BrandText>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <SVG source={transferSVG} width={23} height={23} />
        <SpacerRow size={0.5} />
        <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
          {transfer.toString()}
        </BrandText>
      </View>
    </View>
  );
}
