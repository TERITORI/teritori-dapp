import React from "react";
import { View, ViewStyle, StyleProp } from "react-native";

import { Sort, SortDirection } from "@/api/marketplace/v1/marketplace";
import { EmptyList } from "@/components/EmptyList";
import { NetworkIcon } from "@/components/NetworkIcon";
import { Section } from "@/components/Section";
import { NFTView } from "@/components/nfts/NFTView";
import { useCollectionInfo } from "@/hooks/useCollectionInfo";
import { useNFTs } from "@/hooks/useNFTs";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import {
  NetworkFeature,
  getNetworkFeature,
  parseCollectionId,
} from "@/networks";
import { layout } from "@/utils/style/layout";

const gridHalfGutter = 12;

export const BurnableNFTs: React.FC<{
  ownerId: string;
  style?: StyleProp<ViewStyle>;
}> = ({ ownerId, style }) => {
  const selectedNetworkId = useSelectedNetworkId();
  const burnFeature = getNetworkFeature(
    selectedNetworkId,
    NetworkFeature.CosmWasmNFTsBurner,
  );

  return (
    <View style={[style, { paddingBottom: layout.contentSpacing }]}>
      {burnFeature?.authorizedCollections.length ? (
        burnFeature.authorizedCollections.map((collectionId) => (
          <OwnedNFTsSection
            key={collectionId}
            ownerId={ownerId}
            collectionId={collectionId}
          />
        ))
      ) : (
        <EmptyList text="No burnable NFTs for this network" />
      )}
    </View>
  );
};

const OwnedNFTsSection: React.FC<{
  ownerId: string;
  collectionId: string;
}> = ({ ownerId, collectionId }) => {
  const [network] = parseCollectionId(collectionId);

  const { nfts } = useNFTs({
    offset: 0,
    limit: 100, // FIXME: pagination
    ownerId,
    collectionId,
    sort: Sort.SORT_PRICE,
    sortDirection: SortDirection.SORT_DIRECTION_ASCENDING,
    attributes: [],
    isListed: false,
    priceRange: undefined,
  });

  const { collectionInfo } = useCollectionInfo(
    collectionId,
    undefined,
    !!nfts.length,
  );

  if (nfts.length === 0 || !collectionInfo?.name) {
    return null;
  }

  return (
    <Section
      title={`${collectionInfo.name} Collection`}
      topRightChild={
        <View style={{ alignItems: "flex-end", flexDirection: "row" }}>
          <NetworkIcon size={16} networkId={network?.id} />
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
