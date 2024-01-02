import React, { useEffect, useMemo, useState } from "react";

import { GrantBox } from "./components/GrantBox";
import { useProjects } from "./hooks/useProjects";
import { Project } from "./types";
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
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import {
  neutral00,
  neutral33,
  primaryColor,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold20, fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export const GrantsProgramScreen: ScreenFC<"GrantsProgram"> = () => {
  const [searchText, setSearchText] = useState("");
  const networkId = useSelectedNetworkId();
  const { data: projects } = useProjects(networkId, 0, 100);
  const [filterStatus, setFilterStatus] = useState<string>();

  const navigation = useAppNavigation();

  const gotoGrantsProgramDetail = (id: string) => {
    navigation.navigate("GrantsProgramDetail", { id });
  };

  const gotoGrantsProgramManager = () => {
    navigation.navigate("GrantsProgramManager");
  };

  const gotoCreateGrant = () => {
    navigation.navigate("GrantsProgramMakeRequest", { step: 1 });
  };

  const filteredProjects = useMemo(() => {
    if (!filterStatus) return projects;
    return projects.filter(
      (p: Project) =>
        p.status === filterStatus &&
        (p.metadata.shortDescData.name.includes(searchText) ||
          p.metadata.shortDescData.desc.includes(searchText)),
    );
  }, [filterStatus, projects, searchText]);

  return (
    <ScreenContainer
      isLarge
      responsive
      headerChildren={
        <BrandText style={fontSemibold20}>Grants Program</BrandText>
      }
    >
      <FlexRow style={{ marginTop: layout.spacing_x4 }}>
        <BrandText style={[fontSemibold28, { flexGrow: 1 }]}>
          Grants Program
        </BrandText>

        <SimpleButton
          outline
          text="Grant Manager"
          color={secondaryColor}
          size="SM"
          onPress={gotoGrantsProgramManager}
        />
        <SpacerRow size={2} />
        <SimpleButton
          outline
          text="Create a Grant"
          color={primaryColor}
          size="SM"
          onPress={gotoCreateGrant}
        />
      </FlexRow>

      <Separator style={{ marginTop: layout.spacing_x2 }} />

      <FlexRow style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
        <FlexRow style={{ width: "auto", marginTop: layout.spacing_x2 }}>
          <SimpleButton
            onPress={() => setFilterStatus("")}
            text="All"
            color={!filterStatus ? neutral00 : secondaryColor}
            bgColor={!filterStatus ? secondaryColor : neutral00}
            size="SM"
            style={{ borderWidth: 0 }}
          />
          <SpacerRow size={2} />
          <SimpleButton
            onPress={() => setFilterStatus("CREATED")}
            text="Open"
            size="SM"
            bgColor={filterStatus === "CREATED" ? secondaryColor : "#C8FFAE1A"}
            color={filterStatus === "CREATED" ? neutral00 : "#C8FFAE"}
            style={{ borderWidth: 0 }}
          />
          <SpacerRow size={2} />
          <SimpleButton
            onPress={() => setFilterStatus("IN_PROGRESS")}
            text="In Progress"
            size="SM"
            bgColor={
              filterStatus === "IN_PROGRESS" ? secondaryColor : "#EAA54B1A"
            }
            color={filterStatus === "IN_PROGRESS" ? neutral00 : "#EAA54B"}
            style={{ borderWidth: 0 }}
          />
          <SpacerRow size={2} />
          <SimpleButton
            onPress={() => setFilterStatus("PASS")}
            text="Past Grants"
            size="SM"
            bgColor={filterStatus === "PASS" ? secondaryColor : "#171717"}
            color={filterStatus === "PASS" ? neutral00 : secondaryColor}
            style={{ borderWidth: 0 }}
          />
        </FlexRow>

        <FlexRow style={{ width: "auto", marginTop: layout.spacing_x2 }}>
          <SearchBarInput
            placeholder="Search for grant..."
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
            <GrantBox
              key={"" + project.id}
              project={project}
              onPress={() => gotoGrantsProgramDetail("" + project.id)}
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
