import { Decimal } from "@cosmjs/math";
import { EntityId } from "@reduxjs/toolkit";
import { groupBy } from "lodash";
import React, { ReactNode, useEffect, useState } from "react";
import {
  FlatList,
  StyleProp,
  View,
  ViewStyle,
  StyleSheet,
  Pressable,
  TextInput,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ChevronDownIcon } from "react-native-heroicons/outline";
import { XMarkIcon } from "react-native-heroicons/solid";
import { Switch } from "react-native-paper";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useSelector } from "react-redux";

import { resolveColor } from "./utils";
import closeSVG from "../../../assets/icons/close.svg";
import { AttributeRarityFloor } from "../../api/marketplace/v1/marketplace";
import { BrandText } from "../../components/BrandText";
import { CurrencyIcon } from "../../components/CurrencyIcon";
import { SVG } from "../../components/SVG";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { Separator } from "../../components/separators/Separator";
import { SearchInput } from "../../components/sorts/SearchInput";
import { useCollectionStats } from "../../hooks/useCollectionStats";
import {
  getNativeCurrency,
  NativeCurrencyInfo,
  parseNetworkObjectId,
} from "../../networks";
import {
  selectShowFilters,
  setShowFilters,
  addSelected,
  removeSelected,
  selectSelectedAttributeIds,
  selectBuyNow,
  setBuyNow,
  setPriceRange,
  selectPriceRange,
  selectAllSelectedAttributeDataByCollectionId,
  clearSelectedByCollection,
} from "../../store/slices/marketplaceFilters";
import { RootState, useAppDispatch } from "../../store/store";
import { getMarketplaceClient } from "../../utils/backend";
import { prettyPrice } from "../../utils/coins";
import {
  codGrayColor,
  neutral00,
  neutral33,
  neutral44,
  neutralA3,
  primaryColor,
  secondaryColor,
} from "../../utils/style/colors";
import {
  fontBold11,
  fontMedium14,
  fontSemibold12,
  fontSemibold14,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { modalMarginPadding } from "../../utils/style/modals";

const Header: React.FC = () => {
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
        paddingBottom: layout.spacing_x1,
        marginBottom: layout.spacing_x1,
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

const AccordionItem: React.FC<{
  attributes: AttributeRarityFloor[];
  total: number;
  networkId: string;
  denom: string;
}> = ({ attributes, total, networkId, denom }) => {
  const shareValue = useSharedValue(0);
  const [bodySectionHeight, setBodySectionHeight] = useState(0);
  const [searchValue, setSearchValue] = useState("");
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
        <BrandText style={fontSemibold14}>{attributes[0].traitType}</BrandText>
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
          <SearchInput
            style={{
              paddingVertical: layout.spacing_x1,
            }}
            handleChangeText={(text) => setSearchValue(text)}
          />
          {attributes
            .filter((value) =>
              value.value.toLowerCase().includes(searchValue.toLowerCase()),
            )
            .map((value) => (
              <FilterItems
                attribute={value}
                networkId={networkId}
                denom={denom}
              />
            ))}
        </View>
      </Animated.View>
    </View>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
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

const FilterItems: React.FC<{
  attribute: AttributeRarityFloor;
  networkId: string;
  denom: string;
}> = ({ attribute, networkId, denom }) => {
  const isSelected = useAttributeIsSelected(attribute);

  const dispatch = useAppDispatch();

  const handlePress = (attribute: AttributeRarityFloor, selected: boolean) => {
    if (!selected) {
      dispatch(addSelected(attribute));
    } else {
      dispatch(
        removeSelected(
          `${attribute.collectionId}-${attribute.traitType}-${attribute.value}`,
        ),
      );
    }
  };

  return attribute ? (
    <View>
      <Pressable
        style={{
          backgroundColor: codGrayColor,
          borderRadius: 8,
          padding: layout.spacing_x1,
          marginBottom: layout.spacing_x1,
          borderColor: isSelected ? primaryColor : codGrayColor,
          borderWidth: 1,
        }}
        onPress={() => handlePress(attribute, isSelected)}
      >
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            flexWrap: "nowrap",
            alignItems: "center",
            marginBottom: layout.spacing_x0_5,
          }}
        >
          <BrandText style={[fontSemibold12, { color: primaryColor }]}>
            {attribute.value}
          </BrandText>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "nowrap",
            }}
          >
            <BrandText style={fontSemibold12}>{attribute.counta}</BrandText>
            <BrandText style={[fontSemibold12, { color: neutralA3 }]}>
              /{attribute.collectionSize}
            </BrandText>
          </View>
        </View>
        <Separator />
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            flexWrap: "nowrap",
            alignItems: "center",
            marginTop: layout.spacing_x0_5,
          }}
        >
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <BrandText style={fontSemibold12}>
              {prettyPrice(networkId, attribute.floor + "", denom)}
            </BrandText>
            <CurrencyIcon networkId={networkId} denom={denom} size={16} />
            <BrandText style={[fontSemibold12, { color: neutralA3 }]}>
              Floor
            </BrandText>
          </View>
          <BrandText
            style={[
              {
                backgroundColor: resolveColor(
                  "backgroundColor",
                  attribute.rareRatio,
                ),
                borderStyle: "solid",
                borderWidth: 1,
                borderRadius: 32,
                height: 16,
                color: resolveColor("color", attribute.rareRatio),
                paddingTop: 2,
                paddingRight: 6,
                paddingBottom: 2,
                paddingLeft: 6,
              },
              fontBold11,
            ]}
          >
            {attribute.rareRatio.toFixed(2)}%
          </BrandText>
        </View>
      </Pressable>
    </View>
  ) : null;
};

