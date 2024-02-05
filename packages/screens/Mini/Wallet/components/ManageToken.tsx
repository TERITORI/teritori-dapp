import React from "react";
import { Switch, View } from "react-native";
import { useSelector } from "react-redux";

import questionSVG from "../../../../../assets/icons/question-gray.svg";
import { BrandText } from "../../../../components/BrandText";
import { SVGorImageIcon } from "../../../../components/SVG/SVGorImageIcon";
import { selectTokenId, updateOne } from "../../../../store/slices/wallets";
import { RootState, useAppDispatch } from "../../../../store/store";
import { prettyPrice } from "../../../../utils/coins";
import {
  blueDefault,
  neutral33,
  neutral39,
  neutral99,
  neutralA3,
  secondaryColor,
} from "../../../../utils/style/colors";
import { fontSemibold14, fontSemibold22 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { findByBaseDenom } from "../../../Wallet/util/chain-registry";

type Props = {
  amount: string;
  denom: string;
  showSwitch?: boolean;
};

export const ManageToken = ({ amount, showSwitch = true, denom }: Props) => {
  const assetList = findByBaseDenom(denom);
  const asset = assetList?.assets[0];
  const token = useSelector((state: RootState) => selectTokenId(state, denom));

  const dispatch = useAppDispatch();

  const onToggleSwitch = () => {
    if (!token) {
      dispatch(
        updateOne({
          denom,
          enabled: true,
          networkId: "teritori",
          decimals: asset?.denom_units[0].exponent || 6, // default to 6
          symbol: asset ? asset.symbol : denom,
        }),
      );
    } else {
      dispatch(
        updateOne({
          ...token,
          enabled: !token.enabled,
        }),
      );
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: layout.spacing_x1_5,
        marginVertical: layout.spacing_x1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: layout.spacing_x1_5,
        }}
      >
        <View
          style={{
            backgroundColor: !asset?.logo_URIs?.svg ? neutral39 : "transparent",
            borderRadius: 100,
            alignItems: "center",
            justifyContent: "center",
            width: 24,
            height: 24,
          }}
        >
          <SVGorImageIcon
            icon={asset?.logo_URIs?.svg || questionSVG}
            iconSize={asset?.logo_URIs?.svg ? 24 : 18}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: layout.spacing_x0_5,
          }}
        >
          <BrandText style={[fontSemibold22, {}]}>{asset?.symbol}</BrandText>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: layout.spacing_x1_5,
        }}
      >
        <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
          {prettyPrice(assetList?.chain_name, amount, denom)}
        </BrandText>
        {showSwitch && (
          <Switch
            value={token?.enabled || false}
            onChange={() => {
              onToggleSwitch();
            }}
            trackColor={{ false: neutral33, true: blueDefault }}
            thumbColor={!token?.enabled ? neutral99 : secondaryColor}
            ios_backgroundColor={token?.enabled ? blueDefault : neutral33}
          />
        )}
      </View>
    </View>
  );
};
