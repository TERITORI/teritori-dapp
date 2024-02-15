import { Link } from "@react-navigation/native";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import chevronRightSVG from "@/assets/icons/chevron-right.svg";
import closeSVG from "@/assets/icons/close.svg";
import githubSVG from "@/assets/icons/github.svg";
import { BrandText } from "@/components/BrandText";
import FlexRow from "@/components/FlexRow";
import { SVG } from "@/components/SVG";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SelectInput, SelectInputItem } from "@/components/inputs/SelectInput";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn } from "@/components/spacer";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { MilestonePriorityTag } from "@/screens/Projects/components/MilestonePriorityTag";
import { MilestoneStatusTag } from "@/screens/Projects/components/MilestoneStatusTag";
import { useEscrowContract } from "@/screens/Projects/hooks/useEscrowContract";
import { MsStatus, Project, ProjectMilestone } from "@/screens/Projects/types";
import {
  neutral00,
  neutral22,
  neutral33,
  neutralA3,
} from "@/utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

const STATUSES: SelectInputItem[] = [
  { label: "Open", value: MsStatus.MS_OPEN.toString() },
  { label: "In Progress", value: MsStatus.MS_PROGRESS.toString() },
  { label: "Review", value: MsStatus.MS_REVIEW.toString() },
  // NOTE: Disable, use cannot change status to COMPLETED
  // { label: "Completed", value: MsStatus.MS_COMPLETED.toString() },
];

export const MilestoneDetail: React.FC<{
  project: Project;
  milestone: ProjectMilestone;
  editable?: boolean;
  onClose?: (milestone: ProjectMilestone) => void;
}> = ({ project, editable, milestone, onClose }) => {
  const [newStatus, setNewStatus] = useState<MsStatus>(milestone.status);
  const networkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();

  const { execEscrowMethod } = useEscrowContract(
    networkId,
    selectedWallet?.address,
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const changeMilestoneStatus = async (
    project: Project,
    milestone: ProjectMilestone,
  ) => {
    setIsProcessing(true);

    // Convert milestone status => status id
    let statusId = 1;
    for (const msStatus in MsStatus) {
      if (msStatus === newStatus) {
        break;
      }
      statusId++;
    }

    await execEscrowMethod("ChangeMilestoneStatus", [
      project.id.toString(),
      milestone.id.toString(),
      statusId.toString(),
    ]);

    setIsProcessing(false);
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
