import React, { useRef } from "react";
import { ActivityIndicator, Image, TouchableOpacity, View } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

import chevronLeftSVG from "../../../assets/icons/chevron-left.svg";
import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import {
  Collection,
  CollectionsRequest_Kind,
} from "../../api/marketplace/v1/marketplace";
import { useCollections } from "../../hooks/useCollections";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { useNavigateToCollection } from "../../hooks/useNavigateToCollection";
import { primaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { Section } from "../Section";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { PrimaryButton } from "../buttons/PrimaryButton";

const CarouselCollectionItem: React.FC<{
  collection: Collection;
}> = ({ collection }) => {
  const navigateToCollection = useNavigateToCollection(collection.id);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
      }}
    >
      {/* Left container */}
      <View
        style={{
          justifyContent: "flex-start",
        }}
      >
        <BrandText style={{ marginBottom: layout.padding_x1_5 }}>
          {collection.collectionName}
        </BrandText>

        {/*TODO: blue white text */}
        <BrandText
          style={[
            fontSemibold14,
            {
              color: primaryColor,
              marginBottom: layout.padding_x3,
              marginRight: layout.padding_x3,
            },
          ]}
        >
          TERITORI Collections
        </BrandText>

        <PrimaryButton
          size="M"
          text="Explore collection"
          onPress={navigateToCollection}
        />
      </View>

      {/* Right container */}
      <TertiaryBox style={{ marginBottom: 40 }}>
        {collection.imageUri ? (
          <Image
            source={{ uri: collection.imageUri }}
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
};

export const CollectionsCarouselHeader: React.FC<{
  kind: CollectionsRequest_Kind;
}> = ({ kind }) => {
  const [collections] = useCollections({
    kind,
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

  return (
    <Section title="" topRightChild={topRightChild}>
      <Carousel
        width={width}
        data={collections}
        ref={carouselRef}
        panGestureHandlerProps={{ enableTrackpadTwoFingerGesture: true }}
        height={370}
        pagingEnabled
        autoPlay
        autoPlayInterval={3000}
        renderItem={({ item }) => <CarouselCollectionItem collection={item} />}
      />
    </Section>
  );
};
