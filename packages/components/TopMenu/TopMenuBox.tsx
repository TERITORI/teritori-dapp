import { FC } from "react";
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  ViewStyle,
} from "react-native";

import { TOP_MENU_BUTTON_HEIGHT } from "./TopMenu";
import { TopMenuAccount } from "./TopMenuAccount";
import { TopMenuHighlightedNews } from "./TopMenuHighlightedNews";
import { TopMenuLiveMint } from "./TopMenuLiveMint";
import { TopMenuMyTeritories } from "./TopMenuMyTeritories";
import { TopMenuMyWallets } from "./TopMenuMyWallets";
import { purpleLight } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { headerHeight, layout, topMenuWidth } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import FlexCol from "../FlexCol";
import { OmniLink } from "../OmniLink";
import { Separator } from "../Separator";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const TopMenuBox: FC<{
  style?: StyleProp<ViewStyle>;
  mainContainerStyle?: StyleProp<ViewStyle>;
}> = ({ style, mainContainerStyle }) => {
  const { height: windowHeight } = useWindowDimensions();

  return (
    <TertiaryBox
      width={topMenuWidth}
      noBrokenCorners
      style={[style, { borderRadius: 8 }]}
      mainContainerStyle={mainContainerStyle}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[
          styles.scrollView,
          {
            maxHeight: windowHeight - headerHeight / 2 - TOP_MENU_BUTTON_HEIGHT,
          },
        ]}
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
      </ScrollView>
    </TertiaryBox>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    height: "100%",
    width: topMenuWidth - 2,
  },
  settingsText: {
    ...(fontSemibold14 as object),
    color: purpleLight,
  },
});
