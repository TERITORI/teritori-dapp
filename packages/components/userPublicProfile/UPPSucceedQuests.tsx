import React from "react";

import { Quests } from "../Quests";

export const UPPQuests: React.FC<{ userAddress: string }> = ({
  userAddress,
}) => {
  return <Quests userAddress={userAddress} />;
};
