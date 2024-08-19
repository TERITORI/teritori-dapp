import React, { useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Hoverable from "react-native-hoverable";
import { SvgProps } from "react-native-svg";

import { MilestoneForm } from "./MilestoneForm";
import { MilestoneItem } from "./MilestoneItem";
import { MilestoneList } from "./MilestoneList";
import addCircleSVG from "../../../../assets/icons/add-circle.svg";
import noMilestonesSVG from "../../../../assets/icons/no-tasks.svg";
import projectsCompletedSVG from "../../../../assets/icons/projects-completed.svg";
import projectsInProgressSVG from "../../../../assets/icons/projects-inProgress.svg";
import projectsOpenSVG from "../../../../assets/icons/projects-open.svg";
import projectsReviewSVG from "../../../../assets/icons/projects-review.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { SimpleButton } from "../../../components/buttons/SimpleButton";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import {
  ProjectMilestone,
  MilestoneStatus,
  MilestoneFormValues,
} from "../../../utils/projects/types";
import {
  neutral00,
  neutral33,
  neutral77,
  neutralFF,
} from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { useMakeRequestState } from "../hooks/useMakeRequestHook";

export type Step = {
  status: MilestoneStatus;
  text: string;
  iconSVG: React.FC<SvgProps>;
};

const STEPS: Step[] = [
  {
    status: "MS_OPEN",
    text: "Open (Backlog)",
    iconSVG: projectsOpenSVG,
  },
  {
    status: "MS_PROGRESS",
    text: "In Progress",
    iconSVG: projectsInProgressSVG,
  },
  {
    status: "MS_REVIEW",
    text: "Review",
    iconSVG: projectsReviewSVG,
  },
  {
    status: "MS_COMPLETED",
    text: "Completed",
    iconSVG: projectsCompletedSVG,
  },
];

export const MilestoneBoard: React.FC<{
  milestones: ProjectMilestone[];
  containerStyle?: StyleProp<ViewStyle>;
  onSelectMilestone?: (id: string) => void;
  editable?: boolean;
}> = ({ onSelectMilestone, containerStyle, editable, milestones }) => {
  const [hoveredMilestone, setHoveredMilestone] = useState<ProjectMilestone>();
  const [isShowMilestoneForm, showMilestoneForm] = useState(false);

  const {
    actions: { addMilestone, removeMilestone },
  } = useMakeRequestState();

  const removeHoveredMilestone = (id: string) => {
    setHoveredMilestone(undefined);
    removeMilestone(id);
  };

  const addNewMilestone = (milestone: MilestoneFormValues) => {
    showMilestoneForm(false);
    console.log("adding milestone", milestone);
    addMilestone(milestone);
  };

  return (
    <FlexRow
      style={[
        {
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
        },
        containerStyle,
      ]}
    >
      {STEPS.map((step, idx) => {
        const listItems = (milestones || []).filter(
          (milestone) => milestone.status === step.status,
        );
        const isBacklogItem = idx === 0;

        return (
          <MilestoneList
            key={idx}
            text={step.text}
            count={listItems.length}
            iconSVG={step.iconSVG}
          >
            {listItems.map((milestone) => {
              const isHovered = hoveredMilestone?.id === milestone.id;
              return (
                <Hoverable
                  key={milestone.id}
                  onMouseEnter={() =>
                    isBacklogItem && editable && setHoveredMilestone(milestone)
                  }
                  onMouseLeave={() =>
                    isBacklogItem && editable && setHoveredMilestone(undefined)
                  }
                >
                  <MilestoneItem
                    milestone={milestone}
                    onPress={onSelectMilestone}
                    onDelete={removeHoveredMilestone}
                    isHovered={isHovered}
                  />
                  <SpacerRow size={3} />
                </Hoverable>
              );
            })}

            {listItems.length === 0 && (
              <FlexRow
                style={{
                  backgroundColor: neutral00,
                  borderRadius: 8,
                  padding: layout.spacing_x1_5,
                  marginBottom: layout.spacing_x2,
                }}
              >
                <SVG source={noMilestonesSVG} width={18} height={18} />
                <SpacerRow size={1} />
                <BrandText style={[fontSemibold13, { color: neutral77 }]}>
                  {editable ? "No milestones" : "Empty"}
                </BrandText>
              </FlexRow>
            )}

            {isBacklogItem && isShowMilestoneForm && (
              <MilestoneForm
                onClose={() => showMilestoneForm(false)}
                onSubmit={addNewMilestone}
              />
            )}

            {isBacklogItem && editable && !isShowMilestoneForm && (
              <SimpleButton
                onPress={() => showMilestoneForm(true)}
                text="Add"
                size="XS"
                iconSVG={addCircleSVG}
                color={neutralFF}
                bgColor={neutral33}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            )}

            <SpacerColumn size={2} />
          </MilestoneList>
        );
      })}
    </FlexRow>
  );
};
