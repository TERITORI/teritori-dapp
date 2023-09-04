import React, { useState } from "react";

import { GrantBox } from "./components/GrantBox";
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
import {
  fontSemibold14,
  fontSemibold20,
  fontSemibold28,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

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
  const [searchText, setSearchText] = useState("");
  const [selectedTab, setSelectedTab] = useState<Tab>("allGrants");

  return (
    <ScreenContainer
      isLarge
      responsive
      headerChildren={
        <BrandText style={fontSemibold20}>Grants Program</BrandText>
      }
    >
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

      <FlexRow
        style={{
          width: "100%",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7].map((id) => {
          return (
            <GrantBox
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
