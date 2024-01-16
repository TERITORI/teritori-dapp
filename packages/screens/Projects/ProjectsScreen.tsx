import React, { useMemo, useState } from "react";

import { ProjectBox } from "./components/ProjectBox";
import { ProjectsStatusFilterButtons } from "./components/ProjectsStatusFilterButtons";
import { useProjects } from "./hooks/useProjects";
import { ContractStatus, Project } from "./types";
import filterSVG from "../../../assets/icons/filter.svg";
import { BrandText } from "../../components/BrandText";
import { FlexRow } from "../../components/FlexRow";
import { ScreenContainer } from "../../components/ScreenContainer";
import { SearchBarInput } from "../../components/Search/SearchBarInput";
import { IconButton } from "../../components/buttons/IconButton";
import { SimpleButton } from "../../components/buttons/SimpleButton";
import { Separator } from "../../components/separators/Separator";
import { SpacerRow } from "../../components/spacer";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { NetworkKind } from "../../networks";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import {
  neutral33,
  primaryColor,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold20, fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export const ProjectsScreen: ScreenFC<"Projects"> = () => {
  const [searchText, setSearchText] = useState("");
  const networkId = useSelectedNetworkId();
  const { data: projects } = useProjects(networkId, 0, 100, "ALL", "ALL");

  const navigation = useAppNavigation();

  const gotoProjectsDetail = (id: string) => {
    navigation.navigate("ProjectsDetail", { id });
  };

  const gotoProjectsManager = () => {
    navigation.navigate("ProjectsManager", { view: "myInvestments" });
  };

  const gotoCreateGrant = () => {
    navigation.navigate("ProjectsMakeRequest", { step: 1 });
  };

  const [statusFilter, setStatusFilter] = useState<ContractStatus>(
    ContractStatus.ALL,
  );

  const filteredProjects = useMemo(() => {
    return projects.filter(
      (p: Project) =>
        (statusFilter === ContractStatus.ALL || p.status === statusFilter) &&
        (p.metadata.shortDescData.name.includes(searchText) ||
          p.metadata.shortDescData.desc.includes(searchText)),
    );
  }, [statusFilter, projects, searchText]);

  return (
    <ScreenContainer
      forceNetworkKind={NetworkKind.Gno}
      isLarge
      responsive
      headerChildren={
        <BrandText style={fontSemibold20}>Projects Program</BrandText>
      }
    >
      <FlexRow style={{ marginTop: layout.spacing_x4 }}>
        <BrandText style={[fontSemibold28, { flexGrow: 1 }]}>
          Projects Program
        </BrandText>

        <SimpleButton
          outline
          text="Project Manager"
          color={secondaryColor}
          size="SM"
          onPress={gotoProjectsManager}
        />
        <SpacerRow size={2} />
        <SimpleButton
          outline
          text="Create a Project"
          color={primaryColor}
          size="SM"
          onPress={gotoCreateGrant}
        />
      </FlexRow>

      <Separator style={{ marginTop: layout.spacing_x2 }} />

      <FlexRow style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
        <ProjectsStatusFilterButtons
          status={statusFilter}
          onChange={setStatusFilter}
        />

        <FlexRow style={{ width: "auto", marginTop: layout.spacing_x2 }}>
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

      <FlexRow
        style={{
          width: "100%",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {filteredProjects.map((project) => {
          return (
            <ProjectBox
              key={"" + project.id}
              project={project}
              onPress={() => gotoProjectsDetail("" + project.id)}
              containerStyle={{
                marginTop: layout.spacing_x2,
                marginRight: layout.spacing_x2,
              }}
            />
          );
        })}
      </FlexRow>
    </ScreenContainer>
  );
};
