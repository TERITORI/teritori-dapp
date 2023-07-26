import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { Tabs } from "../../tabs/Tabs";
import { GigsTable } from "../SellerDetails/GigsTable";

export const GigList: React.FC<{
  gigAddress: string;
}> = ({ gigAddress }) => {
  const tabs = {
    active: {
      name: "ACTIVE",
    },
    draft: {
      name: "DRAFT",
    },
  };
  const [selectedTab, setSelectedTab] = useState<keyof typeof tabs>("active");
  const wallet = useSelectedWallet();
  return (
    <>
      {wallet && wallet.address === gigAddress && (
        <View style={styles.rowHeader}>
          <View style={styles.rowWithCenter}>
            <Tabs
              items={tabs}
              onSelect={setSelectedTab}
              style={{ height: 44 }}
              selected={selectedTab}
            />
          </View>
        </View>
      )}
      {!(wallet && wallet.address === gigAddress) && (
        <View style={[styles.rowWithCenter, { marginVertical: 24 }]}>
          <BrandText>Gigs</BrandText>
        </View>
      )}
      <GigsTable gigAddress={gigAddress} />
    </>
  );
};

const styles = StyleSheet.create({
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: layout.contentPadding,
    marginBottom: layout.padding_x2_5,
  },
  rowWithCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  upperCase: {
    textTransform: "uppercase",
  },
});
