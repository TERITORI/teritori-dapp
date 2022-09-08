import { RouteProp } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { RootStackParamList } from "../../utils/navigation";
import { Network } from "../../utils/network";

function usePrevious<T>(value: T, initialValue: T) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef<T>(initialValue);

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

const useCollectionNFTs = (
  req: CollectionNFTsRequest,
  ready: boolean
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
        newNFTS = [...newNFTS, response.nft];
      });
      setNFTs((collec) => [...collec, ...newNFTS]);
    } catch (err) {
      console.warn("failed to fetch collection nfts:", err);
    }
  }, [req, nfts]);

  const prevReady = usePrevious(ready, false);

  useEffect(() => {
    if (ready && !prevReady) {
      setNFTs([]);
      fetchMore();
    }
  }, [req.mintAddress, ready, prevReady]);

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
        network: Network.Solana,
        name: nft.name,
        owned: false,
        imageURI: nft.imageUri,
        collectionName: "Collection",
        collectionId: "TODO",
        collectionDiscriminator: "TODO",
        isCertified: true,
        floorPrice: nft.price,
        favoritesCount: 420,
        id: `sol-${nft.mintAddress}`,
      }}
      style={{ marginHorizontal: gap / 2 }}
    />
  );
};

const viewStyle: ViewStyle = {
  alignItems: "center",
  height: "100%",
};

const alignDown = (count: number, stride: number) => {
  const factor = Math.floor(count / stride);
  return factor * stride;
};

const BoundariesSpacer: React.FC = () => <View style={{ height: 100 }} />;

const Content: React.FC<{ mintAddress: string }> = ({ mintAddress }) => {
  const [viewWidth, setViewWidth] = useState(0);
  const numColumns = Math.floor(viewWidth / nftWidth);
  const [nfts, fetchMore] = useCollectionNFTs(
    {
      mintAddress,
      limit: alignDown(20, numColumns) || numColumns,
      offset: 0,
    },
    !!viewWidth
  );

  const handleViewLayout = useCallback(
    (event: LayoutChangeEvent) => setViewWidth(event.nativeEvent.layout.width),
    []
  );

  return (
    <View style={viewStyle} onLayout={handleViewLayout}>
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
    </View>
  );
};

export const CollectionScreen: React.FC<{
  route: RouteProp<RootStackParamList, "Collection">;
}> = ({ route }) => {
  return (
    <ScreenContainer noMargin noScroll>
      <Content
        key={route.params.mintAddress}
        mintAddress={route.params.mintAddress}
      />
    </ScreenContainer>
  );
};
