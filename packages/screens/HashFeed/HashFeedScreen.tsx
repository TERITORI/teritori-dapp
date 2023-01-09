import React from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { NewsFeed } from "../../components/NewsFeed/NewsFeed";
import { ScreenContainer } from "../../components/ScreenContainer";
import { screenTabItems } from "../../utils/feed";
import { ScreenFC } from "../../utils/navigation";
import { neutral22, primaryColor } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";

export interface SelectedTabContentProps {
  selectedTab: keyof typeof screenTabItems;
  Header: React.ComponentType;
}

const Header = ({ hash }: { hash: string }) => (
  <View
    style={{
      height: 80,
      alignItems: "center",
      flexDirection: "row",
    }}
  >
    <View
      style={{
        height: 60,
        width: 60,
        borderRadius: 30,
        marginRight: layout.padding_x2,
        backgroundColor: neutral22,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <BrandText
        style={{
          fontSize: 40,
          color: primaryColor,
        }}
      >
        #
      </BrandText>
    </View>

    <BrandText>#{hash}</BrandText>
  </View>
);

export const HashFeedScreen: ScreenFC<"HashFeed"> = ({
  route: {
    params: { id: hash },
  },
}) => {
  return (
    <ScreenContainer responsive footerChildren={<></>} fullWidth noScroll>
      <NewsFeed Header={() => <Header hash={hash} />} />
    </ScreenContainer>
  );
};
