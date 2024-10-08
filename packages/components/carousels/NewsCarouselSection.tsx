import React, { useEffect, useRef } from "react";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

import { News } from "../../api/marketplace/v1/marketplace";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { FullWidthSeparator } from "../FullWidthSeparator";
import { Section } from "../Section";
import { NewsBox } from "../hub/NewsBox";

import { LeftRightButtons } from "@/components/carousels/LeftRightButtons";
import { useNews } from "@/hooks/marketing/useNews";

export const NewsCarouselSection: React.FC = () => {
  const { width } = useMaxResolution();
  const carouselRef = useRef<ICarouselInstance | null>(null);
  const renderItem = (props: { item: News }) => <NewsBox news={props.item} />;
  const networkId = useSelectedNetworkId();
  const news = useNews(networkId);

  useEffect(() => {
    carouselRef.current?.next();
  }, [width]);

  return (
    <Section
      title="Highlighted News"
      topRightChild={
        <LeftRightButtons
          onPressNext={() => carouselRef.current?.next()}
          onPressPrev={() => carouselRef.current?.prev()}
        />
      }
    >
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
