import React, { useState } from "react";
import { Dimensions, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { Separator } from "../../../components/separators/Separator";
import { RoundedTabs } from "../../../components/tabs/RoundedTabs";
import { neutral88, secondaryColor } from "../../../utils/style/colors";
import { fontMedium13, fontMedium24 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { CustomButton } from "../Settings/components/CustomButton";

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

  const onDepositPress = () => {};

  return (
    <ScreenContainer
      headerChildren={<></>}
      responsive
      fullWidth
      footerChildren={null}
      noScroll
      mobileTitle="Wallets"
    >
      <RoundedTabs
        items={collectionScreenTabItems}
        onSelect={(key) => setSelectedTab(key)}
        selected={selectedTab}
        style={{
          maxHeight: 36,
          marginTop: layout.spacing_x2,
          marginBottom: layout.spacing_x2,
        }}
      />
      <View
        style={{
          flex: 1,
          width: Dimensions.get("window").width,
          paddingHorizontal: layout.spacing_x1_5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            paddingVertical: layout.spacing_x3,
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
          <View style={{ flexDirection: "row", gap: layout.spacing_x1 }}>
            <CustomButton
              width={72}
              title="Deposit"
              size="medium"
              onPress={onDepositPress}
            />
            <CustomButton
              width={72}
              title="Send"
              size="medium"
              onPress={onDepositPress}
              type="gray"
            />
          </View>
        </View>
        <Separator />
      </View>
    </ScreenContainer>
  );
};
