import React from "react";

import { RWAScreenContainer } from "./components/ScreenContainer";
import { BrandText } from "../../components/BrandText";
import { ScreenFC } from "../../utils/navigation";

export const RWAHome: ScreenFC<"RWAHome"> = () => {
  return (
    <RWAScreenContainer headerTitle="Fractionalized Real State Launchpad">
      <HomeProposals />
      <View style={{ marginLeft: 50 }}>
        <EstateCardList title="Available" cards={getEstateCardList()} />
        <EstateCardList title="Coming soon" cards={getEstateCardList(true)} />
        <EstateCardList title="Sold out" cards={getEstateCardList()} />
      </View>
    </RWAScreenContainer>
  );
};
