import React from "react";

import { ScreenContainer } from "../../../../components/ScreenContainer";
import { TopLogo } from "../../../../components/navigation/components/TopLogo";
import { ScreenFC, useAppNavigation } from "../../../../utils/navigation";
import { Content } from "./content/Content";
import { ContentContextProvider } from "./context/ContentProvider";

export const ToriPunks: ScreenFC<"ToriPunks"> = ({ route }) => {
  const navigation = useAppNavigation();
  const screen = route.params ? route.params.route : "welcome";
  if (!route.params) {
    navigation.navigate("ToriPunks", { route: screen });
  }
  return (
    <ScreenContainer
      fullWidth
      hideSidebar
      headerChildren={<TopLogo />}
      footerChildren={<div />}
    >
      <ContentContextProvider screen={screen}>
        <Content />
      </ContentContextProvider>
    </ScreenContainer>
  );
};
