import React from "react";
import { View } from "react-native";

import { HomeProposals } from "./components/HomeProposals/HomeProposals";
import { setIsLightTheme } from "../../../store/slices/settings";
import { useAppDispatch } from "../../../store/store";
import { ScreenFC } from "../../../utils/navigation";
import {
  EstateCardList,
  getEstateCardList,
} from "../components/EstateCard/EstateCardList";
import { RWAScreenContainer } from "../components/RWAScreenContainer/RWAScreenContainer";

export const RWAHomeScreen: ScreenFC<"RWAHome"> = () => {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(setIsLightTheme(true));
  }, [dispatch]);

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
