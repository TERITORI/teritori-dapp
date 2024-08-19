import React from "react";

import { ProjectStatusTag } from "./ProjectStatusTag";
import FlexRow from "../../../components/FlexRow";
import { SpacerRow } from "../../../components/spacer";
import { ContractStatusFilter } from "../../../utils/projects/types";

export const ProjectsStatusFilterButtons: React.FC<{
  status: ContractStatusFilter;
  onChange: (newFilter: ContractStatusFilter) => void;
}> = ({ status, onChange }) => {
  return (
    <FlexRow
      style={{
        width: "auto",
        alignItems: "center",
      }}
    >
      <ProjectStatusTag
        status="ALL"
        size="XS"
        active={status === "ALL"}
        onPress={() => onChange("ALL")}
      />

      <SpacerRow size={2} />

      <ProjectStatusTag
        status="CREATED"
        size="XS"
        active={status === "CREATED"}
        onPress={() => onChange("CREATED")}
      />

      <SpacerRow size={2} />

      <ProjectStatusTag
        status="ACCEPTED"
        size="XS"
        active={status === "ACCEPTED"}
        onPress={() => onChange("ACCEPTED")}
      />

      <SpacerRow size={2} />

      <ProjectStatusTag
        status="REJECTED"
        size="XS"
        active={status === "REJECTED"}
        onPress={() => onChange("REJECTED")}
      />

      <SpacerRow size={2} />

      <ProjectStatusTag
        status="COMPLETED"
        size="XS"
        active={status === "COMPLETED"}
        onPress={() => onChange("COMPLETED")}
      />
    </FlexRow>
  );
};
