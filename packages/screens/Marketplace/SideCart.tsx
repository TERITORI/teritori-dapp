import React from "react";
import { FlatList, StyleProp, View, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { TrashIcon } from "react-native-heroicons/solid";
import { useSelector } from "react-redux";

import closeSVG from "../../../assets/icons/close.svg";
import teritoriLogoSVG from "../../../assets/logos/logo.svg";
import { BrandText } from "../../components/BrandText";
import { OptimizedImage } from "../../components/OptimizedImage";
import { SVG } from "../../components/SVG";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { SpacerRow } from "../../components/spacer";
import { useNFTInfo } from "../../hooks/useNFTInfo";
import {
  clearSelected,
  selectSelectedNFT,
} from "../../store/slices/marketplaceReducer";
import { useAppDispatch } from "../../store/store";
import { modalMarginPadding } from "../../utils/style/modals";

const Header: React.FC<{ items: any[]; onPress: () => void }> = ({
  items,
  onPress,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      <BrandText>Cart {items.length}</BrandText>
      <TouchableOpacity
        containerStyle={[{ marginLeft: modalMarginPadding }]}
        style={{ justifyContent: "center" }}
        onPress={onPress}
      >
        <SVG width={20} height={20} source={closeSVG} />
      </TouchableOpacity>
    </View>
  );
};

const CartItems: React.FC<{ id: string }> = ({ id }) => {
  const { info } = useNFTInfo(id);

  return info ? (
    <View>
      <View
        style={{
          justifyContent: "space-between",
        }}
      >
        <OptimizedImage
          source={{ uri: info?.imageURL }}
          width={40}
          height={40}
          style={{
            height: 40,
            width: 40,
            borderRadius: 2,
            marginRight: 6,
          }}
        />
        <BrandText>{info?.name}</BrandText>
        <TrashIcon size={32} />
      </View>
      <SpacerRow size={0.75} />
      <View
        style={{
          justifyContent: "space-between",
        }}
      >
        <BrandText>{info?.ownerAddress}</BrandText>
        <BrandText>{info?.price}</BrandText>
      </View>
    </View>
  ) : null;
};

const ItemTotal: React.FC<{
  textLeft: string;
  showLogo?: boolean;
  textRight: string;
}> = ({ textLeft, showLogo = false, textRight }) => {
  return (
    <View>
      <BrandText>{textLeft}</BrandText>
      <View>
        {showLogo && <SVG source={teritoriLogoSVG} height={16} width={16} />}
        <BrandText>{textRight}</BrandText>
      </View>
    </View>
  );
};

const Footer: React.FC<{ items: any[] }> = ({ items }) => {
  const onBuyButtonPress = () => {
    console.log("Implement buy");
  };
  const subTotal = "1";
  const takerFee = `1.5%`;
  const total = "50";
  return (
    <View>
      <ItemTotal
        textLeft={`Price (${items.length}`}
        showLogo
        textRight={subTotal}
      />
      <ItemTotal textLeft="Royalty" showLogo textRight={subTotal} />
      <ItemTotal textLeft="Taker Fee" showLogo={false} textRight={takerFee} />
      <SpacerRow size={0.75} />
      <ItemTotal textLeft="You pay" showLogo textRight={total} />
      <SpacerRow size={0.75} />
      <PrimaryButton
        size="M"
        text="Buy Now"
        onPress={() => onBuyButtonPress()}
      />
    </View>
  );
};

export const SideCart: React.FC<{ style?: StyleProp<ViewStyle> }> = ({
  style,
}) => {
  const dispatch = useAppDispatch();
  const selected = useSelector(selectSelectedNFT);
  const emptyCart = () => {
    dispatch(clearSelected());
  };
  return selected.length > 0 ? (
    <View style={style}>
      <Header items={selected} onPress={() => emptyCart()} />
      <FlatList
        data={selected}
        renderItem={({ item }) => {
          return <CartItems id={item} />;
        }}
      />
      <Footer items={selected} />
    </View>
  ) : null;
};
