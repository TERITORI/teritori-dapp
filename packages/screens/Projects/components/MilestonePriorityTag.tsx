import React from "react";

import { Tag } from "./Milestone";
import { neutralFF } from "../../../utils/style/colors";
import { MsPriority } from "../types";

export const MilestonePriorityTag: React.FC<{
  priority: MsPriority;
}> = ({ priority }) => {
  switch (priority) {
    case MsPriority.MS_PRIORITY_HIGH:
      return <Tag text={"High"} color={neutralFF} bgColor="#673932" />;
    case MsPriority.MS_PRIORITY_MEDIUM:
      return <Tag text={"Medium"} color={neutralFF} bgColor="#705B38" />;
    default:
      return <Tag text={"Unknown"} color={neutralFF} bgColor="#000000" />;
  }
};
