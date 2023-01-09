import { useState, useCallback, useEffect, useRef } from "react";

import {
  Collection,
  CollectionsRequest,
} from "../api/marketplace/v1/marketplace";
import { useBackendClient } from "./useBackendClient";

export const useCollections = (
  req: CollectionsRequest
): [Collection[], (index: number) => Promise<void>] => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const fetchRef = useRef(false);
  const { backendClient, isForceBackendMainnet } = useBackendClient();

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
    [req, collections, isForceBackendMainnet()]
  );

  useEffect(() => {
    fetchMore(0);
  }, []);

  return [collections, fetchMore];
};
