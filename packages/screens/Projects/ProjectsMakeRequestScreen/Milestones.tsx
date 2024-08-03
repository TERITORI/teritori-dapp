import React from "react";
import { View } from "react-native";

import { MakeRequestFooter } from "./Footer";
import { neutral17 } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { MilestoneBoard } from "../components/MilestoneBoard";
import { useMakeRequestState } from "../hooks/useMakeRequestHook";
import { previewMilestoneForm } from "../types";

export const Milestones: React.FC = () => {
  const {
    milestones,
    projectFormData: shortDescData,
    actions: { goNextStep, setShortDesc },
  } = useMakeRequestState();

  const goToReview = () => {
    setShortDesc(shortDescData);

    goNextStep();
  };

  return (
    <View>
      <MilestoneBoard
        milestones={milestones.map(previewMilestoneForm)}
        editable
        containerStyle={{
          backgroundColor: neutral17,
          padding: layout.spacing_x2,
          borderRadius: 8,
        }}
      />

      <MakeRequestFooter
        disableNext={!milestones.length}
        onSubmit={goToReview}
      />
    </View>
  );
};
