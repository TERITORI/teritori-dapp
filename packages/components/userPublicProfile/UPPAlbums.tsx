import React, { useState, useMemo } from "react";
import Animated from "react-native-reanimated";

import {
  combineFetchAlbumPages,
  useFetchUserAlbums,
} from "../../hooks/musicplayer/useFetchUserAlbums";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  ALBUM_CARD_WIDTH,
  AlbumCard,
} from "../../screens/MusicAlbum/components/AlbumCard";
import { SpacerColumn, SpacerRow } from "../spacer";

export const UPPAlbums: React.FC<{ userId: string }> = ({ userId }) => {
  const selectedWallet = useSelectedWallet();
  const [flatListWidth, setFlatListWidth] = useState(0);
  const elemsPerRow = Math.floor(flatListWidth / ALBUM_CARD_WIDTH) || 1;
  const { data, isFetching, hasNextPage, fetchNextPage, isLoading } =
    useFetchUserAlbums({
      limit: 10,
      offset: 0,
      createdBy: userId,
    });
  const albums = useMemo(
    () => (data ? combineFetchAlbumPages(data.pages) : []),
    [data]
  );
  const onEndReached = () => {
    if (!isLoading && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  };
  return (
    <Animated.FlatList
      onLayout={(e) => setFlatListWidth(e.nativeEvent.layout.width)}
      key={`upp-albums-flat-list-${elemsPerRow}`}
      scrollEventThrottle={0.1}
      data={albums}
      numColumns={elemsPerRow}
      renderItem={({ item: albumInfo, index }) => (
        <>
          <AlbumCard
            album={albumInfo}
            hideAuthor={selectedWallet?.userId === userId}
          />
          {index !== elemsPerRow - 1 && <SpacerRow size={2.5} />}
        </>
      )}
      onEndReachedThreshold={1}
      onEndReached={onEndReached}
      ItemSeparatorComponent={() => <SpacerColumn size={2.5} />}
    />
  );
};
