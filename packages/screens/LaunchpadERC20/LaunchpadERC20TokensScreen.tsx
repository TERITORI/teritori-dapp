import React from "react";

import { LaunchpadERC20Banner } from "./component/LaunchpadERC20Banner";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SpacerColumn } from "@/components/spacer";
import { ScreenFC } from "@/utils/navigation";
import { fontSemibold28 } from "@/utils/style/fonts";

export const LaunchpadERC20TokensScreen: ScreenFC<
  "LaunchpadERC20Tokens"
> = () => {
  return (
    <ScreenContainer>
      <LaunchpadERC20Banner />

      <SpacerColumn size={2} />

      <BrandText style={fontSemibold28}>
        Welcome on the ERC20 Launchpad tokens page
      </BrandText>

      <SpacerColumn size={2} />
    </ScreenContainer>
  );
};
