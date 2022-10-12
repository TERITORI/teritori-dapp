import React, { useState } from "react";
import { View } from "react-native";

import {
  Collection,
  CollectionsRequest_Kind,
} from "../../api/marketplace/v1/marketplace";
import { useCollections } from "../../hooks/useCollections";
import {
  collectionItemHeight,
  collectionItemWidth,
  CollectionView,
} from "../CollectionView";
import { CarouselSection } from "./CarouselSection";

const gap = 24;

const renderItem = (props: { item: Collection }) => (
  <CollectionView item={props.item} />
);

export const CollectionsCarouselSection: React.FC<{
  title: string;
  kind?: CollectionsRequest_Kind;
}> = ({ title, kind = CollectionsRequest_Kind.KIND_FAKE }) => {
  const [collections, fetchMore] = useCollections({
    kind,
    limit: 16,
    offset: 0,
  });
  const [viewWidth, setWidth] = useState(0);

  return (
    <View onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      <CarouselSection
        title={title}
        data={collections}
        width={collectionItemWidth + gap}
        height={collectionItemHeight}
        onScrollEnd={fetchMore}
        pagingEnabled
        loop={false}
        style={{
          width: viewWidth,
        }}
        renderItem={renderItem}
      />
    </View>
  );
};
