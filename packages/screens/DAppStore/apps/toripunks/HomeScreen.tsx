import React from "react";
import { View } from "react-native";

import { BrandText } from "../../../../components/BrandText";
import { ScreenContainer } from "../../../../components/ScreenContainer";
import { ScreenFC } from "../../../../utils/navigation";

export const ToriPunks: ScreenFC<"ToriPunks"> = () => {
  return (
    <ScreenContainer
      fullWidth
      headerChildren={<BrandText>ToriPunks</BrandText>}
    >
      {/*Just a placeholder please delete me*/}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignContent: "center",
          height: "10em",
        }}
      >
        <BrandText>ToriPunks Placeholder</BrandText>
      </View>
      {/*Just a placeholder please delete me*/}
    </ScreenContainer>
  );
};
