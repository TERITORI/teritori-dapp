import React, { useState } from "react";

import { HeaderBackButton } from "./components/HeaderBackButton";
import { ManagerAllGrants } from "./components/ManagerAllGrants";
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

type Tab = "allGrants" | "requestsByBuilders";

const TAB_OPTIONS = {
  allGrants: {
    name: "All Grants",
  },
  requestsByBuilders: {
    name: "Requests by builders",
  },
};

export const GrantsProgramManagerScreen: ScreenFC<
  "GrantsProgramManager"
> = () => {
  const params = useRoute();
  const projectId = (params as any).projectId || "0";

  const [searchText, setSearchText] = useState("");
  const [selectedTab, setSelectedTab] = useState<Tab>("allGrants");

  return (
    <ScreenContainer isLarge responsive headerChildren={<HeaderBackButton />}>
      <FlexRow
        style={{
          marginTop: layout.spacing_x4,
          justifyContent: "space-between",
        }}
      >
        <BrandText style={fontSemibold28}>Grants Manager</BrandText>

        <Tabs
          items={TAB_OPTIONS}
          selected={selectedTab}
          onSelect={(tab) => setSelectedTab(tab)}
          tabTextStyle={fontSemibold14}
        />

        <FlexRow style={{ width: "auto" }}>
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

      {selectedTab === "allGrants" && <ManagerAllGrants />}
      {selectedTab === "requestsByBuilders" && <ManagerRequests />}
    </ScreenContainer>
  );
};
