import React, { useEffect } from "react";

import { Content } from "./content/Content";
import { ContentContextProvider } from "./context/ContentProvider";
import { ScreenContainer } from "../../../../components/ScreenContainer";
import { TopLogo } from "../../../../components/navigation/components/TopLogo";
import { ScreenFC, useAppNavigation } from "../../../../utils/navigation";

export const ToriPunks: ScreenFC<"ToriPunks"> = ({ route }) => {
  const navigation = useAppNavigation();
  const screen = route.params ? route.params.route : "welcome";
  useEffect(() => {
    if (!route.params) {
      navigation.navigate("ToriPunks", { route: screen });
    }
  }, [navigation, route.params, screen]);
  return (
    <ScreenContainer
      fullWidth
      hideSidebar
      headerChildren={<TopLogo />}
      footerChildren={<div />}
      forceNetworkId="teritori"
    >
      <ContentContextProvider screen={screen}>
        <Content />
      </ContentContextProvider>
    </ScreenContainer>
  );
};
