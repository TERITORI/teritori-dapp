import { Decimal } from "cosmwasm";
import React, { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { CurrencyIcon } from "../../../components/CurrencyIcon";
import { Separator } from "../../../components/Separator";
import { SpacerColumn } from "../../../components/spacer";
import { useBalances } from "../../../hooks/useBalances";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import {
  allNetworks,
  CosmosNetworkInfo,
  CurrencyInfo,
  getNativeCurrency,
  NativeCurrencyInfo,
  NetworkKind,
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
    [currency?.denom, networkId]
  );
  const currencyNetwork: CosmosNetworkInfo | undefined = useMemo(() => {
    const cosmosNetworks = allNetworks.filter(
      (networkInfo) => networkInfo.kind === NetworkKind.Cosmos
    ) as CosmosNetworkInfo[];
    return cosmosNetworks.find(
      (networkInfo) => networkInfo.stakeCurrency === currencyNative?.denom
    );
  }, [currencyNative?.denom]);

  const currencyAmount: number = useMemo(() => {
    if (!currencyNative || !currencyBalance) return 0;
    return Decimal.fromAtomics(
      currencyBalance.amount,
      currencyNative.decimals
    ).toFloatApproximation();
  }, [currencyBalance, currencyNative]);

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
            <BrandText>{currencyNative?.displayName}</BrandText>
            <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
              {currencyNetwork?.displayName}
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
