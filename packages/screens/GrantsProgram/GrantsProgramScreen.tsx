import React from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { ScreenFC } from "../../utils/navigation";
import { primaryColor } from "../../utils/style/colors";
import { SimpleButton } from "../RiotGame/component/SimpleButton";

export const GrantsProgramScreen: ScreenFC<"GrantsProgram"> = () => {
  return (
    <ScreenContainer>
      <View>
        <BrandText>RiotGameScreen</BrandText>

        <SimpleButton
          outline
          text="Create a Grant"
          color={primaryColor}
          size="M"
        />
      </View>
    </ScreenContainer>
  );
};
