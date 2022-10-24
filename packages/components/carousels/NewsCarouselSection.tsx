import React, { useEffect, useRef } from "react";
import {View, TouchableOpacity, Linking} from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

import chevronLeftSVG from "../../../assets/icons/chevron-left.svg";
import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { FullWidthSeparator } from "../FullWidthSeparator";
import { SVG } from "../SVG";
import { Section } from "../Section";
import { News, NewsBox } from "../hub/NewsBox";
import defaultGraphPNG from "../../../assets/default-images/default-graph-nft.png";
import defaultGuardianPNG from "../../../assets/default-images/default-guardian-nft.png";
import defaultToripunkPNG from "../../../assets/default-images/default-toripunk-nft.png";
import tnsPNG from "../../../assets/logos/tertiroti-name-service.png";
import {useAppNavigation} from "../../utils/navigation";

export const NewsCarouselSection: React.FC = () => {
  const { width } = useMaxResolution();
  const navigation = useAppNavigation();
  const carouselRef = useRef<ICarouselInstance | null>(null);
  const renderItem = (props: { item: News }) => <NewsBox news={props.item} />;

  const fakeNews: News[] = [
    {
      title: "JOIN THE R!OT \n Discover the first NFT project on Teritori",
      text:
        "The R!ot is the first NFT project on Teritori Network. This collection tells the story of the members of The R!ot battling The Legion Club through a complete lore and P2E mechanics. \n" +
        "\n" +
        "In addition to this, this collection is closely linked to the Teritori Hub and grants its holders the possibility to access Teritori features in early access.",
      image: defaultGuardianPNG,
      button1Label: "Join the Mint",
      button2Label: "Discover",
      button1Action: () => {navigation.navigate("MintCollection", {id: "tori-tori1m2jqvrk92e4tkxuax8z252mxd0etjz8yrcaqp0npj2u6emx9ltmszz6067"})},
      button2Action: () => {Linking.openURL(" https://theriot.io/")},
    },
    {
      title: "BOOK YOUR HANDLE\nCheck out Teritori Name Service",
      text:
        "Teritori Name Service is a way for you to affirm your identity as a Teritorian. TNS are NFTs that can be used throughout the Teritori dApp and of course you can also sell them on the Marketplace.\n" +
        "\n" +
        "More Name Services will be added to TNS over time so stay on the lookout for the next updates.",
      image: tnsPNG,
      button1Label: "Teritori Name Service",
      button1Action: () => {Linking.openURL("/tns")},
    },
    {
      title: "NEW PLANET, NEW RULES, NEW WAYS\nIntroducing the ToriPunks",
      text:
        "The ToriPunks are invading Teritori and the least we can say is that they did not come empty-handed.\n" +
        "\n" +
        "If you like to play games & earn rewards, you’re at the right place. Mint is coming soon on the launchpad.",
      image: defaultToripunkPNG,
      button1Label: "Discover",
      button1Action: () => {Linking.openURL("https://twitter.com/ToriPunks")}
    },
    {
      title:
        "LEAVE YOUR MARK ON THE DAPP\n" +
        "Participate in the rioters’ footer Graff Contest",
      text:
        "We're hosting a contest for you to design your own graff/artwork so we can create a special community  NFT collection with your creations.\n" +
        "\n" +
        "The contest will last until the collection is complete.\n" +
        "\n" +
        "Players whose creation is selected will earn:\n" +
        "- An XP bonus for Game of Teritori Season 2.\n" +
        "- Earn freemints on this community NFT collection.",
      image: defaultGraphPNG,
      button1Label: "Submit your artwork",
      button1Action: () => {Linking.openURL("https://airtable.com/shrmFENSAEvW7b5qt")},
    },
  ];

  const topRightChild = (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <TouchableOpacity
        onPress={() => carouselRef.current?.prev()}
        style={{ marginRight: 24 }}
      >
        <SVG width={16} height={16} source={chevronLeftSVG} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => carouselRef.current?.next()}>
        <SVG width={16} height={16} source={chevronRightSVG} />
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    carouselRef.current?.next();
  }, [width]);

  // returns
  return (
    <Section title="Highlighted News" topRightChild={topRightChild}>
      <FullWidthSeparator />
      {/*TODO: Async fetchMore for these data ?*/}

      <Carousel
        width={width}
        data={fakeNews}
        ref={carouselRef}
        panGestureHandlerProps={{ enableTrackpadTwoFingerGesture: true }}
        height={382}
        pagingEnabled
        loop
        autoPlay
        autoPlayInterval={3000}
        renderItem={renderItem}
      />
      <FullWidthSeparator />
    </Section>
  );
};
