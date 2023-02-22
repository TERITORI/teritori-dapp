import React from "react";
import { View } from "react-native";

import {
  THE_RIOT_COLLECTION_ID,
  THE_RIOT_CHILD_COLLECTION_ID,
} from "../../utils/game";
import { ScreenFC } from "../../utils/navigation";
import { CollectionThumb } from "./component/CollectionThumb";
import { CollectionView } from "./component/CollectionView";
import { GameContentView } from "./component/GameContentView";

export const RiotGameMarketplaceScreen: ScreenFC<"RiotGameMarketplace"> = ({
  route,
}) => {
  const collectionId = route.params?.collectionId || "";

  return (
    <GameContentView>
      {collectionId ? (
        <CollectionView collectionId={collectionId} />
      ) : (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            flexWrap: "wrap",
          }}
        >
          <CollectionThumb collectionId={THE_RIOT_COLLECTION_ID} />
          <CollectionThumb collectionId={THE_RIOT_CHILD_COLLECTION_ID} />
        </View>
      )}
    </GameContentView>
  );
};
