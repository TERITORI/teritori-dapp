import React from "react";
import { View } from "react-native";

import { MakeRequestFooter } from "./Footer";
import { neutral17 } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { MilestoneBoard } from "../components/MilestoneBoard";
import { useMakeRequestState } from "../hooks/useMakeRequestHook";

export const Milestones: React.FC = () => {
  const {
    milestones,
    actions: { goNextStep },
  } = useMakeRequestState();

  return (
    <View>
      <MilestoneBoard
        milestones={milestones}
        editable
        containerStyle={{
          backgroundColor: neutral17,
          padding: layout.spacing_x2,
          borderRadius: 8,
        }}
      />

      <MakeRequestFooter disableNext={false} onSubmit={goNextStep} />
    </View>
  );
};
