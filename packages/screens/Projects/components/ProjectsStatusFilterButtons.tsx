import React from "react";

import { ProjectStatusTag } from "./ProjectStatusTag";
import FlexRow from "../../../components/FlexRow";
import { SpacerRow } from "../../../components/spacer";
import { ContractStatus } from "../types";

export const ProjectsStatusFilterButtons: React.FC<{
  status: ContractStatus;
  onChange: (newFilter: ContractStatus) => void;
}> = ({ status, onChange }) => {
  return (
    <FlexRow
      style={{
        width: "auto",
        alignItems: "center",
      }}
    >
      <ProjectStatusTag
        status={ContractStatus.ALL}
        size="XS"
        active={status === ContractStatus.ALL}
        onPress={() => onChange(ContractStatus.ALL)}
      />

      <SpacerRow size={2} />

      <ProjectStatusTag
        status={ContractStatus.CREATED}
        size="XS"
        active={status === ContractStatus.CREATED}
        onPress={() => onChange(ContractStatus.CREATED)}
      />

      <SpacerRow size={2} />

      <ProjectStatusTag
        status={ContractStatus.ACCEPTED}
        size="XS"
        active={status === ContractStatus.ACCEPTED}
        onPress={() => onChange(ContractStatus.ACCEPTED)}
      />

      <SpacerRow size={2} />

      <ProjectStatusTag
        status={ContractStatus.REJECTED}
        size="XS"
        active={status === ContractStatus.REJECTED}
        onPress={() => onChange(ContractStatus.REJECTED)}
      />

      <SpacerRow size={2} />

      <ProjectStatusTag
        status={ContractStatus.COMPLETED}
        size="XS"
        active={status === ContractStatus.COMPLETED}
        onPress={() => onChange(ContractStatus.COMPLETED)}
      />
    </FlexRow>
  );
};