export const AppliedFilters: React.FC<{ collectionId: string }> = ({
  collectionId,
}) => {
  const dispatch = useAppDispatch();
  const filterIsShown = useShowFilters();

  const selected = useSelector((state: RootState) =>
    selectAllSelectedAttributeDataByCollectionId(state, collectionId),
  );

  const clearAll = () => {
    const idsToRemove: EntityId[] = [];
    selected.map((attribute) => {
      idsToRemove.push(
        `${attribute.collectionId}-${attribute.traitType}-${attribute.value}`,
      );
    });

    dispatch(clearSelectedByCollection(idsToRemove));
  };
  const removeFilter = (attribute: AttributeRarityFloor) => {
    dispatch(
      removeSelected(
        `${attribute.collectionId}-${attribute.traitType}-${attribute.value}`,
      ),
    );
  };

  const commonStyles: StyleProp<ViewStyle> = {
    flexDirection: "row",
    flexWrap: "nowrap",
    minWidth: layout.spacing_x2_5,
    borderRadius: 8,
    backgroundColor: codGrayColor,
    marginLeft: layout.spacing_x1,
    alignItems: "center",
    padding: layout.spacing_x1,
  };

  return selected.length > 0 ? (
    <View
      style={{
        flexDirection: "row",
        marginBottom: layout.spacing_x1,
        alignSelf: "flex-start",
        marginLeft: filterIsShown ? 281 : 0,
      }}
    >
      <Pressable style={commonStyles} onPress={() => clearAll()}>
        <BrandText style={fontSemibold12}>Clear All</BrandText>
      </Pressable>
      {selected.map((attribute, index) => (
        <Pressable style={commonStyles} onPress={() => removeFilter(attribute)}>
          <BrandText
            style={[
              fontSemibold12,
              { textTransform: "capitalize", marginRight: layout.spacing_x1 },
            ]}
          >
            {attribute.traitType}: {attribute.value}
          </BrandText>
          <XMarkIcon color={secondaryColor} size={12} />
        </Pressable>
      ))}
    </View>
  ) : null;
};

const FilterContainer: React.FC<{
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}> = ({ children, style }) => (
  <View
    style={[
      {
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "space-between",
        alignItems: "center",
        borderStyle: "solid",
        borderBottomColor: neutral44,
        borderWidth: 1,
        paddingBottom: layout.spacing_x1,
        marginBottom: layout.spacing_x1,
      },
      style,
    ]}
  >
    {children}
  </View>
);

