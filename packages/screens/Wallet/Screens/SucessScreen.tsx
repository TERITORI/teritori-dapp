import React from "react";
import { View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { ScreenFC } from "../../../utils/navigation";
import { neutral77 } from "../../../utils/style/colors";
import { fontSemibold16, fontSemibold28 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { Button } from "../components/Button";
import { TopBarWithProgress } from "../layout/TopBarWithProgress";
import { WalletContainer } from "../layout/WalletContainer";

export const SuccessScreen: ScreenFC<"SuccessScreen"> = () => {
  return (
    <WalletContainer>
      <TopBarWithProgress progress={100} />
      <View
        style={{
          width: "100%",
          flex: 7,
          marginTop: layout.spacing_x3,
          alignItems: "flex-start",
        }}
      >
        <BrandText style={[fontSemibold28]}>You're All Set!</BrandText>
        <BrandText
          style={[
            fontSemibold16,
            { color: neutral77, marginTop: layout.spacing_x1 },
          ]}
        >
          Click on the Start button to launch Teritori.
        </BrandText>
      </View>
      <Button text="Start" navigateTo="MiniTabs" />
    </WalletContainer>
  );
};
