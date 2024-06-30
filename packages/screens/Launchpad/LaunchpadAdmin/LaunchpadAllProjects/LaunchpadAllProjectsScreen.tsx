import React, { useState } from "react";
import { View } from "react-native";

import { LaunchpadAllProjectsTable } from "./component/LaunchpadAllProjectsTable";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { HighVolSortButton } from "@/components/sorts/HighVolSortButton";
import { Tabs } from "@/components/tabs/Tabs";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useIsMobile } from "@/hooks/useIsMobile";
import { NetworkFeature } from "@/networks";
import { neutral33 } from "@/utils/style/colors";
import { fontSemibold20, fontSemibold28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

type TabsListType = "all" | "verified" | "ethereum" | "solana" | "cosmos";

export interface DummyLaunchpadProject {
  id: number;
  rank: number;
  collectionNameData: string;
  floor: string;
  totalVol: string;
  vol: string;
  volPercentage: string;
}

const dummyData: DummyLaunchpadProject[] = [
  {
    id: 1,
    rank: 1,
    collectionNameData: "Meebits",
    floor: "3.9",
    totalVol: "2,052,499,51",
    vol: "78,231.57",
    volPercentage: "+24.26%",
  },
  {
    id: 2,
    rank: 2,
    collectionNameData: "Meebits",
    floor: "3.9",
    totalVol: "2,052,499,51",
    vol: "78,231.57",
    volPercentage: "-24.26%",
  },
  {
    id: 3,
    rank: 3,
    collectionNameData: "Meebits",
    floor: "3.9",
    totalVol: "2,052,499,51",
    vol: "78,231.57",
    volPercentage: "+24.26%",
  },
  {
    id: 4,
    rank: 4,
    collectionNameData: "Meebits",
    floor: "3.9",
    totalVol: "2,052,499,51",
    vol: "78,231.57",
    volPercentage: "-24.26%",
  },
];

export const LaunchpadAllProjectsScreen: React.FC = () => {
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
      onBackPress={() => navigation.navigate("LaunchpadAdministrationOverview")}
      forceNetworkFeatures={[NetworkFeature.NFTLaunchpad]}
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
            alignItems: "center",
            marginTop: 30,
            borderTopColor: neutral33,
            borderTopWidth: 1,
            borderBottomColor: neutral33,
            borderBottomWidth: 1,
          }}
        >
          <Tabs
            items={tabs}
            selected={selectedTab}
            style={{ height: 58, flex: 1 }}
            onSelect={setSelectedTab}
            noUnderline
          />

          {!isMobile && (
            <HighVolSortButton
              style={{ marginLeft: 12 }}
              sortDirection={1}
              onChangeSortDirection={() => {}} // TODO: don't forget to rewrite onPress function if possible
              height={42}
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
          <LaunchpadAllProjectsTable rows={dummyData} />
        </View>
      </View>
    </ScreenContainer>
  );
};
