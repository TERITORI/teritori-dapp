import React from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import githubSVG from "@/assets/icons/github.svg";
import FlexRow from "../../../components/FlexRow";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { ProjectMilestone } from "../../../utils/projects/types";
import { MilestonePriorityTag } from "../components/MilestonePriorityTag";
import { MilestoneStatusTag } from "../components/MilestoneStatusTag";
import { useProjects } from "../hooks/useProjects";

import { BrandText } from "@/components/BrandText";
import { Link } from "@/components/Link";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { SocialButton } from "@/components/buttons/SocialButton";
import { Separator } from "@/components/separators/Separator";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { getNetworkObjectId } from "@/networks";
import { useAppNavigation } from "@/utils/navigation";
import {
  neutral00,
  neutral17,
  neutral77,
  neutralA3,
  neutralFF,
} from "@/utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold16,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const MilestonesUpdateManager: React.FC = () => {
  const navigation = useAppNavigation();
  const networkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();

  // TODO: Support to default limit projects for now, make this more dynamic latter
  const { projects, isLoading } = useProjects(networkId, {
    byFunder: { funder: selectedWallet?.address || "" },
  });

  if (isLoading || !selectedWallet?.address) return null;

  return (
    <>
      {projects.map((project) =>
        (project.milestones || [])
          .filter((m) => m.status === "MS_REVIEW")
          .map((milestone: ProjectMilestone, milestoneIdx: number) => {
            return (
              <>
                <BrandText style={[fontSemibold16]}>
                  Project: {project.metadata?.shortDescData?.name}
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
                        {project.metadata?.shortDescData?.name}
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

                      <MilestoneStatusTag status="MS_REVIEW" />
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
                          backgroundColor: neutral17,
                        }}
                      />
                    </Link>

                    <TouchableOpacity
                      onPress={() => {
                        if (!project.id) return;
                        navigation.navigate("ProjectsCompleteMilestone", {
                          projectId: getNetworkObjectId(networkId, project.id),
                          milestoneId: milestone.id,
                        });
                      }}
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
