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
import { LegacyTertiaryBox } from "../boxes/LegacyTertiaryBox";
import { Separator } from "../separators/Separator";

export const TopMenuBox: FC<{
  style?: StyleProp<ViewStyle>;
  mainContainerStyle?: StyleProp<ViewStyle>;
}> = ({ style, mainContainerStyle }) => {
  const { height: windowHeight } = useWindowDimensions();

  return (
    <LegacyTertiaryBox
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
        <OmniLink href="/settings">
          <FlexCol style={{ paddingVertical: layout.spacing_x1_5 }}>
            <BrandText style={styles.settingsText}>Settings</BrandText>
          </FlexCol>
        </OmniLink>
      </ScrollView>
    </LegacyTertiaryBox>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
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
