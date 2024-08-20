import React, { useCallback } from "react";

import {
  Collection,
  CollectionsRequest,
} from "../../api/marketplace/v1/marketplace";
import { useCollections } from "../../hooks/useCollections";
import { CollectionView } from "../CollectionView";
import { Section } from "../Section";
import { GridList } from "../layout/GridList";

export const CollectionGallery: React.FC<{
  title?: string;
  linkToMint?: boolean;
  req: CollectionsRequest;
  filter?: (c: Collection) => boolean;
}> = ({ title, req, linkToMint, filter }) => {
  const { collections, fetchNextPage } = useCollections(req, filter);

  const handleEndReached = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  return collections.length > 0 ? (
    <Section title={title}>
      <GridList<Collection>
        data={collections}
        minElemWidth={250}
        keyExtractor={(item) => item.id}
        onEndReached={handleEndReached}
        noFixedHeight
        renderItem={(props, width) => (
          <CollectionView
            item={props.item}
            linkToMint={linkToMint}
            mintState={req.mintState}
            width={width}
          />
        )}
      />
    </Section>
  ) : null;
};
