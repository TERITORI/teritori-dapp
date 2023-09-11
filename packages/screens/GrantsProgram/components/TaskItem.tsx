import React from "react";
import { TouchableOpacity, View } from "react-native";

import { Tag } from "./Tag";
import githubSVG from "../../../../assets/icons/github.svg";
import trashSVG from "../../../../assets/icons/trash.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { SocialButton } from "../../../components/buttons/SocialButton";
import {
  neutral22,
  neutral33,
  neutral44,
  redDefault,
} from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const TaskItem: React.FC<{
  text: string;
  showDelete?: boolean;
  priority: "medium" | "hight";
  onPress?: () => void;
}> = ({ text, priority, onPress, showDelete }) => {
  return (
    <View>
      <TouchableOpacity onPress={onPress}>
        <TertiaryBox
          fullWidth
          noBrokenCorners
          mainContainerStyle={{
            backgroundColor: neutral22,
            padding: layout.spacing_x2,
            marginBottom: layout.spacing_x2,
          }}
        >
          <BrandText
            style={[
              fontSemibold13,
              { alignSelf: "flex-start", alignItems: "center" },
            ]}
          >
            🔎 {text}
          </BrandText>

          <FlexRow
            style={{
              marginTop: layout.spacing_x2,
              justifyContent: "space-between",
            }}
          >
            {priority === "hight" && (
              <Tag bgColor="#673932" color="#ffffff" text="High 🔥" />
            )}

            {priority === "medium" && (
              <Tag bgColor="#705B38" color="#ffffff" text="Medium" />
            )}

            <SocialButton iconSvg={githubSVG} height={32} />
          </FlexRow>
        </TertiaryBox>
      </TouchableOpacity>

      {showDelete && (
        <TouchableOpacity
          style={{
            position: "absolute",
            right: -44,
            top: "30%",
            padding: layout.spacing_x1,
            backgroundColor: neutral33,
            borderWidth: 1,
            borderColor: neutral44,
            borderRadius: 100,
          }}
        >
          <SVG source={trashSVG} width={16} height={16} color={redDefault} />
        </TouchableOpacity>
      )}
    </View>
  );
};
