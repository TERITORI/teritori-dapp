import React, { useState } from "react";
import { View } from "react-native";
import { SvgProps } from "react-native-svg";

import { HeaderBackButton } from "./components/HeaderBackButton";
import { MilestoneStatusTag } from "./components/MilestoneStatusTag";
import { useProject } from "./hooks/useProjects";
import { Project, ProjectMilestone } from "./types";
import githubSVG from "../../../assets/icons/github.svg";
import FlexRow from "../../components/FlexRow";
import useSelectedWallet from "../../hooks/useSelectedWallet";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { PrimaryButtonOutline } from "@/components/buttons/PrimaryButtonOutline";
import { SocialButton } from "@/components/buttons/SocialButton";
import { RoundedGradientImage } from "@/components/images/RoundedGradientImage";
import { TextInputCustom } from "@/components/inputs/TextInputCustom";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { useEscrowContract } from "@/screens/Projects/hooks/useEscrowContract";
import { prettyPrice } from "@/utils/coins";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";
import {
  neutral17,
  neutral77,
  neutralA3,
  neutralFF,
  primaryColor,
  redDefault,
} from "@/utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold16,
  fontSemibold20,
  fontSemibold28,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

const CustomSocialButton: React.FC<{
  text: string;
  iconSvg: React.FC<SvgProps>;
}> = ({ text, iconSvg }) => {
  return (
    <SocialButton
      text={text}
      iconSvg={iconSvg}
      textColor={neutralA3}
      style={{ width: "100%", backgroundColor: neutral17 }}
    />
  );
};

export const ProjectsCompleteMilestoneScreen: ScreenFC<
  "ProjectsCompleteMilestone"
