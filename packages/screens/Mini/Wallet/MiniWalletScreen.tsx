import React, { useState } from "react";
import { Dimensions, View } from "react-native";

import { AddedTokens } from "./components/AddedTokens";
import teritoriSVG from "../../../../assets/icons/networks/teritori.svg";
import settingSVG from "../../../../assets/icons/setting-solid.svg";
import transactionSVG from "../../../../assets/icons/transactions-gray.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { Separator } from "../../../components/separators/Separator";
import { RoundedTabs } from "../../../components/tabs/RoundedTabs";
import {
  neutral88,
  neutralA3,
  secondaryColor,
} from "../../../utils/style/colors";
import {
  fontMedium13,
  fontMedium24,
  fontSemibold14,
} from "../../../utils/style/fonts";
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
          marginBottom: layout.spacing_x0_5,
        }}
      />
      <View
        style={{
          flex: 1,
          width: Dimensions.get("window").width,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            paddingTop: layout.spacing_x3,
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
        <Separator style={{ marginVertical: layout.spacing_x3 }} />
        <AddedTokens
          code="3A31"
          dollar={14530.35}
          icon={teritoriSVG}
          onPress={() => {}}
          title="Teritori"
          tori={62424}
        />

        <CustomPressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: layout.spacing_x1_5,
          }}
        >
          <SVG source={settingSVG} height={24} width={24} />
          <BrandText style={[fontSemibold14, {}]}>Manage Tokens</BrandText>
        </CustomPressable>
        <Separator style={{ marginVertical: layout.spacing_x3 }} />
        <BrandText
          style={[
            fontSemibold14,
            { color: neutralA3, marginBottom: layout.spacing_x2 },
          ]}
        >
          Last transactions
        </BrandText>
        <View
          style={{
            flexDirection: "row",
            gap: layout.spacing_x1_5,
            alignItems: "center",
          }}
        >
          <SVG source={transactionSVG} height={24} width={24} />
          <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
            No recent transactions
          </BrandText>
        </View>
      </View>
    </ScreenContainer>
  );
};
