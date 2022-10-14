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
import { BrandText } from "./BrandText";
import { SVG } from "./SVG";
import { TertiaryBox } from "./boxes/TertiaryBox";
import { SecondaryButton } from "./buttons/SecondaryButton";
import { NetworkIcon } from "./images/NetworkIcon";

export const NFTView: React.FC<{
  data: NFT;
  style?: StyleProp<ViewStyle>;
}> = React.memo(({ data: nft, style }) => {
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
  } = flatStyle || {};

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("NFTDetail", { id: nft.id })}
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
        key={nft.name}
        height={438}
        width={255}
        style={styleWithoutMargins}
      >
        <View>
          <View
            style={{
              paddingTop: 16,
              paddingBottom: 12,
              paddingHorizontal: 16,
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
                  source={{ uri: avatarPNG }}
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
                    @nickname
                  </BrandText>
                </View>
              </View>
              <TouchableOpacity>
                <SVG source={dotsCircleSVG} height={32} width={32} />
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 15, marginBottom: 20 }}>
              <Image
                source={{ uri: nft.imageUri }}
                style={{
                  height: 223,
                  width: 223,
                  borderRadius: 12,
                }}
              />
              {!!nft.textInsert && (
                <BrandText
                  style={{
                    color: "white",
                    position: "absolute",
                    fontSize: 14,
                    bottom: 10,
                    right: 10,
                    maxWidth: 223 - 10,
                  }}
                >
                  {nft.textInsert}
                </BrandText>
              )}
            </View>
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
