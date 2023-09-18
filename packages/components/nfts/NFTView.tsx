import React, { memo, useRef, useState } from "react";
import {
  ViewStyle,
  View,
  StyleProp,
  StyleSheet,
  Pressable,
} from "react-native";
import { useSelector } from "react-redux";

import { NFTTransferModal } from "./NFTTransferModal";
import { minNFTWidth } from "./NFTs";
import checkMark from "../../../assets/icons/checkmark-marketplace.svg";
import dotsCircleSVG from "../../../assets/icons/dots-circle.svg";
import footerSVG from "../../../assets/icons/footer-regular.svg";
import gridSVG from "../../../assets/icons/grid.svg";
import octagonSVG from "../../../assets/icons/octagon.svg";
import raffleSVG from "../../../assets/icons/raffle.svg";
import sendSVG from "../../../assets/icons/send.svg";
import { NFT } from "../../api/marketplace/v1/marketplace";
import { useDropdowns } from "../../context/DropdownsProvider";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getNetwork, parseUserId } from "../../networks";
import {
  addSelected,
  removeSelected,
  selectSelectedNFTIds,
  setShowCart,
} from "../../store/slices/marketplaceCartItems";
import { useAppDispatch } from "../../store/store";
import { prettyPrice } from "../../utils/coins";
import {
  neutral00,
  neutral22,
  neutral33,
  neutral77,
} from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { nameServiceDefaultImage } from "../../utils/tns";
import { BrandText } from "../BrandText";
import { CurrencyIcon } from "../CurrencyIcon";
import { DropdownOption } from "../DropdownOption";
import { ImageWithTextInsert } from "../ImageWithTextInsert";
import { NetworkIcon } from "../NetworkIcon";
import { OmniLink } from "../OmniLink";
import { OptimizedImage } from "../OptimizedImage";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { SecondaryButton } from "../buttons/SecondaryButton";
import { SpacerColumn, SpacerRow } from "../spacer";

export const NFTView: React.FC<{
  data: NFT;
  style?: StyleProp<ViewStyle>;
}> = memo(({ data: nft, style }) => {
  const isMobile = useIsMobile();
  const cardWidth = isMobile ? 220 : 250;
  const { width: maxWidth } = useMaxResolution({ isLarge: true });
  const insideMargin = layout.spacing_x2;
  const flatStyle = StyleSheet.flatten(style);
  const selectedWallet = useSelectedWallet();
  const userInfo = useNSUserInfo(nft.ownerId);
  const network = getNetwork(nft.networkId);
  const { onPressDropdownButton, isDropdownOpen, closeOpenedDropdown } =
    useDropdowns();
  const [isTransferNFTVisible, setIsTransferNFTVisible] =
    useState<boolean>(false);
  const localSelected = new Set(useSelector(selectSelectedNFTIds)).has(nft.id);
  const dispatch = useAppDispatch();
  const handleClick = (nft: NFT, selected: boolean) => {
    if (maxWidth < 500) return; // disable cart on mobile
    dispatch(setShowCart(true));
    if (!selected) {
      dispatch(addSelected(nft));
    } else {
      dispatch(removeSelected(nft.id));
    }
  };
  const dropdownRef = useRef<View>(null);

  const isOwner = nft.ownerId === selectedWallet?.userId;

  const isOwnerAndNotListed = isOwner && !nft.isListed;

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

  // functions
  const toggleTransferNFT = () =>
    setIsTransferNFTVisible(!isTransferNFTVisible);

  if (nft.id.startsWith("padded-")) {
    return <View style={{ width }} />;
  }

  const widthNumber =
    typeof width === "number" ? width : parseInt(width || "0", 10) || cardWidth;

  return (
    <>
      <View
        ref={dropdownRef}
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
          // height={438}
          width={widthNumber}
          style={styleWithoutMargins}
        >
          <View style={{ width: "100%" }}>
            <Pressable
              disabled={!nft.isListed || isOwner}
              style={{
                paddingTop: insideMargin,
                paddingBottom: 12,
                paddingHorizontal: insideMargin,
                zIndex: 1000,
                borderTopRightRadius: 7,
                backgroundColor: localSelected ? neutral22 : neutral00,
              }}
              onPress={() => {
                handleClick(nft, localSelected);
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
                  <OptimizedImage
                    sourceURI={userInfo.metadata.image}
                    fallbackURI={nameServiceDefaultImage(network)}
                    width={32}
                    height={32}
                    style={{
                      height: 32,
                      width: 32,
                      borderRadius: 18,
                      marginRight: 6,
                    }}
                  />
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
                {localSelected && (
                  <View style={{ position: "relative", zIndex: 1000 }}>
                    <SVG source={checkMark} height={32} width={32} />
                  </View>
                )}
                {isOwnerAndNotListed && (
                  <View style={{ position: "relative", zIndex: 1000 }}>
                    <Pressable
                      onPress={() => onPressDropdownButton(dropdownRef)}
                    >
                      <SVG source={dotsCircleSVG} height={32} width={32} />
                    </Pressable>
                    {isDropdownOpen(dropdownRef) && (
                      <View
                        style={{
                          position: "absolute",
                          zIndex: 2,
                          top: layout.iconButton + layout.spacing_x0_5,
                          backgroundColor: neutral00,
                          padding: layout.spacing_x0_5,
                          borderColor: neutral33,
                          borderWidth: 1,
                          borderRadius: 8,
                          right: -layout.spacing_x1_5,
                          minWidth: 250,
                        }}
                      >
                        <DropdownOption
                          onPress={closeOpenedDropdown}
                          icon={octagonSVG}
                          isComingSoon
                          label="Set as Avatar"
                        />
                        <SpacerColumn size={0.5} />
                        <OmniLink
                          to={{
                            screen: "NFTDetail",
                            params: { id: nft.id },
                          }}
                        >
                          <DropdownOption
                            icon={gridSVG}
                            label="List this NFT"
                          />
                        </OmniLink>
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
                )}
              </View>
              <OmniLink
                to={{
                  screen: "NFTDetail",
                  params: { id: nft.id },
                }}
              >
                <ImageWithTextInsert
                  size={minNFTWidth}
                  imageURL={nft.imageUri}
                  textInsert={nft.textInsert}
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
              </OmniLink>
            </Pressable>
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: neutral33,
                backgroundColor: localSelected ? neutral22 : neutral00,
                height: 69,
                paddingHorizontal: 16,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                borderBottomLeftRadius: 7, // HAS to be 7
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
                    <CurrencyIcon
                      size={24}
                      networkId={nft.networkId}
                      denom={nft.denom}
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
              <SpacerRow size={2} />
              {nft.isListed && (
                <View style={{ flex: 1 }}>
                  <OmniLink
                    to={{
                      screen: "NFTDetail",
                      params: { id: nft.id, openBuy: !isOwner },
                    }}
                  >
                    <SecondaryButton
                      size="XS"
                      squaresBackgroundColor={
                        localSelected ? neutral22 : neutral00
                      }
                      text={prettyPrice(nft.networkId, nft.price, nft.denom)}
                      fullWidth
                      numberOfLines={1}
                      activeOpacity={1}
                    />
                  </OmniLink>
                </View>
              )}
            </View>
          </View>
        </TertiaryBox>
      </View>
      <NFTTransferModal
        nft={nft}
        isVisible={isTransferNFTVisible}
        onClose={() => toggleTransferNFT()}
        onSubmit={() => toggleTransferNFT()}
      />
    </>
  );
});

// using this because ellipizeMode seems broken
export const shortUserAddressFromID = (id: string, size: number) => {
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
