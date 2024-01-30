import React, { useEffect } from "react";

import { Content } from "./content/Content";
import { ContentContextProvider } from "./context/ContentProvider";
import { ScreenContainer } from "../../../../components/ScreenContainer";
import { TopLogo } from "../../../../components/navigation/components/TopLogo";

import { router, useLocalSearchParams } from "@/utils/router";
export const ToriPunks = () => {
  const { route } = useLocalSearchParams<"/dapp/tori-punks/[route]">();

  const screen = route || "welcome";
  useEffect(() => {
    if (!route) {
      router.navigate({
        pathname: "/dapp/tori-punks/[route]",
        params: { route: screen },
      });
    }
  }, [route, screen]);

  return (
    <ScreenContainer
      fullWidth
      hideSidebar
      headerChildren={<TopLogo />}
      footerChildren={<></>}
      forceNetworkId="teritori"
    >
      <ContentContextProvider screen={screen}>
        <Content />
      </ContentContextProvider>
    </ScreenContainer>
  );
};
