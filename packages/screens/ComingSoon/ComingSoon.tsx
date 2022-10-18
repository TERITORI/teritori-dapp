import React from "react";

import { ComingSoon } from "../../components/ComingSoon";
import { ScreenContainer } from "../../components/ScreenContainer";
import { ScreenFC } from "../../utils/navigation";

export const ComingSoonScreen: ScreenFC<"ComingSoon"> = () => {
  return (
    <ScreenContainer>
      <ComingSoon />
    </ScreenContainer>
  );
};
