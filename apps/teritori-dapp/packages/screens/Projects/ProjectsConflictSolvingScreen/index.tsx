import React from "react";

import { useProject } from "../hooks/useProjects";

import { ScreenContainer } from "@/components/ScreenContainer";
import { SpacerColumn } from "@/components/spacer";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { NewConflictSection } from "@/screens/Projects/ProjectsConflictSolvingScreen/NewConflictSection";
import { OngoingConflictSection } from "@/screens/Projects/ProjectsConflictSolvingScreen/OngoingConflictSection";
import { SettledConflictsSection } from "@/screens/Projects/ProjectsConflictSolvingScreen/SettledConflictsSection";
import { ScreenFC } from "@/utils/navigation";

export const ProjectsConflictSolvingScreen: ScreenFC<
  "ProjectsConflictSolving"
> = ({ route }) => {
  const projectId = route.params.projectId;
  const selectedWallet = useSelectedWallet();
  const userId = selectedWallet?.userId;
  const userAddress = selectedWallet?.address;
  const { data: project } = useProject(projectId);
  const userIsParty =
    !!project &&
    !!userAddress &&
    (userAddress === project?.contractor || userAddress === project?.funder);
  return (
    <ScreenContainer isLarge>
      <SpacerColumn size={4} />
      {project?.status === "ACCEPTED" && userIsParty && (
        <NewConflictSection projectId={projectId} userId={userId} />
      )}

      {project?.status === "CONFLICT" && (
        <OngoingConflictSection
          userId={selectedWallet?.userId}
          projectId={projectId}
        />
      )}

      {(project?.conflicts?.length || 0) > 0 &&
        !(
          project?.conflicts?.length === 1 && project.status === "CONFLICT"
        ) && <SettledConflictsSection projectId={projectId} />}
    </ScreenContainer>
  );
};
