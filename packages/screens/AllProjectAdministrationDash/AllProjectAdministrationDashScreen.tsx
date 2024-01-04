import React, { useState } from "react";
import { View } from "react-native";

import { AllApplicationTable } from "./component/AllApplicationTable";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { HighVolSortButton } from "../../components/sorts/HighVolSortButton";
import { Tabs } from "../../components/tabs/Tabs";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useAppNavigation } from "../../utils/navigation";
import { neutral33 } from "../../utils/style/colors";
import { fontSemibold20, fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export type TabsListType =
  | "all"
  | "verified"
  | "ethereum"
  | "solana"
  | "cosmos";

const dummyData = [
  {
    rank: 1,
    collectionNameData: "Meebits",
    floor: "3.9",
    totalVol: "2,052,499,51",
    vol: "78,231.57",
    volPerctage: "+24.26%",
  },
  {
    rank: 1,
    collectionNameData: "Meebits",
    floor: "3.9",
    totalVol: "2,052,499,51",
    vol: "78,231.57",
    volPerctage: "-24.26%",
  },
  {
    rank: 1,
    collectionNameData: "Meebits",
    floor: "3.9",
    totalVol: "2,052,499,51",
    vol: "78,231.57",
    volPerctage: "+24.26%",
  },
  {
    rank: 1,
    collectionNameData: "Meebits",
    floor: "3.9",
    totalVol: "2,052,499,51",
    vol: "78,231.57",
    volPerctage: "-24.26%",
  },
];

export const AllProjectAdministrationDashScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const isMobile = useIsMobile();

  const tabs = {
    all: {
      name: "All",
    },
    verified: {
      name: "Verified",
    },
    ethereum: {
      name: "Ethereum",
    },
    solana: {
      name: "Solana",
    },
    cosmos: {
      name: "Cosmos",
    },
  };

  const [selectedTab, setSelectedTab] = useState<TabsListType>("all");

  return (
    <ScreenContainer
      isLarge
      footerChildren={<></>}
      headerChildren={
        <BrandText style={fontSemibold20}>Administration Dashboard</BrandText>
      }
      responsive
      onBackPress={() => navigation.goBack()}
    >
      <View
        style={{
          marginTop: layout.spacing_x4,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "nowrap",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <BrandText style={fontSemibold28}>All Projects</BrandText>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginTop: 30,
            borderTopColor: neutral33,
            borderTopWidth: 1,
            borderBottomColor: neutral33,
            borderBottomWidth: 1,
            paddingVertical: 8,
          }}
        >
          <Tabs
            items={tabs}
            selected={selectedTab}
            style={{ height: 48, flex: 1 }}
            onSelect={setSelectedTab}
            noUnderline
          />

          {!isMobile && (
            <HighVolSortButton
              style={{ marginLeft: 12 }}
              sortDirection={1}
              onChangeSortDirection={() => {}}
            />
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            flex: 12,
            flexWrap: "nowrap",
            justifyContent: "space-between",
            marginTop: layout.spacing_x4,
          }}
        >
          <AllApplicationTable rows={dummyData} />
        </View>
      </View>
    </ScreenContainer>
  );
};