const PriceFilter: React.FC<{ currency: NativeCurrencyInfo }> = ({
  currency,
}) => {
  // FIXME: remove StyleSheet.create
  // eslint-disable-next-line no-restricted-syntax
  const styles = StyleSheet.create({
    textInput: {
      color: "#FFFFFF",
      backgroundColor: neutral00,
      borderRadius: layout.spacing_x1,
      borderColor: neutral33,
      borderStyle: "solid",
      width: 85,
      height: 40,
      borderWidth: 1,
      padding: layout.spacing_x1,
    },
  });
  const textInputStyle = StyleSheet.flatten([styles.textInput, fontMedium14]);
  const priceRange = useSelector(selectPriceRange);
  const [min, setMin] = useState<string>(priceRange?.min || "");
  const [max, setMax] = useState<string>(priceRange?.max || "");

  const dispatch = useAppDispatch();
  const handlePress = () => {
    dispatch(
      setPriceRange({
        min: Decimal.fromUserInput(min, currency.decimals).atomics,
        max: Decimal.fromUserInput(max, currency.decimals).atomics,
      }),
    );
  };
  return (
    <>
      <BrandText style={fontSemibold14}>Price</BrandText>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "nowrap",
          alignItems: "center",
          width: "100%",
          paddingVertical: layout.spacing_x1,
          justifyContent: "space-between",
        }}
      >
        <TextInput
          placeholder="Min"
          onChangeText={(value) => (value !== "" ? setMin(value) : setMin(""))}
          placeholderTextColor="#FFFFFF"
          style={textInputStyle}
          value={min !== "0" ? min.replace(/[^0-9\\.]/g, "") : ""}
          keyboardType="decimal-pad"
        />
        <BrandText style={fontSemibold14}>to</BrandText>
        <TextInput
          placeholder="Max"
          onChangeText={(value) => (value !== "" ? setMax(value) : setMax(""))}
          value={max !== "0" ? max.replace(/[^0-9\\.]/g, "") : ""}
          placeholderTextColor="#FFFFFF"
          style={textInputStyle}
          keyboardType="decimal-pad"
        />
      </View>
      <PrimaryButton size="SM" text="Apply" fullWidth onPress={handlePress} />
    </>
  );
};

export const SideFilters: React.FC<{
  style?: StyleProp<ViewStyle>;
  collectionId: string;
}> = ({ style, collectionId }) => {
  const [attributes, setAttributes] = useState<AttributeRarityFloor[]>([]);
  const stats = useCollectionStats(collectionId);
  const [network] = parseNetworkObjectId(collectionId);
  const buyNow = useSelector(selectBuyNow);
  const dispatch = useAppDispatch();

  // FIXME: transform this into a react-query hook
  useEffect(() => {
    try {
      setAttributes([]);
      const backendClient = getMarketplaceClient(network?.id);
      if (!backendClient) {
        return;
      }
      const allAtributes: AttributeRarityFloor[] = [];
      const stream = backendClient.NFTCollectionAttributes({
        collectionId,
      });
      stream.subscribe(
        ({ attributes }) => {
          if (attributes) {
            allAtributes.push(attributes);
          }
        },
        (e) => {
          console.error(e);
        },
        () => {
          if (allAtributes) {
            setAttributes(allAtributes);
          }
        },
      );
    } catch (err) {
      console.error(err);
    }
  }, [network?.id, collectionId]);

  const grouped = groupBy(attributes, (e) => {
    return e.traitType;
  });

  const currency = getNativeCurrency(network?.id, stats?.floorPrice[0]?.denom);

  return useShowFilters() ? (
    <View style={style}>
      <Header />
      <FilterContainer>
        <BrandText style={fontSemibold14}>Buy Now</BrandText>
        <Switch
          value={buyNow}
          onValueChange={() => {
            dispatch(setBuyNow(!buyNow));
          }}
          color={primaryColor}
        />
      </FilterContainer>
      <FilterContainer
        style={{
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {currency && <PriceFilter currency={currency} />}
      </FilterContainer>
      {stats && network && (
        <FlatList
          data={Object.values(grouped)}
          renderItem={({ item }) => {
            return (
              <AccordionItem
                attributes={item}
                total={stats.totalSupply || -1}
                networkId={network.id}
                denom={stats?.floorPrice[0]?.denom}
              />
            );
          }}
        />
      )}
    </View>
  ) : null;
};

const useShowFilters = () => {
  return useSelector(selectShowFilters);
};
const useAttributeIsSelected = (attribute: AttributeRarityFloor) => {
  const selected = new Set(useSelector(selectSelectedAttributeIds));
  return selected.has(
    `${attribute.collectionId}-${attribute.traitType}-${attribute.value}`,
  );
};
