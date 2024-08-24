import React, { FC, useRef, useState } from "react";
import { View } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

import { News } from "@/api/marketplace/v1/marketplace";
import { FullWidthSeparator } from "@/components/FullWidthSeparator";
import { LeftRightButtons } from "@/components/carousels/LeftRightButtons";
import {
  actionUrlInputContainerHeight,
  NewsBox,
} from "@/components/hub/NewsBox";
import { SpacerColumn } from "@/components/spacer";
import { useNews } from "@/hooks/marketing/useNews";
import { useMaxResolution } from "@/hooks/useMaxResolution";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { EditButton } from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadAdministrationOverview/component/MarketingEdition/EditButton";

export const NewsEdition: FC = () => {
  const networkId = useSelectedNetworkId();
  const { width } = useMaxResolution();
  const carouselRef = useRef<ICarouselInstance | null>(null);
  const newsList = useNews(networkId);
  const [isEditing, setIsEditing] = useState(false);
  // const [hasInvalidNews, setHasInvalidNews] = useState(false);
  // const [hasChanges, setHasChanges] = useState(false);

  // console.log('hasChangeshasChangeshasChangeshasChanges', hasChanges)
  // console.log('hasInvalidNewshasInvalidNewshasInvalidNews', hasInvalidNews)

  const renderItem = (props: { item: News }) => (
    <NewsBox
      news={props.item}
      isEditing={isEditing}
      // setHasInvalidNews={setHasInvalidNews}
      // setHasChanges={setHasChanges}
    />
  );

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
            // if (!hasInvalidNews) {
            // TODO
            // }
          }}
          onPressCancel={() => {
            // TODO
          }}
          // isSaveDisabled={hasInvalidNews || !hasChanges}
        />

        <LeftRightButtons
          onPressNext={() => carouselRef.current?.next()}
          onPressPrev={() => carouselRef.current?.prev()}
        />
      </View>

      <SpacerColumn size={2} />
      <FullWidthSeparator />

      {/*TODO: One Edit button per NewsBox ?*/}
      <Carousel
        width={width}
        data={newsList || []}
        ref={carouselRef}
        onConfigurePanGesture={(g) => g.enableTrackpadTwoFingerGesture(true)}
        height={isEditing ? 382 + actionUrlInputContainerHeight : 382}
        pagingEnabled
        loop
        enabled={!isEditing}
        autoPlay={!isEditing}
        autoPlayInterval={3000}
        renderItem={renderItem}
        style={{ alignSelf: "center" }}
      />
    </View>
  );
};
