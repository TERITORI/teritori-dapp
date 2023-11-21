import React from "react";
import { View } from "react-native";

import { setIsLightTheme } from "../../../store/slices/settings";
import { useAppDispatch } from "../../../store/store";
import { ScreenFC } from "../../../utils/navigation";
import { getEstateCardList } from "../components/EstateCard/EstateCardList";
import { PortfolioEstateCardList } from "../components/EstateCard/PortfolioEstateCard";
import { RWAScreenContainer } from "../components/RWAScreenContainer/RWAScreenContainer";

export const RWAPortfolioScreen: ScreenFC<"RWAPortfolio"> = () => {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(setIsLightTheme(false));
  }, [dispatch]);

  return (
    <RWAScreenContainer headerTitle="My Portfolio">
      <View style={{ marginHorizontal: 20 }}>
        <PortfolioEstateCardList cards={getEstateCardList()} />
      </View>
    </RWAScreenContainer>
  );
};
