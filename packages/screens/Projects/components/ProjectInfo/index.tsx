import React from "react";
import { View } from "react-native";

import { Project } from "../../../../utils/projects/types";

import FlexRow from "@/components/FlexRow";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { LeftBlock } from "@/screens/Projects/components/ProjectInfo/LeftBlock";
import { RelatedUsers } from "@/screens/Projects/components/ProjectInfo/RelatedUsers";
import { RightBlock } from "@/screens/Projects/components/ProjectInfo/RightBlock";
import { layout } from "@/utils/style/layout";

export const ProjectInfo: React.FC<{
  project: Project;
}> = ({ project }) => {
  const networkId = useSelectedNetworkId();

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
          <LeftBlock networkId={networkId} project={project} />
        </View>

        {/* Right block ======================================================= */}
        <View style={{ width: 280, alignSelf: "flex-start" }}>
          <RightBlock networkId={networkId} project={project} />
        </View>
      </FlexRow>

      <RelatedUsers networkId={networkId} project={project} />
    </View>
  );
};
