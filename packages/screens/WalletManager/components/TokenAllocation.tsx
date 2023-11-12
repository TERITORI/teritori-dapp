import React from "react";
import { View, ViewStyle } from "react-native";
import { VictoryPie } from "victory-native";

import { BrandText } from "../../../components/BrandText";
import { CurrencyIcon } from "../../../components/CurrencyIcon";
import { useBalances } from "../../../hooks/useBalances";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { getNativeCurrency } from "../../../networks";
import { neutral33 } from "../../../utils/style/colors";

interface TokenAllocationProps {
  style?: ViewStyle;
}

export const TokenAllocation: React.FC<TokenAllocationProps> = ({ style }) => {
  const selectedWallet = useSelectedWallet();
  const selectedNetWorkId = selectedWallet?.networkId || "";
  const allBalances = useBalances(selectedNetWorkId, selectedWallet?.address);
  const balances = allBalances.filter(
    (bal) => bal.usdAmount && bal.usdAmount > 0,
  );

  const usdSum = balances.reduce(
    (total, bal) => total + (bal.usdAmount || 0),
    0,
  );

  return (
    <View style={[style]}>
      <BrandText style={{ marginBottom: 24, fontSize: 20 }}>
        Token Allocation
      </BrandText>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <VictoryPie
          innerRadius={85}
          padAngle={0.8}
          height={216}
          width={216}
          colorScale={balances.map((bal) => {
            const currency = getNativeCurrency(selectedNetWorkId, bal.denom);
            return currency?.color || "#FFFFFF";
          })}
          labels={() => null}
          data={balances.map((bal) => {
            return {
              y: bal.usdAmount || 0,
            };
          })}
          padding={0}
        />

        <View style={{ marginLeft: 32, width: 216 }}>
          {balances.map((item) => {
            const currency = getNativeCurrency(selectedNetWorkId, item.denom);
            return (
              <View
                key={currency?.denom}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <CurrencyIcon
                  networkId={selectedNetWorkId}
                  denom={item.denom}
                  size={24}
                />
                <BrandText
                  style={{
                    marginLeft: 8,
                    width: 120,
                    fontSize: 14,
                  }}
                >
                  {currency?.displayName}
                </BrandText>
                <BrandText
                  style={{
                    fontSize: 14,
                  }}
                >
                  ${item.usdAmount?.toFixed(2)}
                </BrandText>
                <BrandText
                  style={{
                    fontSize: 14,
                    borderLeftWidth: 1,
                    borderColor: neutral33,
                    paddingLeft: 12,
                    marginLeft: 12,
                  }}
                >
                  {(((item.usdAmount || 0) / usdSum) * 100).toFixed(2)}%
                </BrandText>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};
