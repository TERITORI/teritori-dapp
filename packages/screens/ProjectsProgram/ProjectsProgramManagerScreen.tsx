import React, { useState } from "react";

import { HeaderBackButton } from "./components/HeaderBackButton";
import { ManagerAllProjects } from "./components/ManagerAllProjects";
import { ManagerRequests } from "./components/ManagerRequests";
import filterSVG from "../../../assets/icons/filter.svg";
import { BrandText } from "../../components/BrandText";
import { FlexRow } from "../../components/FlexRow";
import { ScreenContainer } from "../../components/ScreenContainer";
import { SearchBarInput } from "../../components/Search/SearchBarInput";
import { IconButton } from "../../components/buttons/IconButton";
import { SpacerRow } from "../../components/spacer";
import { Tabs } from "../../components/tabs/Tabs";
import { ScreenFC } from "../../utils/navigation";
import { neutral33 } from "../../utils/style/colors";
import { fontSemibold14, fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { useRoute } from "@react-navigation/native";

type Tab = "allProjects" | "requestsByBuilders";

const TAB_OPTIONS = {
  allProjects: {
    name: "All Projects",
  },
  requestsByBuilders: {
    name: "Requests by builders",
  },
};

export const ProjectsProgramManagerScreen: ScreenFC<
  "ProjectsProgramManager"
> = () => {
  const params = useRoute();
  const projectId = (params as any).projectId || "0";

  const [searchText, setSearchText] = useState("");
  const [selectedTab, setSelectedTab] = useState<Tab>("allProjects");

  return (
    <ScreenContainer isLarge responsive headerChildren={<HeaderBackButton />}>
      <FlexRow
        style={{
          marginTop: layout.spacing_x4,
          justifyContent: "space-between",
        }}
      >
        <BrandText style={fontSemibold28}>Projects Manager</BrandText>

        <Tabs
          items={TAB_OPTIONS}
          selected={selectedTab}
          onSelect={(tab) => setSelectedTab(tab)}
          tabTextStyle={fontSemibold14}
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

      {selectedTab === "allProjects" && <ManagerAllProjects />}
      {selectedTab === "requestsByBuilders" && <ManagerRequests />}
    </ScreenContainer>
  );
};
