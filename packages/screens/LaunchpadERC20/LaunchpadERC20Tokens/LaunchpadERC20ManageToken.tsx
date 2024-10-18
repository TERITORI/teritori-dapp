import { LaunchpadERC20DetailTokenBox } from "../component/LaunchpadERC20DetailTokenBox";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SpacerColumn } from "@/components/spacer";
import { useForceNetworkSelection } from "@/hooks/useForceNetworkSelection";
import { NetworkFeature, NetworkKind } from "@/networks";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";

export const LaunchpadERC20ManageTokenScreen: ScreenFC<
  "LaunchpadERC20ManageToken"
> = ({ route: { params } }) => {
  const network = params?.network;
  const token = params.token;
  useForceNetworkSelection(network);
  const navigation = useAppNavigation();

  return (
    <ScreenContainer
      headerChildren={<BrandText>Launchpad ERC 20</BrandText>}
      forceNetworkFeatures={[NetworkFeature.LaunchpadERC20]}
      forceNetworkKind={NetworkKind.Gno}
      isLarge
      responsive
      onBackPress={() => navigation.navigate("LaunchpadERC20Tokens")}
    >
      <SpacerColumn size={8} />
      <LaunchpadERC20DetailTokenBox item={token} />
    </ScreenContainer>
  );
};
