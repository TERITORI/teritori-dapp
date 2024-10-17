import { useState } from "react";
import { useWindowDimensions, View } from "react-native";

import exploreSVG from "../../../../assets/icons/explore-neutral77.svg";
import penSVG from "../../../../assets/icons/pen-neutral77.svg";
import registerSVG from "../../../../assets/icons/register-neutral77.svg";
import { SelectUserTokenModal } from "../component/LaunchpadERC20SelectUserTokenModal";
import { TokensTable } from "../component/LaunchpadERC20TokensTable";
import { useUserTokens } from "../hooks/useUserTokens";
import { breakpoints } from "../utils/breakpoints";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { FlowCard } from "@/components/cards/FlowCard";
import { SpacerColumn } from "@/components/spacer";
import { useForceNetworkSelection } from "@/hooks/useForceNetworkSelection";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { NetworkFeature, NetworkKind } from "@/networks";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";

export const LaunchpadERC20TokensScreen: ScreenFC<"LaunchpadERC20Tokens"> = ({
  route: { params },
}) => {
  const network = params?.network;
  useForceNetworkSelection(network);
  const networkId = useSelectedNetworkId();
  const { width } = useWindowDimensions();
  const navigation = useAppNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const selectedWallet = useSelectedWallet();
  const caller = selectedWallet?.address;
  const { data: tokens } = useUserTokens(networkId, caller || "");
  const dropdownItems = tokens?.map((token) => token.name);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <ScreenContainer
      headerChildren={<BrandText>Launchpad ERC 20</BrandText>}
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
          description="Create your own ERC20 token with custom parameters"
          iconSVG={registerSVG}
          onPress={() => navigation.navigate("LaunchpadERC20CreateToken", {})}
        />
        <FlowCard
          label="Manage"
          description="Mint, burn, or transfer the tokens you own"
          iconSVG={penSVG}
          onPress={() => {
            setIsModalVisible(true);
          }}
          style={{
            marginHorizontal: width >= breakpoints.MD_BREAKPOINT ? 12 : 0,
            marginVertical: width >= breakpoints.LG_BREAKPOINT ? 0 : 12,
          }}
        />
        <FlowCard
          label="Explore"
          description="Lookup tokens and explore their details"
          iconSVG={exploreSVG}
          onPress={() => {}}
          disabled
        />
      </View>
      <SelectUserTokenModal
        isVisible={isModalVisible}
        onClose={toggleModal}
        items={dropdownItems}
      />
      <SpacerColumn size={2} />
      <TokensTable networkId={networkId} />
    </ScreenContainer>
  );
};
