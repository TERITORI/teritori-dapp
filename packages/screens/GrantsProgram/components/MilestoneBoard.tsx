import React, { useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Hoverable from "react-native-hoverable";

import { MilestoneForm } from "./MilestoneForm";
import { MilestoneItem } from "./MilestoneItem";
import { MilestoneList } from "./MilestoneList";
import addCircleSVG from "../../../../assets/icons/add-circle.svg";
import grantsCompletedSVG from "../../../../assets/icons/grants-completed.svg";
import grantsInProgressSVG from "../../../../assets/icons/grants-inProgress.svg";
import grantsOpenSVG from "../../../../assets/icons/grants-open.svg";
import grantsReviewSVG from "../../../../assets/icons/grants-review.svg";
import noMilestonesSVG from "../../../../assets/icons/no-tasks.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { SimpleButton } from "../../../components/buttons/SimpleButton";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import {
  neutral00,
  neutral33,
  neutral77,
  neutralFF,
} from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { useMakeRequestState } from "../hooks/useMakeRequestHook";
import { Status, Milestone } from "../types";

const STATUSES: Status[] = [
  { id: "open", text: "Open (Backlog)", count: 4, iconSVG: grantsOpenSVG },
  {
    id: "inProgress",
    text: "In Progress",
    count: 4,
    iconSVG: grantsInProgressSVG,
  },
  { id: "review", text: "Review", count: 4, iconSVG: grantsReviewSVG },
  { id: "completed", text: "Completed", count: 4, iconSVG: grantsCompletedSVG },
];

export const MilestoneBoard: React.FC<{
  containerStyle?: StyleProp<ViewStyle>;
  selectMilestone?: (milestone: Milestone) => void;
  editable?: boolean;
}> = ({ selectMilestone, containerStyle, editable }) => {
  const [hoveredMilestone, setHoveredMilestone] = useState<Milestone>();
  const [isShowMilestoneForm, showMilestoneForm] = useState(false);

  const {
    milestones,
    actions: { addMilestone, removeMilestone },
  } = useMakeRequestState();

  const removeHoveredMilestone = (milestone: Milestone) => {
    setHoveredMilestone(undefined);
    removeMilestone(milestone);
  };

  const addNewMilestone = (milestone: Milestone) => {
    showMilestoneForm(false);
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
      {STATUSES.map((step, idx) => {
        const listItems = milestones.filter(
          (milestone) => milestone.statusId === step.id,
        );
        const isBacklogItem = idx === 0;

        return (
          <MilestoneList
            text={step.text}
            count={step.count}
            iconSVG={step.iconSVG}
          >
            {listItems.map((milestone) => {
              const isHovered = hoveredMilestone?.id === milestone.id;
              return (
                <Hoverable
                  onMouseEnter={() =>
                    isBacklogItem && editable && setHoveredMilestone(milestone)
                  }
                  onMouseLeave={() =>
                    isBacklogItem && editable && setHoveredMilestone(undefined)
                  }
                >
                  <MilestoneItem
                    milestone={milestone}
                    onPress={selectMilestone}
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
