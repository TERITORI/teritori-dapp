import React from "react";
import { useWindowDimensions, View } from "react-native";

import { TokensTable } from "./component/LaunchpadERC20TokensTable";
import exploreSVG from "../../../assets/icons/explore-neutral77.svg";
import penSVG from "../../../assets/icons/pen-neutral77.svg";
import registerSVG from "../../../assets/icons/register-neutral77.svg";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { FlowCard } from "@/components/cards/FlowCard";
import { SpacerColumn } from "@/components/spacer";
import { useForceNetworkSelection } from "@/hooks/useForceNetworkSelection";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { NetworkFeature, NetworkKind } from "@/networks";
import { ScreenFC } from "@/utils/navigation";

const LG_BREAKPOINT = 1600;
const MD_BREAKPOINT = 820;

export const LaunchpadERC20TokensScreen: ScreenFC<"LaunchpadERC20Tokens"> = ({
  route: { params },
}) => {
  const network = params?.network;
  useForceNetworkSelection(network);
  const networkId = useSelectedNetworkId();
  const { width } = useWindowDimensions();

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
          marginVertical: width >= LG_BREAKPOINT ? 60 : 20,
          flexDirection: width >= MD_BREAKPOINT ? "row" : "column",
          justifyContent: "center",
        }}
      >
        <FlowCard
          label="Create"
          description="Create your own ERC20 token with custom parameters"
          iconSVG={registerSVG}
          onPress={() => {}}
        />
        <FlowCard
          label="Manage"
          description="Mint, burn, or transfer the tokens you own"
          iconSVG={penSVG}
          onPress={() => {}}
          style={{
            marginHorizontal: width >= MD_BREAKPOINT ? 12 : 0,
            marginVertical: width >= MD_BREAKPOINT ? 0 : 12,
          }}
          disabled
        />
        <FlowCard
          label="Explore"
          description="Lookup tokens and explore their details"
          iconSVG={exploreSVG}
          onPress={() => {}}
          disabled
        />
      </View>
      <SpacerColumn size={2} />
      <TokensTable networkId={networkId} />
    </ScreenContainer>
  );
};
