import React from "react";

import { Tag } from "./Milestone";
import { neutralFF } from "../../../utils/style/colors";
import { MsStatus } from "../types";

export const MilestoneStatusTag: React.FC<{
  status: MsStatus;
}> = ({ status }) => {
  switch (status) {
    case MsStatus.MS_OPEN:
      return <Tag text={"Open"} color={neutralFF} bgColor="#693CB1" />;
    case MsStatus.MS_PROGRESS:
      return <Tag text={"In Progress"} color={neutralFF} bgColor="#673932" />;
    case MsStatus.MS_REVIEW:
      return <Tag text={"Review"} color={neutralFF} bgColor="#673932" />;
    case MsStatus.MS_COMPLETED:
      return <Tag text={"Completed"} color={neutralFF} bgColor="#2B673D" />;
    default:
      return <Tag text={"Unknown"} color={neutralFF} bgColor="#000000" />;
  }
};
