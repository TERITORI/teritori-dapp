import moment from "moment";
import React, { useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import filterSVG from "../../../../assets/icons/filter.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { ProgressLine } from "../../../components/ProgressLine";
import { SearchBarInput } from "../../../components/Search/SearchBarInput";
import { IconButton } from "../../../components/buttons/IconButton";
import { RoundedGradientImage } from "../../../components/images/RoundedGradientImage";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { TableRow } from "../../../components/table/TableRow";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { useAppNavigation } from "../../../utils/navigation";
import { neutral33, neutralFF } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { ProjectStatusTag } from "../components/ProjectStatusTag";
import { ProjectsStatusFilterButtons } from "../components/ProjectsStatusFilterButtons";
import { useProjects } from "../hooks/useProjects";
import { ContractStatus, Project } from "../types";
import { getProjectStats } from "../utils";

const getTableCols = (projectType: ProjectType) => {
  return {
    name: {
      label: "Project name",
      flex: 3,
    },
    status: {
      label: "Status",
      flex: 2,
    },
    manager: {
      label: projectType === "myProjects" ? "Investor" : "Builder",
      flex: 5,
    },
    milestones: {
      label: "Milestones",
      flex: 3,
    },
    grant: {
      label: "Grant",
      flex: 1,
    },
    creationDate: {
      label: "Creation data",
      flex: 2,
    },
  };
};

type ProjectType = "myInvestments" | "myProjects";

const ProjectRow: React.FC<{ project: Project; projectType: ProjectType }> = ({
  project,
  projectType,
}) => {
  const stats = getProjectStats(project);
  const navigation = useAppNavigation();

  return (
    <FlexRow
      style={{ height: 50, borderBottomWidth: 1, borderBottomColor: neutral33 }}
    >
      {/* === Name === */}
      <FlexRow style={{ flex: 3 }}>
        <RoundedGradientImage
          size="XXS"
          sourceURI={project.metadata.shortDescData.coverImg}
        />

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ProjectsDetail", { id: "" + project.id })
          }
        >
          <BrandText
            numberOfLines={2}
            style={[
              { color: neutralFF, marginLeft: layout.spacing_x1 },
              fontSemibold13,
            ]}
          >
            {project.metadata.shortDescData.name}
          </BrandText>
        </TouchableOpacity>
      </FlexRow>

      {/* === Status === */}
      <View style={{ flex: 2, alignItems: "center" }}>
        <ProjectStatusTag size="XS" status={project.status} />
      </View>

      {/* === Manager === */}
      <View style={{ flex: 5, alignItems: "flex-start" }}>
        <BrandText style={[{ color: neutralFF }, fontSemibold13]}>
          {projectType === "myProjects" && project.funder}
          {projectType === "myInvestments" && project.contractor}
        </BrandText>
      </View>

      {/* === Milestones === */}
      <View style={{ flex: 3, alignItems: "center" }}>
        <BrandText style={[{ color: neutralFF }, fontSemibold13]}>
          {stats.completed}/{stats.total}
        </BrandText>

        <ProgressLine percent={stats.percentCompleted} width={60} />
      </View>

      {/* === Grant === */}
      <View style={{ flex: 1, alignItems: "center" }}>
        <BrandText style={[{ color: neutralFF }, fontSemibold13]}>
          ${project.metadata.shortDescData.budget}
        </BrandText>
      </View>

      {/* === Creation date === */}
      <View style={{ flex: 2, alignItems: "center" }}>
        <BrandText style={[{ color: neutralFF }, fontSemibold13]}>
          {moment(project.createdAt).format("L")}
        </BrandText>
      </View>
    </FlexRow>
  );
};

export const MyProjectsManager: React.FC<{
  type: ProjectType;
}> = ({ type }) => {
  const networkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();

  const { data: projects } = useProjects(
    networkId,
    0,
    100,
    type === "myProjects" ? "ALL" : selectedWallet?.address,
    type === "myProjects" ? selectedWallet?.address : "ALL",
  );

  const [statusFilter, setStatusFilter] = useState<ContractStatus>(
    ContractStatus.ALL,
  );
  const [searchText, setSearchText] = useState("");

  const filteredProjects = useMemo(() => {
    return projects
      .filter(
        (p) => statusFilter === ContractStatus.ALL || p.status === statusFilter,
      )
      .filter((p) =>
        p.metadata.shortDescData.name
          .toLowerCase()
          .includes(searchText.toLowerCase()),
      );
  }, [projects, statusFilter, searchText]);

  return (
    <View>
      <FlexRow style={{ justifyContent: "space-between" }}>
        <ProjectsStatusFilterButtons
          status={statusFilter}
          onChange={setStatusFilter}
        />

        <FlexRow style={{ width: "auto" }}>
          <SearchBarInput
            placeholder="Search for project..."
            text={searchText}
            onChangeText={setSearchText}
          />

          <SpacerRow size={1} />

          <IconButton
            iconSVG={filterSVG}
            size="SM"
            noBrokenCorners
            backgroundColor={neutral33}
          />
        </FlexRow>
      </FlexRow>

      <SpacerColumn size={2} />

      <TableRow
        headings={Object.values(getTableCols(type))}
        labelStyle={{ textAlign: "center" }}
      />

      <FlexRow
        style={{
          width: "100%",
          flexWrap: "wrap",
          justifyContent: "space-between",
          paddingHorizontal: layout.spacing_x2_5, // Need padding to sync with table heading
        }}
      >
        {filteredProjects.map((project) => (
          <ProjectRow key={project.id} project={project} projectType={type} />
        ))}
      </FlexRow>
    </View>
  );
};
