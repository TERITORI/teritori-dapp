import moment from "moment";
import React from "react";
import { TouchableOpacity, View } from "react-native";

import { Tag } from "./Milestone";
import githubSVG from "@/assets/icons/github.svg";
import trashSVG from "@/assets/icons/trash.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { SocialButton } from "../../../components/buttons/SocialButton";
import { SpacerColumn } from "../../../components/spacer";
import { ProjectMilestone } from "../../../utils/projects/types";
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

import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { NetworkFeature, getNetworkFeature } from "@/networks";
import { prettyPrice } from "@/utils/coins";

export const MilestoneItem: React.FC<{
  milestone: ProjectMilestone;
  isHovered?: boolean;
  onPress?: (id: string) => void;
  onDelete?: (id: string) => void;
}> = ({ milestone, onPress, isHovered, onDelete }) => {
  const networkId = useSelectedNetworkId();

  const pmFeature = getNetworkFeature(
    networkId,
    NetworkFeature.GnoProjectManager,
  );

  return (
    <View>
      <TouchableOpacity onPress={() => onPress?.(milestone.id)}>
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
            numberOfLines={1}
          >
            🔎 {milestone.title}
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
            numberOfLines={5}
          >
            {milestone.desc}
          </BrandText>

          <SpacerColumn size={2} />

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
            Duration:{" "}
            {moment.duration(milestone.duration, "seconds").humanize()}
          </BrandText>

          <SpacerColumn size={1} />

          <Tag
            containerStyle={{ alignSelf: "flex-start" }}
            text={prettyPrice(
              networkId,
              milestone.amount.toString(),
              pmFeature?.paymentsDenom,
            )}
            color={neutral77}
            borderColor={neutral33}
            bgColor={neutral00}
          />

          <SpacerColumn size={1} />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: layout.spacing_x1,
            }}
          >
            <View>
              {milestone.priority === "MS_PRIORITY_HIGH" && (
                <Tag bgColor="#673932" color="#ffffff" text="High 🔥" />
              )}

              {milestone.priority === "MS_PRIORITY_MEDIUM" && (
                <Tag bgColor="#705B38" color="#ffffff" text="Medium" />
              )}

              {milestone.priority === "MS_PRIORITY_LOW" && (
                <Tag bgColor="#705B38" color="#ffffff" text="Low" />
              )}
            </View>

            {!!milestone.link && (
              <SocialButton iconSvg={githubSVG} link={milestone.link} />
            )}
          </View>
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
            onPress={() => onDelete?.(milestone.id)}
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
