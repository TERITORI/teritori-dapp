import React, { useState } from "react";

import { MusicHomeContent } from "./components/MusicHomeContent";
import { MusicMyLibraryContent } from "./components/MusicMyLibraryContent";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { TabDefinition, Tabs } from "../../components/tabs/Tabs";
import { ScreenFC } from "../../utils/navigation";

const musicTabItems: { [key: string]: TabDefinition } = {
  // TODO: Add icons when the Tabs component will be fixed
  home: {
    name: "Home",
  },
  myLibrary: {
    name: "My Library",
  },
  // TODO: Later
  // search: {
  //   name: "Search",
  // }
};

export const MusicScreen: ScreenFC<"Music"> = () => {
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof musicTabItems>("home");

  return (
    <ScreenContainer
      headerChildren={<BrandText>Music</BrandText>}
      isLarge
      responsive
    >
      <Tabs
        items={musicTabItems}
        selected={selectedTab}
        onSelect={setSelectedTab}
        style={{
          alignSelf: "center",
          height: 64,
          zIndex: 9,
          elevation: 9,
          width: "100%",
        }}
        tabContainerStyle={{ height: 64 }}
      />

      {selectedTab === "home" && <MusicHomeContent />}
      {selectedTab === "myLibrary" && <MusicMyLibraryContent />}
    </ScreenContainer>
  );
};
