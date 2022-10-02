import React, { useCallback, useEffect, useState } from "react";
import {
  ListRenderItem,
  FlatList,
  LayoutChangeEvent,
  View,
  ViewStyle,
} from "react-native";

import {
  CollectionNFTsRequest,
  NFT,
} from "../../api/marketplace/v1/marketplace";
import { NFTView } from "../../components/NFTView";
import { ScreenContainer } from "../../components/ScreenContainer";
import { backendClient } from "../../utils/backend";
import { prettyPrice } from "../../utils/coins";
import { ScreenFC } from "../../utils/navigation";
import { Network } from "../../utils/network";

export const useCollectionNFTs = (
  req: CollectionNFTsRequest
): [NFT[], () => Promise<void>] => {
  const [nfts, setNFTs] = useState<NFT[]>([]);

  const fetchMore = useCallback(async () => {
    try {
      const offsetReq = {
        ...req,
        offset: req.offset + nfts.length,
      };
      console.log("fetching", offsetReq);
      const stream = backendClient.CollectionNFTs(offsetReq);
      let newNFTS: NFT[] = [];
      await stream.forEach((response) => {
        if (!response.nft) {
          return;
        }
        newNFTS = [...newNFTS, response.nft];
      });
      setNFTs((collec) => [...collec, ...newNFTS]);
    } catch (err) {
      console.warn("failed to fetch collection nfts:", err);
    }
  }, [req, nfts]);

  useEffect(() => {
    setNFTs([]);
    fetchMore();
  }, [req.id]);

  return [nfts, fetchMore];
};

const gap = 20;
const nftWidth = 268 + gap * 2; // FIXME: ssot

const ItemSeparator: React.FC = () => <View style={{ height: gap }} />;

const keyExtractor = (item: NFT) => item.mintAddress;

const renderItem: ListRenderItem<NFT> = (info) => {
  const nft = info.item;
  return (
    <NFTView
      key={nft.mintAddress}
      data={{
        network: Network.Solana, // FIXME
        name: nft.name,
        owned: false,
        imageURI: nft.imageUri,
        collectionName: "Collection",
        collectionId: "TODO",
        collectionDiscriminator: "TODO",
        isCertified: true,
        floorPrice: nft.isListed ? prettyPrice(nft.price, nft.denom) : "",
        favoritesCount: 420,
        id: nft.id,
      }}
      style={{ marginHorizontal: gap / 2 }}
    />
  );
};

const viewStyle: ViewStyle = {
  alignItems: "center",
  height: "100%",
};

export const alignDown = (count: number, stride: number) => {
  const factor = Math.floor(count / stride);
  return factor * stride;
};

const BoundariesSpacer: React.FC = () => <View style={{ height: 100 }} />;

const CollectionNFTs: React.FC<{ id: string; numColumns: number }> = ({
  id,
  numColumns,
}) => {
  const [nfts, fetchMore] = useCollectionNFTs({
    id,
    limit: alignDown(20, numColumns) || numColumns,
    offset: 0,
  });
  return (
    <FlatList
      key={numColumns}
      data={nfts}
      numColumns={numColumns}
      ItemSeparatorComponent={ItemSeparator}
      onEndReached={fetchMore}
      keyExtractor={keyExtractor}
      onEndReachedThreshold={4}
      renderItem={renderItem}
      ListHeaderComponent={BoundariesSpacer}
      ListFooterComponent={BoundariesSpacer}
    />
  );
};

const Content: React.FC<{ id: string }> = React.memo(({ id }) => {
  const [viewWidth, setViewWidth] = useState(0);
  const numColumns = Math.floor(viewWidth / nftWidth);

  const handleViewLayout = useCallback(
    (event: LayoutChangeEvent) => setViewWidth(event.nativeEvent.layout.width),
    []
  );

  return (
    <View style={viewStyle} onLayout={handleViewLayout}>
      {viewWidth ? <CollectionNFTs id={id} numColumns={numColumns} /> : null}
    </View>
  );
});

export const CollectionScreen: ScreenFC<"Collection"> = ({ route }) => {
  return (
    <ScreenContainer noMargin noScroll>
      <Content key={route.params.id} id={route.params.id} />
    </ScreenContainer>
  );
};
