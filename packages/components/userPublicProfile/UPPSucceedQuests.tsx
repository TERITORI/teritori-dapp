import React from "react";

import { Quests } from "../Quests";

export const UPPSucceedQuests: React.FC<{ userId: string }> = ({ userId }) => {
  return <Quests userId={userId} wantCompleted />;
};
