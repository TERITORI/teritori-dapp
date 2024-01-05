import React from "react";

import { ProjectBox } from "./ProjectBox";
import FlexRow from "../../../components/FlexRow";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import { layout } from "../../../utils/style/layout";
import { useProjects } from "../hooks/useProjects";
import { useAppNavigation } from "../../../utils/navigation";

export const ManagerAllProjects: React.FC = () => {
  const navigation = useAppNavigation();
  const networkId = useSelectedNetworkId();
  const { data: projects } = useProjects(networkId, 0, 100);

  const gotoMilestones = (projectId: string) => {
    navigation.navigate("ProjectsProgramManager")
  }

  return (
    <FlexRow
      style={{
        width: "100%",
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      {projects.map((project) => {
        return (
          <ProjectBox
            project={project}
            containerStyle={{
              marginTop: layout.spacing_x2,
              marginRight: layout.spacing_x2,
            }}
          />
        );
      })}
    </FlexRow>
  );
};
