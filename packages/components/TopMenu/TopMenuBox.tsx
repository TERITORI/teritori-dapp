import { FC } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";

import { TopMenuAccount } from "./TopMenuAccount";
import { TopMenuHighlightedNews } from "./TopMenuHighlightedNews";
import { TopMenuLiveMint } from "./TopMenuLiveMint";
import { TopMenuMyTeritories } from "./TopMenuMyTeritories";
import { TopMenuMyWallets } from "./TopMenuMyWallets";
import { purpleLight } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout, topMenuWidth } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import FlexCol from "../FlexCol";
import { OmniLink } from "../OmniLink";
import { Separator } from "../Separator";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const TopMenuBox: FC<{
  style?: StyleProp<ViewStyle>;
  mainContainerStyle?: StyleProp<ViewStyle>;
}> = ({ style, mainContainerStyle }) => {
  return (
    <TertiaryBox
      width={topMenuWidth}
      noBrokenCorners
      style={style}
      mainContainerStyle={mainContainerStyle}
    >
      <TopMenuAccount />
      <TopMenuMyWallets />
      <TopMenuMyTeritories />
      <TopMenuHighlightedNews />
      <TopMenuLiveMint />

      <Separator />
      <OmniLink to={{ screen: "Settings" }}>
        <FlexCol style={{ paddingVertical: layout.padding_x1_5 }}>
          <BrandText style={styles.settingsText}>Settings</BrandText>
        </FlexCol>
      </OmniLink>
    </TertiaryBox>
  );
};

const styles = StyleSheet.create({
  settingsText: {
    ...(fontSemibold14 as object),
    color: purpleLight,
  },
});
