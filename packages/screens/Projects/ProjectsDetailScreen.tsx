import { Link, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { HeaderBackButton } from "./components/HeaderBackButton";
import { MilestonePriorityTag } from "./components/MilestonePriorityTag";
import { MilestoneStatusTag } from "./components/MilestoneStatusTag";
import { ProjectInfo } from "./components/ProjectInfo";
import { ProjectMilestones } from "./components/ProjectMilestones";
import { useProject } from "./hooks/useProjects";
import { useUtils } from "./hooks/useUtils";
import { ContractStatus, MilestoneFormData, MsStatus, Project } from "./types";
import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import closeSVG from "../../../assets/icons/close.svg";
import githubSVG from "../../../assets/icons/github.svg";
import { BrandText } from "../../components/BrandText";
import { FlexRow } from "../../components/FlexRow";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import {
  SelectInput,
  SelectInputItem,
} from "../../components/inputs/SelectInput";
import { Separator } from "../../components/separators/Separator";
import { SpacerColumn } from "../../components/spacer";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { mustGetGnoNetwork } from "../../networks";
import { adenaVMCall } from "../../utils/gno";
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

const STATUSES: SelectInputItem[] = [
  { label: "Open", value: MsStatus.MS_OPEN.toString() },
  { label: "In Progress", value: MsStatus.MS_PROGRESS.toString() },
  { label: "Review", value: MsStatus.MS_REVIEW.toString() },
  { label: "Completed", value: MsStatus.MS_COMPLETED.toString() },
];

const MilestoneDetail: React.FC<{
  project: Project;
  milestone: MilestoneFormData;
  editable?: boolean;
}> = ({ project, editable, milestone }) => {
  const [newStatus, setNewStatus] = useState<MsStatus>(milestone.status);

  return (
    <View
      style={{
        width: 300,
        position: "absolute",
        right: 0,
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
      <TouchableOpacity>
        <SVG
          source={closeSVG}
          width={24}
          style={{ position: "absolute", top: -24, right: -24 }}
        />
      </TouchableOpacity>

      <BrandText style={fontSemibold20}>{milestone.name}</BrandText>

      <SpacerColumn size={3} />

      <FlexRow style={{ justifyContent: "space-between" }}>
        <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
          Status
        </BrandText>

        <MilestoneStatusTag status={milestone.status} />
      </FlexRow>

      <SpacerColumn size={2} />

      <FlexRow style={{ justifyContent: "space-between" }}>
        <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
          Priority
        </BrandText>

        <MilestonePriorityTag priority={milestone.priority} />
      </FlexRow>

      <Separator style={{ marginVertical: layout.spacing_x2 }} />

      <BrandText style={fontSemibold14}>Description</BrandText>

      <SpacerColumn size={2} />

      <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
        {milestone.desc}
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
        <Link to={milestone.githubLink} style={{ width: "100%" }}>
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

      {/*{editable && (*/}
      {/*  <View>*/}
      {/*    <View style={{ marginVertical: layout.spacing_x2 }}>*/}
      {/*      <BrandText style={fontSemibold14}>Change status</BrandText>*/}
      {/*    </View>*/}

      {/*    <SelectInput*/}
      {/*      data={STATUSES}*/}
      {/*      selectedItem={*/}
      {/*        STATUSES.find((s) => s.value === newStatus) || STATUSES[0]*/}
      {/*      }*/}
      {/*      selectItem={(item) => setNewStatus(item.value as MsStatus)}*/}
      {/*      boxStyle={{ height: 32 }}*/}
      {/*    />*/}

      {/*    <SpacerColumn size={2} />*/}

      {/*    <PrimaryButton*/}
      {/*      disabled={newStatus === milestone.status || isProcessing}*/}
      {/*      text="Start"*/}
      {/*      onPress={() => startMilestone(project)}*/}
      {/*      fullWidth*/}
      {/*      size="SM"*/}
      {/*    />*/}
      {/*  </View>*/}
      {/*)}*/}
    </View>
  );
};

export const ProjectsDetailScreen: ScreenFC<"ProjectsDetail"> = () => {
  const [selectedMilestone, setSelectedMilestone] =
    useState<MilestoneFormData>();
  const { params } = useRoute();

  const [isProcessing, setIsProcessing] = useState(false);
  const networkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const { mustGetValue } = useUtils();
  const { setToastError, setToastSuccess } = useFeedbacks();

  const { data: project } = useProject(networkId, (params as any).id || 0);
  const editable =
    project?.contractor === selectedWallet?.address &&
    project?.status === ContractStatus.ACCEPTED;

  const onSelectMilestone = (milestone: MilestoneFormData) => {
    setSelectedMilestone(
      milestone.id === selectedMilestone?.id ? undefined : milestone,
    );
  };

  const startMilestone = async (project: Project) => {
    setIsProcessing(true);

    const gnoNetwork = mustGetGnoNetwork(networkId);
    const caller = mustGetValue(selectedWallet?.address, "caller");
    const escrowPkgPath = mustGetValue(
      gnoNetwork.escrowPkgPath,
      "escrow pkg path",
    );

    try {
      await adenaVMCall(
        networkId,
        {
          caller,
          send: "",
          pkg_path: escrowPkgPath,
          func: "StartMilestone",
          args: ["" + project.id],
        },
        { gasWanted: 2_000_000 },
      );

      setToastSuccess({
        title: "Success",
        message: "Milestone status has been updated",
      });
    } catch (e: any) {
      setToastError({ title: "Error", message: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!project) return null;

  return (
    <ScreenContainer isLarge responsive headerChildren={<HeaderBackButton />}>
      <FlexRow>
        <View style={{ flex: 1 }}>
          <ProjectInfo project={project} />

          {/* Actions */}
          {editable && (
            <>
              <PrimaryButton
                disabled={isProcessing}
                text="Start a milestone"
                onPress={() => startMilestone(project)}
                size="SM"
                width={200}
              />
              <SpacerColumn size={2} />
            </>
          )}

          <ProjectMilestones
            onSelectMilestone={onSelectMilestone}
            project={project}
          />
        </View>

        {/* Detail view ======================================================= */}
        {selectedMilestone !== undefined && (
          <MilestoneDetail
            project={project}
            milestone={selectedMilestone}
            editable={
              project.contractor === selectedWallet?.address &&
              project.status === ContractStatus.ACCEPTED
            }
          />
        )}
      </FlexRow>
    </ScreenContainer>
  );
};
