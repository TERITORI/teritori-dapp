import React from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { ScreenFC } from "../../utils/navigation";

export const GrantsProgramScreen: ScreenFC<"GrantsProgram"> = () => {
  return (
    <ScreenContainer>
      <View>
        <BrandText>RiotGameScreen</BrandText>
      </View>
    </ScreenContainer>
  );
};
