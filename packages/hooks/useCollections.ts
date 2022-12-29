import { useState, useCallback, useEffect, useRef } from "react";

import {
  Collection,
  CollectionsRequest,
} from "../api/marketplace/v1/marketplace";
import { backendClient } from "../utils/backend";

export const useCollections = (
  req: CollectionsRequest
): [Collection[], (index: number) => Promise<void>] => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const fetchRef = useRef(false);

  const fetchMore = useCallback(
    async (index: number, init: boolean = false) => {
      const currentCollection = init ? [] : collections;
      init && setCollections([]);

      try {
        if (!(index + req.limit >= currentCollection.length)) {
          return;
        }
        if (fetchRef.current) {
          return;
        }
        fetchRef.current = true;
        const stream = backendClient.Collections({
          ...req,
          offset: req.offset + currentCollection.length,
        });

        const fetchedCollections: Collection[] = [];
        await stream.forEach(({ collection }) => {
          collection && fetchedCollections.push(collection);
        });

        setCollections([...currentCollection, ...fetchedCollections]);
      } catch (err) {
        console.warn("failed to fetch collections:", err);
      }
      fetchRef.current = false;
    },
    [req, collections]
  );

  useEffect(() => {
    // Reset the collections then changing network
    fetchMore(0, true);
  }, [req.networkId]);

  return [collections, fetchMore];
};
