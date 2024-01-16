import React from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import githubSVG from "../../../../assets/icons/github.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { Link } from "../../../components/Link";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { SocialButton } from "../../../components/buttons/SocialButton";
import { Separator } from "../../../components/separators/Separator";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { useAppNavigation } from "../../../utils/navigation";
import {
  neutral00,
  neutral17,
  neutral77,
  neutralA3,
  neutralFF,
} from "../../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold16,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { MilestonePriorityTag } from "../components/MilestonePriorityTag";
import { MilestoneStatusTag } from "../components/MilestoneStatusTag";
import { useProjects } from "../hooks/useProjects";
import { MsStatus, ProjectMilestone } from "../types";

export const MilestonesUpdateManager: React.FC = () => {
  const navigation = useAppNavigation();
  const networkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();

  // TODO: Support to hardcoded 10 projects for now, make this more dynamic latter
  const { data: projects, isLoading } = useProjects(
    networkId,
    0,
    100,
    selectedWallet?.address,
    "ALL",
  );

  if (isLoading || !selectedWallet?.address) return null;

  return (
    <>
      {projects.map((project) =>
        project.milestones
          .filter((m) => m.status === MsStatus.MS_REVIEW)
          .map((milestone: ProjectMilestone, milestoneIdx: number) => {
            return (
              <>
                <BrandText style={[fontSemibold16]}>
                  Project: {project.metadata.shortDescData.name}
                </BrandText>
                <TertiaryBox
                  style={{
                    backgroundColor: neutral17,
                    marginTop: layout.spacing_x1_5,
                    paddingVertical: layout.spacing_x1_5,
                    paddingHorizontal: layout.spacing_x2,
                  }}
                >
                  <FlexRow>
                    <View style={{ flex: 3 }}>
                      <BrandText style={fontSemibold14}>
                        {project.metadata.shortDescData.name}
                      </BrandText>

                      <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
                        {milestone.title}
                      </BrandText>
                    </View>

                    <Separator
                      horizontal
                      style={{ marginHorizontal: layout.spacing_x1_5 }}
                    />

                    <View style={{ flex: 4 }}>
                      <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
                        Builder: @{project.contractor}
                      </BrandText>

                      <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
                        Funder: @{project.funder}
                      </BrandText>
                    </View>

                    <Separator
                      horizontal
                      style={{ marginHorizontal: layout.spacing_x1_5 }}
                    />

                    <View style={{ flex: 1, alignItems: "center" }}>
                      <BrandText
                        style={[
                          fontSemibold13,
                          {
                            color: neutral77,
                            marginRight: layout.spacing_x1_5,
                          },
                        ]}
                      >
                        Status
                      </BrandText>

                      <MilestoneStatusTag status={MsStatus.MS_REVIEW} />

                      {/*   <FlexRow>*/}
                      {/*  //   <MilestoneStatusTag status={MsStatus.MS_OPEN} />*/}
                      {/*  //*/}
                      {/*  //   <BrandText*/}
                      {/*  /!*    style={[*!/*/}
                      {/*  /!*      fontSemibold16,*!/*/}
                      {/*  /!*      {*!/*/}
                      {/*  /!*        color: neutral77,*!/*/}
                      {/*  /!*        marginHorizontal: layout.spacing_x1_5,*!/*/}
                      {/*  /!*      },*!/*/}
                      {/*  /!*    ]}*!/*/}
                      {/*  /!*  >*!/*/}
                      {/*  /!*    {">"}*!/*/}
                      {/*  /!*  </BrandText>*!/*/}

                      {/*  /!*  <MilestoneStatusTag status={MsStatus.MS_COMPLETED} />*!/*/}
                      {/*  /!*</FlexRow>*!/*/}
                    </View>

                    <Separator
                      horizontal
                      style={{ marginHorizontal: layout.spacing_x1_5 }}
                    />

                    <View style={{ flex: 1, alignItems: "center" }}>
                      <BrandText
                        style={[
                          fontSemibold13,
                          {
                            color: neutral77,
                            marginRight: layout.spacing_x1_5,
                          },
                        ]}
                      >
                        Priority
                      </BrandText>

                      <MilestonePriorityTag priority={milestone.priority} />
                    </View>

                    <Separator
                      horizontal
                      style={{ marginHorizontal: layout.spacing_x1_5 }}
                    />

                    <Link to={milestone.link}>
                      <SocialButton
                        iconSvg={githubSVG}
                        style={{
                          marginRight: layout.spacing_x2,
                        }}
                        bgColor={neutral17}
                      />
                    </Link>

                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("ProjectsCompleteMilestone", {
                          projectId: project.id,
                          milestoneId: milestone.id,
                        })
                      }
                    >
                      <BrandText
                        style={[
                          fontSemibold14,
                          {
                            color: neutral00,
                            backgroundColor: neutralFF,
                            paddingVertical: 10,
                            paddingHorizontal: 16,
                            borderRadius: 4,
                          },
                        ]}
                      >
                        Approve
                      </BrandText>
                    </TouchableOpacity>
                  </FlexRow>
                </TertiaryBox>
              </>
            );
          }),
      )}
    </>
  );
};
