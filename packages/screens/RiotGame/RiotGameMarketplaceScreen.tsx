import React from "react";
import { View } from "react-native";

import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { getCollectionId, getCosmosNetwork } from "../../networks";
import { ScreenFC } from "../../utils/navigation";
import { CollectionThumb } from "./component/CollectionThumb";
import { CollectionView } from "./component/CollectionView";
import { GameContentView } from "./component/GameContentView";

export const RiotGameMarketplaceScreen: ScreenFC<"RiotGameMarketplace"> = ({
  route,
}) => {
  const collectionId = route.params?.collectionId || "";
  const networkId = useSelectedNetworkId();
  const network = getCosmosNetwork(networkId);

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
