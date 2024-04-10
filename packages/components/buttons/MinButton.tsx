import React, { FC } from "react";

import { SmallButton } from "@/components/buttons/SmallButton";

export const MinButton: FC<{
  onPress: () => void;
}> = ({ onPress }) => {
  return <SmallButton onPress={onPress} label="min" />;
};
