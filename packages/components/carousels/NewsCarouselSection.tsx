import React, { useEffect, useRef } from "react";
import { View, TouchableOpacity } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

import chevronLeftSVG from "../../../assets/icons/chevron-left.svg";
import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import { News } from "../../api/marketplace/v1/marketplace";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { FullWidthSeparator } from "../FullWidthSeparator";
import { SVG } from "../SVG";
import { Section } from "../Section";
import { NewsBox } from "../hub/NewsBox";

import { useNews } from "@/hooks/marketing/useNews";

export const NewsCarouselSection: React.FC = () => {
  const { width } = useMaxResolution();
  const carouselRef = useRef<ICarouselInstance | null>(null);
  const renderItem = (props: { item: News }) => <NewsBox news={props.item} />;
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
    <Section title="Highlighted News" topRightChild={topRightChild}>
      <FullWidthSeparator />
      {/*TODO: Async fetchMore for these data ?*/}

      <Carousel
        width={width}
        data={news || []}
        ref={carouselRef}
        onConfigurePanGesture={(g) => g.enableTrackpadTwoFingerGesture(true)}
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
