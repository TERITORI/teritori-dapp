import { toUtf8 } from "@cosmjs/encoding";
import { EncodeObject } from "@cosmjs/proto-signing";
import { isDeliverTxFailure } from "@cosmjs/stargate";
import { EntityId } from "@reduxjs/toolkit";
import { useQueryClient } from "@tanstack/react-query";
import { groupBy } from "lodash";
import React, { useCallback } from "react";
import {
  FlatList,
  Linking,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { TrashIcon } from "react-native-heroicons/outline";
import { useSelector } from "react-redux";

import closeSVG from "@/assets/icons/close.svg";
import { BrandText } from "@/components/BrandText";
import { CurrencyIcon } from "@/components/CurrencyIcon";
import { OptimizedImage } from "@/components/OptimizedImage";
import { SVG } from "@/components/SVG";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { Separator } from "@/components/separators/Separator";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { Wallet } from "@/context/WalletsProvider";
import { popularCollectionsQueryKey } from "@/hooks/marketplace/usePopularCollections";
import { nftBurnerTotalQueryKey } from "@/hooks/nft-burner/useNFTBurnerTotal";
import { nftBurnerUserCountQueryKey } from "@/hooks/nft-burner/useNFTBurnerUserCount";
import { collectionStatsQueryKey } from "@/hooks/useCollectionStats";
import { nftsQueryKey } from "@/hooks/useNFTs";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import {
  getCollectionId,
  getNetworkFeature,
  NetworkFeature,
  parseNftId,
  txExplorerLink,
} from "@/networks";
import { getKeplrSigningCosmWasmClient } from "@/networks/signer";
import {
  emptyBurnCart,
  removeSelectedFromBurn,
  selectAllSelectedNFTData,
  selectSelectedNFTDataById,
  selectSelectedNFTIds,
  selectShowCart,
  setShowBurnCart,
} from "@/store/slices/burnCartItems";
import { RootState, useAppDispatch } from "@/store/store";
import {
  codGrayColor,
  errorColor,
  neutral44,
  neutral77,
  neutralA3,
} from "@/utils/style/colors";
import {
  fontMedium10,
  fontSemibold12,
  fontSemibold14,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { modalMarginPadding } from "@/utils/style/modals";

const Header: React.FC<{
  items: any[];
  onPressClear: () => void;
  onPressHide: () => void;
}> = ({ items, onPressClear, onPressHide }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "space-between",
        borderStyle: "solid",
        borderBottomColor: neutral44,
        borderWidth: 1,
        marginBottom: 10,
        paddingBottom: 6,
      }}
    >
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <BrandText style={fontSemibold14}>Burn </BrandText>
        <BrandText
          style={[
            fontSemibold14,
            {
              color: neutral77,
            },
          ]}
        >
          {items.length}
        </BrandText>
      </View>

      <BrandText
        style={[
          {
            backgroundColor: "rgba(244, 111, 118, 0.22)",
            borderStyle: "solid",
            borderWidth: 1,
            borderRadius: 32,
            width: 37,
            height: 18,
            color: errorColor,
            paddingTop: 2.5,
            paddingRight: 6,
            paddingBottom: 2,
            paddingLeft: 6,
          },
          fontMedium10,
        ]}
        onPress={onPressClear}
      >
        Clear
      </BrandText>
      <TouchableOpacity
        containerStyle={[{ marginLeft: modalMarginPadding }]}
        style={{ justifyContent: "flex-end" }}
        onPress={onPressHide}
      >
        <SVG width={20} height={20} source={closeSVG} />
      </TouchableOpacity>
    </View>
  );
};

const CartItems: React.FC<{ id: EntityId }> = ({ id }) => {
  const nft = useSelector((state: RootState) =>
    selectSelectedNFTDataById(state, id),
  );

  const dispatch = useAppDispatch();
  return nft ? (
    <View>
      <View
        style={{
          backgroundColor: codGrayColor,
          borderRadius: 8,
          padding: layout.spacing_x1,
          marginBottom: layout.spacing_x1,
        }}
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
          <OptimizedImage
            sourceURI={nft?.imageUri}
            width={40}
            height={40}
            style={{
              height: 40,
              width: 40,
              borderRadius: 4,
              marginRight: 6,
            }}
          />
          <BrandText style={fontSemibold12}>{nft?.name}</BrandText>
          <Pressable
            onPress={() => {
              dispatch(removeSelectedFromBurn(id));
            }}
          >
            <TrashIcon size={14} color={neutralA3} />
          </Pressable>
        </View>
      </View>
    </View>
  ) : null;
};

const ItemTotal: React.FC<{
  textLeft: string;
  networkId: string;
  denom: string;
  showLogo?: boolean;
  textRight: string | number;
}> = ({ textLeft, showLogo = false, textRight, networkId, denom }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "space-between",
        marginBottom: layout.spacing_x1,
        marginTop: layout.spacing_x1,
      }}
    >
      <BrandText style={[fontSemibold12, { color: neutralA3 }]}>
        {textLeft}
      </BrandText>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "nowrap",
          justifyContent: "space-around",
        }}
      >
        <BrandText
          style={[fontSemibold12, { marginRight: layout.spacing_x0_5 }]}
        >
          {typeof textRight === "number" ? textRight.toFixed(0) : textRight}
        </BrandText>
        {showLogo && (
          <CurrencyIcon networkId={networkId} denom={denom} size={16} />
        )}
      </View>
    </View>
  );
};

