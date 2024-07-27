import React, { FC, useState } from "react";
import { View } from "react-native";

import { Tabs } from "@/components/tabs/Tabs";
import { CurrentlyHighlightedProject } from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadAdministrationOverview/component/CurrentlyHighLightedProject";
import { GenesisExplore } from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadAdministrationOverview/component/GenesisExplore";
import { layout } from "@/utils/style/layout";

type MarketingTabsListType =
  | "highlightedNewsHero"
  | "upcomingProjectsCarousel"
  | "liveSaleinProgress";

const herosTabs = {
  highlightedNewsHero: {
    name: "Highlighted News Hero",
    badgeCount: 3,
  },
  upcomingProjectsCarousel: {
    name: "Upcoming Projects Carousel",
    badgeCount: 12,
  },
  liveSaleinProgress: {
    name: "Live Sale in Progress",
    badgeCount: 52,
  },
};

export const MarketingEdition: FC = () => {
  const [selectedHerosTab, setSelectedMarketingTab] =
    useState<MarketingTabsListType>("highlightedNewsHero");

  const [isEditHighlighted, setIsEditHighlighted] = useState<boolean>(false);

  return (
    <View style={{ marginTop: layout.spacing_x4 }}>
      <Tabs
        items={herosTabs}
        selected={selectedHerosTab}
        style={{ height: 48 }}
        onSelect={setSelectedMarketingTab}
      />

      {isEditHighlighted ? (
        <CurrentlyHighlightedProject
          setIsEditHighlighted={setIsEditHighlighted}
        />
      ) : (
        <GenesisExplore setIsEditHighlighted={setIsEditHighlighted} />
      )}
    </View>
  );
};
