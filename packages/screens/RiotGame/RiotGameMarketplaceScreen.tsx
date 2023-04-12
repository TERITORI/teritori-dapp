import React from "react";
import { View } from "react-native";

import { CollectionThumb } from "./component/CollectionThumb";
import { GameContentView } from "./component/GameContentView";
import { RiotCollectionView } from "./component/RiotCollectionView";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { getCollectionId, getCosmosNetwork } from "../../networks";
import { ScreenFC } from "../../utils/navigation";

export const RiotGameMarketplaceScreen: ScreenFC<"RiotGameMarketplace"> = ({
  route,
}) => {
  const networkId = useSelectedNetworkId();
  const network = getCosmosNetwork(networkId);
  const collectionId = route.params?.collectionId || "";

  return (
    <GameContentView>
      {collectionId ? (
        <RiotCollectionView collectionId={collectionId} />
      ) : (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            flexWrap: "wrap",
          }}
        >
          <CollectionThumb
            collectionId={getCollectionId(
              network?.id,
              network?.riotContractAddressGen0
            )}
          />
          <CollectionThumb
            collectionId={getCollectionId(
              network?.id,
              network?.riotContractAddressGen1
            )}
          />
        </View>
      )}
    </GameContentView>
  );
};
