import { Link, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";

import { HeaderBackButton } from "./components/HeaderBackButton";
import { Tag } from "./components/Milestone";
import { ProjectInfo } from "./components/ProjectInfo";
import { ProjectMilestones } from "./components/ProjectMilestones";
import {
  EMPTY_SHORT_DESC,
  EMPTY_TEAM_AND_LINK,
} from "./hooks/useMakeRequestHook";
import { useProject, useProjects } from "./hooks/useProjects";
import { Milestone, Project } from "./types";
import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import githubSVG from "../../../assets/icons/github.svg";
import { BrandText } from "../../components/BrandText";
import { FlexRow } from "../../components/FlexRow";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { Separator } from "../../components/separators/Separator";
import { SpacerColumn } from "../../components/spacer";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { ScreenFC } from "../../utils/navigation";
import {
  neutral00,
  neutral22,
  neutral33,
  neutralA3,
} from "../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export const GrantsProgramDetailScreen: ScreenFC<
  "GrantsProgramDetail"
> = () => {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone>();
  const { params } = useRoute();
  const networkId = useSelectedNetworkId();
  const { data: project } = useProject(networkId, (params as any).id || 0);

  const onSelectMilestone = (milestone: Milestone) => {
    setSelectedMilestone(
      milestone.id === selectedMilestone?.id ? undefined : milestone,
    );
  };

  return (
    <ScreenContainer isLarge responsive headerChildren={<HeaderBackButton />}>
      <FlexRow>
        <View style={{ flex: 1 }}>
          <ProjectInfo
            shortDescData={project?.metadata.shortDescData || EMPTY_SHORT_DESC}
            teamAndLinkData={
              project?.metadata.teamAndLinkData || EMPTY_TEAM_AND_LINK
            }
          />

          <ProjectMilestones
            onSelectMilestone={onSelectMilestone}
            milestones={project?.metadata.milestones || []}
          />
        </View>

        {/* Detail view ======================================================= */}
        {selectedMilestone !== undefined && (
          <View
            style={{
              width: 300,
              alignSelf: "flex-start",
              borderLeftWidth: 1,
              borderLeftColor: neutral33,
              backgroundColor: neutral00,
              height: "100%",
              marginLeft: layout.spacing_x2,
              marginRight: -layout.spacing_x3 * 2,
              paddingHorizontal: layout.spacing_x2,
              paddingVertical: layout.spacing_x4,
            }}
          >
            <BrandText style={fontSemibold20}>
              {selectedMilestone.name}
            </BrandText>

            <SpacerColumn size={3} />

            <FlexRow style={{ justifyContent: "space-between" }}>
              <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
                Status
              </BrandText>

              <Tag
                bgColor="#2F4469"
                color="#ffffff"
                text={selectedMilestone.statusId}
              />
            </FlexRow>

            <SpacerColumn size={2} />

            <FlexRow style={{ justifyContent: "space-between" }}>
              <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
                Priority
              </BrandText>

              <Tag
                bgColor="#673932"
                color="#ffffff"
                text={selectedMilestone.priority}
              />
            </FlexRow>

            <Separator style={{ marginVertical: layout.spacing_x2 }} />

            <BrandText style={fontSemibold14}>Description</BrandText>

            <SpacerColumn size={2} />

            <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
              {selectedMilestone.desc}
            </BrandText>

            <Separator style={{ marginVertical: layout.spacing_x2 }} />

            <TertiaryBox
              style={{
                backgroundColor: neutral22,
                padding: layout.spacing_x1_5,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <SVG source={githubSVG} width={22} height={22} />
              <Link to={selectedMilestone.githubLink} style={{ width: "100%" }}>
                <BrandText
                  style={[
                    fontSemibold13,
                    { flexGrow: 1, marginLeft: layout.spacing_x0_5 },
                  ]}
                >
                  Github link
                </BrandText>
              </Link>

              <SVG source={chevronRightSVG} width={24} height={24} />
            </TertiaryBox>
          </View>
        )}
      </FlexRow>
    </ScreenContainer>
  );
};
