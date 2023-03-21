import React from "react";

import { BrandText } from "../../../../components/BrandText";
import { ScreenContainer } from "../../../../components/ScreenContainer";
import { ScreenFC } from "../../../../utils/navigation";
import { Content } from "./content/Content";
import { ContentContextProvider } from "./context/ContentProvider";

export const ToriPunks: ScreenFC<"ToriPunks"> = ({ route }) => {
  return (
    <ScreenContainer
      fullWidth
      headerChildren={<BrandText>ToriPunks</BrandText>}
      footerChildren={<div />}
    >
      {/*Just a placeholder please delete me*/}
      <ContentContextProvider screen={route.params.route}>
        <Content />
      </ContentContextProvider>
      {/*Just a placeholder please delete me*/}
    </ScreenContainer>
  );
};
