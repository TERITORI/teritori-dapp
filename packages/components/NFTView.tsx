import React from "react";
import {
  ViewStyle,
  Image,
  View,
  StyleProp,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { useAppNavigation } from "../utils/navigation";
import { heightButton } from "../utils/style/buttons";
import { neutral33, neutral77 } from "../utils/style/colors";
import { NFTData } from "../utils/types/nft";
import { BrandText } from "./BrandText";
import {NetworkIcon} from "./images/NetworkIcon"
import { TertiaryBox } from "./boxes/TertiaryBox";
import { SecondaryButton } from "./buttons/SecondaryButton";

export const NFTView: React.FC<{
  data: NFTData; // FIXME: replace by NFT pb
  style?: StyleProp<ViewStyle>;
}> = React.memo(({ data, style }) => {
  const collectionFontSize = 12;
  const favoriteCountFontSize = 12;
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
        <Image
          source={{ uri: data.imageURI }}
          style={{
            width: contentWidth,
            height: 236,
            alignSelf: "center",
            borderRadius: 12,
          }}
        />

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
              <NetworkIcon network={data.network} circle size={24} />
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 16,
              }}
            >
              <BrandText
                style={{
                  fontSize: favoriteCountFontSize,
                  letterSpacing: -(favoriteCountFontSize * 0.04),
                  color: neutral77,
                }}
              >
                {data.favoritesCount}
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
            <NetworkIcon network={data.network} circle size={24} />
            <BrandText
              style={{
                marginLeft: 6,
                fontSize: floorPriceLabelFontSize,
                letterSpacing: -(floorPriceLabelFontSize * 0.04),
                color: neutral77,
              }}
            >
              {data.floorPrice ? "Floor Price" : "Not Listed"}
            </BrandText>
          </View>
          {!!data.floorPrice && (
            <SecondaryButton size="XS" text={data.floorPrice} />
          )}
        </View>
      </TertiaryBox>
    </TouchableOpacity>
  );
});
