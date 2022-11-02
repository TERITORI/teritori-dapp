import React, { useRef, useState } from "react"
import { ActivityIndicator, Image, TouchableOpacity, View } from "react-native"

import { Collection, CollectionsRequest_Kind } from "../../api/marketplace/v1/marketplace"
import { ScreenContainer } from "../../components/ScreenContainer";
import { CollectionsCarouselSection } from "../../components/carousels/CollectionsCarouselSection";
import { ScreenFC } from "../../utils/navigation";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../../components/BrandText"
import { fontSemibold14, fontSemibold20 } from "../../utils/style/fonts"
import { ProgressionCard } from "../../components/cards/ProgressionCard"
import { PrimaryButton } from "../../components/buttons/PrimaryButton"
import { getCurrency } from "../../networks"
import { CollectionSocialButtons } from "../../components/collections/CollectionSocialButtons"
import { TertiaryBox } from "../../components/boxes/TertiaryBox"
import { useCollectionInfo } from "../../hooks/useCollectionInfo"
import { useCollections } from "../../hooks/useCollections"
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel"
import { useMaxResolution } from "../../hooks/useMaxResolution"
import { SVG } from "../../components/SVG"
import chevronLeftSVG from "../../../assets/icons/chevron-left.svg"
import chevronRightSVG from "../../../assets/icons/chevron-right.svg"
import { Section } from "../../components/Section"

const renderCarouselCollectionItem = (props: { item: Collection }) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      justifyContent: "space-evenly"
    }}

  >
    {/* Left container */}
    <View
      style={{
        justifyContent: "flex-start",
      }}
    >
      <BrandText style={{ marginBottom: layout.padding_x1_5 }}>
        {props.item.collectionName}
      </BrandText>

      {/*TODO: blue white text */}
      <BrandText
        style={[fontSemibold14, { marginBottom: layout.padding_x3, marginRight: layout.padding_x3 }]}
      >
        EXCLUSIVE GENESIS TERITORI COLLECTION
      </BrandText>

      <PrimaryButton size="M" text="explore collection"/>
    </View>

    {/* Right container */}
    <TertiaryBox style={{ marginBottom: 40 }}>
      {props.item.imageUri ? (
        <Image
          source={{ uri: props.item.imageUri }}
          style={{
            height: 368,
            width: 368,
            borderRadius: 8,
          }}
        />
      ) : (
        <ActivityIndicator size="large" style={{ margin: 40 }} />
      )}
    </TertiaryBox>
  </View>
);

const CollectionsCarouselHeader: React.FC = () => {
  const [collections, fetchMore] = useCollections({
    kind: CollectionsRequest_Kind.KIND_TERITORI_FEATURES,
    limit: 16,
    offset: 0,
  });
  const carouselRef = useRef<ICarouselInstance | null>(null);
  const { width } = useMaxResolution();

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

  console.log('collectionscollectionscollectionscollections', collections)

  return (
    <Section title="" topRightChild={topRightChild}>
      <Carousel
        width={width}
        data={collections}
        ref={carouselRef}
        panGestureHandlerProps={{ enableTrackpadTwoFingerGesture: true }}
        height={370}
        pagingEnabled
        // autoPlay
        autoPlayInterval={3000}
        renderItem={renderCarouselCollectionItem}
      />
    </Section>
  )
}

export const MarketplaceScreen: ScreenFC<"Marketplace"> = () => {
  return (
    <ScreenContainer>
      <View
        style={{
          paddingBottom: layout.contentPadding,
        }}
      >
        {/* ===== Marketplace Header */}
        <CollectionsCarouselHeader/>

        <CollectionsCarouselSection
          title="TERITORI Collections"
          kind={CollectionsRequest_Kind.KIND_TERITORI_FEATURES}
        />
        <CollectionsCarouselSection
          title="Upcoming Launches"
          kind={CollectionsRequest_Kind.KIND_UPCOMING}
        />
      </View>
    </ScreenContainer>
  );
};
