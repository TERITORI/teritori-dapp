import React, { useState } from "react";

import filterSVG from "../../../assets/icons/filter.svg";
import { BrandText } from "../../components/BrandText";
import { FlexRow } from "../../components/FlexRow";
import { ScreenContainer } from "../../components/ScreenContainer";
import { SearchBar } from "../../components/Search/SearchBar";
import {
  SearchBarInputGlobal,
  SearchBarInput,
} from "../../components/Search/SearchBarInput";
import { Separator } from "../../components/Separator";
import { IconButton } from "../../components/buttons/IconButton";
import { SpacerRow } from "../../components/spacer";
import { ScreenFC } from "../../utils/navigation";
import {
  neutral00,
  neutral33,
  primaryColor,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { SimpleButton } from "../RiotGame/component/SimpleButton";

export const GrantsProgramScreen: ScreenFC<"GrantsProgram"> = () => {
  const [searchText, setSearchText] = useState("");

  return (
    <ScreenContainer mobileTitle="Grants Program">
      <FlexRow
        style={{
          marginTop: layout.padding_x4,
          justifyContent: "space-between",
        }}
      >
        <BrandText style={fontSemibold28}>Grants Program</BrandText>

        <SimpleButton
          outline
          text="Create a Grant"
          color={primaryColor}
          size="SM"
        />
      </FlexRow>

      <Separator style={{ marginVertical: layout.padding_x2 }} />

      <FlexRow style={{ justifyContent: "space-between" }}>
        <FlexRow style={{ width: "auto" }}>
          <SimpleButton
            text="All"
            color={neutral00}
            bgColor={secondaryColor}
            size="SM"
            style={{ borderWidth: 0 }}
          />
          <SpacerRow size={2} />
          <SimpleButton
            text="Open"
            size="SM"
            bgColor="#C8FFAE1A"
            color="#C8FFAE"
            style={{ borderWidth: 0 }}
          />
          <SpacerRow size={2} />
          <SimpleButton
            text="In Progress"
            size="SM"
            bgColor="#EAA54B1A"
            color="#EAA54B"
            style={{ borderWidth: 0 }}
          />
          <SpacerRow size={2} />
          <SimpleButton
            text="Past Grants"
            size="SM"
            bgColor="#171717"
            color={secondaryColor}
            style={{ borderWidth: 0 }}
          />
        </FlexRow>

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
    </ScreenContainer>
  );
};
