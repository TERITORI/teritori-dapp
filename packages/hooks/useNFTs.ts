import { useCallback, useEffect, useState } from "react";

import { NFTsRequest, NFT } from "../api/marketplace/v1/marketplace";
import { backendClient } from "../utils/backend";

export const useNFTs = (req: NFTsRequest) => {
  const [nfts, setNFTs] = useState<NFT[]>([]);
  const [firstLoading, setFirstLoading] = useState(false);
  const [isFirstLoadDone, setIsFirstLoadDone] = useState(false);

  const fetchMore = useCallback(async () => {
    if (!isFirstLoadDone) setFirstLoading(true);
    try {
      const offsetReq = {
        ...req,
        offset: req.offset + nfts.length,
      };
      const stream = backendClient.NFTs(offsetReq);

      let newNFTS: NFT[] = [];
      await stream.forEach((response) => {
        if (!response.nft) {
          return;
        }
        newNFTS = [...newNFTS, response.nft];
      });

      setNFTs((collec) => [...collec, ...newNFTS]);
    } catch (err) {
      console.warn("failed to fetch collection nfts:", err);
    }
    if (!isFirstLoadDone) {
      setFirstLoading(false);
      setIsFirstLoadDone(true);
    }
  }, [req, nfts]);

  useEffect(() => {
    setNFTs([]);
    fetchMore();
  }, [req.collectionId, req.ownerId]);

  return { nfts, fetchMore, firstLoading };
};
