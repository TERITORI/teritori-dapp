import React, { useState } from "react";
import { Pressable, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { Separator } from "../../../components/separators/Separator";
import { RoundedTabs } from "../../../components/tabs/RoundedTabs";
import {
  blueDefault,
  neutral88,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontMedium13, fontMedium24 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

const collectionScreenTabItems = {
  tokens: {
    name: "Tokens",
  },
  nfts: {
    name: "NFTs",
  },
};
export const MiniWalletScreen = ({}) => {
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof collectionScreenTabItems>("tokens");
  return (
    <ScreenContainer
      headerChildren={<></>}
      responsive
      fullWidth
      footerChildren={<></>}
      mobileTitle="Wallets"
    >
      <RoundedTabs
        items={collectionScreenTabItems}
        onSelect={(key) => setSelectedTab(key)}
        selected={selectedTab}
        style={{
          height: 48,
          maxHeight: 48,
          marginTop: layout.spacing_x2,
          marginBottom: layout.spacing_x2,
        }}
      />
      <Separator />
      <View style={{ paddingVertical: layout.spacing_x2 }}>
        <View
          style={{
            flexDirection: "row",
            paddingVertical: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <BrandText
              style={[
                fontMedium24,
                {
                  color: secondaryColor,
                },
              ]}
            >
              $14,530.35
            </BrandText>
            <BrandText
              style={[
                fontMedium13,
                {
                  color: neutral88,
                },
              ]}
            >
              Total balance
            </BrandText>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Pressable
              style={{
                backgroundColor: blueDefault,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 100,
                paddingHorizontal: layout.spacing_x2,
                marginHorizontal: layout.spacing_x0_5,
              }}
            >
              <BrandText>Deposit</BrandText>
            </Pressable>
            <Pressable
              style={{
                backgroundColor: "#393939",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 100,
                paddingHorizontal: layout.spacing_x2,
                marginHorizontal: layout.spacing_x0_5,
              }}
            >
              <BrandText>Send</BrandText>
            </Pressable>
          </View>
        </View>
      </View>
      <Separator />
    </ScreenContainer>
  );
};
