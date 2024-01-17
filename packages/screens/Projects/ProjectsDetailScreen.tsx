import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { Link, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { HeaderBackButton } from "./components/HeaderBackButton";
import { MilestonePriorityTag } from "./components/MilestonePriorityTag";
import { MilestoneStatusTag } from "./components/MilestoneStatusTag";
import { ProjectInfo } from "./components/ProjectInfo";
import { ProjectMilestones } from "./components/ProjectMilestones";
import { useProject } from "./hooks/useProjects";
import { useUtils } from "./hooks/useUtils";
import { ContractStatus, ProjectMilestone, MsStatus, Project } from "./types";
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
import { adenaVMCall, extractGnoString } from "../../utils/gno";
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
  // NOTE: Disable, use cannot change status to COMPLETED
  // { label: "Completed", value: MsStatus.MS_COMPLETED.toString() },
];

const MilestoneDetail: React.FC<{
  project: Project;
  milestone: ProjectMilestone;
  editable?: boolean;
  onClose?: (milestone: ProjectMilestone) => void;
}> = ({ project, editable, milestone, onClose }) => {
  const [newStatus, setNewStatus] = useState<MsStatus>(milestone.status);
  const networkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const { mustGetValue } = useUtils();
  const { setToastError, setToastSuccess } = useFeedbacks();

  const [isProcessing, setIsProcessing] = useState(false);

  const changeMilestoneStatus = async (
    project: Project,
    milestone: ProjectMilestone,
  ) => {
    setIsProcessing(true);

    const gnoNetwork = mustGetGnoNetwork(networkId);
    const caller = mustGetValue(selectedWallet?.address, "caller");
    const escrowPkgPath = mustGetValue(
      gnoNetwork.escrowPkgPath,
      "escrow pkg path",
    );

    try {
      // Convert milestone status => status id
      let statusId = 1;
      for (const msStatus in MsStatus) {
        if (msStatus === newStatus) {
          break;
        }
        statusId++;
      }

      await adenaVMCall(
        networkId,
        {
          caller,
          send: "",
          pkg_path: escrowPkgPath,
          func: "ChangeMilestoneStatus",
          args: [
            project.id.toString(),
            milestone.id.toString(),
            statusId.toString(),
          ],
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
      <TouchableOpacity onPress={() => onClose?.(milestone)}>
        <SVG
          source={closeSVG}
          width={24}
          style={{ position: "absolute", top: -24, right: -24 }}
        />
      </TouchableOpacity>

      <BrandText style={fontSemibold20}>{milestone.title}</BrandText>

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
        <Link to={milestone.link} style={{ width: "100%" }}>
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

      {editable && (
        <View>
          <View style={{ marginVertical: layout.spacing_x2 }}>
            <BrandText style={fontSemibold14}>Change status</BrandText>
          </View>

          <SelectInput
            data={STATUSES}
            selectedItem={
              STATUSES.find((s) => s.value === newStatus) || STATUSES[0]
            }
            selectItem={(item) => setNewStatus(item.value as MsStatus)}
            boxStyle={{ height: 32 }}
          />

          <SpacerColumn size={2} />

          <PrimaryButton
            disabled={newStatus === milestone.status || isProcessing}
            text="Start"
            onPress={() => changeMilestoneStatus(project, milestone)}
            fullWidth
            size="SM"
          />
        </View>
      )}
    </View>
  );
};

export const ProjectsDetailScreen: ScreenFC<"ProjectsDetail"> = () => {
  const { params } = useRoute();

  const networkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();

  const [isProcessing, setIsProcessing] = useState(false);
  const { setToastError, setToastSuccess } = useFeedbacks();
  const { mustGetValue } = useUtils();

  const [selectedMilestone, setSelectedMilestone] =
    useState<ProjectMilestone>();

  const { data: project } = useProject(networkId, (params as any).id || 0);

  const onSelectMilestone = (milestone: ProjectMilestone) => {
    setSelectedMilestone(
      milestone.id === selectedMilestone?.id ? undefined : milestone,
    );
  };

  const submitFunder = async (project: Project) => {
    setIsProcessing(true);

    try {
      const gnoNetwork = mustGetGnoNetwork(networkId);
      const caller = mustGetValue(selectedWallet?.address, "caller");
      const escrowPkgPath = mustGetValue(
        gnoNetwork.escrowPkgPath,
        "escrow pkg path",
      );

      // Approve needed amount
      // Approve Escrow to send the needed foo20 fund
      // Get Escrow realm Address
      const provider = new GnoJSONRPCProvider(gnoNetwork.endpoint);

      const escrowAddress = extractGnoString(
        await provider.evaluateExpression(escrowPkgPath, `CurrentRealm()`),
      );

      await adenaVMCall(
        networkId,
        {
          caller,
          send: "",
          pkg_path: project.escrowToken,
          func: "Approve",
          args: [escrowAddress, "" + project.budget], // Decimal of gopher20 = 4
        },
        { gasWanted: 1_000_000 },
      );

      await adenaVMCall(
        networkId,
        {
          caller,
          send: "",
          pkg_path: escrowPkgPath,
          func: "SubmitFunder",
          args: [project.id.toString()],
        },
        { gasWanted: 1_000_000 },
      );

      setToastSuccess({
        title: "Success",
        message: "You become the funder for this project !",
      });
    } catch (e: any) {
      setToastError({ title: "Error", message: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const submitContractor = async (project: Project) => {
    setIsProcessing(true);

    try {
      const gnoNetwork = mustGetGnoNetwork(networkId);
      const caller = mustGetValue(selectedWallet?.address, "caller");
      const escrowPkgPath = mustGetValue(
        gnoNetwork.escrowPkgPath,
        "escrow pkg path",
      );

      await adenaVMCall(
        networkId,
        {
          caller,
          send: "",
          pkg_path: escrowPkgPath,
          func: "SubmitContractor",
          args: [project.id.toString()],
        },
        { gasWanted: 1_000_000 },
      );

      setToastSuccess({
        title: "Success",
        message: "You become the contractor for this project !",
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
          <ProjectInfo
            projectStatus={project.status}
            isFunded={project.funded}
            shortDescData={project.metadata.shortDescData}
            teamAndLinkData={project.metadata.teamAndLinkData}
          />

          {/* Actions */}
          {/* If current user is not funder, not creator of project and the project has not contractor yet then user can become contractor */}
          {selectedWallet?.address !== project.sender &&
            selectedWallet?.address !== project.funder &&
            !project.contractor &&
            project.status === ContractStatus.CREATED && (
              <>
                <PrimaryButton
                  disabled={isProcessing}
                  text="Submit contractor"
                  onPress={() => submitContractor(project)}
                  size="SM"
                  width={200}
                />
                <SpacerColumn size={2} />
              </>
            )}

          {/* If current user is not contractor, not creator of project and the project has not funder yet then user can become funder */}
          {selectedWallet?.address !== project.sender &&
            selectedWallet?.address !== project.contractor &&
            !project.funded &&
            project.status === ContractStatus.CREATED && (
              <>
                <PrimaryButton
                  disabled={isProcessing}
                  text="Submit funder"
                  onPress={() => submitFunder(project)}
                  size="SM"
                  width={200}
                />
                <SpacerColumn size={2} />
              </>
            )}

          <ProjectMilestones
            onSelectMilestone={onSelectMilestone}
            milestones={project.milestones}
          />
        </View>

        {/* Detail view ======================================================= */}
        {selectedMilestone !== undefined && (
          <MilestoneDetail
            project={project}
            milestone={selectedMilestone}
            onClose={() => setSelectedMilestone(undefined)}
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
