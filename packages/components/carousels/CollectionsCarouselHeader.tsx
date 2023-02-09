import React, { useMemo, useRef } from "react";
import {
  ActivityIndicator,
  Image,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

import chevronLeftSVG from "../../../assets/icons/chevron-left.svg";
import chevronRightSVG from "../../../assets/icons/chevron-right.svg";
import {
  Collection,
  CollectionsRequest,
  MintState,
  Sort,
  SortDirection,
} from "../../api/marketplace/v1/marketplace";
import { useCollections } from "../../hooks/useCollections";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { useNavigateToCollection } from "../../hooks/useNavigateToCollection";
import { getNetwork } from "../../networks";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout, smallMobileWidth } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { Section } from "../Section";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { GradientText } from "../gradientText";

const defaultRequest: CollectionsRequest = {
  networkId: "fake",
  sortDirection: SortDirection.SORT_DIRECTION_UNSPECIFIED,
  sort: Sort.SORTING_UNSPECIFIED,
  limit: 16,
  offset: 0,
  upcoming: false,
  mintState: MintState.MINT_STATE_UNSPECIFIED,
};

const breakPoint = 1000;

const CarouselCollectionItem: React.FC<{
  collection: Collection;
  networkId: string;
  linkToMint?: boolean;
}> = ({ collection, networkId, linkToMint }) => {
  const navigateToCollection = useNavigateToCollection(collection.id, {
    forceSecondaryDuringMint: collection.secondaryDuringMint,
    forceLinkToMint: linkToMint,
  });

  const { width: windowWidth } = useWindowDimensions();
  const { width } = useMaxResolution();

  return (
    <View
      style={{
        flexDirection: windowWidth < breakPoint ? "column-reverse" : "row",
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

        <GradientText
          gradientType="blueReversed"
          style={[
            fontSemibold14,
            {
              marginBottom: layout.padding_x3,
              marginRight: layout.padding_x3,
            },
          ]}
        >
          {`${getNetwork(networkId)?.displayName} Collections`}
        </GradientText>

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
              height: width < smallMobileWidth ? 0.8 * width : 368,
              width: width < smallMobileWidth ? 0.8 * width : 368,
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
  req?: CollectionsRequest;
  linkToMint?: boolean;
  filter?: (c: Collection) => boolean;
}> = ({ req = defaultRequest, linkToMint, filter }) => {
  const [collections] = useCollections(req, filter);
  const carouselRef = useRef<ICarouselInstance | null>(null);
  const { width } = useMaxResolution();

  const { width: windowWidth } = useWindowDimensions();

  const collection_height =
    windowWidth < smallMobileWidth ? windowWidth * 0.75 + 130 : 550;

  const topRightChild = useMemo(
    () => (
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
    ),
    [carouselRef]
  );

  return (
    <Section title="" topRightChild={topRightChild}>
      <Carousel
        // width={windowWidth < breakPoint ? windowWidth - minus : width}
        width={width}
        data={collections}
        ref={carouselRef}
        panGestureHandlerProps={{ enableTrackpadTwoFingerGesture: true }}
        height={windowWidth < breakPoint ? collection_height : 370}
        pagingEnabled
        autoPlay
        autoPlayInterval={3000}
        renderItem={({ item }) => (
          <CarouselCollectionItem
            collection={item}
            networkId={req.networkId}
            linkToMint={linkToMint}
          />
        )}
      />
    </Section>
  );
};
