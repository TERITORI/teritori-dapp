import React from "react";
import { FlatList, View } from "react-native";

import {
  Collection,
  NFT,
  Sort,
  SortDirection,
} from "../../../../api/marketplace/v1/marketplace";
import { OmniLink } from "../../../../components/OmniLink";
import { SVGorImageIcon } from "../../../../components/SVG/SVGorImageIcon";
import { RoundedGradientImage } from "../../../../components/images/RoundedGradientImage";
import { Separator } from "../../../../components/separators/Separator";
import { SpacerColumn, SpacerRow } from "../../../../components/spacer";
import { useNFTs } from "../../../../hooks/useNFTs";
import { web3ToWeb2URI } from "../../../../utils/ipfs";
import { primaryColor, withAlpha } from "../../../../utils/style/colors";
import { fontSemibold14 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { randomGradients } from "../../Notifications/notificationData";
import Accordion from "../../components/Accordion/Accordion";
import GradientBox from "../../components/GradientBox";
import ListView from "../../components/ListView";

export const NFTAccordion: React.FC<{
  index: number;
  ownerId: string;
  collection: Collection;
}> = ({ index, ownerId, collection }) => {
  const { nfts } = useNFTs({
    offset: 0,
    limit: 100, // FIXME: pagination
    ownerId,
    collectionId: collection.id,
    sort: Sort.SORT_PRICE,
    sortDirection: SortDirection.SORT_DIRECTION_ASCENDING,
    attributes: [],
    isListed: false,
    priceRange: undefined,
  });
  if (!nfts.length) return null;
  return (
    <>
      <SpacerColumn size={index === 0 ? 1 : 1.5} />
      <Accordion initialValue={index === 0}>
        <Accordion.Header
          iconSize={16}
          children={
            <AccordionTrigger
              label={nfts[0].collectionName}
              image={collection.imageUri}
              subLabel={`${nfts.length} ${nfts.length === 1 ? "NFT" : "NFTs"}`}
            />
          }
        />
        <Accordion.Content
          height={190}
          children={<AccordionContent nfts={nfts} />}
        />
      </Accordion>
      <SpacerColumn size={1.5} />
      <Separator />
    </>
  );
};

const AccordionTrigger: React.FC<{
  label: string;
  subLabel: string;
  image: string;
}> = ({ label, subLabel, image }) => {
  return (
    <ListView
      style={{ paddingVertical: 0 }}
      options={{
        leftIconEnabled: true,
        leftLabel: label,
        leftLabelStyle: [fontSemibold14, { color: "#fff", marginLeft: 6 }],
        rightLabel: subLabel,
        rightLabelStyle: [fontSemibold14, { marginRight: 6 }],
        leftIconOptions: {
          component: (
            <RoundedGradientImage
              size="XS"
              sourceURI={image}
              style={{
                margin: layout.spacing_x1,
              }}
            />
          ),
        },
        iconEnabled: false,
      }}
    />
  );
};

const AccordionContent: React.FC<{ nfts: NFT[] }> = ({ nfts }) => {
  return (
    <>
      <SpacerColumn size={1.5} />
      <FlatList
        style={{ height: 174, flexGrow: 0 }}
        ItemSeparatorComponent={() => <SpacerRow size={1.5} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={nfts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NFTCard key={item.id} nft={item} />}
      />
    </>
  );
};

const NFTCard: React.FC<{ nft: NFT }> = ({ nft }) => {
  const randomIndex = Math.floor(Math.random() * 4);

  return (
    <OmniLink
      to={{
        screen: "NFTDetail",
        params: { id: nft.id },
      }}
    >
      <View
        style={{
          height: 174,
          width: 174,
          borderRadius: 14,
          backgroundColor: primaryColor,
          position: "relative",
        }}
      >
        <View
          style={{
            backgroundColor: withAlpha("#ffffff", 0.1),
            position: "absolute",
            right: 4,
            top: 4,
            width: 24,
            height: 24,
            borderRadius: 12,
            zIndex: 999,
          }}
        />
        {nft.imageUri ? (
          <SVGorImageIcon
            icon={web3ToWeb2URI(nft.imageUri)}
            iconSize={174}
            style={{ borderRadius: 14 }}
          />
        ) : (
          <GradientBox
            colors={randomGradients[randomIndex].colors}
            direction={randomGradients[randomIndex].direction}
            size={174}
            radius={14}
            style={{ flex: 1 }}
          />
        )}
      </View>
    </OmniLink>
  );
};
