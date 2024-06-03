import React, { FC } from "react";

import { SmallButton } from "@/components/buttons/SmallButton";

export const MaxButton: FC<{
  onPress: () => void;
}> = ({ onPress }) => {
  return <SmallButton onPress={onPress} label="max" />;
};
