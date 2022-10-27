import React, { ReactElement, useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { NFT, NFTsRequest } from "../../api/marketplace/v1/marketplace";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useNFTs } from "../../hooks/useNFTs";
import { layout } from "../../utils/style/layout";
import { SpacerColumn } from "../spacer";
import { NFTTransferModal } from "./NFTTransferModal";
import { NFTView } from "./NFTView";

const keyExtractor = (item: NFT) => item.mintAddress;

const RenderItem: React.FC<{
  nft: NFT;
  marginable: boolean;
  onOptionTransferPress: () => void;
}> = ({ nft, marginable, onOptionTransferPress }) => {
  return (
    <NFTView
      key={nft.mintAddress}
      data={nft}
      style={{ marginRight: marginable ? layout.padding_x2 : 0 }}
      onOptionTransferPress={onOptionTransferPress}
    />
  );
};

export const NFTs: React.FC<{
  req: NFTsRequest;
  numColumns: number;
  ListHeaderComponent?: ReactElement;
  ListFooterComponent?: ReactElement;
}> = ({ req, numColumns, ListHeaderComponent, ListFooterComponent }) => {
  // variables
  const [transferNFT, setTransferNFT] = useState<undefined | NFT>();
  const { nfts, fetchMore, firstLoading: firstLoadingNTFs } = useNFTs(req);
  const { setLoadingFullScreen } = useFeedbacks();
  const dropdownRef = useRef<View>(null);

  // Sync loadingFullScreen
  useEffect(() => {
    setLoadingFullScreen(firstLoadingNTFs);
  }, [firstLoadingNTFs]);

  // functions
  const toggleTransferNFT = (nft?: NFT) => {
    setTransferNFT(nft);
  };

  // returns
  return (
    <View style={styles.container} ref={dropdownRef}>
      <FlatList
        key={numColumns}
        data={nfts}
        numColumns={numColumns}
        onEndReached={fetchMore}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={4}
        renderItem={(info) => (
          <RenderItem
            nft={info.item}
            marginable={!!((info.index + 1) % numColumns)}
            onOptionTransferPress={() => toggleTransferNFT(info.item)}
          />
        )}
        ItemSeparatorComponent={() => <SpacerColumn size={2} />}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        contentContainerStyle={styles.contentContainerStyle}
      />
      <NFTTransferModal
        nft={transferNFT}
        isVisible={!!transferNFT}
        onClose={() => toggleTransferNFT()}
        onSubmit={() => toggleTransferNFT()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    alignItems: "center",
    flex: 1,
  },
  contentContainerStyle: {
    alignItems: "center",
  },
});
