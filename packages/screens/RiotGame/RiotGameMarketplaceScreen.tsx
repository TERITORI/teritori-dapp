import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";

import { SortDirection } from "../../api/marketplace/v1/marketplace";
import { useGame } from "../../context/GameProvider";
import { useCollectionInfo } from "../../hooks/useCollectionInfo";
import { ScreenFC } from "../../utils/navigation";
import {
  TabsListType,
  Header as CollectionHeader,
  Content as CollectionContent,
} from "../Marketplace/CollectionScreen";
import { GameContentView } from "./component/GameContentView";
import { THE_RIOT_COLLECTION_ID } from "./settings";
import { GameScreen } from "./types";

export const RiotGameMarketplaceScreen: ScreenFC<
  GameScreen.RiotGameMarketplace
> = () => {
  const [selectedTab, setSelectedTab] = useState<TabsListType>("allNFTs");
  const { info } = useCollectionInfo(THE_RIOT_COLLECTION_ID);
  const [sortDirection, setSortDirection] = useState(
    SortDirection.SORT_DIRECTION_ASCENDING
  );

  const { playGameAudio, muteAudio, enteredInGame } = useGame();
  // When this screen is focused, unmute the game audio and play game audio (A kind of forcing audio to be heard)
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused && enteredInGame) {
      muteAudio(false);
      playGameAudio();
    }
  }, [isFocused]);

  // returns
  return (
    <GameContentView>
      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <CollectionHeader
          collectionId={THE_RIOT_COLLECTION_ID}
          collectionInfo={info}
          selectedTab={selectedTab}
          onSelectTab={setSelectedTab}
          onChangeSortDirection={setSortDirection}
          sortDirection={sortDirection}
        />
        <CollectionContent
          id={THE_RIOT_COLLECTION_ID}
          selectedTab={selectedTab}
          sortDirection={sortDirection}
        />
      </ScrollView>
    </GameContentView>
  );
};
