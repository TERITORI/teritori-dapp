import React, { useState } from "react";
import { View } from "react-native";

import { HeaderBackButton } from "../components/HeaderBackButton";
import { ProjectInfo } from "../components/ProjectInfo";
import { ProjectMilestones } from "../components/ProjectMilestones";
import { useProject } from "../hooks/useProjects";
import { ProjectMilestone } from "../types";

import { ScreenContainer } from "@/components/ScreenContainer";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { MilestoneDetail } from "@/screens/Projects/ProjectsDetailScreen/MilestoneDetail";
import { ScreenFC } from "@/utils/navigation";

export const ProjectsDetailScreen: ScreenFC<"ProjectsDetail"> = ({
  route: { params },
}) => {
  const selectedWallet = useSelectedWallet();

  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(
    null,
  );

  const { data: project } = useProject(params.id);

  const selectedMilestone = project?.milestones.find(
    (m) => m.id === selectedMilestoneId,
  );

  const onSelectMilestone = (milestone: ProjectMilestone) => {
    setSelectedMilestoneId(milestone.id);
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
          onClose={() => setSelectedMilestoneId(null)}
          editable={
            (project.contractor === selectedWallet?.address &&
              selectedMilestone.status === "MS_OPEN") ||
            (project.funder === selectedWallet?.address &&
              selectedMilestone.status === "MS_REVIEW")
          }
        />
      )}
    </ScreenContainer>
  );
};
