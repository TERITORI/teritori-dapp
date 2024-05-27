import React from "react";
import { View } from "react-native";

import { MakeRequestFooter } from "./Footer";
import { ProjectInfo } from "../components/ProjectInfo";
import { ProjectMilestones } from "../components/ProjectMilestones";
import { useMakeRequestState } from "../hooks/useMakeRequestHook";
import { Project } from "../types";

import useSelectedWallet from "@/hooks/useSelectedWallet";

export const Preview: React.FC = () => {
  const {
    projectFormData,
    milestones,
    teamAndLinkData,
    actions: { goNextStep },
  } = useMakeRequestState();

  const selectedWallet = useSelectedWallet();

  let coverFile = projectFormData.coverImg as any;
  if ("file" in coverFile) {
    // files selected by cypress are not File objects
    coverFile = coverFile.file;
  }

  // Create project object just like when it returned from server
  const project: Project = {
    sender: selectedWallet?.address || "",
    metadata: {
      shortDescData: {
        ...projectFormData,
        coverImg: coverFile ? URL.createObjectURL(coverFile) : "",
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
    milestones,
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
