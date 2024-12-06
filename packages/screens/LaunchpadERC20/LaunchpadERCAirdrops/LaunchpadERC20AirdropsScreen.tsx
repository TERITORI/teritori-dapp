import React from "react";
import { useWindowDimensions, View } from "react-native";

import exploreSVG from "../../../../assets/icons/explore-neutral77.svg";
import penSVG from "../../../../assets/icons/pen-neutral77.svg";
import registerSVG from "../../../../assets/icons/register-neutral77.svg";
import { AirdropsTable } from "../component/LaunchpadERC20AirdropsTable";
import { breakpoints } from "../utils/breakpoints";

import { ScreenContainer } from "@/components/ScreenContainer";
import { ScreenTitle } from "@/components/ScreenContainer/ScreenTitle";
import { FlowCard } from "@/components/cards/FlowCard";
import { SpacerColumn } from "@/components/spacer";
import { useForceNetworkSelection } from "@/hooks/useForceNetworkSelection";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { NetworkFeature, NetworkKind } from "@/networks";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";

export const LaunchpadERC20AirdropsScreen: ScreenFC<
  "LaunchpadERC20Airdrops"
> = ({ route: { params } }) => {
  const network = params?.network;
  useForceNetworkSelection(network);
  const networkId = useSelectedNetworkId();
  const { width } = useWindowDimensions();
  const navigation = useAppNavigation();

  return (
    <ScreenContainer
      headerChildren={<ScreenTitle>Launchpad ERC 20</ScreenTitle>}
      forceNetworkFeatures={[NetworkFeature.LaunchpadERC20]}
      forceNetworkKind={NetworkKind.Gno}
      isLarge
      responsive
      onBackPress={() => navigation.navigate("LaunchpadERC20")}
    >
      <View
        style={{
          marginVertical: width >= breakpoints.LG_BREAKPOINT ? 60 : 20,
          flexDirection: width >= breakpoints.MD_BREAKPOINT ? "row" : "column",
          justifyContent: "center",
        }}
      >
        <FlowCard
          label="Create"
          description="Create your own Airdrops using your ERC20 Tokens with custom parameters"
          iconSVG={registerSVG}
          onPress={() => navigation.navigate("LaunchpadERC20CreateAirdrop", {})}
        />
        <FlowCard
          label="Manage"
          description="See how your Airdrops are performing and manage them"
          iconSVG={penSVG}
          onPress={() => {}}
          style={{
            marginHorizontal: width >= breakpoints.MD_BREAKPOINT ? 12 : 0,
            marginVertical: width >= breakpoints.MD_BREAKPOINT ? 0 : 12,
          }}
          disabled
        />
        <FlowCard
          label="Explore"
          description="Lookup for Airdrops from Token Name or Owner Address"
          iconSVG={exploreSVG}
          onPress={() => {}}
          disabled
        />
      </View>
      <SpacerColumn size={2} />
      <AirdropsTable networkId={networkId} />
    </ScreenContainer>
  );
};
