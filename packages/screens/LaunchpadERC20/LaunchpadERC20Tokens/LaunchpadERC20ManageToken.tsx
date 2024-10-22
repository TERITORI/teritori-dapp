import { LaunchpadERC20DetailTokenBox } from "../component/LaunchpadERC20DetailTokenBox";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SpacerColumn } from "@/components/spacer";
import { useForceNetworkSelection } from "@/hooks/useForceNetworkSelection";
import { NetworkFeature, NetworkKind } from "@/networks";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";
import { useState } from "react";
import { LaunchpadERC20TokenAmountButton } from "../component/LaunchpadERC20TokenAmountButton";

export const LaunchpadERC20ManageTokenScreen: ScreenFC<
  "LaunchpadERC20ManageToken"
> = ({ route: { params } }) => {
  const network = params?.network;
  const token = params.token;
  useForceNetworkSelection(network);
  const navigation = useAppNavigation();
  const [mintAmount, setMintAmount] = useState(0);
  const [burnAmount, setBurnAmount] = useState(0);

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
      <BrandText>
        Tokens Details
      </BrandText>
      <SpacerColumn size={1} />
      <LaunchpadERC20DetailTokenBox item={token} />
      <LaunchpadERC20TokenAmountButton amount={mintAmount} setAmount={setMintAmount} buttonLabel={"Mint"} />
    </ScreenContainer>
  );
};
