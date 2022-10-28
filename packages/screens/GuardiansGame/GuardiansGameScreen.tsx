import React from "react";

import { ComingSoon } from "../../components/ComingSoon";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Footer } from "../../components/footers/Footer";
import { ScreenFC } from "../../utils/navigation";

export const GuardiansGameScreen: ScreenFC<"GuardiansGame"> = () => {
  return (
    <ScreenContainer footerChildren={<Footer />}>
      <ComingSoon />
    </ScreenContainer>
  );
};
