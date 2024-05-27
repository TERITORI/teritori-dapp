import moment from "moment";
import React, { useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { ProjectStatusTag } from "../components/ProjectStatusTag";
import { ProjectsStatusFilterButtons } from "../components/ProjectsStatusFilterButtons";
import { ProjectFilter, useProjects } from "../hooks/useProjects";
import { ContractStatusFilter, Project } from "../types";
import { getProjectStats } from "../utils";

import { BrandText } from "@/components/BrandText";
import { ProgressLine } from "@/components/ProgressLine";
import { RoundedGradientImage } from "@/components/images/RoundedGradientImage";
import { SpacerColumn } from "@/components/spacer";
import { TableCell, TableRow } from "@/components/table/TableRow";
import { UsernameWithAvatar } from "@/components/user/UsernameWithAvatar";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { getNetworkObjectId, getUserId } from "@/networks";
import { prettyPrice } from "@/utils/coins";
import { useAppNavigation } from "@/utils/navigation";
import { neutral33, neutralFF } from "@/utils/style/colors";
import { fontSemibold13 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const MyProjectsManager: React.FC<{
  type: ProjectType;
}> = ({ type }) => {
  const networkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();

  let filter: ProjectFilter;
  switch (type) {
    case "myInvestments": {
      filter = { byFunder: { funder: selectedWallet?.address || "" } };
      break;
    }
    case "myProjects": {
      filter = { byContractor: { contractor: selectedWallet?.address || "" } };
    }
  }
  const { projects } = useProjects(networkId, filter);

  const [statusFilter, setStatusFilter] = useState<ContractStatusFilter>("ALL");

  const filteredProjects = useMemo(() => {
    if (!selectedWallet?.address) return [];

    return projects.filter(
      (p) => statusFilter === "ALL" || p.status === statusFilter,
    );
  }, [projects, statusFilter, selectedWallet?.address]);

  return (
    <View>
      <ProjectsStatusFilterButtons
        status={statusFilter}
        onChange={setStatusFilter}
      />

      <SpacerColumn size={2} />

      <TableRow headings={getTableCols(type)} />
      {filteredProjects.map((project) => (
        <ProjectRow key={project.id} project={project} projectType={type} />
      ))}
    </View>
  );
};

const getTableCols = (projectType: ProjectType) => {
  return {
    name: {
      label: "Project name",
      flex: 2.5,
    },
    status: {
      label: "Status",
      flex: 1,
    },
    manager: {
      label: projectType === "myProjects" ? "Funder" : "Contractor",
      flex: 2.5,
    },
    milestones: {
      label: "Milestones",
      flex: 2,
    },
    grant: {
      label: "Grant",
      flex: 2,
    },
    creationDate: {
      label: "Creation date",
      flex: 1,
    },
  };
};

const defaultCols = getTableCols("myProjects");

type ProjectType = "myInvestments" | "myProjects";

const ProjectRow: React.FC<{ project: Project; projectType: ProjectType }> = ({
  project,
  projectType,
}) => {
  const stats = getProjectStats(project);
  const navigation = useAppNavigation();
  const networkId = useSelectedNetworkId();

  return (
    <View
      style={{
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: neutral33,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: layout.spacing_x2_5,
      }}
    >
      {/* === Name === */}
      <TableCell flex={defaultCols.name.flex} isLast={false}>
        <RoundedGradientImage
          size="XXS"
          sourceURI={project.metadata?.shortDescData?.coverImg}
        />

        <TouchableOpacity
          onPress={() => {
            if (!project.id) {
              return;
            }
            navigation.navigate("ProjectsDetail", {
              id: getNetworkObjectId(networkId, project.id),
            });
          }}
        >
          <BrandText
            numberOfLines={2}
            style={[
              { color: neutralFF, marginLeft: layout.spacing_x1 },
              fontSemibold13,
            ]}
          >
            {project.metadata?.shortDescData?.name}
          </BrandText>
        </TouchableOpacity>
      </TableCell>

      {/* === Status === */}
      <TableCell flex={defaultCols.status.flex} isLast={false}>
        <ProjectStatusTag size="XS" status={project.status} />
      </TableCell>

      {/* === Manager === */}
      <TableCell flex={defaultCols.manager.flex} isLast={false}>
        {projectType === "myProjects" && (
          <UsernameWithAvatar userId={getUserId(networkId, project.funder)} />
        )}
        {projectType === "myInvestments" && (
          <UsernameWithAvatar
            userId={getUserId(networkId, project.contractor)}
          />
        )}
      </TableCell>

      {/* === Milestones === */}
      <TableCell flex={defaultCols.milestones.flex} isLast={false}>
        <BrandText
          style={[
            { color: neutralFF, marginRight: layout.spacing_x1 },
            fontSemibold13,
          ]}
        >
          {stats.completed}/{stats.total}
        </BrandText>
        <ProgressLine gain={stats.percentCompleted / 100} />
      </TableCell>

      {/* === Grant === */}
      <TableCell flex={defaultCols.grant.flex} isLast={false}>
        <BrandText style={[{ color: neutralFF }, fontSemibold13]}>
          {prettyPrice(networkId, project.budget, project.paymentDenom)}
        </BrandText>
      </TableCell>

      {/* === Creation date === */}
      <TableCell flex={defaultCols.creationDate.flex} isLast>
        <BrandText style={[{ color: neutralFF }, fontSemibold13]}>
          {moment(project.createdAt).format("L")}
        </BrandText>
      </TableCell>
    </View>
  );
};
