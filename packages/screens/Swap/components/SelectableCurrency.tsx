import { Decimal } from "cosmwasm";
import React, { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { Separator } from "../../../components/Separator";
import { CurrencyIcon } from "../../../components/images/CurrencyIcon";
import { SpacerColumn } from "../../../components/spacer";
import { useBalances } from "../../../hooks/useBalances";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import {
  CurrencyInfo,
  getNativeCurrency,
  NativeCurrencyInfo,
} from "../../../networks";
import { Balance } from "../../../utils/coins";
import { neutralA3 } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { CurrencyAmount } from "./CurrencyAmount";

export const SelectableCurrency: React.FC<{
  onPressItem: () => void;
  currency: CurrencyInfo;
  networkId: string;
}> = ({ onPressItem, currency, networkId }) => {
  const selectedWallet = useSelectedWallet();
  const balances = useBalances(networkId, selectedWallet?.address);

  const currencyBalance: Balance | undefined = useMemo(
    () => balances.find((bal) => bal.denom === currency?.denom),
    [currency?.denom, balances]
  );

  const currencyNative: NativeCurrencyInfo | undefined = useMemo(
    () => getNativeCurrency(networkId, currency?.denom),
    [currency?.denom]
  );

  const currencyAmount: number = useMemo(() => {
    if (!currencyNative || !currencyBalance) return 0;
    return Decimal.fromAtomics(
      currencyBalance.amount,
      currencyNative.decimals
    ).toFloatApproximation();
  }, [currency?.denom, currencyBalance?.amount, currencyNative?.decimals]);

  return (
    <>
      <SpacerColumn size={1} />
      <Separator />
      <SpacerColumn size={1} />
      <TouchableOpacity
        onPress={onPressItem}
        style={{
          alignSelf: "flex-start",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <CurrencyIcon
            size={48}
            denom={currency.denom}
            networkId={networkId}
          />
          <View style={{ marginLeft: layout.padding_x1_5 }}>
            <BrandText>{currency?.displayName}</BrandText>
            <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
              {currency?.sourceNetworkDisplayName}
            </BrandText>
          </View>
        </View>

        <CurrencyAmount
          amount={currencyAmount}
          amountUsd={currencyBalance?.usdAmount || 0}
        />
      </TouchableOpacity>
    </>
  );
};
