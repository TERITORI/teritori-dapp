import React, { useState } from "react";
import { View, ViewStyle } from "react-native";

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
        <View style={rowHeader}>
          <View style={rowWithCenter}>
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
        <View style={[rowWithCenter, { marginVertical: 24 }]}>
          <BrandText>Gigs</BrandText>
        </View>
      )}
      <GigsTable gigAddress={gigAddress} />
    </>
  );
};

const rowHeader: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingTop: layout.contentSpacing,
  marginBottom: layout.spacing_x2_5,
};
const rowWithCenter: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};
