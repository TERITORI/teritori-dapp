import { useQuery } from "@tanstack/react-query";

import { TeritoriBunkerMinterQueryClient } from "../contracts-clients/teritori-bunker-minter/TeritoriBunkerMinter.client";
import { TeritoriNftQueryClient } from "../contracts-clients/teritori-nft/TeritoriNft.client";
import { prettyPrice } from "../utils/coins";
import { ipfsURLToHTTPURL } from "../utils/ipfs";
import { getNonSigningCosmWasmClient } from "../utils/keplr";

export interface CollectionInfo {
  image?: string;
  description?: string;
  prettyUnitPrice?: string;
  unitPrice?: string;
  priceDenom?: string;
  maxSupply?: string;
  mintedAmount?: string;
  name?: string;
  discord?: string;
  twitter?: string;
  website?: string;
  maxPerAddress?: string;
  hasPresale?: boolean;
  whitelistMaxPerAddress?: string;
  whitelistSize?: number;
  isInPresalePeriod?: boolean;
  isMintable?: boolean;
  publicSaleEnded?: boolean;
  bannerImage?: string;
  mintStarted?: boolean;
  publicSaleStartTime?: number; // seconds since epoch
}

// NOTE: consider using the indexer for this

export const useCollectionInfo = (id: string) => {
  const { data, error, refetch } = useQuery(
    ["collectionInfo", id],
    async (): Promise<CollectionInfo> => {
      const mintAddress = id.startsWith("tori-") ? id.substring(5) : id;
      if (mintAddress === process.env.TERITORI_NAME_SERVICE_CONTRACT_ADDRESS) {
        return {
          name: "Teritori Name Service", // FIXME: should fetch from contract or be in env
          image: ipfsURLToHTTPURL(
            process.env.TERITORI_NAME_SERVICE_DEFAULT_IMAGE_URL || ""
          ),
        };
      }
      const cosmwasm = await getNonSigningCosmWasmClient();

      const minterClient = new TeritoriBunkerMinterQueryClient(
        cosmwasm,
        mintAddress
      );
      const conf = await minterClient.config();

      const nftClient = new TeritoriNftQueryClient(cosmwasm, conf.nft_addr);
      const nftInfo = await nftClient.contractInfo();

      const metadataURL = ipfsURLToHTTPURL(conf.nft_base_uri);
      const metadataReply = await fetch(metadataURL);

      const metadata = await metadataReply.json();

      const secondsSinceEpoch = Date.now() / 1000;

      const mintedAmount = await minterClient.currentSupply();

      const whitelistEnd = conf.mint_start_time + conf.whitelist_mint_period;
      const hasWhitelistPeriod = !!conf.whitelist_mint_period;
      const publicSaleEnded = mintedAmount === conf.nft_max_supply;

      const whitelistSize = await minterClient.whitelistSize();

      const info: CollectionInfo = {
        name: nftInfo.name,
        image: ipfsURLToHTTPURL(metadata.image || ""),
        description: metadata.description,
        prettyUnitPrice: prettyPrice(
          process.env.TERITORI_NETWORK_ID || "",
          conf.nft_price_amount,
          conf.price_denom
        ),
        unitPrice: conf.nft_price_amount,
        priceDenom: conf.price_denom,
        maxSupply: conf.nft_max_supply,
        mintStarted: conf.mint_start_time !== 0,
        mintedAmount,
        discord: metadata.discord,
        twitter: metadata.twitter,
        website: metadata.website,
        maxPerAddress: conf.mint_max || undefined,
        whitelistMaxPerAddress: conf.whitelist_mint_max || undefined,
        whitelistSize,
        hasPresale: hasWhitelistPeriod,
        publicSaleEnded,
        isMintable: !publicSaleEnded && conf.is_mintable,
        isInPresalePeriod:
          hasWhitelistPeriod &&
          conf.mint_start_time !== 0 &&
          secondsSinceEpoch >= conf.mint_start_time &&
          secondsSinceEpoch < whitelistEnd,
        publicSaleStartTime: whitelistEnd,
        bannerImage: ipfsURLToHTTPURL(metadata.banner),
      };

      return info;
    },
    { refetchInterval: 5000 }
  );

  return { info: data, notFound: !!error, refetchCollectionInfo: refetch };
};
