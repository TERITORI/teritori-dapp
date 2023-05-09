import { EntityId } from "@reduxjs/toolkit";
import React, { useState } from "react";
import { FlatList, Pressable, StyleProp, View, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { TrashIcon } from "react-native-heroicons/outline";
import { useSelector } from "react-redux";

import closeSVG from "../../../assets/icons/close.svg";
import teritoriLogoSVG from "../../../assets/logos/logo.svg";
import { BrandText } from "../../components/BrandText";
import { CurrencyIcon } from "../../components/CurrencyIcon";
import { OptimizedImage } from "../../components/OptimizedImage";
import { SVG } from "../../components/SVG";
import { Separator } from "../../components/Separator";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import {
  clearSelected,
  removeSelected,
  selectAllSelectedNFTData,
  selectSelectedNFTDataById,
  selectSelectedNFTIds,
} from "../../store/slices/marketplaceCartItems";
import { RootState, useAppDispatch } from "../../store/store";
import { prettyPrice } from "../../utils/coins";
import {
  codGrayColor,
  errorColor,
  neutral44,
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
      }}
    >
      <BrandText style={fontSemibold14}>Cart {items.length}</BrandText>
      <BrandText
        style={[
          {
            backgroundColor: "rgba(244, 111, 118, 0.22)",
            borderStyle: "solid",
            borderWidth: 1,
            borderRadius: 32,
            width: 37,
            height: 16,
            color: errorColor,
            paddingTop: 2,
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

  const dispatch = useAppDispatch();
  return nft ? (
    <View>
      <View
        style={{
          backgroundColor: codGrayColor,
          borderRadius: 8,
          padding: layout.padding_x1,
          marginBottom: layout.padding_x1,
        }}
      >
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            flexWrap: "nowrap",
            alignItems: "center",
          }}
        >
          <OptimizedImage
            source={{ uri: nft?.imageUri }}
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
            <TrashIcon size={10} color={neutralA3} />
          </Pressable>
        </View>
        <Separator />
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            flexWrap: "nowrap",
            alignItems: "center",
            marginTop: layout.padding_x0_5,
          }}
        >
          <BrandText style={[fontSemibold12, { color: primaryColor }]}>
            {/*{info?.ownerAddress}*/}
            you
          </BrandText>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <BrandText style={fontSemibold12}>
              {prettyPrice(nft.networkId, nft.price, nft.denom)}
            </BrandText>
            <CurrencyIcon
              networkId={nft.networkId}
              denom={nft.denom}
              size={16}
            />
          </View>
        </View>
      </View>
    </View>
  ) : null;
};

const ItemTotal: React.FC<{
  textLeft: string;
  showLogo?: boolean;
  textRight: string | number;
}> = ({ textLeft, showLogo = false, textRight }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "space-between",
        marginBottom: layout.padding_x1,
        marginTop: layout.padding_x1,
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
        {showLogo && <SVG source={teritoriLogoSVG} height={16} width={16} />}
        <BrandText style={fontSemibold12}>{textRight}</BrandText>
      </View>
    </View>
  );
};

const Footer: React.FC<{ items: any[] }> = ({ items }) => {
  const onBuyButtonPress = () => {
    console.log("Implement buy");
  };
  const selected = useSelector(selectAllSelectedNFTData);

  const subTotal = selected.reduce(
    (partialSum, nft) =>
      partialSum +
      Number.parseFloat(prettyPrice(nft.networkId, nft.price, nft.denom)),
    0
  );
  const takerFee = subTotal * 0.015;
  const royalty = subTotal * 0.033;
  const total = royalty + subTotal + takerFee;
  return (
    <View
      style={{
        padding: layout.padding_x1,
      }}
    >
      <ItemTotal
        textLeft={`Price (${items.length})`}
        showLogo
        textRight={subTotal}
      />
      <ItemTotal textLeft="Royalty" showLogo textRight={royalty} />
      <ItemTotal textLeft="Taker Fee" showLogo={false} textRight={takerFee} />
      <Separator />
      <ItemTotal textLeft="You pay" showLogo textRight={Math.round(total)} />
      <Separator />

      <View
        style={{
          marginTop: layout.padding_x1,
        }}
      >
        <PrimaryButton
          fullWidth
          size="SM"
          text="Buy Now"
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
  const emptyCart = () => {
    dispatch(clearSelected());
  };
  return useShowCart() ? (
    <View style={style}>
      <Header
        items={selected}
        onPressClear={() => emptyCart()}
        onPressHide={() => emptyCart()}
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

  return selected.length > 0;
};
