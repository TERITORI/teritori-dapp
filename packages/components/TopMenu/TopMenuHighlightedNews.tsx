import React, { useEffect, useRef } from "react";
import { TouchableOpacity, View } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

import { TopMenuSection } from "./TopMenuSection";
import chevronLeftSVG from "../../../assets/icons/chevron-left.svg";
import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { FullWidthSeparator } from "../FullWidthSeparator";
import { SVG } from "../SVG";
import { Section } from "../Section";
import { NewsBox } from "../hub/NewsBox";

import { News } from "@/api/marketplace/v1/marketplace";
import { useNews } from "@/hooks/marketing/useNews";
import { fontSemibold10, fontSemibold14 } from "@/utils/style/fonts";

export const SmallNewsCarouselSection: React.FC = () => {
  const width = 298;
  const carouselRef = useRef<ICarouselInstance | null>(null);
  const renderItem = (props: { item: News }) => (
    <NewsBox
      news={props.item}
      imageHeight={210}
      imageWidth={210}
      titleTextStyle={fontSemibold14}
      subtitleTextStyle={fontSemibold10}
      boxWidth={298}
    />
  );
  const networkId = useSelectedNetworkId();
  const news = useNews(networkId);

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

  return (
    <Section topRightChild={topRightChild}>
      {/*TODO: Async fetchMore for these data ?*/}

      <Carousel
        width={width}
        data={news || []}
        ref={carouselRef}
        onConfigurePanGesture={(g) => g.enableTrackpadTwoFingerGesture(true)}
        height={650}
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

export const TopMenuHighlightedNews: React.FC = () => {
  return (
    <TopMenuSection title="Highlighted News">
      <SmallNewsCarouselSection />
    </TopMenuSection>
  );
};
