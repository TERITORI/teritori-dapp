import React, { useEffect } from "react";
import { View } from "react-native";

import { HomeProposals } from "./components/HomeProposals/HomeProposals";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { setIsLightTheme } from "../../../store/slices/settings";
import { useAppDispatch } from "../../../store/store";
import { ScreenFC } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";
import {
  EstateCardList,
  getEstateCardList,
} from "../components/EstateCard/EstateCardList";
import { RWAScreenContainer } from "../components/RWAScreenContainer/RWAScreenContainer";
import { useIsRWAListThreshold } from "../useIsRWAListThreshold";

export const RWAHomeScreen: ScreenFC<"RWAHome"> = () => {
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const isRWAListThreshold = useIsRWAListThreshold();

  useEffect(() => {
    dispatch(setIsLightTheme(true));
  }, [dispatch]);

  // 789
  return (
    <RWAScreenContainer headerTitle="Fractionalized Real State Launchpad">
      <View>
        <View style={{ alignItems: "center" }}>
          <HomeProposals />
        </View>
        <View style={{ alignItems: "center", flex: 1 }}>
          <View
            style={[
              !isMobile && { width: isRWAListThreshold ? 789 : 1184 },
              { marginTop: layout.spacing_x2 },
            ]}
          >
            <EstateCardList
              title="Available"
              cards={[]}
              style={{ marginTop: isMobile ? 40 : 24 }}
            />
            <EstateCardList
              title="Coming soon"
              cards={getEstateCardList(true)}
              style={{ marginTop: isMobile ? 30 : 64 }}
            />
            <EstateCardList
              title="Sold out"
              cards={getEstateCardList()}
              style={{ marginTop: isMobile ? 30 : 64 }}
            />
          </View>
        </View>
      </View>
    </RWAScreenContainer>
  );
};
