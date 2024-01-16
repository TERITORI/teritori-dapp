import React from "react";

import { SimpleButton } from "../../../components/buttons/SimpleButton";
import {
  neutral00,
  neutral22, primaryColor,
  redDefault,
  secondaryColor,
} from "../../../utils/style/colors";
import { ContractStatus } from "../types";

export const ProjectStatusTag: React.FC<{
  status: ContractStatus;
  onPress?: () => void;
  active?: boolean;
  size?: "XS" | "SM" | "M" | "XL";
}> = ({ status, onPress, active, size }) => {
  let color, bgColor, borderColor, text;

  switch (status) {
    case ContractStatus.ALL:
      text = "All";
      color = secondaryColor;
      bgColor = neutral00;
      borderColor = neutral22;
      break;
    case ContractStatus.CREATED:
      text = "Open";
      color = "#C8FFAE";
      bgColor = "#C8FFAE1A";
      borderColor = "#C8FFAE1A";
      break;
    case ContractStatus.ACCEPTED:
      text = "In Progress";
      color = "#EAA54B";
      bgColor = "#EAA54B1A";
      borderColor = "#EAA54B1A";
      break;
    case ContractStatus.COMPLETED:
      text = "Completed";
      color = primaryColor;
      bgColor = neutral00;
      borderColor = neutral22;
      break;
    case ContractStatus.CANCELED:
      text = "Canceled";
      color = redDefault;
      bgColor = neutral00;
      borderColor = neutral22;
      break;
    case ContractStatus.REJECTED:
      text = "Rejected";
      color = redDefault;
      bgColor = neutral00;
      borderColor = neutral22;
      break;
    default:
      color = secondaryColor;
      bgColor = neutral00;
      borderColor = neutral00;
      text = "unknown";
      break;
  }

  return (
    <SimpleButton
      onPress={() => onPress?.()}
      text={text}
      size={size}
      bgColor={bgColor}
      color={color}
      style={{
        borderColor: active ? secondaryColor : borderColor,
      }}
    />
  );
};
