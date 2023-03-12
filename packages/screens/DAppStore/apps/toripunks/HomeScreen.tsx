import React from "react";
import { View } from "react-native";

import { BrandText } from "../../../../components/BrandText";
import { ScreenContainer } from "../../../../components/ScreenContainer";
import { ScreenFC } from "../../../../utils/navigation";
import { Background } from "./components/background/Background";
import { Label } from "./components/label/Label";

export const ToriPunks: ScreenFC<"ToriPunks"> = () => {
  return (
    <ScreenContainer
      fullWidth
      headerChildren={<BrandText>ToriPunks</BrandText>}
      footerChildren={<div />}
    >
      {/*Just a placeholder please delete me*/}
      <Background type="login">
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            alignContent: "center",
            height: "35em",
          }}
        >
          <Label styleType="H1_80">ToriPunks Placeholder</Label>
        </View>
      </Background>
      {/*Just a placeholder please delete me*/}
    </ScreenContainer>
  );
};
