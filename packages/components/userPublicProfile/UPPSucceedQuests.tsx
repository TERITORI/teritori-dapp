import React from "react";

import { Quests } from "../Quests";

export const UPPQuests: React.FC<{ userId: string }> = ({ userId }) => {
  return <Quests userId={userId} />;
};
