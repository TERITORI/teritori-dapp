import { useQueryClient } from "@tanstack/react-query";
import { isEqual } from "lodash";
import React, { memo, useMemo, useState } from "react";
import { View, StyleProp, StyleSheet, Pressable } from "react-native";
import { useSelector } from "react-redux";

import { NFTTransferModal } from "./NFTTransferModal";
import burnSVG from "../../../assets/icons/burn.svg";
import checkMark from "../../../assets/icons/checkmark-marketplace.svg";
import dotsCircleSVG from "../../../assets/icons/dots-circle.svg";
import gridSVG from "../../../assets/icons/grid.svg";
import sendSVG from "../../../assets/icons/send.svg";
import { NFT } from "../../api/marketplace/v1/marketplace";
import { useDropdowns } from "../../hooks/useDropdowns";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  NetworkFeature,
  getCollectionId,
  getNetworkFeature,
  parseNftId,
  parseUserId,
} from "../../networks";
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
import { BrandText } from "../BrandText";
import { CurrencyIcon } from "../CurrencyIcon";
import { DropdownOption } from "../DropdownOption";
import { ImageWithTextInsert } from "../ImageWithTextInsert";
import { NetworkIcon } from "../NetworkIcon";
import { OmniLink } from "../OmniLink";
import { SVG } from "../SVG";
import { BoxStyle } from "../boxes/Box";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { SecondaryButton } from "../buttons/SecondaryButton";
import { UserAvatarWithFrame } from "../images/AvatarWithFrame";
import { SpacerColumn, SpacerRow } from "../spacer";

import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { TeritoriNftClient } from "@/contracts-clients/teritori-nft/TeritoriNft.client";
import { popularCollectionsQueryKey } from "@/hooks/marketplace/usePopularCollections";
import { useNFTBurnerAuthorizedCollections } from "@/hooks/nft-burner/useNFTBurnerAuthorizedCollections";
import { nftBurnerTotalQueryKey } from "@/hooks/nft-burner/useNFTBurnerTotal";
import { nftBurnerUserCountQueryKey } from "@/hooks/nft-burner/useNFTBurnerUserCount";
import { collectionStatsQueryKey } from "@/hooks/useCollectionStats";
import { nftsQueryKey } from "@/hooks/useNFTs";
import { getKeplrSigningCosmWasmClient } from "@/networks/signer";
import {
  addSelectedToBurn,
  setShowBurnCart,
  selectSelectedNFTIds as selectSelectedNFTIdsForBurn,
  removeSelectedFromBurn,
} from "@/store/slices/burnCartItems";

// NOTE: we put content in a memoized component to only rerender the container when the window width changes

export const NFTView: React.FC<{
  data: NFT;
  style?: StyleProp<Omit<BoxStyle, "width"> & { width?: number }>;
}> = memo(({ data: nft, style }) => {
  const isMobile = useIsMobile();
  const cardWidth = isMobile ? 220 : 250;
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
    width,
    ...styleWithoutMargins
  } = flatStyle || {};

  const widthNumber = width || cardWidth;

  const selectedNfts = useSelector(selectSelectedNFTIds);
  const localSelected = useMemo(
    () => new Set(selectedNfts).has(nft.id),
    [nft.id, selectedNfts],
  );

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
        <TertiaryBox
          style={[
            styleWithoutMargins,
            {
              width: widthNumber,
              padding: 0,
              flex: 1,
            },
            localSelected && {
              backgroundColor: neutral22,
            },
          ]}
        >
          <NFTViewContent
            nft={nft}
            mobileMode={isMobile}
            localSelected={localSelected}
            size={width || widthNumber}
          />
        </TertiaryBox>
      </View>
    </>
  );
}, isEqual);

