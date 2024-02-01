import React, { memo } from "react";
import { View, StyleProp, StyleSheet, Pressable } from "react-native";

import checkMark from "../../../assets/icons/checkmark-marketplace.svg";
import { NFT } from "../../api/marketplace/v1/marketplace";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { parseUserId } from "../../networks";
import {
  neutral00,
  neutral22,
  neutral77,
  yellowDefault,
} from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { ImageWithTextInsert } from "../ImageWithTextInsert";
import { NetworkIcon } from "../NetworkIcon";
import { OmniLink } from "../OmniLink";
import { OptimizedImage } from "../OptimizedImage";
import { SVG } from "../SVG";
import { BoxStyle } from "../boxes/Box";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { SpacerRow } from "../spacer";

// TODO: use `NFTs` component

export const NFTBridge: React.FC<{
  data: NFT;
  selected: boolean;
  onPress?(): void;
  style?: StyleProp<BoxStyle>;
}> = memo(({ data: nft, selected, onPress, style }) => {
  const cardWidth = 250;
  // const { width: maxWidth } = useMaxResolution({ isLarge: true });
  const insideMargin = layout.spacing_x2;
  const flatStyle = StyleSheet.flatten(style);
  const userInfo = useNSUserInfo(nft.ownerId);

  // put margins on touchable opacity
  const {
    marginBottom,
    marginHorizontal,
    marginVertical,
    margin,
    marginEnd,
    marginStart,
    marginTop,
    width,
    ...styleWithoutMargins
  } = flatStyle || {};

  if (nft.id.startsWith("padded-")) {
    return <View style={{ width }} />;
  }

  const widthNumber =
    typeof width === "number"
      ? width
      : parseInt(width ? width.toString() : "0", 10) || cardWidth;
  return (
    <>
      <View
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
        <TertiaryBox key={nft.name} style={styleWithoutMargins}>
          <View style={{ width: "100%" }}>
            <Pressable
              style={{
                paddingTop: insideMargin,
                paddingBottom: 12,
                paddingHorizontal: insideMargin,
                zIndex: 1000,
                borderTopRightRadius: 7,
                backgroundColor: selected ? neutral22 : neutral00,
              }}
              onPress={() => onPress?.()}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  zIndex: 1000,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    zIndex: 1000,
                  }}
                >
                  <OptimizedImage
                    sourceURI={userInfo.metadata.image}
                    width={32}
                    height={32}
                    style={{
                      height: 32,
                      width: 32,
                      borderRadius: 18,
                    }}
                  />

                  <SpacerRow size={1} />

                  <OmniLink
                    to={{
                      screen: "UserPublicProfile",
                      params: { id: nft.ownerId },
                    }}
                  >
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
                      {userInfo.metadata?.tokenId ||
                        shortUserAddressFromID(nft.ownerId, 10)}
                    </BrandText>
                  </OmniLink>
                </View>
                {selected && (
                  <View style={{ position: "relative", zIndex: 1000 }}>
                    <SVG
                      source={checkMark}
                      color={yellowDefault}
                      height={32}
                      width={32}
                    />
                  </View>
                )}
              </View>
              <ImageWithTextInsert
                size={250}
                imageURL={nft.imageUri}
                style={{
                  marginTop: 15,
                  marginBottom: 20,
                  borderRadius: 12,
                  width: widthNumber - insideMargin * 2,
                  height: widthNumber - insideMargin * 2,
                }}
              />
              <BrandText
                style={{
                  fontSize: 14,
                  marginBottom: 12,
                }}
                ellipsizeMode="tail"
                numberOfLines={1}
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
                    flex: 1,
                  }}
                >
                  <NetworkIcon size={12} networkId={nft.networkId} />
                  <BrandText
                    numberOfLines={1}
                    style={{
                      fontSize: 12,
                      marginLeft: layout.spacing_x1,
                    }}
                  >
                    {nft.collectionName}
                  </BrandText>
                </View>
              </View>
            </Pressable>
          </View>
        </TertiaryBox>
      </View>
    </>
  );
});

// using this because ellipizeMode seems broken
const shortUserAddressFromID = (id: string, size: number) => {
  const [network] = parseUserId(id);
  if (network) {
    const prefixLen = network.idPrefix.length + 1;
    return (
      id.substring(prefixLen, prefixLen + size) +
      "..." +
      id.substring(id.length - size)
    );
  }
  return id.substring(0, size) + "..." + id.substring(id.length - size);
};
