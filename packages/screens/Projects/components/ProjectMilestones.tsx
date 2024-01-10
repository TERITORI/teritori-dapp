import React, { useMemo, useState } from "react";
import { View } from "react-native";

import { MilestoneBoard } from "./MilestoneBoard";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SearchBarInput } from "../../../components/Search/SearchBarInput";
import { Separator } from "../../../components/separators/Separator";
import { SpacerRow } from "../../../components/spacer";
import {
  neutral77,
  neutral33,
  neutral00,
  neutral17,
} from "../../../utils/style/colors";
import { fontSemibold20 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { MilestoneFormData, Project } from "../types";

export const ProjectMilestones: React.FC<{
  project: Project;
  onSelectMilestone?: (milestone: MilestoneFormData) => void;
}> = ({ project, onSelectMilestone }) => {
  const milestones = useMemo(() => {
    return project?.metadata.milestones || [];
  }, [project?.metadata.milestones]);

  const [searchText, setSearchText] = useState("");
  const [isHideInfo, setIsHideInfo] = useState(false);

  const filteredMilestones = useMemo(() => {
    return milestones.filter(
      (m) => m.name.includes(searchText) || m.desc.includes(searchText),
    );
  }, [milestones, searchText]);

  return (
    <View
      style={{
        // NOTE: trick to get will width background on responsible/large ScreenContainer
        marginHorizontal: -140,
        paddingHorizontal: 140,
        backgroundColor: neutral17,
        paddingVertical: layout.spacing_x3,
      }}
    >
      <FlexRow>
        <BrandText
          onPress={() => setIsHideInfo(!isHideInfo)}
          style={fontSemibold20}
        >
          All Milestones:
        </BrandText>
        <SpacerRow size={1} />
        <BrandText style={[fontSemibold20, { color: neutral77, flexGrow: 1 }]}>
          {filteredMilestones.length}
        </BrandText>

        <SearchBarInput
          placeholder="Type to search..."
          text={searchText}
          onChangeText={setSearchText}
          inputStyle={{ backgroundColor: neutral00 }}
          noBrokenCorners
        />
      </FlexRow>

      <Separator
        color={neutral33}
        style={{
          marginBottom: layout.spacing_x2,
          marginTop: layout.spacing_x3,
        }}
      />

      <MilestoneBoard
        milestones={filteredMilestones}
        onSelectMilestone={onSelectMilestone}
      />
    </View>
  );
};
