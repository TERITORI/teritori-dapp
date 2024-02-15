import React, { useMemo } from "react";
import { View } from "react-native";

import { useQueryEscrow } from "../../hooks/useEscrowContract";
import { Project } from "../../types";

import FlexRow from "@/components/FlexRow";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { LeftBlock } from "@/screens/Projects/components/ProjectInfo/LeftBlock";
import { RelatedUsers } from "@/screens/Projects/components/ProjectInfo/RelatedUsers";
import { RightBlock } from "@/screens/Projects/components/ProjectInfo/RightBlock";
import { extractGnoString } from "@/utils/gno";
import { layout } from "@/utils/style/layout";

export const ProjectInfo: React.FC<{
  project: Project;
}> = ({ project }) => {
  const networkId = useSelectedNetworkId();

  const { data: candidatesData } = useQueryEscrow(
    networkId,
    "GetContractorCandidates",
    [project?.id],
    !project?.contractor,
  );

  const candidates = useMemo(() => {
    if (!candidatesData) return [];
    return extractGnoString(candidatesData)
      .split(",")
      .filter((c) => !!c);
  }, [candidatesData]);

  return (
    <View>
      <FlexRow
        style={{
          marginTop: layout.spacing_x4,
          justifyContent: "space-between",
        }}
        breakpoint={550}
      >
        {/* Left block ======================================================= */}
        <View style={{ flex: 1 }}>
          <LeftBlock
            networkId={networkId}
            project={project}
            candidates={candidates}
          />
        </View>

        {/* Right block ======================================================= */}
        <View style={{ width: 280, alignSelf: "flex-start" }}>
          <RightBlock project={project} />
        </View>
      </FlexRow>

      <RelatedUsers networkId={networkId} project={project} />
    </View>
  );
};
