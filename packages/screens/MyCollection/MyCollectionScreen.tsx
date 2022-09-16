import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { NFTView } from "../../components/NFTView";
import { NetworkIcon } from "../../components/images/NetworkIcon";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Section } from "../../components/Section";
import { HubIntro } from "../../components/hub/HubIntro";
import { useSolanaOwnedNFTs } from "../../context/SolanaOwnedNFTsProvider";
import { useWallets } from "../../context/WalletsProvider";
import { TeritoriNftQueryClient } from "../../contracts-clients/teritori-nft/TeritoriNft.client";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { getNonSigningCosmWasmClient } from "../../utils/keplr";
import { ScreenFC } from "../../utils/navigation";
import { Network } from "../../utils/network";
import { neutral77 } from "../../utils/style/colors";
import { fontMedium13 } from "../../utils/style/fonts";
import { NFTData } from "../../utils/types/nft";

const gridHalfGutter = 12;

const nftContractCodeID = 6;

/*
NOTE: this whole thing need to be rewritten using indexers and better data organisation
*/

export const MyCollectionScreen: ScreenFC<"MyCollection"> = () => {
  const teritoriNFTs = useTeritoriOwnedNFTs();
  const { solanaNFTs } = useSolanaOwnedNFTs();

  // FIXME: don't rely on the first nft being properly formatted
  const byCollection = [...teritoriNFTs, ...solanaNFTs].reduce(
    (byCollection, nft) => {
      if (!nft.network) {
        return byCollection;
      }
      if (!byCollection[nft.collectionId]) {
        byCollection[nft.collectionId] = {
          collectionName: nft.collectionName,
          collectionDiscriminator: nft.collectionDiscriminator,
          network: nft.network,
          nfts: [],
        };
      }
      byCollection[nft.collectionId].nfts.push(nft);
      return byCollection;
    },
    {} as {
      [key: string]: {
        collectionName: string;
        collectionDiscriminator: string;
        network: Network;
        nfts: NFTData[];
      };
    }
  );

  return (
    <ScreenContainer>
      <HubIntro />
      <View style={{ marginHorizontal: 24 }}>
        {!Object.keys(byCollection).length && (
          <ActivityIndicator size="large" style={{ marginBottom: 72 }} />
        )}
        {Object.entries(byCollection).map(([key, collection]) => (
          <Section
            title={`${collection.collectionName} Collection`}
            key={key}
            topRightChild={
              <>
                <BrandText
                  style={[fontMedium13, { color: neutral77, marginRight: 10 }]}
                >
                  {collection.collectionDiscriminator}
                </BrandText>
                <NetworkIcon network={collection.network} />
              </>
            }
          >
            <View
              style={{
                margin: -gridHalfGutter,
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {collection.nfts.map((nft) => {
                return (
                  <NFTView
                    key={nft.id}
                    data={nft}
                    style={{ margin: gridHalfGutter }}
                  />
                );
              })}
            </View>
          </Section>
        ))}
      </View>
    </ScreenContainer>
  );
};

const useTeritoriOwnedNFTs = () => {
  const { wallets } = useWallets();
  const [teritoriNFTs, setTeritoriNFTs] = useState<NFTData[]>([]);
  const refresh = useCallback(() => {
    const effect = async () => {
      const teritoriWallets = wallets.filter(
        (wallet) => wallet.network === Network.Teritori && wallet.publicKey
      );
      const cosmwasmClient = await getNonSigningCosmWasmClient();

      // FIXME: this does not scale at all, we have to query every collection on the network
      const contracts = [
        ...(await cosmwasmClient.getContracts(nftContractCodeID)),
      ].reverse();
      for (const contract of contracts) {
        try {
          const nftClient = new TeritoriNftQueryClient(
            cosmwasmClient,
            contract
          );

          const collectionInfo = await nftClient.contractInfo();

          const myTokens: string[] = [];

          for (const wallet of teritoriWallets) {
            const nfts = await nftClient.tokens({ owner: wallet.publicKey });
            if (!nfts.tokens.length) {
              continue;
            }
            myTokens.push(...nfts.tokens);
          }

          for (const tokenId of myTokens) {
            const info = await nftClient.nftInfo({ tokenId });
            if (!info.token_uri) {
              console.error("token has no uri");
              continue;
            }
            const gatewayURI = ipfsURLToHTTPURL(info.token_uri);
            const metadataReply = await fetch(gatewayURI);
            const metadata = await metadataReply.json();
            setTeritoriNFTs((nfts) => {
              return [
                ...nfts,
                {
                  id: `tori-${contract}-${tokenId}`,
                  collectionId: `tori-${contract}`,
                  name: metadata.name,
                  imageURI: ipfsURLToHTTPURL(metadata.image),
                  network: Network.Teritori,
                  owned: true,
                  collectionName: collectionInfo.name,
                  collectionDiscriminator: contract.substring(5, 12),
                  isCertified: true,
                  floorPrice: "",
                  favoritesCount: 0,
                },
              ];
            });
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    effect();
  }, []);
  useFocusEffect(refresh);
  return teritoriNFTs;
};
