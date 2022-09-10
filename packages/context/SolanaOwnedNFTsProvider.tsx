import { JsonMetadata } from "@metaplex-foundation/js-next";
import React, { createContext, useContext, useEffect, useState } from "react";

import { Network } from "../utils/network";
import { getSolanaOwnedNFTS } from "../utils/solana";
import { NFTData } from "../utils/types/nft";
import { useWallets } from "./WalletsProvider";

// this needs to be rewritten

interface SolanaOwnedNFTsValue {
  solanaNFTs: NFTData[];
}

const initialValue: SolanaOwnedNFTsValue = {
  solanaNFTs: [],
};

const solanaOwnedNFTsContext = createContext(initialValue);

export const SolanaOwnedNFTsProvider: React.FC = ({ children }) => {
  const [value, setValue] = useState(initialValue);
  const { wallets, ready } = useWallets();

  useEffect(() => {
    let cancelled = false;
    const effect = async () => {
      if (!ready) {
        return;
      }
      const solanaWallets = wallets.filter(
        (wallet) => wallet.network === Network.Solana && wallet.publicKey
      );
      const walletsNFTs = await Promise.all(
        solanaWallets.map((wallet) => getSolanaOwnedNFTS(wallet.publicKey))
      );
      const nfts = walletsNFTs.reduce((allNFTs, walletNFTs) => {
        allNFTs.push(...walletNFTs);
        return allNFTs;
      }, []);
      if (cancelled) {
        return;
      }
      const nftsData = (
        await Promise.all(
          nfts.map(async (nft) => {
            // TODO: fetch certified collection name
            try {
              const response = await fetch(nft.uri);
              const meta: JsonMetadata = await response.json();
              const data: NFTData = {
                name: nft.name,
                collectionName: meta.collection.name,
                collectionId: `sol-${nft.collection.key}`,
                collectionDiscriminator: nft.collection.key
                  .toString()
                  .substring(0, 7),
                network: Network.Solana,
                floorPrice: "4.75 SOL",
                isCertified: !!nft.collection,
                favoritesCount: 175,
                owned: true,
                imageURI: meta.image,
                id: `Solana-${nft.mint.toBase58()}`,
              };
              return data;
            } catch (err) {
              console.warn("failed to fetch nft metadata:", err);
              return undefined;
            }
          })
        )
      ).filter((data) => !!data);
      if (cancelled) {
        return;
      }
      setValue({ solanaNFTs: nftsData });
      console.log("refreshed solana owned nfts", nfts);
    };
    effect();
    return () => {
      cancelled = true;
    };
  }, [wallets, ready]);

  return (
    <solanaOwnedNFTsContext.Provider value={value}>
      {children}
    </solanaOwnedNFTsContext.Provider>
  );
};

export const useSolanaOwnedNFTs = () => useContext(solanaOwnedNFTsContext);
