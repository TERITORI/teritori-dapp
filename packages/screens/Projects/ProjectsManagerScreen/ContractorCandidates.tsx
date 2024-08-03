import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import FlexRow from "../../../components/FlexRow";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { ProjectStatusTag } from "../components/ProjectStatusTag";
import { useProjects } from "../hooks/useProjects";
import { Project } from "../types";

import { BrandText } from "@/components/BrandText";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { RoundedGradientImage } from "@/components/images/RoundedGradientImage";
import { TableCell } from "@/components/table/TableCell";
import { TableHeader } from "@/components/table/TableHeader";
import { UsernameWithAvatar } from "@/components/user/UsernameWithAvatar";
import {
  getNetworkObjectId,
  getUserId,
  parseNetworkObjectId,
} from "@/networks";
import { useEscrowContract } from "@/screens/Projects/hooks/useEscrowContract";
import { useAppNavigation } from "@/utils/navigation";
import { neutral33, neutralFF } from "@/utils/style/colors";
import { fontSemibold13 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const ContractorCandidates: React.FC<{ networkId: string }> = ({
  networkId,
}) => {
  const selectedWallet = useSelectedWallet();

  const { projects } = useProjects(networkId, {
    byCandidatesForFunder: { funder: selectedWallet?.address || "" },
  });

  return (
    <View>
      <TableHeader columns={TABLE_COLS} />
      {projects.map((project) => (
        <ProjectRow key={project.id} networkId={networkId} project={project} />
      ))}
    </View>
  );
};

const TABLE_COLS = {
  name: {
    label: "Project name",
    flex: 3,
  },
  status: {
    label: "Status",
    flex: 1,
  },
  candidates: {
    label: "Candidates",
    flex: 3,
  },
};

const ProjectRow: React.FC<{ networkId: string; project: Project }> = ({
  networkId,
  project,
}) => {
  const navigation = useAppNavigation();

  if (!project.contractorCandidates.length) return null;

  return (
    <View
      style={{
        minHeight: 50,
        borderBottomWidth: 1,
        borderBottomColor: neutral33,
        flexDirection: "row",
        width: "100%",
        paddingVertical: layout.spacing_x1,
        paddingHorizontal: layout.spacing_x2_5,
      }}
    >
      {/* === Name === */}
      <TableCell style={{ flex: TABLE_COLS.name.flex }}>
        <RoundedGradientImage
          size="XXS"
          sourceURI={project.metadata?.shortDescData?.coverImg}
        />

        <TouchableOpacity
          onPress={() => {
            if (!project.id) {
              return;
            }
            navigation.navigate("ProjectsDetail", { id: project.id });
          }}
        >
          <BrandText
            numberOfLines={2}
            style={[
              { color: neutralFF, marginLeft: layout.spacing_x1 },
              fontSemibold13,
            ]}
          >
            {project.metadata?.shortDescData?.name}
          </BrandText>
        </TouchableOpacity>
      </TableCell>

      {/* === Status === */}
      <TableCell style={{ flex: TABLE_COLS.status.flex }}>
        <ProjectStatusTag size="XS" status={project.status} />
      </TableCell>

      <TableCell style={{ flex: TABLE_COLS.candidates.flex }}>
        <View style={{ gap: layout.spacing_x1 }}>
          {[
            project.contractorCandidates,
            // project.contractorCandidates,
            // project.contractorCandidates,
          ]
            .flatMap((c) => c)
            .map((c, idx) => (
              <Candidate
                key={idx}
                candidate={c}
                projectId={getNetworkObjectId(networkId, project.id)}
              />
            ))}
        </View>
      </TableCell>
    </View>
  );
};

type CandidateProps = {
  projectId: string;
  candidate: string;
};

const Candidate: React.FC<CandidateProps> = ({ projectId, candidate }) => {
  const [network, localProjectId] = parseNetworkObjectId(projectId);
  const networkId = network?.id;

  const selectedWallet = useSelectedWallet();

  const [isProcessing, setIsProcessing] = useState(false);

  const queryClient = useQueryClient();

  const { execEscrowMethod } = useEscrowContract(
    networkId,
    selectedWallet?.address,
  );

  const acceptCandidate = async () => {
    setIsProcessing(true);
    await execEscrowMethod("AcceptContractor", [localProjectId, candidate]);
    await Promise.all([
      queryClient.invalidateQueries(["project", projectId]),
      queryClient.invalidateQueries(["projects", networkId]),
    ]);
    setIsProcessing(false);
  };

  return (
    <FlexRow style={{ justifyContent: "space-between" }}>
      <UsernameWithAvatar userId={getUserId(networkId, candidate)} />
      <PrimaryButton
        disabled={isProcessing}
        text="Accept"
        size="XS"
        touchableStyle={{ marginLeft: layout.spacing_x1 }}
        onPress={() => acceptCandidate()}
      />
    </FlexRow>
  );
};
