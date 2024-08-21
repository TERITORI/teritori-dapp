import React, { FC, useRef, useState } from "react";
import { View } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

import { News } from "@/api/marketplace/v1/marketplace";
import { FullWidthSeparator } from "@/components/FullWidthSeparator";
import { LeftRightButtons } from "@/components/carousels/LeftRightButtons";
import { NewsBox } from "@/components/hub/NewsBox";
import { SpacerColumn } from "@/components/spacer";
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
    <View style={{ width, alignSelf: "center" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <EditButton
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onPressSave={() => {
            // TODO
          }}
          onPressCancel={() => {
            // TODO
          }}
        />

        <LeftRightButtons
          onPressNext={() => carouselRef.current?.next()}
          onPressPrev={() => carouselRef.current?.prev()}
        />
      </View>

      <SpacerColumn size={2} />
      <FullWidthSeparator />

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
        style={{ alignSelf: "center" }}
      />
    </View>
  );
};
