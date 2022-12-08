import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { View, TouchableOpacity } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { useSelector } from "react-redux";

import chevronLeftSVG from "../../../assets/icons/chevron-left.svg";
import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import { News } from "../../api/marketplace/v1/marketplace";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { selectSelectedNetworkId } from "../../store/slices/settings";
import { backendClient } from "../../utils/backend";
import { FullWidthSeparator } from "../FullWidthSeparator";
import { SVG } from "../SVG";
import { Section } from "../Section";
import { NewsBox } from "../hub/NewsBox";

export const NewsCarouselSection: React.FC = () => {
  const { width } = useMaxResolution();
  const carouselRef = useRef<ICarouselInstance | null>(null);
  const selectedNetworkId = useSelector(selectSelectedNetworkId);
  const renderItem = (props: { item: News }) => <NewsBox news={props.item} />;
  const news = useNews(selectedNetworkId === "teritori-testnet");

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
        data={news || []}
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

//TODO: networkId instead of testnet. ==> Wait for backend modif
const useNews = (testnet: boolean) => {
  const { data } = useQuery(
    ["news", testnet],
    async () => {
      const { news } = await backendClient.News({ testnet });
      return news;
    },
    {
      staleTime: Infinity,
    }
  );
  return data;
};
