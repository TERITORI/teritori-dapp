import { useCallback, useEffect, useState } from "react";

import { CollectionNFTsRequest, NFT } from "../api/marketplace/v1/marketplace";
import { backendClient } from "../utils/backend";

export const useCollectionNFTs = (req: CollectionNFTsRequest) => {
  const [nfts, setNFTs] = useState<NFT[]>([]);
  const [firstLoading, setFirstLoading] = useState(false);
  const [isFirstLoadDone, setIsFetFirstLoad] = useState(false);

  const fetchMore = useCallback(async () => {
    if (!isFirstLoadDone) setFirstLoading(true);
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

      if (!isFirstLoadDone) {
        setFirstLoading(false);
        setIsFetFirstLoad(true);
      }
    } catch (err) {
      console.warn("failed to fetch collection nfts:", err);

      if (!isFirstLoadDone) {
        setFirstLoading(false);
        setIsFetFirstLoad(true);
      }
    }
  }, [req, nfts]);

  useEffect(() => {
    setNFTs([]);
    fetchMore();
  }, [req.id]);

  return { nfts, fetchMore, firstLoading };
};
