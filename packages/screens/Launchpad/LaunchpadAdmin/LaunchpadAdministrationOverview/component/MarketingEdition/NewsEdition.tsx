import React, { FC, useRef, useState } from "react";
import { View } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

import { News } from "@/api/marketplace/v1/marketplace";
import { NewsBox } from "@/components/hub/NewsBox";
import { useNews } from "@/hooks/marketing/useNews";
import { useMaxResolution } from "@/hooks/useMaxResolution";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { EditButton } from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadAdministrationOverview/component/MarketingEdition/EditButton";

export const NewsEdition: FC = () => {
  const networkId = useSelectedNetworkId();
  const { width } = useMaxResolution();
  const carouselRef = useRef<ICarouselInstance | null>(null);
  const renderItem = (props: { item: News }) => <NewsBox news={props.item} />;
  const news = useNews(networkId);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <View>
      <EditButton
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        saveChanges={() => {
          // TODO
        }}
      />

      {/*TODO: Edition*/}
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
    </View>
  );
};
