import React, { useRef, useState } from "react";
import {
  ViewStyle,
  Image,
  View,
  StyleProp,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";

import avatarPNG from "../../../assets/default-images/avatar.png";
import dotsCircleSVG from "../../../assets/icons/dots-circle.svg";
import footerSVG from "../../../assets/icons/footer-regular.svg";
import gridSVG from "../../../assets/icons/grid.svg";
import octagonSVG from "../../../assets/icons/octagon.svg";
import raffleSVG from "../../../assets/icons/raffle.svg";
import sendSVG from "../../../assets/icons/send.svg";
import { NFT } from "../../api/marketplace/v1/marketplace";
import { useDropdowns } from "../../context/DropdownsProvider";
import { useTNSMetadata } from "../../hooks/useTNSMetadata";
import { prettyPrice } from "../../utils/coins";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { useAppNavigation } from "../../utils/navigation";
import { protobufNetworkToNetwork } from "../../utils/network";
import { neutral00, neutral33, neutral77 } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { DropdownOption } from "../DropdownOption";
import { ImageWithTextInsert } from "../ImageWithTextInsert";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { SecondaryButton } from "../buttons/SecondaryButton";
import { NetworkIcon } from "../images/NetworkIcon";
import { SpacerColumn } from "../spacer";
import { NFTTransferModal } from "./NFTTransferModal";

export const NFTView: React.FC<{
  data: NFT;
  style?: StyleProp<ViewStyle>;
}> = React.memo(({ data: nft, style }) => {
  // variables
  const cardWidth = 258;
  const insideMargin = layout.padding_x2;
  const contentWidth = cardWidth - insideMargin * 2;
  const navigation = useAppNavigation();
  const flatStyle = StyleSheet.flatten(style);
  const tnsMetadata = useTNSMetadata(nft.ownerId.replace("tori-", ""));
  const { onPressDropdownButton, isDropdownOpen, closeOpenedDropdown } =
    useDropdowns();
  const [isTransferNFTVisible, setIsTransferNFTVisible] =
    useState<boolean>(false);
  const dropdownRef = useRef<TouchableOpacity>(null);

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

  // functions
  const toggleTransferNFT = () =>
    setIsTransferNFTVisible(!isTransferNFTVisible);

  // returns
  return (
    <>
      <TouchableOpacity
        ref={dropdownRef}
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
                zIndex: 1000,
              }}
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
                  <Image
                    source={{
                      uri: tnsMetadata.metadata?.image
                        ? ipfsURLToHTTPURL(tnsMetadata.metadata.image)
                        : avatarPNG,
                    }} // TODO: proper fallback
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
                      {tnsMetadata.metadata?.public_name ||
                        shortUserAddressFromID(nft.ownerId, 10)}
                    </BrandText>
                  </View>
                </View>
                <View style={{ position: "relative", zIndex: 1000 }}>
                  <Pressable onPress={() => onPressDropdownButton(dropdownRef)}>
                    <SVG source={dotsCircleSVG} height={32} width={32} />
                  </Pressable>
                  {isDropdownOpen(dropdownRef) && (
                    <View style={styles.optionContainer}>
                      <DropdownOption
                        onPress={closeOpenedDropdown}
                        icon={octagonSVG}
                        isComingSoon
                        label="Set as Avatar"
                      />
                      <SpacerColumn size={0.5} />
                      <DropdownOption
                        onPress={closeOpenedDropdown}
                        isComingSoon
                        icon={gridSVG}
                        label="List this NFT"
                      />
                      <SpacerColumn size={0.5} />
                      <DropdownOption
                        onPress={closeOpenedDropdown}
                        icon={raffleSVG}
                        isComingSoon
                        label="Create Raffle with this NFT"
                      />
                      <SpacerColumn size={0.5} />
                      <DropdownOption
                        onPress={() => {
                          closeOpenedDropdown();
                          toggleTransferNFT();
                        }}
                        icon={sendSVG}
                        label="Send & Transfer this NFT"
                      />
                      <SpacerColumn size={0.5} />
                      <DropdownOption
                        onPress={closeOpenedDropdown}
                        icon={footerSVG}
                        isComingSoon
                        label="Put this NFT in the Rioters Footer"
                      />
                    </View>
                  )}
                </View>
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
      <NFTTransferModal
        nft={nft}
        isVisible={isTransferNFTVisible}
        onClose={() => toggleTransferNFT()}
        onSubmit={() => toggleTransferNFT()}
      />
    </>
  );
});

const styles = StyleSheet.create({
  optionContainer: {
    position: "absolute",
    zIndex: 2,
    top: layout.iconButton + layout.padding_x0_5,
    backgroundColor: neutral00,
    padding: layout.padding_x0_5,
    borderColor: neutral33,
    borderWidth: 1,
    borderRadius: 8,
    right: -layout.padding_x1_5,
    minWidth: 250,
  },
});

// using this because ellipizeMode seems broken
const shortUserAddressFromID = (id: string, size: number) => {
  if (id.startsWith("tori-")) {
    return id.substring(5, 5 + size) + "..." + id.substring(id.length - size);
  }
  return id.substring(0, size) + "..." + id.substring(id.length - size);
};
