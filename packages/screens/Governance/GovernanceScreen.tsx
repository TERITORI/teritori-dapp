import React from "react";

import { ComingSoon } from "../../components/ComingSoon";
import { ScreenContainer } from "../../components/ScreenContainer";
import { ScreenFC } from "../../utils/navigation";

export const GovernanceScreen: ScreenFC<"Governance"> = () => {
  return (
    <ScreenContainer>
      <ComingSoon />
    </ScreenContainer>
  );
};
