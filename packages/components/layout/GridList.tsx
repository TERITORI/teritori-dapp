import React, { ComponentProps, useCallback, useMemo, useState } from "react";
import { FlatList, ListRenderItemInfo, View } from "react-native";

import { useMaxResolution } from "../../hooks/useMaxResolution";
import { layout } from "../../utils/style/layout";
import { EmptyList } from "../EmptyList";

type GridListType<T> = React.FC<{
  data: T[];
  minElemWidth: number;
  keyExtractor: (item: T) => string;
  renderItem: (
    info: ListRenderItemInfo<T>,
    elemWidth: number,
  ) => React.ReactElement | null;
  gap?: number;
  noFixedHeight?: boolean;
  onEndReached?: ComponentProps<typeof FlatList<T>>["onEndReached"];
}>;

type ItemWrapper<T> =
  | {
      value: T;
      filler: false;
    }
  | {
      index: number;
      filler: true;
    };

export function GridList<T>({
  data,
  minElemWidth,
  gap = layout.spacing_x2,
  onEndReached,
  noFixedHeight,
  keyExtractor,
  renderItem,
}: ComponentProps<GridListType<T>>): ReturnType<GridListType<T>> {
  const { height } = useMaxResolution({ isLarge: true });
  const [containerWidth, setContainerWidth] = useState(0);
  const elemsPerRow = Math.floor(containerWidth / minElemWidth) || 1;
  const elemsCount = data?.length || 0;
  const elemWidth =
    elemsPerRow === 1
      ? containerWidth
      : Math.floor((containerWidth - gap * (elemsPerRow - 1)) / elemsPerRow);

  let padded: ItemWrapper<T>[] = useMemo(() => {
    const wrappedData: ItemWrapper<T>[] = data.map((d) => ({
      value: d,
      filler: false,
    }));
    if (!(elemsCount % elemsPerRow !== 0 && elemsPerRow > 1)) {
      return wrappedData;
    }
    const padding: ItemWrapper<T>[] = Array(
      elemsPerRow - (elemsCount % elemsPerRow),
    )
      .fill(undefined)
      .map((_, index) => ({ filler: true, index }));
    return wrappedData.concat(padding);
  }, [data, elemsCount, elemsPerRow]);

  const keyExtractorWithPadding = useCallback(
    (item: ItemWrapper<T>) => {
      if (item.filler) {
        return `padding-${item.index}`;
      }
      return keyExtractor(item.value);
    },
    [keyExtractor],
  );

  const renderItemWithFixedWidth = useCallback(
    (info: ListRenderItemInfo<ItemWrapper<T>>) => {
      if (info.item.filler) {
        return <View style={{ width: elemWidth }} />;
      }
      return renderItem({ ...info, item: info.item.value }, elemWidth);
    },
    [elemWidth, renderItem],
  );

  if (containerWidth === 0) {
    padded = emptyList;
  }

  return (
    <FlatList<ItemWrapper<T>>
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      contentContainerStyle={!noFixedHeight && { height }}
      columnWrapperStyle={
        elemsPerRow < 2
          ? undefined
          : { flex: 1, justifyContent: "space-between" }
      }
      numColumns={elemsPerRow}
      ItemSeparatorComponent={() => <View style={{ height: gap }} />}
      key={`grid-list-${elemsPerRow}`}
      data={padded}
      onEndReached={onEndReached}
      keyExtractor={keyExtractorWithPadding}
      onEndReachedThreshold={4}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <EmptyList
          text="No result found"
          size={Math.min(height, containerWidth) / 3}
        />
      }
      renderItem={renderItemWithFixedWidth}
    />
  );
}

const emptyList: [] = [];