const Footer: React.FC<{ items: any[] }> = ({ items }) => {
  const { setToast } = useFeedbacks();
  const wallet = useSelectedWallet();
  const dispatch = useAppDispatch();

  const selectedNFTData = useSelector(selectAllSelectedNFTData);
  const { setToastError, setLoadingFullScreen, setToastSuccess } =
    useFeedbacks();
  const queryClient = useQueryClient();

  const cosmosMultiBuy = useCallback(
    async (wallet: Wallet) => {
      const sender = wallet.address;
      if (!sender) {
        throw Error("invalid buy args");
      }

      const msgs: EncodeObject[] = [];

      selectedNFTData.map((nft) => {
        const [network, , tokenId] = parseNftId(nft.id);

        const burnerFeature = getNetworkFeature(
          nft.networkId,
          NetworkFeature.CosmWasmNFTsBurner,
        );

        if (!burnerFeature || !network) {
          setToast({
            title: `${nft.networkId} multi-burn is not supported`,
            duration: 5000,
            mode: "normal",
            type: "error",
          });
          return;
        }

        const msg = {
          typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
          value: {
            sender,
            msg: toUtf8(
              JSON.stringify({
                send_nft: {
                  contract: burnerFeature.burnerContractAddress, //nft.nftContractAddress,
                  token_id: tokenId,
                },
              }),
            ),
            contract: nft.nftContractAddress,
            funds: [],
          },
        };

        msgs.push(msg);
      });
      if (msgs.length > 0) {
        setLoadingFullScreen(true);
        const cosmwasmClient = await getKeplrSigningCosmWasmClient("teritori");

        try {
          const tx = await cosmwasmClient.signAndBroadcast(
            sender,
            msgs,
            "auto",
          );
          if (isDeliverTxFailure(tx)) {
            throw Error(tx.transactionHash);
          }
          selectedNFTData.map(async (nft) => {
            setToastSuccess({
              title: "Burned",
              message: "View TX",
              duration: 10000,
              onPress: () => {
                Linking.openURL(txExplorerLink("teritori", tx.transactionHash)); // test it further
              },
            });
            dispatch(removeSelectedFromBurn(nft.id)); //remove items from cart

            // invalidate cache
            const [, mintContractAddress] = parseNftId(nft.id);

            await Promise.all([
              queryClient.invalidateQueries(nftsQueryKey()),
              queryClient.invalidateQueries(
                nftBurnerTotalQueryKey(nft.networkId),
              ),
              queryClient.invalidateQueries(
                nftBurnerUserCountQueryKey(wallet.userId),
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
            // end of invalidate cache

            setLoadingFullScreen(false);
          });
        } catch (e: any) {
          setToastError({
            title: "Error",
            message: `${e}`,
            duration: 30000,
          });
        }
      }
    },
    [
      dispatch,
      selectedNFTData,
      setLoadingFullScreen,
      setToast,
      queryClient,
      setToastError,
      setToastSuccess,
    ],
  );

  const onBuyButtonPress = async () => {
    if (!wallet) {
      setToast({
        title: `Wallet is not connected`,
        duration: 5000,
        mode: "normal",
        type: "error",
      });
      return;
    }
    await cosmosMultiBuy(wallet);
  };

  const grouped = groupBy(selectedNFTData, (e) => {
    return e.denom;
  });

  return (
    <View>
      {Object.values(grouped).map((totals, index) => {
        return (
          <ItemTotal
            textLeft="Total Burn"
            showLogo={false}
            key={index}
            textRight={totals.length}
            networkId={totals[0].networkId}
            denom={totals[0].denom}
          />
        );
      })}
      <Separator />

      <View
        style={{
          marginTop: layout.spacing_x1,
        }}
      >
        <PrimaryButton
          fullWidth
          size="SM"
          disabled={Object.values(grouped).length === 0}
          text="Burn 🫡"
          onPress={() => onBuyButtonPress()}
        />
      </View>
    </View>
  );
};

export const BurnSideCart: React.FC<{ style?: StyleProp<ViewStyle> }> = ({
  style,
}) => {
  const dispatch = useAppDispatch();
  const selected = useSelector(selectSelectedNFTIds);
  const handleEmptyCart = () => {
    dispatch(emptyBurnCart());
  };
  const handleHideCart = () => {
    dispatch(setShowBurnCart(false));
  };

  return useShowCart() ? (
    <View style={style}>
      <Header
        items={selected}
        onPressClear={() => handleEmptyCart()}
        onPressHide={() => handleHideCart()}
      />
      <FlatList
        data={selected}
        renderItem={({ item }) => {
          return <CartItems id={item} />;
        }}
      />
      <Separator />
      <Footer items={selected} />
    </View>
  ) : null;
};

const useShowCart = () => {
  const selected = useSelector(selectSelectedNFTIds);
  return useSelector(selectShowCart) && selected.length > 0;
};
