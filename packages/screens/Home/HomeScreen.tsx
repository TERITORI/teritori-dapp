import React from "react";

import { ScreenContainer } from "../../components/ScreenContainer";
import { HubIntro } from "../../components/hub/HubIntro";
import { HubLanding } from "../../components/hub/HubLanding";
import { useForceNetworkSelection } from "../../hooks/useForceNetworkSelection";

import { useLocalSearchParams } from "@/utils/router";

export const HomeScreen = () => {
  const params = useLocalSearchParams<"">();
  useForceNetworkSelection(params.network);
  return (
    <ScreenContainer mobileTitle="HOME">
      <HubIntro />
      <HubLanding />
    </ScreenContainer>
  );
};
