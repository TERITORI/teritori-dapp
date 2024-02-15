import React from "react";
import { View } from "react-native";

import { MakeRequestFooter } from "./Footer";
import { ProjectInfo } from "../components/ProjectInfo";
import { ProjectMilestones } from "../components/ProjectMilestones";
import { useMakeRequestState } from "../hooks/useMakeRequestHook";

import useSelectedWallet from "@/hooks/useSelectedWallet";
import { Project } from "@/screens/Projects/types";

export const Preview: React.FC = () => {
  const {
    shortDescData,
    milestones,
    teamAndLinkData,
    actions: { goNextStep },
  } = useMakeRequestState();

  const selectedWallet = useSelectedWallet();

  // Create project object just like when it returned from server
  const project: Project = {
    sender: selectedWallet?.address || "",
    metadata: {
      shortDescData,
      teamAndLinkData,
      milestones: [],
    },
  };

  return (
    <View>
      <ProjectInfo project={project} />

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
