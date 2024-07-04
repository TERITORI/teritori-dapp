import React from "react";
import { View } from "react-native";

import { MakeRequestFooter } from "./Footer";
import { ProjectInfo } from "../components/ProjectInfo";
import { ProjectMilestones } from "../components/ProjectMilestones";
import { useMakeRequestState } from "../hooks/useMakeRequestHook";
import { Project, previewMilestoneForm } from "../types";

import useSelectedWallet from "@/hooks/useSelectedWallet";

export const Preview: React.FC = () => {
  const {
    projectFormData,
    milestones,
    teamAndLinkData,
    actions: { goNextStep },
  } = useMakeRequestState();

  const selectedWallet = useSelectedWallet();

  // Create project object just like when it returned from server
  const project: Project = {
    sender: selectedWallet?.address || "",
    metadata: {
      shortDescData: {
        ...projectFormData,
        coverImg: projectFormData.coverImg,
        tags: projectFormData.tags || "",
      },
      teamAndLinkData,
    },
    budget: "",
    funder: selectedWallet?.address || "",
    contractor: "",
    status: "CREATED",
    id: "",
    funded: false,
    milestones: milestones.map(previewMilestoneForm),
    contractorCandidates: [],
    paymentDenom: "",
    expireAt: new Date(),
    funderFeedback: "",
    contractorFeedback: "",
    pausedBy: "",
    conflictHandler: "",
    handlerCandidate: "",
    handlerSuggestor: "",
    createdAt: new Date(),
    rejectReason: "",
    conflicts: [],
  };

  return (
    <View>
      <ProjectInfo project={project} />

      <ProjectMilestones milestones={milestones.map(previewMilestoneForm)} />

      <MakeRequestFooter
        nextText="Publish this request"
        disableNext={false}
        onSubmit={goNextStep}
        width={200}
      />
    </View>
  );
};