> = ({ route: { params } }) => {
  const navigation = useAppNavigation();

  const networkId = useSelectedNetworkId();
  const { projectId, milestoneId } = params;
  const [isProcessing, setIsProcessing] = useState(false);
  const selectedWallet = useSelectedWallet();

  const { data: project } = useProject(projectId);
  const milestone = (project?.milestones || []).find(
    (_, idx) => idx === +milestoneId,
  );

  const [report, setReport] = useState("");

  const { execEscrowMethod } = useEscrowContract(
    networkId,
    selectedWallet?.address,
  );

  const completeMilestone = async (
    project: Project,
    milestone: ProjectMilestone,
  ) => {
    setIsProcessing(true);

    const isOk = await execEscrowMethod("CompleteMilestoneAndPay", [
      project?.id?.toString(),
      milestone.id.toString(),
    ]);

    setIsProcessing(true);

    if (isOk) {
      navigation.navigate("ProjectsDetail", { id: projectId });
    }
  };

  if (!milestone || !project) return null;

  return (
    <ScreenContainer isLarge responsive headerChildren={<HeaderBackButton />}>
      <FlexRow style={{ marginTop: layout.spacing_x4 }}>
        <RoundedGradientImage
          size="S"
          square
          sourceURI={project.metadata?.shortDescData?.coverImg}
        />
        <SpacerRow size={2} />

        <View>
          <BrandText style={[fontSemibold16, { color: neutralA3 }]}>
            Project
          </BrandText>

          <BrandText style={fontSemibold28}>
            {project.metadata?.shortDescData?.name}
          </BrandText>
        </View>
      </FlexRow>

      <Separator style={{ marginVertical: layout.spacing_x2 }} />

      <FlexRow breakpoint={800} style={{ alignItems: "flex-start" }}>
        {/* Left Col ==========================================================*/}

        <View style={{ flex: 1, width: "100%" }}>
          <TertiaryBox
            style={{
              backgroundColor: neutral17,
              borderWidth: 0,
              padding: layout.spacing_x2,
            }}
          >
            <BrandText
              style={[
                fontSemibold14,
                { color: neutralFF, alignSelf: "flex-start" },
              ]}
            >
              Milestone: {milestone.title}
            </BrandText>

            <SpacerColumn size={2} />

            <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
              {milestone.desc}
            </BrandText>
          </TertiaryBox>

          <SpacerColumn size={2} />

          {/*<TertiaryBox*/}
          {/*  style={{*/}
          {/*    backgroundColor: neutral17,*/}
          {/*    padding: layout.spacing_x2,*/}
          {/*    borderWidth: 0,*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <FlexRow>*/}
          {/*    <BrandText style={[fontSemibold14, { color: neutralFF }]}>*/}
          {/*      Tags:*/}
          {/*    </BrandText>*/}

          {/*    {project?.metadata?.shortDescData?.tags.split(",").map((tag) => {*/}
          {/*      return (*/}
          {/*        <Tag*/}
          {/*          text={tag}*/}
          {/*          containerStyle={{ marginLeft: layout.spacing_x1_5 }}*/}
          {/*        />*/}
          {/*      );*/}
          {/*    })}*/}

          {/*    <View style={{ flexGrow: 1, alignItems: "flex-end" }}>*/}
          {/*      <Tag text={moment(project?.createdAt).format("L")} />*/}
          {/*    </View>*/}
          {/*  </FlexRow>*/}
          {/*</TertiaryBox>*/}

          {/*<SpacerColumn size={2} />*/}

          <TertiaryBox
            style={{
              backgroundColor: neutral17,
              padding: layout.spacing_x2,
              borderWidth: 0,
              marginBottom: layout.spacing_x2,
            }}
          >
            <BrandText
              style={[
                fontSemibold14,
                { color: neutralFF, alignSelf: "flex-start" },
              ]}
            >
              Report input:
            </BrandText>

            <SpacerColumn size={2} />

            <TextInputCustom
              value={report}
              onChangeText={(text) => setReport(text)}
              label=""
              name="name"
              placeholder="Enter details here..."
              hideLabel
              multiline
              noBrokenCorners
              containerStyle={{ width: "100%" }}
              textInputStyle={{ height: 80 }}
            />

            <SpacerColumn size={2} />

            <PrimaryButtonOutline
              noBrokenCorners
              disabled={!report}
              size="SM"
              color={redDefault}
              text="Ask for conflict solver"
              style={{ alignSelf: "flex-end" }}
            />
          </TertiaryBox>
        </View>

        <SpacerRow size={2} />

        {/* Right Col =========================================================*/}
        <View style={{ maxWidth: 380 }}>
          <TertiaryBox
            style={{
              padding: layout.spacing_x2,
              backgroundColor: neutral17,
              borderWidth: 0,
            }}
          >
            <FlexRow style={{ justifyContent: "space-between", width: "100%" }}>
              <BrandText style={fontSemibold20}>Budget</BrandText>
              <SpacerRow size={1} />
              <BrandText style={[fontSemibold20, { color: primaryColor }]}>
                {prettyPrice(networkId, milestone.amount, project.paymentDenom)}
              </BrandText>
            </FlexRow>

            <Separator style={{ marginVertical: layout.spacing_x2 }} />

            <FlexRow style={{ justifyContent: "space-between", width: "100%" }}>
              <BrandText style={fontSemibold14}>Status</BrandText>

              <MilestoneStatusTag status={milestone.status} />
            </FlexRow>

            <Separator style={{ marginVertical: layout.spacing_x2 }} />

            <View style={{ justifyContent: "flex-start", width: "100%" }}>
              <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                Contractor:
              </BrandText>

              <BrandText style={fontSemibold14}>
                @{project?.contractor}
              </BrandText>
            </View>
          </TertiaryBox>

          <SpacerColumn size={2} />

          <TertiaryBox
            style={{
              padding: layout.spacing_x2,
              backgroundColor: neutral17,
              borderWidth: 0,
            }}
          >
            <CustomSocialButton text="Github URL" iconSvg={githubSVG} />
          </TertiaryBox>

          <SpacerColumn size={2} />

          <PrimaryButton
            onPress={() => completeMilestone(project, milestone)}
            fullWidth
            disabled={isProcessing}
            text="Complete the Milestone"
          />

          <SpacerColumn size={2} />
        </View>
      </FlexRow>
    </ScreenContainer>
  );
};
