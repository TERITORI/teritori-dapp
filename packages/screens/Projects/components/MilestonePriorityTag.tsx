import React from "react";

import { Tag } from "./Milestone";
import { neutral33, neutralFF } from "../../../utils/style/colors";
import { MilestonePriority } from "../types";

export const MilestonePriorityTag: React.FC<{
  priority: MilestonePriority;
}> = ({ priority }) => {
  switch (priority) {
    case "MS_PRIORITY_HIGH":
      return <Tag text="High" color={neutralFF} bgColor="#673932" />;
    case "MS_PRIORITY_MEDIUM":
      return <Tag text="Medium" color={neutralFF} bgColor="#705B38" />;
    case "MS_PRIORITY_LOW":
      return <Tag text="Low" color={neutralFF} bgColor={neutral33} />;
    default:
      return <Tag text="Unknown" color={neutralFF} bgColor="#000000" />;
  }
};