const NFTViewContent: React.FC<{
  nft: NFT;
  mobileMode: boolean;
  localSelected: boolean;
  size: number | undefined;
}> = memo(({ nft, mobileMode, localSelected, size }) => {
  const insideMargin = layout.spacing_x2;
  const selectedWallet = useSelectedWallet();
  const dispatch = useAppDispatch();
  const handleClick = (nft: NFT, selected: boolean) => {
    if (mobileMode) return; // disable cart on mobile
    dispatch(setShowCart(true));
    if (!selected) {
      dispatch(addSelected(nft));
    } else {
      dispatch(removeSelected(nft.id));
    }
  };

  const imgRenderSize = size ? size - insideMargin * 2 : 250;

  const isOwner = nft.ownerId === selectedWallet?.userId;
  return (
    <View style={{ width: "100%" }}>
      <Pressable
        disabled={!nft.isListed || isOwner}
        style={{
          paddingTop: insideMargin,
          paddingBottom: 12,
          paddingHorizontal: insideMargin,
          zIndex: 1000,
          borderTopRightRadius: 7,
        }}
        onPress={() => {
          handleClick(nft, localSelected);
        }}
      >
        <NFTViewHeader nft={nft} localSelected={localSelected} />
        <OmniLink
          to={{
            screen: "NFTDetail",
            params: { id: nft.id },
          }}
        >
          <ImageWithTextInsert
            sourceSize={250}
            imageURL={nft.imageUri}
            textInsert={nft.textInsert}
            style={{
              marginTop: 15,
              marginBottom: 20,
              borderRadius: 12,
              width: imgRenderSize,
              height: imgRenderSize,
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
      <NFTViewFooter nft={nft} localSelected={localSelected} />
    </View>
  );
});

const NFTViewHeader: React.FC<{
  nft: NFT;
  localSelected: boolean;
}> = memo(({ nft, localSelected }) => {
  const selectedWallet = useSelectedWallet();
  const userInfo = useNSUserInfo(nft.ownerId);
  const [isDropdownOpen, setDropdownState, dropdownRef] = useDropdowns();
  const isOwner = !!selectedWallet && nft.ownerId === selectedWallet?.userId;
  const isOwnerAndNotListed = isOwner && !nft.isListed;
  const [isTransferNFTVisible, setIsTransferNFTVisible] =
    useState<boolean>(false);

  return (
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
        <UserAvatarWithFrame
          userId={nft.ownerId}
          size="XXS"
          style={{
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
        <View
          style={{ position: "relative", zIndex: 1000 }}
          ref={dropdownRef}
          collapsable={false}
        >
          <Pressable onPress={() => setDropdownState(!isDropdownOpen)}>
            <SVG source={dotsCircleSVG} height={32} width={32} />
          </Pressable>
          {isDropdownOpen && (
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
              <OmniLink
                to={{
                  screen: "NFTDetail",
                  params: { id: nft.id },
                }}
              >
                <DropdownOption icon={gridSVG} label="Sell" />
              </OmniLink>
              <SpacerColumn size={0.5} />
              <DropdownOption
                onPress={() => {
                  setDropdownState(false);
                  setIsTransferNFTVisible(true);
                }}
                icon={sendSVG}
                label="Send"
              />
              <RecycleSection
                nft={nft}
                closeDropdown={() => setDropdownState(false)}
              />
            </View>
          )}
        </View>
      )}
      <NFTTransferModal
        nft={nft}
        isVisible={isTransferNFTVisible}
        onClose={() => setIsTransferNFTVisible(false)}
        onSubmit={() => setIsTransferNFTVisible(false)}
      />
    </View>
  );
});

const RecycleSection: React.FC<{ nft: NFT; closeDropdown: () => void }> = memo(
  ({ nft, closeDropdown }) => {
    const selectedWallet = useSelectedWallet();
    const { wrapWithFeedback, setLoadingFullScreen } = useFeedbacks();
    const burnerFeature = getNetworkFeature(
      nft.networkId,
      NetworkFeature.CosmWasmNFTsBurner,
    );
    const { data: authorizedCollections } = useNFTBurnerAuthorizedCollections(
      nft.networkId,
    );
    const queryClient = useQueryClient();

    const showRecycle =
      !!burnerFeature &&
      (authorizedCollections || []).includes(nft.nftContractAddress);
    if (!showRecycle || !selectedWallet) {
      return null;
    }

    return (
      <>
        <SpacerColumn size={0.5} />
        <DropdownOption
          onPress={wrapWithFeedback(
            async () => {
              setLoadingFullScreen(true);
              try {
                closeDropdown();
                const [, mintContractAddress, tokenId] = parseNftId(nft.id);
                if (!mintContractAddress || !tokenId) {
                  throw new Error("Invalid NFT ID");
                }
                const cosmWasmClient = await getKeplrSigningCosmWasmClient(
                  nft.networkId,
                  "low",
                );
                const collectionClient = new TeritoriNftClient(
                  cosmWasmClient,
                  selectedWallet.address,
                  nft.nftContractAddress,
                );
                await collectionClient.sendNft({
                  contract: burnerFeature.burnerContractAddress,
                  tokenId,
                  msg: "",
                });
                await Promise.all([
                  queryClient.invalidateQueries(nftsQueryKey()),
                  queryClient.invalidateQueries(
                    nftBurnerTotalQueryKey(nft.networkId),
                  ),
                  queryClient.invalidateQueries(
                    nftBurnerUserCountQueryKey(selectedWallet.userId),
                  ),
                  queryClient.invalidateQueries(
                    collectionStatsQueryKey(
                      getCollectionId(nft.networkId, mintContractAddress),
                    ),
                  ),
                  queryClient.invalidateQueries(
                    popularCollectionsQueryKey(nft.networkId),
                  ),
                ]);
              } finally {
                setLoadingFullScreen(false);
              }
            },
            { title: "Recycled NFT!" },
          )}
          icon={burnSVG}
          label="Recycle"
        />
      </>
    );
  },
);

const NFTViewFooter: React.FC<{ nft: NFT; localSelected: boolean }> = memo(
  ({ nft, localSelected }) => {
    const selectedWallet = useSelectedWallet();
    const isOwner = nft.ownerId === selectedWallet?.userId;
    const dispatch = useAppDispatch();

    const burnerFeature = getNetworkFeature(
      nft.networkId,
      NetworkFeature.CosmWasmNFTsBurner,
    );
    const { data: authorizedCollections } = useNFTBurnerAuthorizedCollections(
      nft.networkId,
    );

    const showRecycle =
      !!burnerFeature &&
      (authorizedCollections || []).includes(nft.nftContractAddress);

    const selectedForBurn = useSelector(selectSelectedNFTIdsForBurn).includes(
      nft.id,
    );
    return (
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: neutral33,
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
            <>
              {showRecycle ? (
                <PrimaryButton
                  onPress={() => {
                    dispatch(setShowBurnCart(true));
                    if (!selectedForBurn) {
                      dispatch(addSelectedToBurn(nft));
                    } else {
                      dispatch(removeSelectedFromBurn(nft.id));
                    }
                  }}
                  text={selectedForBurn ? "Added to the burn 🔥" : "Burnable"}
                />
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
            </>
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
              noHoverEffect
            >
              <SecondaryButton
                size="XS"
                text={prettyPrice(nft.networkId, nft.price, nft.denom)}
                fullWidth
                numberOfLines={1}
              />
            </OmniLink>
          </View>
        )}
      </View>
    );
  },
);

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
