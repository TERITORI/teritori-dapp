import React from "react";

import { UsernameWithAvatar } from "@/components/user/UsernameWithAvatar";
import { getUserId } from "@/networks";

export const TNSName: React.FC<{ networkId: string; userAddress: string }> = ({
  networkId,
  userAddress,
}) => {
  const userId = getUserId(networkId, userAddress);

  if (!userId) return null;
  return <UsernameWithAvatar userId={userId} />;
};
