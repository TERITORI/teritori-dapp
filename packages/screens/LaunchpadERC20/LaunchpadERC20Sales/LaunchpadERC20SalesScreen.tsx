import React from "react";
import { useWindowDimensions, View } from "react-native";

import exploreSVG from "../../../../assets/icons/explore-neutral77.svg";
import penSVG from "../../../../assets/icons/pen-neutral77.svg";
import registerSVG from "../../../../assets/icons/register-neutral77.svg";
import { SalesTable } from "../component/LaunchpadERC20SalesTable";
import { breakpoints } from "../utils/breakpoints";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { FlowCard } from "@/components/cards/FlowCard";
import { SpacerColumn } from "@/components/spacer";
import { useForceNetworkSelection } from "@/hooks/useForceNetworkSelection";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { NetworkFeature, NetworkKind } from "@/networks";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";

export const LaunchpadERC20SalesScreen: ScreenFC<"LaunchpadERC20Sales"> = ({
  route: { params },
}) => {
  const network = params?.network;
  useForceNetworkSelection(network);
  const networkId = useSelectedNetworkId();
  const { width } = useWindowDimensions();
  const navigation = useAppNavigation();

  return (
    <ScreenContainer
      headerChildren={<BrandText>Launchpad ERC 20</BrandText>}
      forceNetworkFeatures={[NetworkFeature.LaunchpadERC20]}
      forceNetworkKind={NetworkKind.Gno}
      isLarge
      responsive
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
          description="Create your own private or public Sales using your ERC20 Tokens with custom parameters"
          iconSVG={registerSVG}
          onPress={() => navigation.navigate("LaunchpadERC20CreateSale", {})}
        />
        <FlowCard
          label="Manage"
          description="See how your Sales are performing and manage them"
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
          description="Lookup for Sales from Token Name or Owner Address"
          iconSVG={exploreSVG}
          onPress={() => {}}
          disabled
        />
      </View>
      <SpacerColumn size={2} />
      <SalesTable networkId={networkId} />
    </ScreenContainer>
  );
};
