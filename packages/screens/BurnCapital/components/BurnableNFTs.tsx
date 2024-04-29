import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { View, ActivityIndicator, ViewStyle, StyleProp } from "react-native";

import {
  Collection,
  MintState,
  Sort,
  SortDirection,
} from "@/api/marketplace/v1/marketplace";
import { NetworkIcon } from "@/components/NetworkIcon";
import { Section } from "@/components/Section";
import { NFTView } from "@/components/nfts/NFTView";
import { useNFTBurnerAuthorizedCollections } from "@/hooks/nft-burner/useNFTBurnerAuthorizedCollections";
import { useCollections } from "@/hooks/useCollections";
import { useNFTs } from "@/hooks/useNFTs";
import {
  getNetworkFeature,
  NetworkFeature,
  parseNetworkObjectId,
} from "@/networks";
import { layout } from "@/utils/style/layout";

const gridHalfGutter = 12;

export const BurnableNFTs: React.FC<{
  ownerId: string;
  style?: StyleProp<ViewStyle>;
  EmptyListComponent?: React.ComponentType;
}> = ({ ownerId, style, EmptyListComponent }) => {
  const [network] = parseNetworkObjectId(ownerId);
  const networkId = network?.id || "";

  const { collections } = useCollections({
    networkId,
    sortDirection: SortDirection.SORT_DIRECTION_DESCENDING,
    upcoming: false,
    sort: Sort.SORT_VOLUME,
    limit: 100,
    offset: 0,
    mintState: MintState.MINT_STATE_UNSPECIFIED,
  });
  const burnableIds = [
    "tori-tori1upd858fjdlme0wv4vd2v7c4majyr9dg53rl72dzfhds9zusmn9mqzjk22e", // Sasquatch Society Farmers
    "tori-tori1lnx4r7styl209e9lfce8tdd7hyclq98upx25ax3t2qkmcl3jlgvsh787qa", // glitch candies
    "tori-tori1quj5act407qgszngzsh9elcelzl9pgcglq3844cwqex3cxzzeres0ckprs", // ToriWadz
    "tori-tori1ss9a0rs5m603g8m7f3pwen8g9mpqypg908rs0g4ml2zzqjupx25syne2jn", // Starbois
  ];

  // const { data: authorizedCollections } =
  //   useNFTBurnerAuthorizedCollections("teritori");
  //
  // const torifyIds =
  //   authorizedCollections?.map((collection) => `tori-${collection}`) || [];

  const burnableCollections = collections.filter((collection) =>
    burnableIds.includes(collection.id),
  );

  if (!burnableCollections.length && EmptyListComponent) {
    return <EmptyListComponent />;
  }

  return (
    <View style={[style, { paddingBottom: layout.contentSpacing }]}>
      {!Object.keys(burnableCollections).length && (
        <ActivityIndicator size="large" style={{ marginBottom: 72 }} />
      )}
      {burnableCollections.map((collection) => (
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
    sort: Sort.SORT_PRICE,
    sortDirection: SortDirection.SORT_DIRECTION_ASCENDING,
    attributes: [],
    isListed: false,
    priceRange: undefined,
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
