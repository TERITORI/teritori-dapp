import React, { useState } from "react";
import { StyleSheet } from "react-native";

import { SettingItem } from "./SettingItem";
import { BrandText } from "../../../components/BrandText";
import { SpacerColumn } from "../../../components/spacer";
import { neutral17, neutralA3 } from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { SettingItemGroupType, SettingItemType } from "../types";

const styles = StyleSheet.create({
  bigTitle: StyleSheet.flatten([
    fontSemibold20,
    {
      paddingTop: layout.padding_x4,
      paddingLeft: layout.padding_x2,
    },
  ]),
  bigText: StyleSheet.flatten([
    fontSemibold14,
    {
      color: neutralA3,
      paddingLeft: layout.padding_x2,
      paddingTop: layout.padding_x1,
    },
  ]),
});

export const Notifications: React.FC = () => {
  const data: SettingItemGroupType = {
    sales: {
      title: "Sales",
      description: "When one of your NFTs sells",
      state: true,
    },
    successfulBids: {
      title: "Successful bids",
      description: "When your bid was successful and the NFT is in your wallet",
      state: true,
    },
    bidsInfo: {
      title: "Bids & Outbids",
      description:
        "When someone bids on one of your items or outbids yours bids",
      state: true,
    },
    expiredBids: {
      title: "Expired bids",
      description:
        "When your bid expires or gets deactivated because of insufficient funds",
      state: true,
    },
    purchase: {
      title: "Purchases",
      description:
        "When a purchase is successful and you have received the NFT in your wallet",
      state: true,
    },
  };
  const [settings, setSettings] = useState<SettingItemGroupType>(data);

  return (
    <>
      <BrandText style={styles.bigTitle}>Notifications</BrandText>
      <BrandText style={styles.bigText}>
        Select the kinds of notifications you’d like receive to your email and
        in-app notifications center
      </BrandText>

      <SpacerColumn size={2} />

      <div // change into View
        style={{
          width: "100%",
          borderRadius: layout.padding_x1_5,
          backgroundColor: neutral17,
          padding: layout.padding_x1_5,
          opacity: 0.5, //  delete when ready
          pointerEvents: "none", //  delete when ready
        }}
      >
        {Object.keys(data).map((key) => {
          const item = settings[key];
          return (
            <SettingItem
              key={key}
              onPress={(item: SettingItemType) => {
                item.state = !item.state;
                setSettings({ ...settings, key: item });
              }}
              item={item}
            />
          );
        })}
      </div>
    </>
  );
};
