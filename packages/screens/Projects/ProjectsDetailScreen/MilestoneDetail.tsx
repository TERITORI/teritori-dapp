import { Link } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
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
import { getNetworkObjectId } from "@/networks";
import { MilestonePriorityTag } from "@/screens/Projects/components/MilestonePriorityTag";
import { MilestoneStatusTag } from "@/screens/Projects/components/MilestoneStatusTag";
import { useEscrowContract } from "@/screens/Projects/hooks/useEscrowContract";
import {
  MilestoneStatus,
  Project,
  ProjectMilestone,
  zodMilestoneStatus,
} from "@/screens/Projects/types";
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
import { objectKeys } from "@/utils/typescript";

const STATUSES: SelectInputItem[] = [
  { label: "Open", value: "MS_OPEN" },
  { label: "In Progress", value: "MS_PROGRESS" },
  { label: "Review", value: "MS_REVIEW" },
  { label: "Completed", value: "MS_COMPLETED" },
];

export const MilestoneDetail: React.FC<{
  project: Project;
  milestone: ProjectMilestone;
  editable?: boolean;
  onClose?: (milestone: ProjectMilestone) => void;
}> = ({ project, editable, milestone, onClose }) => {
  const [newStatus, setNewStatus] = useState<MilestoneStatus>(milestone.status);
  const networkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();

  const { execEscrowMethod } = useEscrowContract(
    networkId,
    selectedWallet?.address,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  const changeMilestoneStatus = async (
    project: Project,
    milestone: ProjectMilestone,
  ) => {
    setIsProcessing(true);
    try {
      // Convert milestone status => status id
      let statusId = 1;
      for (const msStatus of objectKeys(zodMilestoneStatus.enum)) {
        if (msStatus === newStatus) {
          break;
        }
        statusId++;
      }

      const refetch = () =>
        Promise.all([
          queryClient.invalidateQueries(["projects", networkId]),
          queryClient.invalidateQueries([
            "project",
            getNetworkObjectId(networkId, project.id),
          ]),
        ]);

      if (newStatus === "MS_COMPLETED") {
        await execEscrowMethod("CompleteMilestoneAndPay", [
          project.id.toString(),
          milestone.id.toString(),
        ]);
        await refetch();
        return;
      }

      await execEscrowMethod("ChangeMilestoneStatus", [
        project.id.toString(),
        milestone.id.toString(),
        statusId.toString(),
      ]);
      await refetch();
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
            selectItem={(item) => setNewStatus(item.value as MilestoneStatus)}
            boxStyle={{ height: 32 }}
            testID="milestone-select-new-status"
          />

          <SpacerColumn size={2} />

          <PrimaryButton
            disabled={newStatus === milestone.status || isProcessing}
            text="Change Status"
            onPress={() => changeMilestoneStatus(project, milestone)}
            fullWidth
            size="SM"
          />
        </View>
      )}
    </View>
  );
};
