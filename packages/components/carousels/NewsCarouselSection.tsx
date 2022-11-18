import React, { useEffect, useRef } from "react";
import { View, TouchableOpacity, Linking } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

import defaultGraphPNG from "../../../assets/default-images/default-graph-nft.png";
import defaultGuardianPNG from "../../../assets/default-images/default-guardian-nft.png";
import defaultToripunkPNG from "../../../assets/default-images/default-toripunk-nft.png";
import chevronLeftSVG from "../../../assets/icons/chevron-left.svg";
import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import tnsPNG from "../../../assets/logos/teritori-name-service.png";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { useNavigateToCollection } from "../../hooks/useNavigateToCollection";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { useAppNavigation } from "../../utils/navigation";
import { FullWidthSeparator } from "../FullWidthSeparator";
import { SVG } from "../SVG";
import { Section } from "../Section";
import { News, NewsBox } from "../hub/NewsBox";

export const NewsCarouselSection: React.FC = () => {
  const { width } = useMaxResolution();
  const navigation = useAppNavigation();
  const carouselRef = useRef<ICarouselInstance | null>(null);
  const renderItem = (props: { item: News }) => <NewsBox news={props.item} />;

  const gorillaNavigate = useNavigateToCollection(
    "tori-tori1999u8suptza3rtxwk7lspve02m406xe7l622erg3np3aq05gawxsrh9g0p"
  );
  const succubiNavigate = useNavigateToCollection(
    "tori-tori1x22q8lfhz7qcvtzs0dakhgx2th64l79kepjujhhxk5x804taeqlqmhm4sz"
  );

  const fakeNews: News[] = [
    {
      title: "JOIN THE YIELDRILLAS PARK",
      subtitle: "Yield finds a way",
      text:
        "The first non-GATA series from GATA DAO, Yield gorilla is the first collection of the yield series. \n" +
        "\n" +
        "10K fun primates are coming your way to give you back the rewards periodically.\n" +
        "\n" +
        "Find the rare one.",
      image:
        "https://bafybeihiumjqixnq5uzy3xaofryt76zf7n2vlbl7rrm27h6mc6b6qqpdmi.ipfs.nftstorage.link/collection-image.png",
      button1Label: "Join",
      button2Label: "Discover",
      button1Action: gorillaNavigate,
      button2Action: () => {
        Linking.openURL(
          "https://medium.com/gatadao/yield-gorilla-minting-rarities-67f03bd395b2"
        );
      },
    },
    {
      title: "ARE YOU READY FOR THE SUCCUBI?",
      subtitle:
        "An original collection from the Sunnyside Reapers featuring stunning new art: exclusively on Teritori",
      text:
        "These 666 succubi are here to bring a world of pleasure to Teritori. \n" +
        "\n" +
        "The price they demand? It’s only your soul. You’ll give it to them, right?",
      image: ipfsURLToHTTPURL(
        "ipfs://bafybeig2gr2ykukmglkxnvdsu7nwumezrwfr53o45t2kpvnhfohi7dpimq"
      ),
      button1Label: "Join",
      button2Label: "Discover",
      button1Action: succubiNavigate,
      button2Action: () => {
        Linking.openURL(
          "https://medium.com/@SunnysideReapers/sweet-succubi-launch-faq-5861e87f4dd2"
        );
      },
    },
    {
      title: "JOIN THE R!OT",
      subtitle: "Discover the first NFT project on Teritori",
      text:
        "The R!ot is the first NFT project on Teritori Network. This collection tells the story of the members of The R!ot battling The Legion Club through a complete lore and P2E mechanics.\n" +
        "\n" +
        "In addition to this, this collection is closely linked to the Teritori Hub and grants its holders the possibility to access Teritori features in early access.",
      image: defaultGuardianPNG,
      button1Label: "Marketplace",
      button2Label: "Discover",
      button1Action: () => {
        navigation.navigate("Collection", {
          id: "tori-tori1mf6ptkssddfmxvhdx0ech0k03ktp6kf9yk59renau2gvht3nq2gqg87tkw",
        });
      },
      button2Action: () => {
        Linking.openURL("https://theriot.io/");
      },
    },
    {
      title: "NEW PLANET, NEW RULES, NEW WAYS",
      subtitle: "Introducing the ToriPunks",
      text:
        "The ToriPunks are invading Teritori and the least we can say is that they did not come empty-handed.\n" +
        "\n" +
        "If you like to play games & earn rewards, you’re at the right place. Mint is coming soon on the launchpad.",
      image: defaultToripunkPNG,
      button1Label: "Marketplace",
      button2Label: "Discover",
      button1Action: () => {
        navigation.navigate("Collection", {
          id: "tori-tori1plr28ztj64a47a32lw7tdae8vluzm2lm7nqk364r4ws50rgwyzgsapzezt",
        });
      },
      button2Action: () => {
        Linking.openURL("https://twitter.com/ToriPunks");
      },
    },
    {
      title: "BOOK YOUR HANDLE",
      subtitle: "Check out Teritori Name Service",
      text:
        "Teritori Name Service is a way for you to affirm your identity as a Teritorian. TNS are NFTs that can be used throughout the Teritori dApp and of course you can also sell them on the Marketplace.\n" +
        "\n" +
        "More Name Services will be added to TNS over time so stay on the lookout for the next updates.",
      image: tnsPNG,
      button1Label: "Teritori Name Service",
      button1Action: () => {
        navigation.navigate("TNSHome");
      },
    },
    {
      title: "LEAVE YOUR MARK ON THE DAPP",
      subtitle: "Participate in the rioters’ footer Graff Contest",
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
      button1Action: () => {
        Linking.openURL("https://airtable.com/shrmFENSAEvW7b5qt");
      },
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
