import React, { useEffect, useState } from "react";
import { FlatList, StyleProp, View, ViewStyle, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ChevronDownIcon } from "react-native-heroicons/outline";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useSelector } from "react-redux";

import closeSVG from "../../../assets/icons/close.svg";
import { Attribute } from "../../api/marketplace/v1/marketplace";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { Separator } from "../../components/Separator";
import { parseNetworkObjectId } from "../../networks";
import {
  selectShowFilters,
  setShowFilters,
} from "../../store/slices/marketplaceFilters";
import { useAppDispatch } from "../../store/store";
import { mustGetMarketplaceClient } from "../../utils/backend";
import {
  codGrayColor,
  neutral44,
  neutralA3,
  primaryColor,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold12, fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { modalMarginPadding } from "../../utils/style/modals";

const Header: React.FC<{ items: any[] }> = ({ items }) => {
  const dispatch = useAppDispatch();
  const onPressClear = () => {
    dispatch(setShowFilters(false));
  };
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "space-between",
        borderStyle: "solid",
        borderBottomColor: neutral44,
        borderWidth: 1,
        paddingBottom: layout.padding_x1,
        marginBottom: layout.padding_x1,
      }}
    >
      <BrandText style={fontSemibold14}>Filters</BrandText>
      <TouchableOpacity
        containerStyle={[{ marginLeft: modalMarginPadding }]}
        style={{ justifyContent: "flex-end" }}
        onPress={onPressClear}
      >
        <SVG width={20} height={20} source={closeSVG} />
      </TouchableOpacity>
    </View>
  );
};

const AccordionItem: React.FC<{ attribute: Attribute }> = ({ attribute }) => {
  const shareValue = useSharedValue(0);
  const [bodySectionHeight, setBodySectionHeight] = useState(0);

  const bodyHeight = useAnimatedStyle(() => ({
    height: interpolate(shareValue.value, [0, 1], [0, bodySectionHeight]),
  }));

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(shareValue.value, [0, 1], [0, 90])}deg`,
        },
      ],
    };
  });

  const toggleButton = () => {
    if (shareValue.value === 0) {
      shareValue.value = withTiming(1, {
        duration: 500,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      });
    } else {
      shareValue.value = withTiming(0, {
        duration: 500,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      });
    }
  };

  return (
    <View style={styles.subContainer}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.btnStyle}
        onPress={toggleButton}
      >
        <BrandText style={fontSemibold14}>{attribute.traitType}</BrandText>
        <Animated.View style={iconStyle}>
          <ChevronDownIcon color={secondaryColor} />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={[styles.descStyle, bodyHeight]}>
        <View
          style={styles.bodyContainer}
          onLayout={(event) => {
            setBodySectionHeight(event.nativeEvent.layout.height);
          }}
        >
          {attribute.value.split(",").map((value) => (
            <FilterItems attribute={attribute} text={value} />
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 24,
  },
  btnStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  subContainer: {
    paddingHorizontal: 8,
    marginBottom: 6,
    flex: 1,
    borderRadius: 10,
  },
  svgStyle: {
    width: 20,
    height: 20,
  },
  descStyle: {
    overflow: "hidden",
  },
  title: {
    fontWeight: "600",
  },
  bodyContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    paddingBottom: 20,
  },
});

const FilterItems: React.FC<{ attribute: Attribute; text: string }> = ({
  attribute,
  text,
}) => {
  // const selected = useSelector(selectSelectedNFTIds);
  //
  // const nft = useSelector((state: RootState) =>
  //   selectSelectedNFTDataById(state, selected[0])
  // );

  // const dispatch = useAppDispatch();
  return attribute ? (
    <View>
      <View
        style={{
          backgroundColor: codGrayColor,
          borderRadius: 8,
          padding: layout.padding_x1,
          marginBottom: layout.padding_x1,
        }}
      >
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            flexWrap: "nowrap",
            alignItems: "center",
            marginBottom: layout.padding_x0_5,
          }}
        >
          <BrandText style={[fontSemibold12, { color: primaryColor }]}>
            {text}
          </BrandText>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "nowrap",
            }}
          >
            <BrandText style={fontSemibold12}>144</BrandText>
            <BrandText style={[fontSemibold12, { color: neutralA3 }]}>
              /7777
            </BrandText>
          </View>

          {/*<Pressable*/}
          {/*  onPress={() => {*/}
          {/*    dispatch(removeSelected(id));*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <TrashIcon size={10} color={neutralA3} />*/}
          {/*</Pressable>*/}
        </View>
        <Separator />
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            flexWrap: "nowrap",
            alignItems: "center",
            marginTop: layout.padding_x0_5,
          }}
        >
          <BrandText style={[fontSemibold12, { color: neutralA3 }]}>
            you
          </BrandText>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <BrandText style={fontSemibold12}>
              {/*{prettyPrice(nft.networkId, nft.price, nft.denom)}*/}
            </BrandText>
            {/*<CurrencyIcon*/}
            {/*  networkId={nft.networkId}*/}
            {/*  denom={nft.denom}*/}
            {/*  size={16}*/}
            {/*/>*/}
          </View>
        </View>
      </View>
    </View>
  ) : null;
};

export const SideFilters: React.FC<{
  style?: StyleProp<ViewStyle>;
  collectionId: string;
}> = ({ style, collectionId }) => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [network] = parseNetworkObjectId(collectionId);

  useEffect(() => {
    try {
      setAttributes([]);
      const backendClient = mustGetMarketplaceClient(network?.id);
      const stream = backendClient.NFTCollectionAttributes({
        collectionId,
      });
      stream.forEach(({ attributes }) => {
        if (!attributes) {
          return;
        }
        setAttributes((attr) => [...attr, attributes]);
      });
    } catch (err) {
      console.error(err);
    }
  }, [network?.id, collectionId]);

  return useShowFilters() ? (
    <View style={style}>
      <Header items={attributes} />
      <FlatList
        data={attributes}
        renderItem={({ item }) => {
          return <AccordionItem attribute={item} />;
        }}
      />
      <Separator />
    </View>
  ) : null;
};

export const useShowFilters = () => {
  return useSelector(selectShowFilters);
};
