import React from "react";
import { View } from "react-native";

import { HubIntro } from "../../components/HubIntro";
import { NFTView } from "../../components/NFTView";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Section } from "../../components/Section";
import { useSolanaOwnedNFTs } from "../../context/SolanaOwnedNFTsProvider";
import { NFTData } from "../../utils/nft";

const gridHalfGutter = 12;

export const MyCollectionScreen: React.FC = () => {
  const { solanaNFTs } = useSolanaOwnedNFTs();
  const byCollection = solanaNFTs.reduce((byCollection, nft) => {
    if (!byCollection[nft.collectionName]) {
      byCollection[nft.collectionName] = [];
    }
    byCollection[nft.collectionName].push(nft);
    return byCollection;
  }, {} as { [key: string]: NFTData[] });
  return (
    <ScreenContainer>
      <HubIntro hubPage="MyCollection" />
      <View style={{ marginHorizontal: 24 }}>
        {Object.entries(byCollection).map(([key, nfts]) => (
          <Section title={`${key} Collection`} key={key}>
            <View
              style={{
                margin: -gridHalfGutter,
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {nfts.map((nft) => {
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
