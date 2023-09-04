import React from "react";
import { TouchableOpacity } from "react-native";

import { Tag } from "./Tag";
import githubSVG from "../../../../assets/icons/github.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { SocialButton } from "../../../components/buttons/SocialButton";
import { neutral22 } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const TaskItem: React.FC<{
  text: string;
  priority: "medium" | "hight";
  onPress?: () => void;
}> = ({ text, priority, onPress }) => {
  return (
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
  );
};
