import React from "react";
import { TouchableOpacity, View } from "react-native";

import { Tag } from "./Milestone";
import githubSVG from "../../../../assets/icons/github.svg";
import trashSVG from "../../../../assets/icons/trash.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { SocialButton } from "../../../components/buttons/SocialButton";
import { SpacerColumn } from "../../../components/spacer";
import {
  neutral00,
  neutral22,
  neutral33,
  neutral44,
  neutral77,
  neutralA3,
  redDefault,
} from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { PRIORITY_HIGH, PRIORITY_MEDIUM, Milestone } from "../types";

export const MilestoneItem: React.FC<{
  milestone: Milestone;
  isHovered?: boolean;
  onPress?: (milestone: Milestone) => void;
  onDelete?: (milestone: Milestone) => void;
}> = ({ milestone, onPress, isHovered, onDelete }) => {
  return (
    <View>
      <TouchableOpacity onPress={() => onPress?.(milestone)}>
        <TertiaryBox
          style={{
            backgroundColor: isHovered ? neutral33 : neutral22,
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
            🔎 {milestone.name}
          </BrandText>

          <SpacerColumn size={1} />

          <BrandText
            style={[
              fontSemibold13,
              {
                alignSelf: "flex-start",
                alignItems: "center",
                color: neutralA3,
              },
            ]}
          >
            {milestone.desc}
          </BrandText>

          <FlexRow
            style={{
              marginTop: layout.spacing_x2,
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexGrow: 1, alignItems: "flex-start" }}>
              {milestone.priority === PRIORITY_HIGH && (
                <Tag bgColor="#673932" color="#ffffff" text="High 🔥" />
              )}

              {milestone.priority === PRIORITY_MEDIUM && (
                <Tag bgColor="#705B38" color="#ffffff" text="Medium" />
              )}
            </View>

            <Tag
              text={"$" + milestone.budget}
              color={neutral77}
              borderColor={neutral33}
              bgColor={neutral00}
              containerStyle={{ marginRight: layout.spacing_x2 }}
            />

            <SocialButton iconSvg={githubSVG} height={32} />
          </FlexRow>
        </TertiaryBox>
      </TouchableOpacity>

      {isHovered && (
        <View
          style={{
            position: "absolute",
            right: -44,
            top: 32,
            width: 48,
            height: 64,
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => onDelete?.(milestone)}
            style={{
              position: "absolute",
              padding: layout.spacing_x1,
              backgroundColor: neutral33,
              borderWidth: 1,
              borderColor: neutral44,
              borderRadius: 100,
            }}
          >
            <SVG source={trashSVG} width={16} height={16} color={redDefault} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
