import React from "react";
import { View, ActivityIndicator, ViewStyle, StyleProp } from "react-native";

import {
  Collection,
  CollectionsRequest_Kind,
} from "../api/marketplace/v1/marketplace";
import { useCollections } from "../hooks/useCollections";
import { useNFTs } from "../hooks/useNFTs";
import { protobufNetworkToNetwork } from "../utils/network";
import { layout } from "../utils/style/layout";
import { Section } from "./Section";
import { NetworkIcon } from "./images/NetworkIcon";
import { NFTView } from "./nfts/NFTView";

const gridHalfGutter = 12;

export const OwnedNFTs: React.FC<{
  ownerId: string;
  style?: StyleProp<ViewStyle>;
  EmptyListComponent?: React.ComponentType;
}> = ({ ownerId, style, EmptyListComponent }) => {
  const [collections] = useCollections({
    limit: 100,
    offset: 0,
    kind: CollectionsRequest_Kind.KIND_TERITORI_FEATURES,
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
  const { nfts } = useNFTs({
    offset: 0,
    limit: 100, // FIXME: pagination
    ownerId,
    collectionId: collection.id,
  });

  if (nfts.length === 0) {
    return null;
  }

  return (
    <Section
      title={`${collection.collectionName} Collection`}
      topRightChild={
        <View style={{ alignItems: "flex-end", flexDirection: "row" }}>
          <NetworkIcon network={protobufNetworkToNetwork(collection.network)} />
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
