import React from "react";
import { View } from "react-native";

import { MakeRequestFooter } from "./Footer";
import { ProjectInfo } from "../components/ProjectInfo";
import { ProjectMilestones } from "../components/ProjectMilestones";
import { useMakeRequestState } from "../hooks/useMakeRequestHook";

export const Preview: React.FC = () => {
  const {
    shortDescData,
    milestones,
    teamAndLinkData,
    actions: { goNextStep },
  } = useMakeRequestState();

  return (
    <View>
      <ProjectInfo
        shortDescData={shortDescData}
        teamAndLinkData={teamAndLinkData}
      />

      <ProjectMilestones milestones={milestones} />
      <MakeRequestFooter
        nextText="Publish this request"
        disableNext={false}
        onSubmit={goNextStep}
        width={200}
      />
    </View>
  );
};
