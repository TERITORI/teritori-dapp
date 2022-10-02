import React, { useState, useCallback, useEffect, useRef } from "react";
import { View } from "react-native";

import {
  Collection,
  CollectionsRequest,
  CollectionsRequest_Kind,
} from "../api/marketplace/v1/marketplace";
import { backendClient } from "../utils/backend";
import { CarouselSection } from "./CarouselSection";
import {
  collectionItemHeight,
  collectionItemWidth,
  CollectionView,
} from "./CollectionView";

export const useCollections = (
  req: CollectionsRequest
): [Collection[], (index: number) => Promise<void>] => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const fetchRef = useRef(false);

  const fetchMore = useCallback(
    async (index: number) => {
      try {
        if (!(index + req.limit >= collections.length)) {
          return;
        }
        if (fetchRef.current) {
          return;
        }
        fetchRef.current = true;
        const stream = backendClient.Collections({
          ...req,
          offset: req.offset + collections.length,
        });
        await stream.forEach(({ collection }) => {
          if (!collection) {
            return;
          }
          setCollections((collections) => [...collections, collection]);
        });
      } catch (err) {
        console.warn("failed to fetch collections:", err);
      }
      fetchRef.current = false;
    },
    [req, collections]
  );

  useEffect(() => {
    fetchMore(0);
  }, []);

  return [collections, fetchMore];
};

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
