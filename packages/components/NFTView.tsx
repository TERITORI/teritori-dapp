import React from "react";
import {
  ViewStyle,
  Image,
  View,
  StyleProp,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { NFT } from "../api/marketplace/v1/marketplace";
import { prettyPrice } from "../utils/coins";
import { useAppNavigation } from "../utils/navigation";
import { protobufNetworkToNetwork } from "../utils/network";
import { heightButton } from "../utils/style/buttons";
import { neutral33, neutral77 } from "../utils/style/colors";
import { BrandText } from "./BrandText";
import { TertiaryBox } from "./boxes/TertiaryBox";
import { SecondaryButton } from "./buttons/SecondaryButton";
import { NetworkIcon } from "./images/NetworkIcon";

export const NFTView: React.FC<{
  data: NFT;
  style?: StyleProp<ViewStyle>;
}> = React.memo(({ data, style }) => {
  const collectionFontSize = 12;
  const floorPriceLabelFontSize = 12;
  const contentWidth = 236;
  const navigation = useAppNavigation();
  const flatStyle = StyleSheet.flatten(style);

  // put margins on touchable opacity
  const {
    marginLeft,
    marginBottom,
    marginHorizontal,
    marginVertical,
    margin,
    marginEnd,
    marginRight,
    marginStart,
    marginTop,
    ...styleWithoutMargins
  } = flatStyle;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("NFTDetail", { id: data.id })}
      style={{
        margin,
        marginBottom,
        marginEnd,
        marginHorizontal,
        marginLeft,
        marginRight,
        marginStart,
        marginTop,
        marginVertical,
      }}
    >
      <TertiaryBox
        width={268}
        style={styleWithoutMargins}
        mainContainerStyle={{ paddingVertical: 16 }}
      >
        <View>
          <Image
            source={{ uri: data.imageUri }}
            style={{
              width: contentWidth,
              height: contentWidth,
              alignSelf: "center",
              borderRadius: 12,
            }}
          />
          {data.textInsert && (
            <BrandText
              style={{
                color: "white",
                position: "absolute",
                fontSize: 14,
                bottom: 10,
                right: 10,
                maxWidth: contentWidth - 10,
              }}
            >
              {data.textInsert}
            </BrandText>
          )}
        </View>
        <View style={{ marginHorizontal: 16, width: contentWidth }}>
          <BrandText
            style={{ marginTop: 16, fontSize: 14 }}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {data.name}
          </BrandText>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 12,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                alignItems: "center",
              }}
            >
              <NetworkIcon
                network={protobufNetworkToNetwork(data.network)}
                circle
                size={24}
              />
              <BrandText
                style={{
                  fontSize: collectionFontSize,
                  letterSpacing: -(collectionFontSize * 0.04),
                  marginHorizontal: 4,
                }}
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                {data.collectionName}
              </BrandText>
            </View>
          </View>
        </View>
        <View
          style={{
            borderBottomColor: neutral33,
            borderBottomWidth: 1,
            marginBottom: 14,
            marginTop: 12,
            width: "100%",
            height: 1,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: contentWidth,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              minHeight: heightButton("XS"),
            }}
          >
            <NetworkIcon
              network={protobufNetworkToNetwork(data.network)}
              circle
              size={24}
            />
            <BrandText
              style={{
                marginLeft: 6,
                fontSize: floorPriceLabelFontSize,
                letterSpacing: -(floorPriceLabelFontSize * 0.04),
                color: neutral77,
              }}
            >
              {data.price ? "Price" : "Not Listed"}
            </BrandText>
          </View>
          {!!data.price && (
            <SecondaryButton
              size="XS"
              text={prettyPrice(data.price, data.denom)}
            />
          )}
        </View>
      </TertiaryBox>
    </TouchableOpacity>
  );
});
