import React from "react";

import { RWAScreenContainer } from "./components/ScreenContainer";
import { BrandText } from "../../components/BrandText";
import { ScreenFC } from "../../utils/navigation";

export const RWAHome: ScreenFC<"RWAHome"> = () => {
  return (
    <RWAScreenContainer>
      <BrandText>Coucou</BrandText>
    </RWAScreenContainer>
  );
};
