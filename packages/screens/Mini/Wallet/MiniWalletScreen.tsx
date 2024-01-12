import React, { useState } from "react";
import { Dimensions, View } from "react-native";

import NFTScreen from "./NFTScreen";
import TokenScreen from "./TokenScreen";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { RoundedTabs } from "../../../components/tabs/RoundedTabs";
import { ScreenFC } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";
import { CustomButton } from "../components/CustomButton";

const collectionScreenTabItems = {
  tokens: {
    name: "Tokens",
  },
  nfts: {
    name: "NFTs",
  },
};

export const MiniWalletScreen: ScreenFC<"MiniWallets"> = ({
  navigation,
  route,
}) => {
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof collectionScreenTabItems>("tokens");

  return (
    <ScreenContainer
      headerChildren={<></>}
      responsive
      fullWidth
      footerChildren={null}
      noScroll
      mobileTitle="Wallets"
    >
      <View
        style={{
          flex: 1,
          width: Dimensions.get("window").width,
          paddingHorizontal: layout.spacing_x1_5,
        }}
      >
        <RoundedTabs
          items={collectionScreenTabItems}
          onSelect={(key) => setSelectedTab(key)}
          selected={selectedTab}
          style={{
            maxHeight: 36,
            marginTop: layout.spacing_x2,
            marginBottom: layout.spacing_x0_5,
          }}
        />
        {selectedTab === "tokens" && (
          <TokenScreen navigation={navigation} route={route} />
        )}
        {selectedTab === "nfts" && (
          <NFTScreen navigation={navigation} route={route} />
        )}
      </View>
    </ScreenContainer>
  );
};
