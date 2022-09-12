import React, { useState } from "react";
import { Image, View } from "react-native";

import guardian1PNG from "../../../assets/default-images/guardian_1.png";
import { neutral77, primaryColor } from "../../utils/style/colors";
import { fontSemibold14, fontSemibold28 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { NFTPriceBuyCard } from "../cards/NFTPriceBuyCard";
import { CollectionInfoInline } from "../collections/CollectionInfoInline";
import { TransactionPaymentModal } from "../modals/transaction/TransactionPaymentModal";
import { TabItem, Tabs, useTabs } from "../tabs/Tabs";
import { NFTAttributes } from "./NFTAttributes";

const mainInfoTabItems: TabItem[] = [
  {
    label: "About",
    isSelected: false,
  },
  {
    label: "Attributes",
    isSelected: true,
  },
  {
    label: "Details",
    isSelected: false,
  },
];

export const NFTMainInfo: React.FC = () => {
  const [transactionPaymentModalVisible, setTransactionPaymentModalVisible] =
    useState(false);

  const { onPressTabItem, selectedTabItem, tabItems } =
    useTabs(mainInfoTabItems);

  const SelectedTabItemRendering: React.FC = () => {
    switch (selectedTabItem.label) {
      case "About":
        return (
          <BrandText
            style={[fontSemibold14, { marginBottom: 24, width: "100%" }]}
          >
            {"For decades, the destruction of ecosystems and social relations has turned people into soulless robots. " +
              "At the same time, inequality explodes every year and misery becomes the norm for the silent majority.\n\n" +
              "A minority of powerful & wealthy leaders, called the “The Legion'', have set up a technological & political" +
              "system allowing them to continue to develop their wealth and safety.\n" +
              "Of course this system only serves the happy few elite members of the society while the majority survives in" +
              "an increasingly uncertain world.\n\n" +
              "Small groups start to gather in the shadows to take action.\n" +
              "They go by the name of “Guardians” and believe that everyone should be able to live autonomously without the" +
              "need to rely on “The Legion”. Their solution for a better world is to offer a decentralized ecosystem open" +
              "to anyone, rich or poor."}
          </BrandText>
        );
      case "Attributes":
        return <NFTAttributes />;
      case "Details":
        return (
          <View style={{ height: 222, width: 600 }}>
            <BrandText>WIP</BrandText>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        marginTop: 48,
        width: "100%",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {/*---- Image NFT */}
      <TertiaryBox
        width={464}
        height={464}
        style={{ marginRight: 28, marginBottom: 40 }}
      >
        <Image
          source={guardian1PNG}
          style={{ width: 462, height: 462, borderRadius: 8 }}
        />
      </TertiaryBox>
      {/*---- Info NFT */}
      <View style={{ maxWidth: 600 }}>
        <BrandText style={[fontSemibold28, { marginBottom: 12 }]}>
          Genesis Guardians of Teritori
        </BrandText>
        <CollectionInfoInline
          imageSource={guardian1PNG}
          name="Genesis Guardians"
        />
        <NFTPriceBuyCard
          style={{ marginTop: 24, marginBottom: 40 }}
          onPressBuy={() => setTransactionPaymentModalVisible(true)}
        />

        <Tabs
          onPressTabItem={onPressTabItem}
          items={tabItems}
          borderColorTabSelected={primaryColor}
          style={{ height: 26, marginBottom: 16 }}
        />
        {/*TODO: 3 View to display depending on the nftMainInfoTabItems isSelected item*/}
        {/*TODO: About  = Big text*/}
        <SelectedTabItemRendering />
      </View>

      <TransactionPaymentModal
        onClose={() => setTransactionPaymentModalVisible(false)}
        visible={transactionPaymentModalVisible}
        price={8}
        label="Checkout"
        text={
          <BrandText style={fontSemibold14}>
            <BrandText style={[fontSemibold14, { color: neutral77 }]}>
              You are about to purchase a{" "}
            </BrandText>
            Genesis Guardians of Teritori
            <BrandText style={[fontSemibold14, { color: neutral77 }]}>
              {" "}
              from{" "}
            </BrandText>
            Genesis Guardians
          </BrandText>
        }
      />
    </View>
  );
};
