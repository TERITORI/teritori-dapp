import React, { useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import FlexRow from "../../../components/FlexRow";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { ProjectStatusTag } from "../components/ProjectStatusTag";
import { useProjects } from "../hooks/useProjects";
import { Project } from "../types";

import { BrandText } from "@/components/BrandText";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { RoundedGradientImage } from "@/components/images/RoundedGradientImage";
import { TableRow } from "@/components/table/TableRow";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { TNSName } from "@/screens/Projects/components/TNSName";
import {
  useEscrowContract,
  useQueryEscrow,
} from "@/screens/Projects/hooks/useEscrowContract";
import { extractGnoString } from "@/utils/gno";
import { useAppNavigation } from "@/utils/navigation";
import { neutral33, neutralA3, neutralFF } from "@/utils/style/colors";
import { fontSemibold13 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

const TABLE_COLS = {
  name: {
    label: "Project name",
    flex: 3,
  },
  status: {
    label: "Status",
    flex: 2,
  },
  candidates: {
    label: "Candidates",
    flex: 8,
  },
};

type CandidateProps = {
  projectId: number;
  candidate: string;
};

const Candidate: React.FC<CandidateProps> = ({ projectId, candidate }) => {
  const networkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const [isProcessing, setIsProcessing] = useState(false);

  const { execEscrowMethod } = useEscrowContract(
    networkId,
    selectedWallet?.address || "",
  );

  const acceptCandidate = async () => {
    setIsProcessing(true);
    await execEscrowMethod("AcceptContractor", [
      projectId.toString(),
      candidate,
    ]);
    setIsProcessing(false);
  };

  return (
    <FlexRow style={{ justifyContent: "space-between" }}>
      <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
        <TNSName networkId={networkId} userAddress={candidate} />
      </BrandText>

      <PrimaryButton
        disabled={isProcessing}
        text="Accept"
        size="XS"
        onPress={() => acceptCandidate()}
      />
    </FlexRow>
  );
};

const ProjectRow: React.FC<{ project: Project }> = ({ project }) => {
  const navigation = useAppNavigation();
  const networkId = useSelectedNetworkId();

  const { data } = useQueryEscrow(
    networkId,
    "GetContractorCandidates",
    [project.id],
    !project.contractor,
  );

  const candidates = useMemo(() => {
    if (!data) return [];
    const extractedStr = extractGnoString(data);
    if (!extractedStr) return [];

    return extractedStr.split(",");
  }, [data]);

  if (!candidates.length) return null;

  return (
    <FlexRow
      style={{ height: 50, borderBottomWidth: 1, borderBottomColor: neutral33 }}
    >
      {/* === Name === */}
      <FlexRow style={{ flex: 3 }}>
        <RoundedGradientImage
          size="XXS"
          sourceURI={project.metadata.shortDescData.coverImg}
        />

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ProjectsDetail", { id: project.id })
          }
        >
          <BrandText
            numberOfLines={2}
            style={[
              { color: neutralFF, marginLeft: layout.spacing_x1 },
              fontSemibold13,
            ]}
          >
            {project.metadata.shortDescData.name}
          </BrandText>
        </TouchableOpacity>
      </FlexRow>

      {/* === Status === */}
      <View style={{ flex: 2, alignItems: "center" }}>
        <ProjectStatusTag size="XS" status={project.status} />
      </View>

      {/* === Candidates === */}
      {candidates.length > 0 && (
        <View style={{ flex: 8, alignItems: "center" }}>
          {candidates.map((c, idx) => (
            <Candidate key={idx} candidate={c} projectId={project.id} />
          ))}
        </View>
      )}
    </FlexRow>
  );
};

export const ContractorCandidates: React.FC = () => {
  const networkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();

  const { data: projects } = useProjects(
    networkId,
    0,
    100,
    selectedWallet?.address,
    "ALL",
  );

  const filteredProjects = useMemo(() => {
    if (!selectedWallet?.address) return [];
    return projects.filter((p) => !p.contractor);
  }, [projects, selectedWallet?.address]);

  return (
    <View>
      <TableRow
        headings={Object.values(TABLE_COLS)}
        labelStyle={{ textAlign: "center" }}
      />

      <FlexRow
        style={{
          width: "100%",
          flexWrap: "wrap",
          justifyContent: "space-between",
          paddingHorizontal: layout.spacing_x2_5, // Need padding to sync with table heading
        }}
      >
        {filteredProjects.map((project) => (
          <ProjectRow key={project.id} project={project} />
        ))}
      </FlexRow>
    </View>
  );
};
