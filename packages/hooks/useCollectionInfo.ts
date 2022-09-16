import {useCallback, useState} from "react"
import {getNonSigningCosmWasmClient} from "../utils/keplr"
import {TeritoriNftMinterQueryClient} from "../contracts-clients/teritori-nft-minter/TeritoriNftMinter.client"
import {TeritoriNftQueryClient} from "../contracts-clients/teritori-nft/TeritoriNft.client"
import {ipfsURLToHTTPURL} from "../utils/ipfs"
import {prettyPrice} from "../utils/coins"
import {useFocusEffect} from "@react-navigation/native"

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
  whitelistSize?: string;
  isInPresalePeriod?: boolean;
  isMintable?: boolean;
  publicSaleEnded?: boolean;
}

export const useCollectionInfo = (id: string) => {
  const [info, setInfo] = useState<CollectionInfo>({});
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(() => {
    let canceled = false;
    const effect = async () => {
      setLoading(true);
      try {
        const cosmwasm = await getNonSigningCosmWasmClient();

        const minterClient = new TeritoriNftMinterQueryClient(cosmwasm, id);
        const conf = await minterClient.config();

        const nftClient = new TeritoriNftQueryClient(cosmwasm, conf.nft_addr);
        const nftInfo = await nftClient.contractInfo();

        const baseURI = ipfsURLToHTTPURL(conf.nft_base_uri);
        const metadataURI = baseURI + "collection.json";
        const metadataReply = await fetch(metadataURI);
        const metadata = await metadataReply.json();

        const secondsSinceEpoch = Date.now() / 1000;

        const whitelistEnd = conf.mint_start_time + conf.whitelist_mint_period;
        const hasWhitelistPeriod = !!conf.whitelist_mint_period;
        const publicSaleEnded = conf.minted_amount === conf.nft_max_supply;

        const info: CollectionInfo = {
          name: nftInfo.name,
          image: ipfsURLToHTTPURL(metadata.image),
          description: metadata.description,
          prettyUnitPrice: prettyPrice(conf.nft_price_amount, conf.price_denom),
          unitPrice: conf.nft_price_amount,
          priceDenom: conf.price_denom,
          maxSupply: conf.nft_max_supply,
          mintedAmount: conf.minted_amount,
          discord: metadata.discord,
          twitter: metadata.twitter,
          website: metadata.website,
          maxPerAddress: conf.mint_max || undefined,
          whitelistMaxPerAddress: conf.whitelist_mint_max || undefined,
          whitelistSize: conf.whitelisted_size,
          hasPresale: hasWhitelistPeriod,
          publicSaleEnded,
          isMintable: !publicSaleEnded && conf.is_mintable,
          isInPresalePeriod:
            hasWhitelistPeriod &&
            conf.mint_start_time !== 0 &&
            secondsSinceEpoch >= conf.mint_start_time &&
            secondsSinceEpoch < whitelistEnd,
        };

        if (canceled) {
          return;
        }
        setInfo(info);
        setNotFound(false);
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (!(err instanceof Error)) {
          return;
        }
        console.log('1111111111111111111111111111111111111111111111111')
        setNotFound(true);
        setLoading(false);
      }
    };
    effect();
    return () => {
      canceled = true;
    };
  }, [id]);
  useFocusEffect(refresh);

  return { info, notFound, loading };
};
