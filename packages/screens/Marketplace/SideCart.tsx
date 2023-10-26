import { toUtf8 } from "@cosmjs/encoding";
import { EncodeObject } from "@cosmjs/proto-signing";
import { isDeliverTxFailure } from "@cosmjs/stargate";
import { EntityId } from "@reduxjs/toolkit";
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

import closeSVG from "../../../assets/icons/close.svg";
import { NFT } from "../../api/marketplace/v1/marketplace";
import { BrandText } from "../../components/BrandText";
import { CurrencyIcon } from "../../components/CurrencyIcon";
import { OptimizedImage } from "../../components/OptimizedImage";
import { SVG } from "../../components/SVG";
import { Separator } from "../../components/Separator";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { shortUserAddressFromID } from "../../components/nfts/NFTView";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { Wallet } from "../../context/WalletsProvider";
import { useBalances } from "../../hooks/useBalances";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  getKeplrSigningCosmWasmClient,
  parseNftId,
  txExplorerLink,
} from "../../networks";
import {
  emptyCart,
  removeSelected,
  selectAllSelectedNFTData,
  selectSelectedNFTDataById,
  selectSelectedNFTIds,
  selectShowCart,
  setShowCart,
} from "../../store/slices/marketplaceCartItems";
import { RootState, useAppDispatch } from "../../store/store";
import { prettyPrice } from "../../utils/coins";
import {
  codGrayColor,
  errorColor,
  neutral44,
  neutral77,
  neutralA3,
  primaryColor,
} from "../../utils/style/colors";
import {
  fontMedium10,
  fontSemibold12,
  fontSemibold14,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { modalMarginPadding } from "../../utils/style/modals";

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
        <BrandText style={fontSemibold14}>Cart </BrandText>
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
    selectSelectedNFTDataById(state, id)
  );
  const userInfo = useNSUserInfo(nft?.ownerId);

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
              dispatch(removeSelected(id));
            }}
          >
            <TrashIcon size={14} color={neutralA3} />
          </Pressable>
        </View>
        <Separator />
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            flexWrap: "nowrap",
            alignItems: "center",
            marginTop: layout.spacing_x1,
          }}
        >
          <BrandText style={[fontSemibold12, { color: primaryColor }]}>
            {userInfo.metadata?.tokenId ||
              shortUserAddressFromID(nft.ownerId, 10)}
          </BrandText>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <BrandText
              style={[
                fontSemibold12,
                {
                  marginRight: layout.spacing_x0_5,
                },
              ]}
            >
              {prettyPrice(nft.networkId, nft.price, nft.denom)}
            </BrandText>
            <CurrencyIcon
              networkId={nft.networkId}
              denom={nft.denom}
              size={15}
            />
          </View>
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
          {typeof textRight === "number" ? textRight.toFixed(2) : textRight}
        </BrandText>
        {showLogo && (
          <CurrencyIcon networkId={networkId} denom={denom} size={16} />
        )}
      </View>
    </View>
  );
};

const Footer: React.FC<{ items: any[] }> = ({ items }) => {
  const wallet = useSelectedWallet();
  const dispatch = useAppDispatch();

  const selectedNFTData = useSelector(selectAllSelectedNFTData);
  const { setToastError, setLoadingFullScreen, setToastSuccess } =
    useFeedbacks();

  const balances = useBalances(wallet?.networkId, wallet?.address);
  const hasEnoughMoney = selectedNFTData.every((nft) => {
    const balance =
      balances.find((bal) => bal.denom === nft.denom)?.amount || "0";
    return parseInt(balance, 10) > parseInt(nft.price, 10);
  });

  const cosmosMultiBuy = useCallback(
    async (wallet: Wallet) => {
      const sender = wallet.address;
      if (!sender) {
        throw Error("invalid buy args");
      }

      const msgs: EncodeObject[] = [];

      selectedNFTData.map((nft) => {
        const [network, , tokenId] = parseNftId(nft.id);

        if (nft.networkId !== "teritori" || !network) {
          alert(`${nft.networkId} multi-buy is not supported`);
          return;
        }

        let funds;
        if (nft.price !== "0") {
          funds = [{ amount: nft.price, denom: nft.denom }];
        }

        const msg = {
          typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
          value: {
            sender,
            msg: toUtf8(
              JSON.stringify({
                buy: {
                  nft_contract_addr: nft.nftContractAddress,
                  nft_token_id: tokenId,
                },
              })
            ),
            contract: network.vaultContractAddress,
            funds,
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
            "auto"
          );
          if (isDeliverTxFailure(tx)) {
            throw Error(tx.transactionHash);
          }
          selectedNFTData.map((nft) => {
            setToastSuccess({
              title: "Purchased",
              message: "View TX",
              duration: 10000,
              onPress: () => {
                Linking.openURL(txExplorerLink("teritori", tx.transactionHash)); // test it further
              },
            });
            dispatch(removeSelected(nft.id)); //remove items from cart
            setLoadingFullScreen(false);
          });
        } catch (e: any) {
          setToastError({
            title: "Error",
            message: e.toString() || "",
            duration: 30000,
          });
        }
      }
    },
    [
      dispatch,
      selectedNFTData,
      setLoadingFullScreen,
      setToastError,
      setToastSuccess,
    ]
  );

  const onBuyButtonPress = async () => {
    if (!wallet) return alert("no wallet");
    await cosmosMultiBuy(wallet);
  };

  const getTotal = (selectedNFTData: NFT[]) => {
    const sum = selectedNFTData.reduce(
      (partialSum, nft) => partialSum + Number.parseFloat(nft.price),
      0
    );
    return prettyPrice(
      selectedNFTData[0].networkId,
      sum.toString(10),
      selectedNFTData[0].denom
    );
  };
  const grouped = groupBy(selectedNFTData, (e) => {
    return e.denom;
  });

  return (
    <View>
      {Object.values(grouped).map((totals, index) => {
        return (
          <ItemTotal
            textLeft="You pay"
            showLogo
            key={index}
            textRight={getTotal(totals)}
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
          disabled={!hasEnoughMoney}
          text={hasEnoughMoney ? "Buy Now" : "Not Enough Funds"}
          onPress={() => onBuyButtonPress()}
        />
      </View>
    </View>
  );
};

export const SideCart: React.FC<{ style?: StyleProp<ViewStyle> }> = ({
  style,
}) => {
  const dispatch = useAppDispatch();
  const selected = useSelector(selectSelectedNFTIds);
  const handleEmptyCart = () => {
    dispatch(emptyCart());
  };
  const handleHideCart = () => {
    dispatch(setShowCart(false));
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

export const useShowCart = () => {
  const selected = useSelector(selectSelectedNFTIds);
  return useSelector(selectShowCart) && selected.length > 0;
};
