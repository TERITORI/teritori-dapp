import React from "react";
import {
  ViewStyle,
  Image,
  View,
  StyleProp,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import avatarPNG from "../../assets/default-images/avatar.png";
import dotsCircleSVG from "../../assets/icons/dots-circle.svg";
import { NFT } from "../api/marketplace/v1/marketplace";
import { prettyPrice } from "../utils/coins";
import { useAppNavigation } from "../utils/navigation";
import { protobufNetworkToNetwork } from "../utils/network";
import { neutral33, neutral77 } from "../utils/style/colors";
import { layout } from "../utils/style/layout";
import { BrandText } from "./BrandText";
import { ImageWithTextInsert } from "./ImageWithTextInsert";
import { SVG } from "./SVG";
import { TertiaryBox } from "./boxes/TertiaryBox";
import { SecondaryButton } from "./buttons/SecondaryButton";
import { NetworkIcon } from "./images/NetworkIcon";

export const NFTView: React.FC<{
  data: NFT;
  style?: StyleProp<ViewStyle>;
}> = React.memo(({ data: nft, style }) => {
  const cardWidth = 258;
  const insideMargin = layout.padding_x2;
  const contentWidth = cardWidth - insideMargin * 2;
  const navigation = useAppNavigation();
  const flatStyle = StyleSheet.flatten(style);

  // put margins on touchable opacity
  const {
    marginBottom,
    marginHorizontal,
    marginVertical,
    margin,
    marginEnd,
    marginStart,
    marginTop,
    ...styleWithoutMargins
  } = flatStyle || {};

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("NFTDetail", { id: nft.id })}
      style={{
        margin,
        marginBottom,
        marginEnd,
        marginHorizontal,
        marginStart,
        marginTop,
        marginVertical,
      }}
    >
      <TertiaryBox
        key={nft.name}
        height={438}
        width={cardWidth}
        style={styleWithoutMargins}
      >
        <View>
          <View
            style={{
              paddingTop: insideMargin,
              paddingBottom: 12,
              paddingHorizontal: insideMargin,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: nft.ownerImageUrl || avatarPNG }} // TODO: proper fallback
                  style={{
                    height: 32,
                    width: 32,
                    borderRadius: 18,
                    marginRight: 6,
                  }}
                />
                <View>
                  <BrandText
                    style={{
                      fontSize: 10,
                      color: neutral77,
                    }}
                  >
                    Owned by
                  </BrandText>
                  <BrandText
                    style={{
                      fontSize: 12,
                      lineHeight: 16,
                    }}
                  >
                    {nft.ownerName || shortUserAddressFromID(nft.ownerId, 10)}
                  </BrandText>
                </View>
              </View>
              <TouchableOpacity>
                <SVG source={dotsCircleSVG} height={32} width={32} />
              </TouchableOpacity>
            </View>
            <ImageWithTextInsert
              size={contentWidth}
              imageURL={nft.imageUri}
              textInsert={nft.textInsert}
              style={{ marginTop: 15, marginBottom: 20, borderRadius: 12 }}
            />
            <BrandText
              style={{
                fontSize: 14,
                marginBottom: 12,
              }}
            >
              {nft.name}
            </BrandText>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <NetworkIcon
                  size={12}
                  network={protobufNetworkToNetwork(nft.network)}
                />
                <BrandText
                  style={{
                    fontSize: 12,
                    marginLeft: 10,
                  }}
                >
                  {nft.collectionName}
                </BrandText>
              </View>
            </View>
          </View>
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: neutral33,
              height: 69,
              paddingHorizontal: 16,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {nft.isListed ? (
                <>
                  <NetworkIcon
                    size={12}
                    network={protobufNetworkToNetwork(nft.network)}
                  />
                  {/* FIXME: should come from price denom */}
                  <BrandText
                    style={{
                      fontSize: 12,
                      color: neutral77,
                      marginLeft: 10,
                    }}
                  >
                    Price
                  </BrandText>
                </>
              ) : (
                <BrandText
                  style={{
                    fontSize: 12,
                    color: neutral77,
                  }}
                >
                  Not listed
                </BrandText>
              )}
            </View>
            {nft.isListed && (
              <SecondaryButton
                size="XS"
                text={prettyPrice(nft.price, nft.denom)}
                onPress={() => {}}
              />
            )}
          </View>
        </View>
      </TertiaryBox>
    </TouchableOpacity>
  );
});

// using this because ellipizeMode seems broken
const shortUserAddressFromID = (id: string, size: number) => {
  if (id.startsWith("tori-")) {
    return id.substring(5, 5 + size) + "..." + id.substring(id.length - size);
  }
  return id.substring(0, size) + "..." + id.substring(id.length - size);
};
