import React from "react";
import { View, ActivityIndicator, ViewStyle, StyleProp } from "react-native";

import {
  Collection,
  MintState,
  Sort,
  SortDirection,
} from "../api/marketplace/v1/marketplace";
import { useCollections } from "../hooks/useCollections";
import { useNFTs } from "../hooks/useNFTs";
import { useSelectedNetworkId } from "../hooks/useSelectedNetwork";
import { layout } from "../utils/style/layout";
import { NetworkIcon } from "./NetworkIcon";
import { Section } from "./Section";
import { NFTView } from "./nfts/NFTView";

const gridHalfGutter = 12;

export const OwnedNFTs: React.FC<{
  ownerId: string;
  style?: StyleProp<ViewStyle>;
  EmptyListComponent?: React.ComponentType;
}> = ({ ownerId, style, EmptyListComponent }) => {
  const selectedNetworkId = useSelectedNetworkId();

  const [collections] = useCollections({
    networkId: selectedNetworkId,
    sortDirection: SortDirection.SORT_DIRECTION_DESCENDING,
    upcoming: false,
    sort: Sort.SORTING_VOLUME,
    limit: 100,
    offset: 0,
    mintState: MintState.MINT_STATE_UNSPECIFIED,
  }); // FIXME: add owner filter and pagination

  if (!collections?.length && EmptyListComponent) {
    return <EmptyListComponent />;
  }

  return (
    <View style={[style, { paddingBottom: layout.contentPadding }]}>
      {!Object.keys(collections).length && (
        <ActivityIndicator size="large" style={{ marginBottom: 72 }} />
      )}
      {collections.map((collection) => (
        <OwnedNFTsSection
          key={collection.id}
          ownerId={ownerId}
          collection={collection}
        />
      ))}
    </View>
  );
};

const OwnedNFTsSection: React.FC<{
  ownerId: string;
  collection: Collection;
}> = ({ ownerId, collection }) => {
  const selectedNetworkId = useSelectedNetworkId();

  const { nfts } = useNFTs({
    networkId: selectedNetworkId,
    offset: 0,
    limit: 100, // FIXME: pagination
    ownerId,
    collectionId: collection.id,
    sort: Sort.SORTING_PRICE,
    sortDirection: SortDirection.SORT_DIRECTION_ASCENDING,
  });

  if (nfts.length === 0) {
    return null;
  }

  return (
    <Section
      title={`${collection.collectionName} Collection`}
      topRightChild={
        <View style={{ alignItems: "flex-end", flexDirection: "row" }}>
          <NetworkIcon size={16} networkId={collection.networkId} />
        </View>
      }
    >
      <View
        style={{
          margin: -gridHalfGutter,
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {nfts.map((nft) => (
          <NFTView key={nft.id} data={nft} style={{ margin: gridHalfGutter }} />
        ))}
      </View>
    </Section>
  );
};
