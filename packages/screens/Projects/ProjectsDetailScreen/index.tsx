import { useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { View } from "react-native";

import { HeaderBackButton } from "../components/HeaderBackButton";
import { ProjectInfo } from "../components/ProjectInfo";
import { ProjectMilestones } from "../components/ProjectMilestones";
import { useProject } from "../hooks/useProjects";
import { ContractStatus, ProjectMilestone } from "../types";

import { ScreenContainer } from "@/components/ScreenContainer";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { MilestoneDetail } from "@/screens/Projects/ProjectsDetailScreen/MilestoneDetail";
import { ScreenFC } from "@/utils/navigation";

export const ProjectsDetailScreen: ScreenFC<"ProjectsDetail"> = () => {
  const { params } = useRoute();

  const networkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();

  const [selectedMilestone, setSelectedMilestone] =
    useState<ProjectMilestone>();

  const { data: project } = useProject(networkId, (params as any).id || 0);

  const onSelectMilestone = (milestone: ProjectMilestone) => {
    setSelectedMilestone(
      milestone.id === selectedMilestone?.id ? undefined : milestone,
    );
  };

  if (!project)
    return (
      <ScreenContainer
        isLarge
        responsive
        headerChildren={<HeaderBackButton />}
      />
    );

  return (
    <ScreenContainer
      isLarge
      responsive
      headerChildren={<HeaderBackButton />}
      footerChildren={<></>}
    >
      <View>
        <ProjectInfo project={project} />

        <ProjectMilestones
          onSelectMilestone={onSelectMilestone}
          milestones={project?.milestones || []}
        />
      </View>

      {/* Detail view ======================================================= */}
      {selectedMilestone !== undefined && (
        <MilestoneDetail
          project={project}
          milestone={selectedMilestone}
          onClose={() => setSelectedMilestone(undefined)}
          editable={
            project.contractor === selectedWallet?.address &&
            project.status === ContractStatus.ACCEPTED
          }
        />
      )}
    </ScreenContainer>
  );
};
